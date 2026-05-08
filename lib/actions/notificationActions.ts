"use server";

import { revalidatePath } from "next/cache";

import { getPrisma } from "@/lib/prisma";

async function getDB() {
  return getPrisma();
}

export async function getNotifications(userId?: string) {
  const db = await getDB();
  if (!db) return [];
  return await db.notification.findMany({
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
  const db = await getDB();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const newNotif = await db.notification.create({
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
  const db = await getDB();
  if (!db) return;
  await db.notification.updateMany({
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
  const db = await getDB();
  if (!db) return [];
  return await db.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 100
  });
}

export async function addAuditLog(log: any) {
  const db = await getDB();
  if (!db) return;
  await db.auditLog.create({
    data: {
      ...log,
      timestamp: new Date()
    }
  });
}
