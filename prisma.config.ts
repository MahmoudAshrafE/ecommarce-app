import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: (() => {
      const url = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || "";
      if (!url.startsWith("postgres")) {
        // If the URL is invalid or missing, this safe fallback prevents P1013 crash during build initialization
        // allowing the build to fail with a clearer message later or succeed if not doing migration
        return "";
      }
      return url;
    })(),
  },
});
