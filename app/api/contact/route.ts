import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { contactFormSchema } from "@/lib/validations";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Simple in-memory rate limiter (per server instance) — 5 requests / 10 minutes / IP hash.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendAdminNotification(data: {
  name: string; email: string; phone?: string | null;
  projectType?: string | null; message: string;
}) {
  try {
    await transporter.sendMail({
      from: `"Karuthal Website" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: data.email,
      subject: `📩 New Contact Message from ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#001f22;font-family:'Segoe UI',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#001f22;padding:30px 20px;">
              <tr><td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#002b2e;border-radius:16px;border:1px solid rgba(0,240,255,0.2);overflow:hidden;">
                  <tr>
                    <td style="background:linear-gradient(135deg,#024950,#001f22);padding:24px 32px;border-bottom:1px solid rgba(0,240,255,0.15);">
                      <h1 style="margin:0;color:#00F0FF;font-size:18px;font-weight:700;">📩 New Contact Message</h1>
                      <p style="margin:4px 0 0;color:#AFDDE5;font-size:12px;">Karuthal Society — Website Inquiry</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07);">
                          <span style="color:#AFDDE5;font-size:12px;opacity:0.6;display:block;">FROM</span>
                          <span style="color:#fff;font-size:15px;font-weight:600;">${data.name}</span>
                        </td></tr>
                        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07);">
                          <span style="color:#AFDDE5;font-size:12px;opacity:0.6;display:block;">EMAIL</span>
                          <a href="mailto:${data.email}" style="color:#00F0FF;font-size:14px;">${data.email}</a>
                        </td></tr>
                        ${data.phone ? `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07);">
                          <span style="color:#AFDDE5;font-size:12px;opacity:0.6;display:block;">PHONE</span>
                          <span style="color:#fff;font-size:14px;">${data.phone}</span>
                        </td></tr>` : ""}
                        ${data.projectType ? `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07);">
                          <span style="color:#AFDDE5;font-size:12px;opacity:0.6;display:block;">PROGRAM INTEREST</span>
                          <span style="color:#fff;font-size:14px;">${data.projectType}</span>
                        </td></tr>` : ""}
                        <tr><td style="padding:12px 0;">
                          <span style="color:#AFDDE5;font-size:12px;opacity:0.6;display:block;margin-bottom:6px;">MESSAGE</span>
                          <div style="background:#001f22;border:1px solid rgba(0,240,255,0.15);border-radius:10px;padding:14px;color:#AFDDE5;font-size:14px;line-height:1.7;white-space:pre-wrap;">${data.message}</div>
                        </td></tr>
                      </table>
                      <table cellpadding="0" cellspacing="0" style="margin-top:20px;">
                        <tr><td style="background:#00F0FF;border-radius:8px;padding:11px 28px;">
                          <a href="mailto:${data.email}" style="color:#001f22;font-size:13px;font-weight:700;text-decoration:none;">Reply to ${data.name}</a>
                        </td></tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#001a1d;padding:16px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0;color:#AFDDE5;font-size:11px;opacity:0.5;">© ${new Date().getFullYear()} Karuthal Social Awareness Society · Thiruvalla, Kerala</p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </body>
        </html>
      `,
    });
    console.log("✅ Admin notification email sent for message from:", data.email);
  } catch (err) {
    console.error("❌ Failed to send admin notification email:", err);
    // Don't throw — saving the message is more important than the email
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors },
        { status: 400 }
      );
    }

    // Honeypot check
    if (parsed.data.company) {
      return NextResponse.json({ ok: true, message: "Thanks — we'll be in touch." }, { status: 200 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";
    const ip = forwardedFor.split(",")[0].trim();
    const ipHash = createHash("sha256").update(ip).digest("hex");

    if (isRateLimited(ipHash)) {
      return NextResponse.json(
        { ok: false, message: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const { name, email, phone, projectType, message } = parsed.data;

    await db.insert(contactSubmissions).values({
      name,
      email,
      phone: phone || null,
      projectType: projectType || null,
      message,
      ipHash
    });

    // Send email notification to admin (non-blocking)
    sendAdminNotification({ name, email, phone, projectType, message });

    return NextResponse.json(
      { ok: true, message: "Message sent — we'll reply within one business day." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }
}

