import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Attempt to use DIRECT_URL first (for migrations), then DATABASE_URL
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
