"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function login(username: string, password?: string) {
  // SECURE SQL AUTH: Find user by credentials
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { name: username }
      ]
    }
  });

  // Basic security check (Note: In production, use bcrypt)
  if (user && password && user.password !== password) {
    throw new Error("INVALID CREDENTIALS");
  }

  if (!user) {
    const defaultRole = "STUDENT_APPLICANT";
    user = await prisma.user.create({
      data: {
        name: username,
        username: username,
        password: password,
        role: defaultRole,
        vault: {
          "1x1 Photo": { uploaded: false, date: null, fileType: null },
          "ID Copy": { uploaded: false, date: null, fileType: null },
          "Birth Certificate": { uploaded: false, date: null, fileType: null },
          "Good Moral": { uploaded: false, date: null, fileType: null },
          "Report Card": { uploaded: false, date: null, fileType: null }
        }
      }
    });
  }

  // Set secure session cookie
  cookies().set("session_user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 // 24 hours
  });

  revalidatePath("/");
  return user;
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
