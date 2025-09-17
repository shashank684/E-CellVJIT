import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { mode: "date" }).notNull(),
});

// --- NEW: Events Table Definition ---
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  description: text("description").notNull(), // Short description for the card
  status: text("status", { enum: ["upcoming", "past"] }).notNull(),
  registrationLink: text("registration_link"), // For upcoming events
  summary: text("summary"), // Detailed description for past event pop-ups
  image: text("image").default('/assets/events/default.jpg'), // Default image path
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
});

// --- NEW: Zod Schema for Event Insertion/Validation ---
export const insertEventSchema = createInsertSchema(events, {
  // Allow date to be provided as a string from the form
  date: z.string().transform((str) => new Date(str)),
}).pick({
  title: true,
  date: true,
  description: true,
  status: true,
  registrationLink: true,
  summary: true,
  image: true,
});

// --- Type Exports ---
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// --- NEW: Type Exports for Events ---
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;