import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: false, message: "Email is required" }, { status: 400 });
    }

    const userRecord = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Always return success to prevent email enumeration attacks
    if (userRecord.length === 0) {
      return NextResponse.json({ ok: true, message: "If that email exists, a reset link was sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.update(users)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(users.id, userRecord[0].id));

    // Dynamically build base URL from the incoming request
    // so this works on localhost AND production without changing .env
    const requestUrl = new URL(req.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Send real email via Gmail SMTP
    await transporter.sendMail({
      from: `"Karuthal Society" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🔐 Reset Your Password — Karuthal Society",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#001f22;font-family:'Segoe UI',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#001f22;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="560" cellpadding="0" cellspacing="0" style="background:#002b2e;border-radius:16px;border:1px solid rgba(0,240,255,0.2);overflow:hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#024950,#001f22);padding:32px;text-align:center;border-bottom:1px solid rgba(0,240,255,0.15);">
                        <h1 style="margin:0;color:#00F0FF;font-size:22px;font-weight:700;letter-spacing:1px;">KARUTHAL SOCIETY</h1>
                        <p style="margin:6px 0 0;color:#AFDDE5;font-size:12px;">Password Reset Request</p>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding:36px 40px;">
                        <p style="margin:0 0 16px;color:#AFDDE5;font-size:15px;line-height:1.6;">Hello,</p>
                        <p style="margin:0 0 24px;color:#AFDDE5;font-size:15px;line-height:1.6;">
                          We received a request to reset the password for your Karuthal Society admin account.
                          Click the button below to set a new password. This link will expire in <strong style="color:#00F0FF;">1 hour</strong>.
                        </p>
                        <!-- CTA Button -->
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                          <tr>
                            <td style="background:#00F0FF;border-radius:10px;padding:14px 36px;">
                              <a href="${resetUrl}" style="color:#001f22;font-size:15px;font-weight:700;text-decoration:none;display:block;">
                                Reset My Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin:0 0 8px;color:#AFDDE5;font-size:12px;line-height:1.6;">
                          If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="margin:0 0 28px;word-break:break-all;">
                          <a href="${resetUrl}" style="color:#00F0FF;font-size:12px;">${resetUrl}</a>
                        </p>
                        <p style="margin:0;color:#AFDDE5;font-size:13px;line-height:1.6;border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;">
                          If you did not request a password reset, please ignore this email — your account is safe.
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background:#001a1d;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);">
                        <p style="margin:0;color:#AFDDE5;font-size:11px;opacity:0.6;">
                          © ${new Date().getFullYear()} Karuthal Social Awareness Society · Thiruvalla, Kerala<br/>
                          Reg No: PTM/TC/15/2023
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log("✅ Password reset email sent to:", email);

    return NextResponse.json({ ok: true, message: "If that email exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
