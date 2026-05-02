import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('💎 STARTING INSTITUTIONAL SEEDING...')

  // 1. Create Master Admin
  const masterAdmin = await prisma.user.upsert({
    where: { username: 'osas_admin' },
    update: {},
    create: {
      username: 'osas_admin',
      password: 'password123', // USER: PLEASE CHANGE THIS IMMEDIATELY
      name: 'System Administrator',
      role: 'SYSTEM_ADMIN',
      status: 'Active',
      department: 'OSAS',
      contactNumber: '09XX-XXX-XXXX',
      vault: {}
    }
  })

  console.log(`✅ MASTER ADMIN CREATED: ${masterAdmin.username}`)
  console.log('💎 SEEDING COMPLETED.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
