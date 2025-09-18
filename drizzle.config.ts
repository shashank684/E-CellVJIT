import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in your environment variables.");
}

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql", // <-- This line was missing
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
