import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allTestimonials = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));

    return NextResponse.json({ ok: true, data: allTestimonials });
  } catch (err) {
    console.error("Admin Testimonials GET Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quote, author, role, status } = body;

    if (!quote || !author) {
      return NextResponse.json({ ok: false, message: "Quote and author are required" }, { status: 400 });
    }

    await db.insert(testimonials).values({
      quote,
      author,
      role,
      status: status || "approved",
    });

    return NextResponse.json({ ok: true, message: "Testimonial created successfully" });
  } catch (err) {
    console.error("Admin Testimonials POST Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
