"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * LOGIN ENGINE - THE GATEKEEPER
 */
export async function login(usernameInput: string, passwordInput: string) {
  const username = (usernameInput || "").trim().toLowerCase();
  const password = (passwordInput || "").trim();

  // 1. ABSOLUTE ADMIN BYPASS (Hardcoded Emergency Gateway)
  // This bypasses the database completely to ensure Mr. Dacles never gets locked out.
  if (username === "admin" && password === "admin") {
    const adminSession = { 
      id: "ADMIN-MASTER", 
      name: "Administrator", 
      username: "admin", 
      role: "SYSTEM_ADMIN" 
    };
    cookies().set("session_user", JSON.stringify(adminSession), { 
      httpOnly: true, 
      secure: true, 
      path: "/", 
      maxAge: 86400 // 24 Hours
    });
    return { success: true, user: adminSession };
  }

  // 2. DATABASE AUTHENTICATION (For Students & Staff)
  try {
    const { getPrisma } = await import("@/lib/prisma");
    const db = getPrisma();
    if (!db) return { success: false, message: "DATABASE_OFFLINE" };

    const user = await db.user.findUnique({ where: { username } });
    
    if (!user) {
      return { success: false, message: "ACCOUNT NOT FOUND" };
    }

    if (user.password !== password) {
      return { success: false, message: "INVALID CREDENTIALS" };
    }

    const session = { 
      id: user.id, 
      name: user.name, 
      username: user.username, 
      role: user.role 
    };

    cookies().set("session_user", JSON.stringify(session), { 
      httpOnly: true, 
      secure: true, 
      path: "/", 
      maxAge: 86400 
    });

    revalidatePath("/");
    return { success: true, user: session };
  } catch (error: any) {
    console.error("Auth DB Error:", error);
    return { success: false, message: `DATABASE_OFFLINE: ${error.message}` };
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

    const newUser = await db.user.create({
      data: {
        name: formData.name,
        username: username,
        password: formData.password,
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
    return { success: false, message: `REGISTRATION_ERROR: ${error.message}` };
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
    return JSON.parse(session.value);
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
      cookies().set("session_user", JSON.stringify(updatedUser), {
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
