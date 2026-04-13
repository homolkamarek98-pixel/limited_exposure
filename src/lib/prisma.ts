// Prisma 7: přímé připojení vyžaduje driver adapter (@prisma/adapter-pg)
// URL se nekonfiguruje v schema.prisma, ale přes adapter konstruktor
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL není nastavena v prostředí");
  }
  // Neon vyžaduje SSL — pg.Pool bez explicitního ssl odmítne připojení.
  // Používáme rejectUnauthorized: false pro self-signed certifikáty Neon.
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
