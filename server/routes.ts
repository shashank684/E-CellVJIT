import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { randomBytes } from "crypto";

// This will store our tokens temporarily.
const activeTokens = new Set<string>();

// Admin authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token && activeTokens.has(token)) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Authentication required' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication routes
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

  // Protected admin routes
  app.get("/api/admin/submissions", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
    }
  });

  // Added this new route for deleting
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

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json({ 
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

  const httpServer = createServer(app);
  return httpServer;
}