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
