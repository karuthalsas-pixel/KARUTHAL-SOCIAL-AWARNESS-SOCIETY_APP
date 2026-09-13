import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programs } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allItems = await db
      .select()
      .from(programs)
      .orderBy(desc(programs.createdAt));

    return NextResponse.json({ ok: true, data: allItems });
  } catch (err) {
    console.error("Admin Programs GET Error:", err);
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
      const uploadDir = path.join(process.cwd(), "public", "uploads", "programs");
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // ignore
      }

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/programs/${fileName}`;
    }

    if (!imageUrl) {
      return NextResponse.json({ ok: false, message: "Image URL or File is required" }, { status: 400 });
    }

    await db.insert(programs).values({
      imageUrl,
      title: title || null,
      description: description || null,
      order,
    });

    return NextResponse.json({ ok: true, message: "Program item created successfully" });
  } catch (err) {
    console.error("Admin Programs POST Error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
