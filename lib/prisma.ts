import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log: ['error', 'warn'],
    })
  } catch (e) {
    console.error("PRISMA_INIT_CRITICAL_FAIL", e);
    return null as any;
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
