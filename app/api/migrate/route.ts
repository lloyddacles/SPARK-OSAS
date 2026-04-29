import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("🚀 Cloud Migration Started...");

    // We'll add a few "Master" users directly via SQL
    const admin = await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        id: "USER-ADMIN",
        name: "Administrator",
        username: "admin",
        password: "admin", // Standard institutional password
        role: "SYSTEM_ADMIN",
        vault: {},
        updatedAt: new Date()
      }
    });

    const student = await prisma.user.upsert({
      where: { username: "student" },
      update: {},
      create: {
        id: "USER-STUDENT",
        name: "Test Student",
        username: "student",
        password: "password",
        role: "STUDENT_APPLICANT",
        vault: {},
        updatedAt: new Date()
      }
    });

    console.log("✅ Admin & Test accounts initialized.");

    return NextResponse.json({ 
      success: true, 
      message: "Cloud Migration Successful! You can now log in with admin/admin.",
      users: [admin.username, student.username]
    });
  } catch (error: any) {
    console.error("❌ Migration Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
