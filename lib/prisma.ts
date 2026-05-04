import { PrismaClient } from '@prisma/client'

/**
 * ULTRA-LAZY PRISMA SINGLETON
 * This prevents top-level crashes by ensuring the client only initializes when needed.
 */
const prismaClientSingleton = () => {
  // Prisma 7 manages connections via prisma.config.ts and env variables.
  // Manual overrides in the constructor are no longer supported in this environment.
  return new PrismaClient();
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// We DO NOT initialize here. We export a getter instead.
export const getPrisma = () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("CRITICAL_CONFIG_ERROR: DATABASE_URL_MISSING");
      return null;
    }

    if (!globalThis.prisma) {
      globalThis.prisma = prismaClientSingleton();
    }
    return globalThis.prisma;
  } catch (e: any) {
    console.error("ULTRA_LAZY_PRISMA_FAIL", e.message || e);
    // Store error on global for debugging if needed
    (globalThis as any).PRISMA_LAST_ERROR = e.message || "UNKNOWN_ERROR";
    return null;
  }
}

// Keep legacy export for backward compatibility but warn
export const prisma = globalThis.prisma;
