"use server";

import { revalidatePath } from "next/cache";

async function getDB() {
  const { getPrisma } = await import("@/lib/prisma");
  return getPrisma();
}

export async function getServiceRequests() {
  const db = await getDB();
  if (!db) return [];
  return await db.serviceRequest.findMany();
}

export async function addServiceRequest(form: { type: string; studentName: string; requirements: any }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newReq = await db.serviceRequest.create({
    data: {
      ...form,
      status: "PENDING",
      date: new Date().toISOString().split('T')[0]
    }
  });
  revalidatePath("/requests");
  return newReq;
}

export async function updateServiceRequestStatus(id: string, status: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.serviceRequest.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/requests");
}

export async function getServiceTypes() {
  const db = await getDB();
  if (!db) return [];
  return await db.serviceType.findMany();
}

export async function addServiceType(form: { name: string; description: string; requiredDocs: string[] }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newType = await db.serviceType.create({
    data: form
  });
  revalidatePath("/requests");
  return newType;
}

export async function updateServiceType(id: string, updates: any) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.serviceType.update({
    where: { id },
    data: updates
  });
  revalidatePath("/requests");
}

export async function deleteServiceType(id: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.serviceType.delete({
    where: { id }
  });
  revalidatePath("/requests");
}

export async function getGoodMoralConfig() {
  return {
    content: "This is to certify that [STUDENT_NAME] is a student of good moral character.",
    signatories: []
  };
}

export async function updateGoodMoralConfig(config: any) {
  revalidatePath("/requests");
}

export async function getIssuedCertificates() {
  return [];
}

export async function issueCertificate(cert: any) {
  revalidatePath("/requests");
  return { id: "TEMP" };
}
