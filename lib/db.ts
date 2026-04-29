const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

// Use a singleton pattern with a lazy getter to ensure server-only execution
const getPrisma = () => {
  if (typeof window !== "undefined") return null;

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["error", "warn"],
    });
  }
  return globalForPrisma.prisma;
};

export const prisma = getPrisma();
