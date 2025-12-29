import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL!
});

// Pass the adapter in options
export const prisma = new PrismaClient({ adapter }); // ✅ TypeScript happy
