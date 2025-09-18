import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables to ensure they are set.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in your environment variables.');
}
if (!process.env.SUPABASE_PROJECT_URL) {
    throw new Error('SUPABASE_PROJECT_URL is not set in your environment variables.');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in your environment variables.');
}

// Create a single Postgres client for Drizzle, configured for our Supabase connection.
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, { max: 1 });

// Export the Drizzle instance for database queries.
export const db = drizzle(sql, { schema });

// Create and export the Supabase client, which will be used for file storage.
export const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);