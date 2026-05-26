import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  const hasUrl = !!process.env.DATABASE_URL;
  const db = getPrisma();
  let queryOk = false;
  let errorMsg = "";

  if (db) {
    try {
      await db.$queryRawUnsafe("SELECT 1");
      queryOk = true;
    } catch (e: any) {
      errorMsg = e.message;
    }
  } else {
    errorMsg = "getPrisma() returned null";
  }

  return NextResponse.json({
    DATABASE_URL_SET: hasUrl,
    PRISMA_READY: queryOk,
    ERROR: errorMsg || null,
    URL_PREVIEW: hasUrl ? process.env.DATABASE_URL!.substring(0, 45) + "..." : null,
  });
}
