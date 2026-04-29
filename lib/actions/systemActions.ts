"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getAnnouncements() {
  return await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function addAnnouncement(form: { title: string; content: string; category: string; author: string }) {
  const newAnn = await prisma.announcement.create({
    data: {
      ...form,
      date: new Date().toDateString()
    }
  });
  revalidatePath("/events");
  return newAnn;
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({
    where: { id }
  });
  revalidatePath("/events");
}

export async function getReferrals() {
  return await prisma.referral.findMany();
}

export async function addReferral(form: { studentName: string; reason: string; adviserName: string; adviserId: string }) {
  const newRef = await prisma.referral.create({
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
  await prisma.referral.update({
    where: { id },
    data: updates
  });
  revalidatePath("/referrals");
}
