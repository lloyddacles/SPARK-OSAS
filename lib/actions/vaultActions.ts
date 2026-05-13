"use server";

import { revalidatePath } from "next/cache";

async function getDB() {
  const { getPrisma } = await import("@/lib/prisma");
  return getPrisma();
}

export type VaultStatus = "Verified" | "Not Yet Verified" | "For Re-upload" | "Wrong Document" | "Blurred";

export async function uploadToVault(userId: string, docName: string) {
  console.log(`[VAULT_ACTION] Attempting upload for User: ${userId}, Doc: ${docName}`);
  
  const db = await getDB();
  if (!db) {
    console.error("[VAULT_ACTION] Database connection failed");
    throw new Error("DATABASE_UNAVAILABLE");
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error(`[VAULT_ACTION] User ${userId} not found in registry`);
      return null;
    }

    const currentVault = user.vault as any || {};
    const updatedVault = {
      ...currentVault,
      [docName]: {
        uploaded: true,
        status: "Not Yet Verified",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        fileType: "application/pdf"
      }
    };

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { vault: updatedVault }
    });

    console.log(`[VAULT_ACTION] Successfully updated vault for ${user.name}`);
    revalidatePath("/submissions");
    return updatedUser;
  } catch (error) {
    console.error("[VAULT_ACTION] Critical failure during vault update:", error);
    throw error;
  }
}

export async function verifyDocument(userId: string, docName: string, status: VaultStatus, remarks?: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const vault = user.vault as any || {};
  if (vault[docName]) {
    vault[docName].status = status;
    vault[docName].remarks = remarks;
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: { vault }
  });

  revalidatePath("/submissions");
  revalidatePath("/scholarships");
  return updatedUser;
}

export async function getAllStudentVaults() {
  const db = await getDB();
  if (!db) return [];
  return await db.user.findMany({
    where: { role: { in: ["STUDENT_APPLICANT", "STUDENT_LEADER"] } }
  });
}

export async function bulkVerifyDocuments(updates: { userId: string, docName: string }[], status: VaultStatus, remarks?: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");

  // We group updates by userId to minimize database writes
  const userGroups: { [userId: string]: string[] } = {};
  updates.forEach(u => {
    if (!userGroups[u.userId]) userGroups[u.userId] = [];
    userGroups[u.userId].push(u.docName);
  });

  const updatePromises = Object.entries(userGroups).map(async ([userId, docs]) => {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const vault = user.vault as any || {};
    docs.forEach(docName => {
      if (vault[docName]) {
        vault[docName].status = status;
        vault[docName].remarks = remarks;
      }
    });

    return db.user.update({
      where: { id: userId },
      data: { vault }
    });
  });

  await Promise.all(updatePromises);
  revalidatePath("/submissions");
  revalidatePath("/scholarships");
}
