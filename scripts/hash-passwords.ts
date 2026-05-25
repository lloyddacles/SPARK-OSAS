import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Hashing all existing plaintext passwords...')

  const users = await prisma.$queryRawUnsafe<Array<{ id: string; username: string; name: string; password: string | null }>>(
    'SELECT id, username, name, password FROM "User"'
  )
  let updated = 0

  for (const user of users) {
    if (user.password && !user.password.startsWith('$2')) {
      const hash = await bcrypt.hash(user.password, 12)
      await prisma.$executeRawUnsafe('UPDATE "User" SET password = $1 WHERE id = $2', hash, user.id)
      updated++
      console.log(`  ✓ ${user.username} (${user.name}) — password hashed`)
    }
  }

  console.log(`\nDone. ${updated} user(s) updated.`)
  console.log('You can now log in with your existing credentials.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
