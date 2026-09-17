import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carouselItems } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allItems = await db
      .select()
      .from(carouselItems)
      .orderBy(desc(carouselItems.createdAt));

    return NextResponse.json({ ok: true, data: allItems });
  } catch (err) {
    console.error("Admin Carousel GET Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const orderStr = formData.get("order") as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    
    let imageUrl = formData.get("imageUrl") as string || "";
    
    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(`carousel/${fileName}`, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json({ ok: false, message: "Failed to upload image to Supabase." }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('uploads')
        .getPublicUrl(`carousel/${fileName}`);

      imageUrl = publicUrlData.publicUrl;
    }

    if (!imageUrl || !title) {
      return NextResponse.json({ ok: false, message: "Image URL and Title are required" }, { status: 400 });
    }

    await db.insert(carouselItems).values({
      imageUrl,
      title,
      description,
      order,
    });

    return NextResponse.json({ ok: true, message: "Carousel item created successfully" });
  } catch (err) {
    console.error("Admin Carousel POST Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
