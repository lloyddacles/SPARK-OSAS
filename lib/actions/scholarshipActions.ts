"use server";

import { revalidatePath } from "next/cache";

import { getPrisma } from "@/lib/prisma";

async function getDB() {
  return getPrisma();
}

export async function getScholarshipPrograms() {
  const db = await getDB();
  if (!db) return [];
  return await db.scholarshipProgram.findMany();
}

export async function addScholarshipProgram(form: { name: string; provider: string; description: string; deadline: string }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newProg = await db.scholarshipProgram.create({
    data: {
      ...form,
      status: "Active"
    }
  });
  revalidatePath("/scholarships");
  return newProg;
}

export async function updateScholarshipProgram(id: string, updates: any) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.scholarshipProgram.update({
    where: { id },
    data: updates
  });
  revalidatePath("/scholarships");
}

export async function deleteScholarshipProgram(id: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.scholarshipProgram.delete({
    where: { id }
  });
  revalidatePath("/scholarships");
}

export async function getScholarshipApps() {
  const db = await getDB();
  if (!db) return [];
  return await db.scholarshipApp.findMany();
}

export async function submitScholarshipApp(form: { studentName: string; scholarshipId: string; requirements: any }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const isComplete = Object.values(form.requirements).every(v => v === true);
  const newApp = await db.scholarshipApp.create({
    data: {
      studentName: form.studentName,
      requirements: form.requirements,
      status: isComplete ? "For OSAS Review" : "Pending Requirements",
      dateApplied: new Date().toISOString().split('T')[0]
    }
  });
  revalidatePath("/scholarships");
  return newApp;
}

export async function updateAppStatus(id: string, updates: any) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.scholarshipApp.update({
    where: { id },
    data: updates
  });
  revalidatePath("/scholarships");
}

export async function getBatchConfigs() {
  const db = await getDB();
  if (!db) return [];
  return await db.batchConfig.findMany();
}

export async function updateBatchTimeline(id: number, updates: any) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.batchConfig.update({
    where: { id },
    data: updates
  });
  revalidatePath("/scholarships");
}

export async function addBatchConfig(form: { name: string; startDate: string; endDate: string }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newBatch = await db.batchConfig.create({
    data: {
      ...form,
      status: "Inactive"
    }
  });
  revalidatePath("/scholarships");
  return newBatch;
}

export async function deleteBatchConfig(id: number) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.batchConfig.delete({
    where: { id }
  });
  revalidatePath("/scholarships");
}
