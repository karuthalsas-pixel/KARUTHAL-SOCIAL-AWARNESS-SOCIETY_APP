import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programs } from "@/lib/schema";
import { asc } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(programs)
      .orderBy(asc(programs.order));

    return NextResponse.json({ ok: true, data: items });
  } catch (err) {
    console.error("Programs GET Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
