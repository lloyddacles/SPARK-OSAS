import { PrismaClient } from '@prisma/client'

/**
 * ULTRA-LAZY PRISMA SINGLETON
 * This prevents top-level crashes by ensuring the client only initializes when needed.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  });
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// We DO NOT initialize here. We export a getter instead.
export const getPrisma = () => {
  try {
    if (!globalThis.prisma) {
      globalThis.prisma = prismaClientSingleton();
    }
    return globalThis.prisma;
  } catch (e) {
    console.error("ULTRA_LAZY_PRISMA_FAIL", e);
    return null;
  }
}

// Keep legacy export for backward compatibility but warn
export const prisma = globalThis.prisma;
