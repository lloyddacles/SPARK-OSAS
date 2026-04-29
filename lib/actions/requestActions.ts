"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getServiceRequests() {
  return await prisma.serviceRequest.findMany();
}

export async function addServiceRequest(form: { type: string; studentName: string; requirements: any }) {
  const newReq = await prisma.serviceRequest.create({
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
  await prisma.serviceRequest.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/requests");
}

export async function getServiceTypes() {
  return await prisma.serviceType.findMany();
}

export async function addServiceType(form: { name: string; description: string; requiredDocs: string[] }) {
  const newType = await prisma.serviceType.create({
    data: form
  });
  revalidatePath("/requests");
  return newType;
}

export async function updateServiceType(id: string, updates: any) {
  await prisma.serviceType.update({
    where: { id },
    data: updates
  });
  revalidatePath("/requests");
}

export async function deleteServiceType(id: string) {
  await prisma.serviceType.delete({
    where: { id }
  });
  revalidatePath("/requests");
}

export async function getGoodMoralConfig() {
  // We can store this in a special Config table later if needed, 
  // for now returning a default or we could add a Config model.
  return {
    content: "This is to certify that [STUDENT_NAME] is a student of good moral character.",
    signatories: []
  };
}

export async function updateGoodMoralConfig(config: any) {
  // Placeholder for when we add a Config table
  revalidatePath("/requests");
}

export async function getIssuedCertificates() {
  // We can add an IssuedCertificate model later
  return [];
}

export async function issueCertificate(cert: any) {
  // Placeholder for when we add an IssuedCertificate model
  revalidatePath("/requests");
  return { id: "TEMP" };
}
