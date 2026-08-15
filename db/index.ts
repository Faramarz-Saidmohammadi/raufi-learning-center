import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { initializeDatabase } from "./bootstrap";
import * as schema from "./schema";

let database: NeonHttpDatabase<typeof schema> | undefined;
let initialization: Promise<void> | undefined;

export async function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is unavailable. Connect a Neon Postgres database to this Vercel project.");
  }

  if (!database) database = drizzle(neon(connectionString), { schema });
  if (!initialization) {
    initialization = initializeDatabase(database).catch((error) => {
      initialization = undefined;
      throw error;
    });
  }
  await initialization;
  return database;
}
