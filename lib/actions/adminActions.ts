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

    const updated = await (db as any).user.update({
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

    const user = await db.user.findUnique({ where: { id: userId } }) as any;
    if (!user) throw new Error("USER_NOT_FOUND");

    const newStatus = user.status === "Archived" ? "Active" : "Archived";
    const updated = await db.user.update({
      where: { id: userId },
      data: { status: newStatus } as any
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
    const lastError = (globalThis as any).PRISMA_LAST_ERROR;
    return {
      success: false,
      message: lastError ? `DATABASE_ERROR: ${lastError}` : (process.env.DATABASE_URL ? "DATABASE_OFFLINE_OR_BUSY" : "CRITICAL_CONFIG_ERROR: DATABASE_URL_MISSING")
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
      (db as any).user.count(),
      (db as any).scholarshipApp.count(),
      (db as any).studentOrg.count(),
      (db as any).serviceRequest.count()
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
    await (db as any).appointment.deleteMany();
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
      (db as any).serviceRequest.deleteMany({ where: { status: { in: ["Completed", "Rejected"] } } }),
      (db as any).appointment.deleteMany({ where: { status: { in: ["COMPLETED", "CANCELLED"] } } }),
      (db as any).scholarshipApp.deleteMany({ where: { status: { in: ["Approved", "Rejected"] } } }),
      (db as any).referral.deleteMany({ where: { status: { in: ["Sanctioned", "Dismissed"] } } })
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

/**
 * SCHOLAR INVENTORY MANAGEMENT
 */
export async function getScholarInventory(page: number = 1, pageSize: number = 20, searchTerm: string = "", filters: any = {}) {
  try {
    const db = await getDB();
    if (!db) return { scholars: [], total: 0 };

    if (!(db as any).scholarInventory) {
      console.warn("SCHOLAR_INVENTORY_MODEL_MISSING: Registry sync pending.");
      return { scholars: [], total: 0 };
    }

    const skip = (page - 1) * pageSize;

    // Build Complex Filter Object
    const where: any = { AND: [] };

    if (searchTerm) {
      where.AND.push({
        OR: [
          { studentName: { contains: searchTerm, mode: 'insensitive' } },
          { programName: { contains: searchTerm, mode: 'insensitive' } },
          { batch: { contains: searchTerm, mode: 'insensitive' } },
          { studentId: { contains: searchTerm, mode: 'insensitive' } }
        ]
      });
    }

    if (filters.program) where.AND.push({ programName: filters.program });
    if (filters.batch) where.AND.push({ batch: filters.batch });
    if (filters.status) where.AND.push({ status: filters.status });
    if (filters.type) where.AND.push({ type: filters.type });

    const [scholars, total] = await Promise.all([
      (db as any).scholarInventory.findMany({
        where: where.AND.length > 0 ? where : {},
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' }
      }),
      (db as any).scholarInventory.count({ where: where.AND.length > 0 ? where : {} })
    ]);

    return { scholars, total };
  } catch (e) {
    console.error("GET_SCHOLAR_INVENTORY_FAIL", e);
    return { scholars: [], total: 0 };
  }
}

export async function bulkUpdateScholarStatus(ids: string[], status: string) {
  try {
    const db = await getDB();
    if (!db) throw new Error("DATABASE_UNAVAILABLE");

    await (db as any).scholarInventory.updateMany({
      where: { id: { in: ids } },
      data: { status }
    });

    revalidatePath("/admin/scholars");
    return { success: true };
  } catch (e: any) {
    console.error("BULK_UPDATE_FAIL", e);
    return { success: false, message: e.message || "BULK_UPDATE_FAILED" };
  }
}

export async function addScholarToInventory(data: any) {
  try {
    const db = await getDB();
    if (!db) throw new Error("DATABASE_UNAVAILABLE");

    const newScholar = await (db as any).scholarInventory.create({
      data: {
        studentId: data.studentId,
        studentName: data.studentName,
        programId: data.programId,
        programName: data.programName,
        type: data.type,
        category: data.category,
        batch: data.batch,
        status: data.status || "Active",
        dateAwarded: data.dateAwarded ? new Date(data.dateAwarded) : new Date(),
      }
    });

    revalidatePath("/admin/scholars");
    return { success: true, scholar: newScholar };
  } catch (e: any) {
    console.error("ADD_SCHOLAR_FAIL", e);
    return { success: false, message: e.message || "ADD_FAILED" };
  }
}

export async function updateScholarInInventory(id: string, updates: any) {
  try {
    const db = await getDB();
    if (!db) throw new Error("DATABASE_UNAVAILABLE");

    const updated = await (db as any).scholarInventory.update({
      where: { id },
      data: {
        ...updates,
        dateAwarded: updates.dateAwarded ? new Date(updates.dateAwarded) : undefined,
      }
    });

    revalidatePath("/admin/scholars");
    return { success: true, scholar: updated };
  } catch (e: any) {
    console.error("UPDATE_SCHOLAR_FAIL", e);
    return { success: false, message: e.message || "UPDATE_FAILED" };
  }
}

export async function deleteScholarFromInventory(id: string) {
  try {
    const db = await getDB();
    if (!db) throw new Error("DATABASE_UNAVAILABLE");

    await (db as any).scholarInventory.delete({
      where: { id }
    });

    revalidatePath("/admin/scholars");
    return { success: true };
  } catch (e: any) {
    console.error("DELETE_SCHOLAR_FAIL", e);
    return { success: false, message: e.message || "DELETE_FAILED" };
  }
}
/**
 * DIGITAL STUDENT PASSPORT - IDENTITY AGGREGATION
 */
export async function getStudentPassport(identifier: string) {
  try {
    const db = await getDB();
    if (!db) throw new Error("DATABASE_UNAVAILABLE");

    // Identifier can be StudentId or Name
    const [user, scholarRecords, applications, requests, referrals, appointments] = await Promise.all([
      db.user.findFirst({
        where: {
          OR: [
            { studentId: identifier },
            { name: { contains: identifier, mode: 'insensitive' } as any },
            { username: identifier }
          ]
        } as any
      }),
      (db as any).scholarInventory.findMany({
        where: {
          OR: [
            { studentId: identifier },
            { studentName: { contains: identifier, mode: 'insensitive' } as any }
          ]
        }
      }),
      (db as any).scholarshipApp.findMany({
        where: {
          studentName: { contains: identifier, mode: 'insensitive' } as any
        }
      }),
      (db as any).serviceRequest.findMany({
        where: {
          studentName: { contains: identifier, mode: 'insensitive' } as any
        }
      }),
      (db as any).referral.findMany({
        where: {
          studentName: { contains: identifier, mode: 'insensitive' } as any
        }
      }),
      (db as any).appointment.findMany({
        where: {
          studentName: { contains: identifier, mode: 'insensitive' } as any
        }
      })
    ]);

    return {
      identity: user,
      scholarships: scholarRecords,
      applicationHistory: applications,
      serviceRequests: requests,
      referralHistory: referrals,
      appointmentHistory: appointments,
      lastAudit: new Date().toISOString()
    };
  } catch (e) {
    console.error("GET_PASSPORT_FAIL", e);
    return null;
  }
}
