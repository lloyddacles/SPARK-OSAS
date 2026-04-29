"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getScholarshipPrograms() {
  return await prisma.scholarshipProgram.findMany();
}

export async function addScholarshipProgram(form: { name: string; provider: string; description: string; deadline: string }) {
  const newProg = await prisma.scholarshipProgram.create({
    data: {
      ...form,
      status: "Active"
    }
  });
  revalidatePath("/scholarships");
  return newProg;
}

export async function updateScholarshipProgram(id: string, updates: any) {
  await prisma.scholarshipProgram.update({
    where: { id },
    data: updates
  });
  revalidatePath("/scholarships");
}

export async function deleteScholarshipProgram(id: string) {
  await prisma.scholarshipProgram.delete({
    where: { id }
  });
  revalidatePath("/scholarships");
}

export async function getScholarshipApps() {
  return await prisma.scholarshipApp.findMany();
}

export async function submitScholarshipApp(form: { studentName: string; scholarshipId: string; requirements: any }) {
  const isComplete = Object.values(form.requirements).every(v => v === true);
  const newApp = await prisma.scholarshipApp.create({
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
  await prisma.scholarshipApp.update({
    where: { id },
    data: updates
  });
  revalidatePath("/scholarships");
}

export async function getBatchConfigs() {
  return await prisma.batchConfig.findMany();
}

export async function updateBatchTimeline(id: number, updates: any) {
  await prisma.batchConfig.update({
    where: { id },
    data: updates
  });
  revalidatePath("/scholarships");
}

export async function addBatchConfig(form: { name: string; startDate: string; endDate: string }) {
  const newBatch = await prisma.batchConfig.create({
    data: {
      ...form,
      status: "Inactive"
    }
  });
  revalidatePath("/scholarships");
  return newBatch;
}

export async function deleteBatchConfig(id: number) {
  await prisma.batchConfig.delete({
    where: { id }
  });
  revalidatePath("/scholarships");
}
