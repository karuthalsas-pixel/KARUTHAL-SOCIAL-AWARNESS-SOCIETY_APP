import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { employees } from "@/lib/schema";
import { writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await db.select().from(employees).orderBy(asc(employees.name));
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (error) {
    console.error("Employees fetch error:", error);
    return NextResponse.json({ ok: false, items: [], message: "Unable to load employees." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const orderStr = formData.get("order") as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    
    let imageUrl = "";
    
    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "employees");
      const filePath = path.join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/employees/${fileName}`;
    }

    const [newItem] = await db.insert(employees).values({
      name,
      role,
      address,
      phone,
      imageUrl,
      order,
    }).returning();

    return NextResponse.json({ ok: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Employee create error:", error);
    return NextResponse.json({ ok: false, message: "Unable to create employee." }, { status: 500 });
  }
}
