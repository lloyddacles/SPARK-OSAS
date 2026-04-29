"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type VaultStatus = "Verified" | "Not Yet Verified" | "For Re-upload" | "Wrong Document" | "Blurred";

export async function uploadToVault(userId: string, docName: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
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

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { vault: updatedVault }
  });

  revalidatePath("/submissions");
  return updatedUser;
}

export async function verifyDocument(userId: string, docName: string, status: VaultStatus, remarks?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const vault = user.vault as any || {};
  if (vault[docName]) {
    vault[docName].status = status;
    vault[docName].remarks = remarks;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { vault }
  });

  // Optional: Update matching scholarship apps based on studentName
  // (In a real app we'd use studentId, but our current schema uses studentName)

  revalidatePath("/submissions");
  revalidatePath("/scholarships");
  return updatedUser;
}

export async function getAllStudentVaults() {
  return await prisma.user.findMany({
    where: { role: "STUDENT_APPLICANT" }
  });
}
