import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carouselItems } from "@/lib/schema";
import { asc } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(carouselItems)
      .orderBy(asc(carouselItems.order));

    return NextResponse.json({ ok: true, data: items });
  } catch (err) {
    console.error("Carousel GET Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
