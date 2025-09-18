import { db, supabase } from './db';
import { 
  contactSubmissions, 
  events, 
  teamMembers,
  type InsertContactSubmission, 
  type InsertEvent, 
  type ContactSubmission, 
  type Event,
  type TeamMember,
  type InsertTeamMember,
} from '@shared/schema';
import { eq, desc, asc, and } from "drizzle-orm";
import { z } from 'zod';

// Interface defining all storage operations
export interface IStorage {
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  deleteContactSubmission(id: string): Promise<{ success: boolean }>;
  
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  updateEvent(id: string, data: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<{ success: boolean }>;

  createTeamMember(member: InsertTeamMember, photoBuffer: Buffer, fileName: string): Promise<TeamMember>;
  getTeamMembers(): Promise<TeamMember[]>;
  getFeaturedTeamMembers(): Promise<TeamMember[]>; // <-- Added missing function
  getAdminTeamMembers(): Promise<TeamMember[]>;
  updateTeamMember(id: string, data: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<{ success: boolean }>;
}

// DatabaseStorage class implementing the IStorage interface
export class DatabaseStorage implements IStorage {
  // --- Contact Submissions Methods ---
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

  // --- Event Methods ---
  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async updateEvent(id: string, data: Partial<InsertEvent>): Promise<Event> {
      const result = await db.update(events).set(data).where(eq(events.id, id)).returning();
      return result[0];
  }

  async deleteEvent(id: string): Promise<{ success: boolean }> {
    await db.delete(events).where(eq(events.id, id));
    return { success: true };
  }

  // --- Team Member Methods ---
  async createTeamMember(member: InsertTeamMember, photoBuffer: Buffer, fileName: string): Promise<TeamMember> {
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const { data: uploadData, error } = await supabase.storage.from('team-photos').upload(uniqueFileName, photoBuffer);
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    
    const { data: { publicUrl } } = supabase.storage.from('team-photos').getPublicUrl(uniqueFileName);
    if (!publicUrl) throw new Error("Could not get public URL for uploaded image.");

    const memberWithImage = { ...member, imageUrl: publicUrl };
    const result = await db.insert(teamMembers).values(memberWithImage).returning();
    return result[0];
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder));
  }

  // THIS IS THE NEW, CORRECTED FUNCTION
  async getFeaturedTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.isFeatured, true)).orderBy(asc(teamMembers.displayOrder));
  }
  
  async getAdminTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder));
  }

  async updateTeamMember(id: string, data: Partial<InsertTeamMember>): Promise<TeamMember> {
    const result = await db.update(teamMembers).set(data).where(eq(teamMembers.id, id)).returning();
    return result[0];
  }

  async deleteTeamMember(id: string): Promise<{ success: boolean }> {
    // First, delete from DB to get the imageUrl
    const deletedMembers = await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning({ imageUrl: teamMembers.imageUrl });
    if (deletedMembers.length > 0 && deletedMembers[0].imageUrl) {
        const fileName = deletedMembers[0].imageUrl.split('/').pop();
        if (fileName) {
            await supabase.storage.from('team-photos').remove([fileName]);
        }
    }
    return { success: true };
  }
}

export const storage = new DatabaseStorage();