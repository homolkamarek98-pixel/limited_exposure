// Prisma 7: URL se konfiguruje přes prisma.config.ts (pro migrace)
// a runtime klient čte DATABASE_URL z prostředí automaticky.
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
