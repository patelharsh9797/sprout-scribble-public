import { defineConfig } from "drizzle-kit";
import { env } from "@/env.mjs";

export default defineConfig({
  schema: "./server/schema.ts",
  out: "./server/migrations",
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
