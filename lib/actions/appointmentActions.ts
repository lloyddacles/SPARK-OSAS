"use server";

import { revalidatePath } from "next/cache";

async function getDB() {
  const { getPrisma } = await import("@/lib/prisma");
  return getPrisma();
}

export async function getAppointments() {
  const db = await getDB();
  if (!db) return [];
  return await db.appointment.findMany({
    orderBy: { date: "asc" }
  });
}

export async function bookAppointment(form: { title: string; date: string; startTime: string; endTime: string; type: string; description: string; studentName: string }) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newApp = await db.appointment.create({
    data: {
      ...form,
      status: "PENDING"
    }
  });

  revalidatePath("/appointments");
  return newApp;
}

export async function updateAppointmentStatus(id: string, status: string) {
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.appointment.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/appointments");
}
