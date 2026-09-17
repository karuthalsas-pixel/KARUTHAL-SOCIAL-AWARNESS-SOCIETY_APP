import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageId, clientEmail, clientName, replyText } = body;

    if (!messageId || !clientEmail || !replyText) {
      return NextResponse.json({ ok: false, message: "Missing required fields" }, { status: 400 });
    }

    // Send the reply email to the client
    await transporter.sendMail({
      from: `"Karuthal Society" <${process.env.SMTP_USER}>`,
      to: clientEmail,
      subject: `Re: Your Inquiry to Karuthal Society`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:40px;border-top:4px solid #0FA4AF;border-radius:0 0 8px 8px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
              <h2 style="color:#001f22;margin-top:0;">Hello ${clientName},</h2>
              <div style="color:#374151;font-size:15px;line-height:1.6;white-space:pre-wrap;margin-bottom:30px;">${replyText}</div>
              
              <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-top:20px;">
                <p style="margin:0;color:#6b7280;font-size:14px;font-weight:600;">Best regards,</p>
                <p style="margin:4px 0 0;color:#0FA4AF;font-size:14px;font-weight:bold;">Karuthal Social Awareness Society</p>
                <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">P.B. No. 22, Kuttapuzha P.O., Thiruvalla</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Mark the message as responded in the database
    await db
      .update(contactSubmissions)
      .set({ status: "responded" })
      .where(eq(contactSubmissions.id, messageId));

    return NextResponse.json({ ok: true, message: "Reply sent successfully" });
  } catch (err) {
    console.error("Admin Messages Reply Error:", err);
    return NextResponse.json({ ok: false, message: "Failed to send reply email" }, { status: 500 });
  }
}
