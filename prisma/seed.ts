import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Data Migration: JSON to SQL...')

  const dataPath = path.join(process.cwd(), 'data.json')
  let data: any;
  
  try {
    const content = await fs.readFile(dataPath, 'utf-8')
    data = JSON.parse(content)
  } catch (err) {
    console.log('⚠️ No existing data.json found. Skipping migration.')
    return
  }

  // 1. Migrate Users
  console.log('👤 Migrating Users...')
  for (const user of data.users || []) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address,
        department: user.department,
        advisorySection: user.advisorySection,
        role: user.role,
        vault: user.vault || {},
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date()
      }
    })
  }

  // 2. Migrate Organizations
  console.log('🏢 Migrating Organizations...')
  for (const org of data.organizations || []) {
    await prisma.studentOrg.upsert({
      where: { id: org.id },
      update: {},
      create: {
        id: org.id,
        name: org.name,
        acronym: org.acronym,
        category: org.category,
        status: org.status,
        president: org.president,
        adviser: org.adviser,
        adviserId: org.adviserId,
        logo: org.logo,
        renewalDate: org.renewalDate
      }
    })
  }

  // 3. Migrate Scholarship Programs
  console.log('🎓 Migrating Scholarship Programs...')
  for (const prog of data.scholarships || []) {
    await prisma.scholarshipProgram.upsert({
      where: { id: prog.id },
      update: {},
      create: {
        id: prog.id,
        name: prog.name,
        provider: prog.provider || "Institutional",
        description: prog.description || "",
        deadline: prog.deadline || "",
        status: prog.status || "Active"
      }
    })
  }

  // 4. Migrate Scholarship Apps
  console.log('📝 Migrating Scholarship Applications...')
  for (const app of data.scholarshipApps || []) {
    await prisma.scholarshipApp.upsert({
      where: { id: app.id },
      update: {},
      create: {
        id: app.id,
        studentName: app.studentName,
        requirements: app.requirements || {},
        status: app.status,
        recommendationLevel: app.recommendationLevel,
        batchId: app.batchId,
        dateApplied: app.dateApplied || new Date().toISOString().split('T')[0]
      }
    })
  }

  // 5. Migrate Service Types
  console.log('🛠️ Migrating Service Types...')
  for (const st of data.serviceTypes || []) {
    await prisma.serviceType.upsert({
      where: { id: st.id },
      update: {},
      create: {
        id: st.id,
        name: st.name,
        description: st.description,
        requiredDocs: st.requiredDocs || []
      }
    })
  }

  // 6. Migrate Requests
  console.log('📋 Migrating Service Requests...')
  for (const req of data.serviceRequests || []) {
    await prisma.serviceRequest.upsert({
      where: { id: req.id },
      update: {},
      create: {
        id: req.id,
        type: req.type,
        studentName: req.studentName,
        date: req.date,
        status: req.status,
        requirements: req.requirements || {}
      }
    })
  }

  console.log('✅ Migration Complete! Project SPARK is now SQL-Powered.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
