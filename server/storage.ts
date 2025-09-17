import { 
  type User, 
  type InsertUser, 
  type ContactSubmission, 
  type InsertContactSubmission,
  type Event,
  type InsertEvent,
  users,
  contactSubmissions,
  events 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  deleteContactSubmission(id: string): Promise<{ success: boolean }>;
  
  // --- NEW: Event Methods Interface ---
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  deleteEvent(id: string): Promise<{ success: boolean }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async deleteContactSubmission(id: string): Promise<{ success: boolean }> {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    return { success: true };
  }

  // --- NEW: Event Method Implementations ---
  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async getEvents(): Promise<Event[]> {
    // Fetch events ordered by date, with the newest events appearing first.
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async deleteEvent(id: string): Promise<{ success: boolean }> {
    await db.delete(events).where(eq(events.id, id));
    return { success: true };
  }
}

export const storage = new DatabaseStorage();