import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { galleryItems } from "@/lib/schema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await db.select().from(galleryItems).orderBy(asc(galleryItems.order));
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ ok: false, items: [], message: "Unable to load gallery." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
      const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
      
      // Ensure directory exists
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // ignore
      }

      const filePath = path.join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/gallery/${fileName}`;
    }

    if (!title || !category || !imageUrl) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields: title, category, imageUrl" },
        { status: 400 }
      );
    }

    const [newItem] = await db.insert(galleryItems).values({
      title,
      category,
      location,
      year,
      imageUrl,
      description,
      featured,
      order,
    }).returning();

    return NextResponse.json({ ok: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json({ ok: false, message: "Unable to create gallery item." }, { status: 500 });
  }
}
