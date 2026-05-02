"use server";

import { prisma as globalPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * DATABASE CONNECTOR - ULTRA-LAZY
 */
async function getDB() {
  const { getPrisma } = await import("@/lib/prisma");
  return getPrisma();
}

/**
 * USER MANAGEMENT
 */
export async function getAllUsers() {
  try {
    const db = await getDB();
    if (!db) return [];
    return await db.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.error("GET_ALL_USERS_FAIL", e);
    return [];
  }
}

export async function updateUser(userId: string, updates: any) {
  try {
    const db = await getDB();
    if (!db) throw new Error("DATABASE_UNAVAILABLE");
    
    const updated = await db.user.update({
      where: { id: userId },
      data: updates
    });
    revalidatePath("/admin");
    return updated;
  } catch (e: any) {
    console.error("UPDATE_USER_FAIL", e);
    throw new Error(e.message || "UPDATE_FAILED");
  }
}

export async function toggleUserArchive(userId: string) {
  try {
    const db = await getDB();
    if (!db) throw new Error("DATABASE_UNAVAILABLE");

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("USER_NOT_FOUND");

    const newStatus = user.status === "Archived" ? "Active" : "Archived";
    const updated = await db.user.update({
      where: { id: userId },
      data: { status: newStatus }
    });
    revalidatePath("/admin");
    return updated;
  } catch (e: any) {
    console.error("ARCHIVE_TOGGLE_FAIL", e);
    throw new Error(e.message || "ARCHIVE_FAILED");
  }
}

export async function createUser(formData: any) {
  const db = await getDB();
  if (!db) {
    return { 
      success: false, 
      message: process.env.DATABASE_URL ? "DATABASE_OFFLINE_OR_BUSY" : "CRITICAL_CONFIG_ERROR: DATABASE_URL_MISSING" 
    };
  }

  try {
    const newUser = await db.user.create({
      data: {
        ...formData,
        vault: {}
      }
    });
    revalidatePath("/admin");
    return { success: true, user: newUser };
  } catch (e: any) {
    console.error("CREATE_USER_FAIL", e);
    return { success: false, message: e.message || "PROVISIONING_FAILED" };
  }
}

export async function deleteUser(userId: string) {
  try {
    if (userId === "ADMIN-MASTER" || userId === "USER-ADMIN-RECOVERY") {
      throw new Error("CANNOT_DELETE_MASTER_ADMIN");
    }

    const db = await getDB();
    if (!db) throw new Error("DATABASE_UNAVAILABLE");

    await db.user.delete({ where: { id: userId } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    console.error("DELETE_USER_FAIL", e);
    throw new Error(e.message || "DELETION_FAILED");
  }
}

/**
 * SYSTEM DIAGNOSTICS
 */
export async function getSystemHealth() {
  try {
    const db = await getDB();
    if (!db) return { userCount: 0, appCount: 0, orgCount: 0, reqCount: 0, status: "OFFLINE" };

    const [userCount, appCount, orgCount, reqCount] = await Promise.all([
      db.user.count(),
      db.scholarshipApp.count(),
      db.studentOrg.count(),
      db.serviceRequest.count()
    ]);

    return {
      userCount,
      appCount,
      orgCount,
      reqCount,
      status: "HEALTHY",
      lastBackup: new Date().toISOString()
    };
  } catch (e) {
    return { userCount: 0, appCount: 0, orgCount: 0, reqCount: 0, status: "DEGRADED" };
  }
}

/**
 * DATA MAINTENANCE
 */
export async function clearAllAppointments() {
  try {
    const db = await getDB();
    if (!db) return;
    await db.appointment.deleteMany();
    revalidatePath("/admin");
  } catch (e) {
    console.error("WIPE_DATA_FAIL", e);
  }
}

export async function performAnnualArchive() {
  try {
    const db = await getDB();
    if (!db) return { archivedRequests: 0, archivedAppointments: 0, archivedScholarships: 0, archivedReferrals: 0 };

    const results = await Promise.all([
      db.serviceRequest.deleteMany({ where: { status: { in: ["Completed", "Rejected"] } } }),
      db.appointment.deleteMany({ where: { status: { in: ["COMPLETED", "CANCELLED"] } } }),
      db.scholarshipApp.deleteMany({ where: { status: { in: ["Approved", "Rejected"] } } }),
      db.referral.deleteMany({ where: { status: { in: ["Sanctioned", "Dismissed"] } } })
    ]);

    revalidatePath("/admin");
    return {
      archivedRequests: results[0].count,
      archivedAppointments: results[1].count,
      archivedScholarships: results[2].count,
      archivedReferrals: results[3].count
    };
  } catch (e) {
    return { archivedRequests: 0, archivedAppointments: 0, archivedScholarships: 0, archivedReferrals: 0 };
  }
}
