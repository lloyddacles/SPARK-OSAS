"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId?: string) {
  return await prisma.notification.findMany({
    where: userId ? {
      OR: [
        { targetId: userId },
        { targetId: null }
      ]
    } : {},
    orderBy: { createdAt: "desc" },
    take: 50
  });
}

export async function addNotification(notification: { title: string, desc: string, targetId?: string }) {
  const newNotif = await prisma.notification.create({
    data: {
      ...notification,
      time: new Date().toISOString(),
      unread: true
    }
  });
  
  revalidatePath("/");
  return newNotif;
}

export async function markNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: {
      OR: [
        { targetId: userId },
        { targetId: null }
      ],
      unread: true
    },
    data: { unread: false }
  });
  
  revalidatePath("/");
}

export async function getAuditLogs() {
  return await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 100
  });
}

export async function addAuditLog(log: any) {
  await prisma.auditLog.create({
    data: {
      ...log,
      timestamp: new Date()
    }
  });
}
