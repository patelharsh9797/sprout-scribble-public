import { neon, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/server/schema";
import { env } from "@/env.mjs";
import { drizzle as drizzlePool } from "drizzle-orm/neon-serverless";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema, logger: true });

const pool = new Pool({ connectionString: env.DATABASE_URL });
export const dbPool = drizzlePool(pool);
