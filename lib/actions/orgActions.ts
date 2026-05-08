"use server";

import { revalidatePath } from "next/cache";

import { getPrisma } from "@/lib/prisma";

async function getDB() {
  return getPrisma();
}

export async function getOrganizations() {
  const db = await getDB();
  if (!db) return [];
  return await db.studentOrg.findMany();
}

export async function addOrganization(form: { name: string; acronym: string; category: string; president: string; adviser: string; adviserId: string; logo?: string }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newOrg = await db.studentOrg.create({
    data: {
      ...form,
      status: "Recognized"
    }
  });

  revalidatePath("/organizations");
  return newOrg;
}

export async function updateOrganization(id: string, updates: any) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.studentOrg.update({
    where: { id },
    data: updates
  });
  revalidatePath("/organizations");
}

export async function deleteOrganization(id: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.studentOrg.delete({
    where: { id }
  });
  revalidatePath("/organizations");
}

export async function proposeActivity(orgId: string, form: { title: string; description: string; date: string; budget: string; venue: string; participants: string }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newAct = await db.orgActivity.create({
    data: {
      orgId,
      ...form,
      status: "Pending Adviser Review"
    }
  });
  revalidatePath("/organizations");
  return newAct;
}

export async function updateActivityStatus(id: string, updates: { status: string; comments?: string }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.orgActivity.update({
    where: { id },
    data: {
      status: updates.status,
      osasComments: updates.comments
    }
  });
  revalidatePath("/organizations");
}

export async function getActivities() {
  const db = await getDB();
  if (!db) return [];
  return await db.orgActivity.findMany();
}
