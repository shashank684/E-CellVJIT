import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean, integer } from "drizzle-orm/pg-core";
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

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  description: text("description").notNull(), 
  status: text("status", { enum: ["upcoming", "past"] }).notNull(),
  registrationLink: text("registration_link"), 
  summary: text("summary"),
  image: text("image").default('/assets/events/default.jpg'),
});

// --- NEW: Team Members Table Definition ---
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  imageUrl: text("image_url").notNull(),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export const insertEventSchema = createInsertSchema(events, {
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

// --- NEW: Zod Schema for Team Member Insertion/Validation ---
export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  name: true,
  role: true,
  imageUrl: true,
  instagram: true,
  linkedin: true,
  isFeatured: true,
  displayOrder: true,
});

// --- Type Exports ---
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

// --- NEW: Type Exports for Team Members ---
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
