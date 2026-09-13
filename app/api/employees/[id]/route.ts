import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { employees } from "@/lib/schema";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const orderStr = formData.get("order") as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    
    // Check if we have a new image
    let imageUrl = formData.get("imageUrl") as string; // existing image URL if not changed
    const file = formData.get("image") as File;
    
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(`employees/${fileName}`, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json({ ok: false, message: "Failed to upload image to Supabase." }, { status: 500 });
      }
      
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('uploads')
        .getPublicUrl(`employees/${fileName}`);
        
      imageUrl = publicUrlData.publicUrl;
      
      // We could optionally delete the old image here, but skipping for simplicity
    }

    const [updatedItem] = await db.update(employees).set({
      name,
      role,
      address,
      phone,
      imageUrl,
      order,
    }).where(eq(employees.id, id)).returning();

    return NextResponse.json({ ok: true, item: updatedItem }, { status: 200 });
  } catch (error) {
    console.error("Employee update error:", error);
    return NextResponse.json({ ok: false, message: "Unable to update employee." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    
    // Optional: Fetch the employee to delete the associated image file
    const [existing] = await db.select().from(employees).where(eq(employees.id, id));
    if (existing && existing.imageUrl && existing.imageUrl.startsWith('/uploads/')) {
        try {
            const filePath = path.join(process.cwd(), "public", existing.imageUrl);
            await unlink(filePath);
        } catch (e) {
            console.error("Could not delete image file", e);
        }
    }

    await db.delete(employees).where(eq(employees.id, id));
    
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Employee delete error:", error);
    return NextResponse.json({ ok: false, message: "Unable to delete employee." }, { status: 500 });
  }
}
