import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: "Missing fields" }, { status: 400 });
    }

    const userRecord = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userRecord.length === 0) {
      return NextResponse.json({ ok: false, message: "Invalid email or password" }, { status: 401 });
    }

    const user = userRecord[0];
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ ok: false, message: "Invalid email or password" }, { status: 401 });
    }

    // Create session token
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ 
      ok: true, 
      message: "Logged in successfully",
      role: user.role
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
