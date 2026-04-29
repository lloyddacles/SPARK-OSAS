"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getAppointments() {
  return await prisma.appointment.findMany({
    orderBy: { date: "asc" }
  });
}

export async function bookAppointment(form: { title: string; date: string; startTime: string; endTime: string; type: string; description: string; studentName: string }) {
  const newApp = await prisma.appointment.create({
    data: {
      ...form,
      status: "PENDING"
    }
  });

  revalidatePath("/appointments");
  return newApp;
}

export async function updateAppointmentStatus(id: string, status: string) {
  await prisma.appointment.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/appointments");
}
