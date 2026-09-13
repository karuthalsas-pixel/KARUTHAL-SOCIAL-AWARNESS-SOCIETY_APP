import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { galleryItems } from "@/lib/schema";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ ok: false, message: "Invalid ID" }, { status: 400 });

    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const location = formData.get("location") as string;
    const yearStr = formData.get("year") as string;
    const description = formData.get("description") as string;
    const featured = formData.get("featured") === "true";
    const orderStr = formData.get("order") as string;
    
    const year = yearStr ? parseInt(yearStr, 10) : null;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    
    let imageUrl = formData.get("imageUrl") as string || "";
    
    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(`gallery/${fileName}`, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json({ ok: false, message: "Failed to upload image to Supabase." }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('uploads')
        .getPublicUrl(`gallery/${fileName}`);

      imageUrl = publicUrlData.publicUrl;
    }

    const updated = await db.update(galleryItems).set({
      title,
      category,
      location,
      year,
      imageUrl,
      description,
      featured,
      order,
    }).where(eq(galleryItems.id, id)).returning();

    if (updated.length === 0) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: updated[0] }, { status: 200 });
  } catch (error) {
    console.error("Gallery update error:", error);
    return NextResponse.json({ ok: false, message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ ok: false, message: "Invalid ID" }, { status: 400 });

    const deleted = await db.delete(galleryItems).where(eq(galleryItems.id, id)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ ok: false, message: "Delete failed" }, { status: 500 });
  }
}
