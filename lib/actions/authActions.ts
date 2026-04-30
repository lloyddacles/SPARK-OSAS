"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function login(usernameInput: string, passwordInput: string) {
  try {
    const username = usernameInput.trim().toLowerCase();
    const password = passwordInput.trim();

    // 1. Find the institutional account
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    // 2. Strict Credential Verification
    if (!user) {
      return { success: false, message: "ACCOUNT NOT FOUND" };
    }

    if (user.password !== password) {
      return { success: false, message: "INVALID CREDENTIALS" };
    }

    // 3. Establish Secure Session
    const session = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    };

    cookies().set("session_user", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    revalidatePath("/");
    return { success: true, user: session };
  } catch (error: any) {
    console.error("Auth Error:", error);
    return { success: false, message: "SYSTEM UNAVAILABLE" };
  }
}

export async function logout() {
  cookies().delete("session_user");
  revalidatePath("/");
}

export async function getSession() {
  const session = cookies().get("session_user");
  if (!session) return null;
  
  try {
    return JSON.parse(session.value);
  } catch (e) {
    return null;
  }
}

export async function updateProfile(userId: string, updates: any) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updates
  });

  if (updatedUser) {
    // Update session cookie
    cookies().set("session_user", JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/"
    });
    
    revalidatePath("/");
    return updatedUser;
  }
  return null;
}
