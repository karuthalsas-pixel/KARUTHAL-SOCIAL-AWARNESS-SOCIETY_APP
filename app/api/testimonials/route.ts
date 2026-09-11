import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const submitSchema = z.object({
  quote: z.string().min(10, "Review must be at least 10 characters long").max(1000),
  author: z.string().min(2, "Name must be at least 2 characters long").max(120),
  role: z.string().max(120).optional(),
});

export async function GET() {
  try {
    const approvedTestimonials = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.status, "approved"))
      .orderBy(desc(testimonials.createdAt));

    return NextResponse.json({ ok: true, data: approvedTestimonials });
  } catch (err) {
    console.error("Testimonials GET Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ 
        ok: false, 
        message: "Validation failed", 
        errors: parsed.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    await db.insert(testimonials).values({
      quote: parsed.data.quote,
      author: parsed.data.author,
      role: parsed.data.role,
      status: "pending",
    });

    return NextResponse.json({ 
      ok: true, 
      message: "Review submitted successfully! It will appear once approved." 
    });
  } catch (err) {
    console.error("Testimonials POST Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
