import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const MASTER_KEY = process.env.MASTER_ACCESS_KEY;

export async function GET(req: NextRequest) {
  const providedKey = req.nextUrl.searchParams.get("key");

  if (!MASTER_KEY || MASTER_KEY.length < 32) {
    return NextResponse.json(
      { error: "Master access is not configured" },
      { status: 503 }
    );
  }

  if (!providedKey || providedKey !== MASTER_KEY) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { signSession } = await import("@/lib/sessionCrypto");

  const masterSession = {
    id: "USER-ADMIN-RECOVERY",
    name: "Master Administrator",
    username: "admin",
    role: "SYSTEM_ADMIN"
  };

  const token = await signSession(JSON.stringify(masterSession));
  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set("session_user", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60
  });

  return response;
}
