import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection string from environment — points to Docker DB or Supabase Cloud
const connectionString = process.env.DATABASE_URL!;

// postgres.js client — used by Drizzle for all queries
const client = postgres(connectionString, {
  prepare: false, // Required for Supabase connection pooling (transaction mode)
});

// Drizzle ORM instance with schema for relational queries
export const db = drizzle(client, { schema });
