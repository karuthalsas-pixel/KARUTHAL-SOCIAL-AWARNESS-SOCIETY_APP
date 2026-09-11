import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ ok: false, message: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { quote, author, role, status } = body;

    await db
      .update(testimonials)
      .set({ quote, author, role, status })
      .where(eq(testimonials.id, id));

    return NextResponse.json({ ok: true, message: "Testimonial updated successfully" });
  } catch (err) {
    console.error("Admin Testimonials PUT Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ ok: false, message: "Invalid ID" }, { status: 400 });
    }

    await db.delete(testimonials).where(eq(testimonials.id, id));

    return NextResponse.json({ ok: true, message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error("Admin Testimonials DELETE Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
