"use server";

import { readData, writeData } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  const data = await readData();
  return data.users;
}

export async function updateUser(userId: string, updates: any) {
  const data = await readData();
  const userIndex = data.users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...updates };
    await writeData(data);
    revalidatePath("/admin");
    return data.users[userIndex];
  }
}

export async function toggleUserArchive(userId: string) {
  const data = await readData();
  const userIndex = data.users.findIndex((u: any) => u.id === userId);
  if (userIndex !== -1) {
    const currentStatus = data.users[userIndex].status;
    data.users[userIndex].status = currentStatus === "Archived" ? "Active" : "Archived";
    await writeData(data);
    revalidatePath("/admin");
    return data.users[userIndex];
  }
}

export async function clearAllAppointments() {
  const data = await readData();
  data.appointments = [];
  await writeData(data);
  revalidatePath("/admin");
  revalidatePath("/appointments");
}

export async function createUser(form: { name: string; username: string; password?: string; role: string }) {
  const data = await readData();
  const newUser = {
    id: `USR-${Math.random().toString(36).substr(2, 9)}`,
    ...form,
    vault: {}
  };
  data.users.push(newUser);
  await writeData(data);
  revalidatePath("/admin");
  return newUser;
}

export async function deleteUser(userId: string) {
  const data = await readData();
  data.users = data.users.filter((u: any) => u.id !== userId);
  await writeData(data);
  revalidatePath("/admin");
}

export async function getSystemHealth() {
  const data = await readData();
  return {
    userCount: data.users.length,
    appCount: data.scholarshipApps.length,
    orgCount: data.organizations.length,
    reqCount: data.serviceRequests.length,
    lastBackup: new Date().toISOString()
  };
}

export async function performAnnualArchive() {
  const data = await readData();
  
  // "Vault" by filtering out completed or resolved records
  const initialReqCount = data.serviceRequests.length;
  data.serviceRequests = data.serviceRequests.filter((req: any) => req.status !== "Completed" && req.status !== "Rejected");
  
  const initialApptCount = data.appointments.length;
  data.appointments = data.appointments.filter((app: any) => app.status !== "Completed" && app.status !== "Cancelled");
  
  const initialRefCount = data.referrals.length;
  data.referrals = data.referrals.filter((ref: any) => ref.status !== "Dismissed" && ref.status !== "Resolved" && ref.status !== "Sanctioned");
  
  const initialScholCount = data.scholarshipApps.length;
  data.scholarshipApps = data.scholarshipApps.filter((app: any) => app.status !== "Approved" && app.status !== "Rejected");

  await writeData(data);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/requests");
  
  return {
    archivedRequests: initialReqCount - data.serviceRequests.length,
    archivedAppointments: initialApptCount - data.appointments.length,
    archivedReferrals: initialRefCount - data.referrals.length,
    archivedScholarships: initialScholCount - data.scholarshipApps.length
  };
}
