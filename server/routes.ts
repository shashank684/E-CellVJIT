import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertEventSchema, insertTeamMemberSchema } from "@shared/schema";
import { randomBytes } from "crypto";
import multer from 'multer';

// Set up multer for memory storage to handle file uploads.
const upload = multer({ storage: multer.memoryStorage() });

// This will store our active admin tokens temporarily.
const activeTokens = new Set<string>();

// Admin authentication middleware to protect sensitive routes.
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token && activeTokens.has(token)) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Authentication required' });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // --- Admin Authentication Routes ---
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
      }
      if (password === process.env.ADMIN_PASSWORD) {
        const token = randomBytes(32).toString("hex");
        activeTokens.add(token);
        res.json({ success: true, message: 'Login successful', token });
      } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  });

  app.post("/api/admin/logout", requireAuth, (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      activeTokens.delete(token);
    }
    res.json({ success: true, message: 'Logout successful' });
  });

  app.get("/api/admin/status", requireAuth, (req, res) => {
    res.json({ success: true, isAuthenticated: true });
  });

  // --- Contact Submission Routes ---
  app.get("/api/admin/submissions", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
    }
  });

  app.delete("/api/admin/submissions/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteContactSubmission(id);
      res.json({ success: true, message: "Submission deleted successfully." });
    } catch (error) {
      console.error('Error deleting submission:', error);
      res.status(500).json({ success: false, message: 'Failed to delete submission' });
    }
  });
  
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Thank you for your message! We'll get back to you within 24 hours.",
        id: submission.id 
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      res.status(400).json({ 
        success: false, 
        message: "There was an error submitting your message. Please try again." 
      });
    }
  });

  // --- Event Routes ---
  app.get("/api/events", async (_req, res) => {
    try {
      const allEvents = await storage.getEvents();
      res.json(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch events' });
    }
  });

  app.post("/api/admin/events", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(validatedData);
      res.status(201).json({ success: true, message: "Event created successfully.", event: newEvent });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(400).json({ success: false, message: "Invalid event data provided." });
    }
  });

  app.delete("/api/admin/events/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteEvent(id);
      res.json({ success: true, message: "Event deleted successfully." });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ success: false, message: 'Failed to delete event' });
    }
  });

  // --- Team Member Routes ---
  app.get("/api/team/featured", async (_req, res) => {
    try {
      const members = await storage.getFeaturedTeamMembers();
      res.json(members);
    } catch (error) {
      console.error('Error fetching featured team:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch team members' });
    }
  });

  app.get("/api/team", async (_req, res) => {
    try {
      const members = await storage.getTeamMembers({ admin: false });
      res.json(members);
    } catch (error) {
      console.error('Error fetching team:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch team members' });
    }
  });
  
  app.get("/api/admin/team", requireAuth, async (_req, res) => {
    try {
      const members = await storage.getTeamMembers({ admin: true });
      res.json(members);
    } catch (error) {
      console.error('Error fetching team for admin:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch team members' });
    }
  });

  app.post("/api/admin/team", requireAuth, upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "A photo is required." });
      }

      const validatedData = insertTeamMemberSchema.omit({ imageUrl: true }).parse({
        ...req.body,
        isFeatured: req.body.isFeatured === 'true',
        displayOrder: parseInt(req.body.displayOrder, 10),
      });
      
      const newMember = await storage.createTeamMember(validatedData, req.file);
      res.status(201).json({ success: true, message: "Team member added successfully.", member: newMember });
    } catch (error) {
      console.error('Error creating team member:', error);
      res.status(400).json({ success: false, message: "Invalid data provided for team member." });
    }
  });

  app.put("/api/admin/team/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const dataToUpdate = {
        ...req.body,
        ...(req.body.isFeatured !== undefined && { isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true }),
        ...(req.body.displayOrder !== undefined && { displayOrder: parseInt(req.body.displayOrder, 10) }),
      };
      const updatedMember = await storage.updateTeamMember(id, dataToUpdate);
      res.json({ success: true, message: "Team member updated successfully.", member: updatedMember });
    } catch (error) {
      console.error('Error updating team member:', error);
      res.status(500).json({ success: false, message: 'Failed to update team member' });
    }
  });
  
  app.delete("/api/admin/team/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTeamMember(id);
      res.json({ success: true, message: "Team member deleted successfully." });
    } catch (error) {
      console.error('Error deleting team member:', error);
      res.status(500).json({ success: false, message: 'Failed to delete team member' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
