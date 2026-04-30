import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log: ['error', 'warn'],
    })
  } catch (e: any) {
    console.error("PRISMA_INIT_CRITICAL_FAIL", e);
    // Instead of null, let's throw so the caller sees the reason
    throw new Error(`PRISMA_GEN_FAIL: ${e.message}`);
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
