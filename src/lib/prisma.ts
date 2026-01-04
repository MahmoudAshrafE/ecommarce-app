import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL
});

const adapter = new PrismaPg(pool);

// Pass the adapter in options
export const prisma = new PrismaClient({ adapter }); // ✅ TypeScript happy
