"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { signSession, verifySession } from "@/lib/sessionCrypto";
import bcrypt from "bcryptjs";

export async function login(usernameInput: string, passwordInput: string) {
  const username = (usernameInput || "").trim().toLowerCase();
  const password = (passwordInput || "").trim();

  try {
    const { getPrisma } = await import("@/lib/prisma");
    const db = getPrisma();
    if (!db) return { success: false, message: "DATABASE_OFFLINE" };

    const user = await db.user.findUnique({ where: { username } });
    
    if (!user) {
      return { success: false, message: "ACCOUNT NOT FOUND" };
    }

    if (!user.password) {
      return { success: false, message: "INVALID CREDENTIALS" };
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return { success: false, message: "INVALID CREDENTIALS" };
    }

    const session = { 
      id: user.id, 
      name: user.name, 
      username: user.username, 
      role: user.role 
    };

    const token = await signSession(JSON.stringify(session));
    if (!token) return { success: false, message: "SESSION_CONFIG_ERROR" };

    cookies().set("session_user", token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: "lax",
      path: "/", 
      maxAge: 86400 
    });

    revalidatePath("/");
    return { success: true, user: session };
  } catch (error: any) {
    console.error("Auth DB Error:", error);
    return { success: false, message: "DATABASE_OFFLINE" };
  }
}

/**
 * REGISTRATION ENGINE
 */
export async function register(formData: { name: string, username: string, password: string }) {
  try {
    const { getPrisma } = await import("@/lib/prisma");
    const db = getPrisma();
    if (!db) return { success: false, message: "DATABASE_OFFLINE" };

    const username = formData.username.trim().toLowerCase();
    
    const existing = await db.user.findUnique({ where: { username } });
    if (existing) {
      return { success: false, message: "USERNAME ALREADY TAKEN" };
    }

    const hashedPassword = await bcrypt.hash(formData.password, 12);

    const newUser = await db.user.create({
      data: {
        name: formData.name,
        username: username,
        password: hashedPassword,
        role: "STUDENT_APPLICANT",
        vault: {
          "1x1 Photo": { uploaded: false, date: "", status: "Not Yet Verified" },
          "ID Copy": { uploaded: false, date: "", status: "Not Yet Verified" },
          "Birth Certificate": { uploaded: false, date: "", status: "Not Yet Verified" },
          "Good Moral": { uploaded: false, date: "", status: "Not Yet Verified" },
          "Report Card": { uploaded: false, date: "", status: "Not Yet Verified" }
        }
      }
    });

    return { success: true, user: newUser };
  } catch (error: any) {
    return { success: false, message: "REGISTRATION_ERROR" };
  }
}

/**
 * SESSION MANAGEMENT
 */
export async function logout() {
  cookies().delete("session_user");
  revalidatePath("/");
}

export async function getSession() {
  const session = cookies().get("session_user");
  if (!session) return null;
  
  try {
    const verified = await verifySession(session.value);
    if (!verified) return null;
    return JSON.parse(verified);
  } catch (e) {
    return null;
  }
}

/**
 * PROFILE UPDATES
 */
export async function updateProfile(userId: string, updates: any) {
  try {
    const { getPrisma } = await import("@/lib/prisma");
    const db = getPrisma();
    if (!db) return null;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updates
    });

    if (updatedUser) {
      const token = await signSession(JSON.stringify(updatedUser));
      if (!token) return null;

      cookies().set("session_user", token, {
        httpOnly: true,
        secure: true,
        maxAge: 86400,
        path: "/"
      });
      
      revalidatePath("/");
      return updatedUser;
    }
  } catch (e) {
    console.error("Profile Update Error:", e);
    return null;
  }
}
