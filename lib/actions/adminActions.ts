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
    // Note: status is not in the schema yet, using role or adding it might be needed.
    // For now, we could use a custom field in the Json vault or add it to schema.
    revalidatePath("/admin");
  }
}

export async function clearAllAppointments() {
  await prisma.appointment.deleteMany();
  revalidatePath("/admin");
  revalidatePath("/appointments");
}

export async function createUser(form: { name: string; username: string; password?: string; role: string }) {
  const newUser = await prisma.user.create({
    data: {
      ...form,
      vault: {}
    }
  });
  revalidatePath("/admin");
  return newUser;
}

export async function deleteUser(userId: string) {
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
