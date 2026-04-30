"use server";

import { revalidatePath } from "next/cache";

async function getDB() {
  const { getPrisma } = await import("@/lib/prisma");
  return getPrisma();
}

export type VaultStatus = "Verified" | "Not Yet Verified" | "For Re-upload" | "Wrong Document" | "Blurred";

export async function uploadToVault(userId: string, docName: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;

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

  revalidatePath("/submissions");
  return updatedUser;
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
    where: { role: "STUDENT_APPLICANT" }
  });
}
