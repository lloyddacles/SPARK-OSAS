"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function updateUser(userId: string, updates: any) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: updates
  });
  revalidatePath("/admin");
  return updated;
}

export async function toggleUserArchive(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    const newStatus = user.status === "Archived" ? "Active" : "Archived";
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus }
    });
    revalidatePath("/admin");
    return updated;
  }
}

export async function clearAllAppointments() {
  await prisma.appointment.deleteMany();
  revalidatePath("/admin");
  revalidatePath("/appointments");
}

export async function createUser(form: { 
  name: string; 
  username: string; 
  password?: string; 
  role: string;
  department?: string;
  contactNumber?: string;
  status?: string;
}) {
  try {
    const { prisma: db } = await import("@/lib/prisma");
    
    if (!db) {
      return { success: false, message: "DATABASE_CONNECTION_NOT_INITIALIZED" };
    }

    const newUser = await db.user.create({
      data: {
        ...form,
        vault: {}
      }
    });
    revalidatePath("/admin");
    return { success: true, user: newUser };
  } catch (error: any) {
    console.error("ADMIN_CREATE_USER_ERROR:", error);
    return { success: false, message: error.message || "DATABASE_PERSISTENCE_FAILURE" };
  }
}

export async function deleteUser(userId: string) {
  // Check if it's the master admin before deleting
  if (userId === "USER-ADMIN-RECOVERY" || userId === "ADMIN-MASTER") {
    throw new Error("CANNOT_DELETE_MASTER_ADMIN");
  }

  await prisma.user.delete({
    where: { id: userId }
  });
  revalidatePath("/admin");
}

export async function getSystemHealth() {
  const [userCount, appCount, orgCount, reqCount] = await Promise.all([
    prisma.user.count(),
    prisma.scholarshipApp.count(),
    prisma.studentOrg.count(),
    prisma.serviceRequest.count()
  ]);

  return {
    userCount,
    appCount,
    orgCount,
    reqCount,
    lastBackup: new Date().toISOString()
  };
}

export async function performAnnualArchive() {
  // SQL implementation of archiving (deleting completed records)
  const results = await Promise.all([
    prisma.serviceRequest.deleteMany({ where: { status: { in: ["Completed", "Rejected"] } } }),
    prisma.appointment.deleteMany({ where: { status: { in: ["COMPLETED", "CANCELLED"] } } }),
    prisma.scholarshipApp.deleteMany({ where: { status: { in: ["Approved", "Rejected"] } } }),
    prisma.referral.deleteMany({ where: { status: { in: ["Sanctioned", "Dismissed"] } } })
  ]);

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/requests");
  
  return {
    archivedRequests: results[0].count,
    archivedAppointments: results[1].count,
    archivedScholarships: results[2].count,
    archivedReferrals: results[3].count
  };
}
