import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ ok: false, message: "Email already exists" }, { status: 400 });
    }

    const designatedAdminEmail = process.env.DESIGNATED_ADMIN_EMAIL || "admin@example.com";
    let role = "USER";

    if (email === designatedAdminEmail) {
      // Check if an admin already exists (only 1 allowed)
      const existingAdmin = await db.select().from(users).where(eq(users.role, "ADMIN")).limit(1);
      if (existingAdmin.length > 0) {
        return NextResponse.json({ ok: false, message: "A System Admin already exists. Only 1 allowed." }, { status: 403 });
      }
      role = "ADMIN";
    }

    const passwordHash = await hashPassword(password);

    await db.insert(users).values({
      name,
      email,
      passwordHash,
      role,
    });

    return NextResponse.json({ ok: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
