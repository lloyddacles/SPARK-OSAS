import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const adminUser = await prisma.user.findUnique({
      where: { username: "admin" }
    });

    return NextResponse.json({
      success: true,
      message: "Database Connection Active",
      data: {
        totalUsers: userCount,
        adminFound: !!adminUser,
        adminRole: adminUser?.role || "none",
        // We'll check the first 3 characters of the password to see if it matches 'admin'
        passwordCheck: adminUser?.password ? adminUser.password.substring(0, 3) + "..." : "none"
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Database Connection Failed",
      error: error.message
    }, { status: 500 });
  }
}
