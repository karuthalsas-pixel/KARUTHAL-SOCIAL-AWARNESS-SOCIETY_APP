import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq, and, gt } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ ok: false, message: "Missing fields" }, { status: 400 });
    }

    const now = new Date();
    const userRecord = await db.select()
      .from(users)
      .where(
        and(
          eq(users.resetToken, token),
          gt(users.resetTokenExpiry, now)
        )
      )
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json({ ok: false, message: "Invalid or expired reset token" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await db.update(users)
      .set({ 
        passwordHash, 
        resetToken: null, 
        resetTokenExpiry: null 
      })
      .where(eq(users.id, userRecord[0].id));

    return NextResponse.json({ ok: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
