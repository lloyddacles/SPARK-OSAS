"use server";

import { revalidatePath } from "next/cache";

async function getDB() {
  const { getPrisma } = await import("@/lib/prisma");
  return getPrisma();
}

export async function getAnnouncements() {
  const db = await getDB();
  if (!db) return [];
  return await db.announcement.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function addAnnouncement(form: { title: string; content: string; category: string; author: string }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newAnn = await db.announcement.create({
    data: {
      ...form,
      date: new Date().toDateString()
    }
  });
  revalidatePath("/events");
  return newAnn;
}

export async function deleteAnnouncement(id: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.announcement.delete({
    where: { id }
  });
  revalidatePath("/events");
}

export async function getReferrals() {
  const db = await getDB();
  if (!db) return [];
  return await db.referral.findMany();
}

export async function addReferral(form: { 
  studentName: string; 
  reason: string; 
  adviserName: string; 
  adviserId: string;
  severity?: string;
  aiAnalysis?: string;
}) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newRef = await db.referral.create({
    data: {
      ...form,
      status: "Referred to Guidance",
      dateFiled: new Date().toISOString()
    }
  });
  revalidatePath("/referrals");
  return newRef;
}

export async function updateReferralStatus(id: string, updates: any) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.referral.update({
    where: { id },
    data: updates
  });
  revalidatePath("/referrals");
}

/**
 * PULSE GATEKEEPER - SECURITY LOGGING
 */
export async function logGateEntry(studentId: string, type: "IN" | "OUT" = "IN") {
  const db = await getDB();
  if (!db) return { success: false, message: "DB_OFFLINE" };

  try {
    // 1. Resolve Student Identity
    const student = await (db as any).user.findFirst({
      where: { 
        OR: [
          { id: studentId },
          { studentId: studentId }
        ]
      }
    });

    if (!student) return { success: false, message: "IDENTITY_NOT_FOUND" };

    // 2. Check Institutional Status
    // We search for URGENT referrals or suspicious patterns
    const urgentReferrals = await (db as any).referral.findMany({
      where: { studentId: student.id, severity: "URGENT", status: { not: "Closed" } }
    });

    const isFlagged = urgentReferrals.length > 0 || student.status === "Suspended";

    // 3. Record the Transaction
    const log = await (db as any).gateLog.create({
      data: {
        studentId: student.id,
        studentName: student.name,
        entryType: type,
        status: isFlagged ? "DENIED" : "SUCCESS"
      }
    });

    return { 
      success: true, 
      isFlagged, 
      studentName: student.name, 
      program: (student as any).program,
      timestamp: log.timestamp 
    };
  } catch (e) {
    console.error("GATE_LOG_FAIL", e);
    return { success: false, message: "LOGGING_ERROR" };
  }
}
