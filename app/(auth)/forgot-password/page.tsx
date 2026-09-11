"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#001f22] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#02393e]/50 border border-[#0FA4AF]/30 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0FA4AF]/20 border border-[#0FA4AF] flex items-center justify-center text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <KeyRound size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">Forgot Password</h1>
        <p className="text-[#AFDDE5]/70 text-center text-sm mb-8">Enter your email to receive a reset link</p>

        {status === "success" ? (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg text-sm mb-6">
              {message}
              <br /><br />
              <span className="text-xs text-white/50">(Check your server terminal logs for the mock email link)</span>
            </div>
            <Link href="/login">
              <Button variant="secondary" className="w-full">Return to Log In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
                {message}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#AFDDE5] mb-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#00F0FF] transition-colors" 
                placeholder="you@example.com" 
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-6 py-3 font-bold" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </Button>
            
            <p className="mt-6 text-center text-[#AFDDE5] text-sm">
              Remember your password? <Link href="/login" className="text-[#00F0FF] hover:underline">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
