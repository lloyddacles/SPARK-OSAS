const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting SQL-Direct Migration (Pure JS)...');
  
  const dataPath = path.join(process.cwd(), 'data.json');
  const content = await fs.readFile(dataPath, 'utf-8');
  const data = JSON.parse(content);

  // 1. Migrate Users
  console.log(`📡 Pushing ${data.users.length} Users...`);
  for (const u of data.users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        username: u.username || u.name,
        password: u.password || 'password123',
        role: u.role || 'STUDENT_APPLICANT',
        vault: u.vault || {},
        updatedAt: new Date()
      },
      create: {
        id: u.id,
        name: u.name,
        username: u.username || u.name,
        password: u.password || 'password123',
        role: u.role || 'STUDENT_APPLICANT',
        vault: u.vault || {},
        updatedAt: new Date()
      }
    });
  }

  // 2. Migrate Orgs
  console.log(`📡 Pushing ${data.organizations.length} Organizations...`);
  for (const o of data.organizations) {
    await prisma.studentOrg.upsert({
      where: { id: o.id },
      update: {
        name: o.name,
        acronym: o.acronym,
        category: o.category,
        status: o.status || 'Recognized',
        president: o.president || 'N/A',
        adviser: o.adviser || 'N/A'
      },
      create: {
        id: o.id,
        name: o.name,
        acronym: o.acronym,
        category: o.category,
        status: o.status || 'Recognized',
        president: o.president || 'N/A',
        adviser: o.adviser || 'N/A'
      }
    });
  }

  console.log('🏁 SQL Migration Finalized! Admin Account is now LIVE.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
