import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import sgMail from '@sendgrid/mail';

// Extend session data type
declare module 'express-session' {
  interface SessionData {
    isAuthenticated?: boolean;
  }
}

// Admin authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Authentication required' });
  }
};

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
      }
      
      // Check against environment variable
      if (password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ success: false, message: 'Logout failed' });
      }
      res.json({ success: true, message: 'Logout successful' });
    });
  });

  app.get("/api/admin/status", (req, res) => {
    res.json({ 
      isAuthenticated: !!req.session.isAuthenticated 
    });
  });

  // Protected admin routes
  app.get("/api/admin/dashboard", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      
      // Basic stats
      const stats = {
        totalSubmissions: submissions.length,
        recentSubmissions: submissions.filter(s => {
          const submissionDate = new Date(s.createdAt);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return submissionDate > weekAgo;
        }).length,
        submissions: submissions.slice(0, 10), // Latest 10 submissions
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Dashboard data error:', error);
      res.status(500).json({ success: false, message: 'Failed to load dashboard data' });
    }
  });

  app.get("/api/admin/submissions", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      // Save to database
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification if SendGrid is configured
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
        const emailContent = {
          to: process.env.SENDGRID_TO_EMAIL || 'ecell@vjit.ac.in',
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: `New Contact Form Submission - ${validatedData.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
            <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
          `,
        };
        
        try {
          await sgMail.send(emailContent);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the request if email fails
        }
      }
      
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

  // Get all contact submissions (for potential admin dashboard)
  app.get("/api/contact/submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching submissions" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
