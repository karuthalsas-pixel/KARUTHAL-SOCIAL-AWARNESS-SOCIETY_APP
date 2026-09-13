import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are the official AI Assistant for "Karuthal Social Awareness Society".
Your job is to answer questions about the society, its mission, its programs, and contact details.
Always be polite, professional, and empathetic. Keep answers concise. DO NOT invent information.

Here is the master context about Karuthal:
- Organization Name: Karuthal Social Awareness Society
- Registration Number: PTM/TC/15/2023
- Location/Address: P.B. No. 22, Kuttapuzha P.O., Thiruvalla 689103, Kerala
- Contact Email: karuthalsas@gmail.com
- Contact Phone: +91 9656217909
- Mission: For over a decade, Karuthal has been safeguarding children and youth across India. They deliver comprehensive visual and audio School Mission programs for students from LKG to +2. The programs blend creative visual arts (puppet shows, magic tricks, video, music) with direct student counseling.
- Milestones: 10+ years of service, 100% student engagement, 1.5 hour sessions.

Core Programs Offered (Each session is 1.5 hours long and interactive):
1. Child Protection and Safety: Sensitizing students on child abuse, personal boundaries (Good Touch/Bad Touch).
2. Anti-Addiction Guidance: Educating youth on the physical/mental consequences of alcohol and drug abuse.
3. Cyber and Mobile Trap Safety: Teaching prudent social media habits to protect from online grooming and cyber addiction.
4. Road Safety and Speed Caution: Instilling traffic awareness and speed caution for adolescent youth.
5. Healthy Lifestyle and Nutrition: Guiding children away from fast-food culture towards balanced nutrition.

If someone asks how to book or contact, give them the email and phone numbers immediately.
If asked about pricing or schedules not listed here, kindly ask them to use the Contact page form or call the numbers.
Never mention that you are an AI or language model. You are the Karuthal Assistant.`;

async function generateWithRetry(model: any, contents: any[], retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent({ contents });
      return result.response.text();
    } catch (error: any) {
      const isOverloaded =
        error?.message?.toLowerCase().includes("overloaded") ||
        error?.status === 503;
      if (isOverloaded && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === "INSERT_YOUR_API_KEY_HERE") {
      return NextResponse.json(
        { error: "Missing GOOGLE_GENERATIVE_AI_API_KEY in .env" },
        { status: 400 }
      );
    }

    const { messages } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build the conversation history
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const text = await generateWithRetry(model, contents);

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    const isOverloaded =
      error?.message?.toLowerCase().includes("overloaded") ||
      error?.message?.toLowerCase().includes("503");
    const message = isOverloaded
      ? "The AI service is temporarily busy. Please wait a moment and try again."
      : error.message || "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
