import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  cookies().delete("session");
  return NextResponse.json({ ok: true, message: "Logged out successfully" });
}
