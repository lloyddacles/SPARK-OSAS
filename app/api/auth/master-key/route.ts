import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // THE INSTITUTIONAL MASTER KEY
  // This bypasses the database to restore access to Mr. Lloyd Christopher F. Dacles
  
  const masterSession = {
    id: "USER-ADMIN-RECOVERY",
    name: "Master Administrator",
    username: "admin",
    role: "SYSTEM_ADMIN"
  };

  cookies().set("session_user", JSON.stringify(masterSession), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 // 24 hours
  });

  // Redirect to dashboard relative to current domain
  const url = req.nextUrl.clone();
  url.pathname = "/dashboard";
  return NextResponse.redirect(url);
}
