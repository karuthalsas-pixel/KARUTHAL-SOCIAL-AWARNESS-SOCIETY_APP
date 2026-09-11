import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allMessages = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));

    return NextResponse.json({ ok: true, data: allMessages });
  } catch (err) {
    console.error("Admin Messages GET Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ ok: false, message: "ID and status are required" }, { status: 400 });
    }

    await db
      .update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, id));

    return NextResponse.json({ ok: true, message: "Message status updated" });
  } catch (err) {
    console.error("Admin Messages PATCH Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ ok: false, message: "ID is required" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);

    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));

    return NextResponse.json({ ok: true, message: "Message deleted" });
  } catch (err) {
    console.error("Admin Messages DELETE Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
