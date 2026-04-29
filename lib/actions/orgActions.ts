"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getOrganizations() {
  return await prisma.studentOrg.findMany();
}

export async function addOrganization(form: { name: string; acronym: string; category: string; president: string; adviser: string; adviserId: string; logo?: string }) {
  const newOrg = await prisma.studentOrg.create({
    data: {
      ...form,
      status: "Recognized"
    }
  });

  revalidatePath("/organizations");
  return newOrg;
}

export async function updateOrganization(id: string, updates: any) {
  await prisma.studentOrg.update({
    where: { id },
    data: updates
  });
  revalidatePath("/organizations");
}

export async function deleteOrganization(id: string) {
  await prisma.studentOrg.delete({
    where: { id }
  });
  revalidatePath("/organizations");
}

export async function proposeActivity(orgId: string, form: { title: string; description: string; date: string; budget: string; venue: string; participants: string }) {
  const newAct = await prisma.orgActivity.create({
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
  await prisma.orgActivity.update({
    where: { id },
    data: {
      status: updates.status,
      osasComments: updates.comments
    }
  });
  revalidatePath("/organizations");
}

export async function getActivities() {
  return await prisma.orgActivity.findMany();
}
