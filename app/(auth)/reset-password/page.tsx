"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { KeyRound, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing reset token");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Password reset successfully. You can now log in.");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to reset password");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  if (!token && status !== "success") {
    return (
      <div className="text-center">
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm mb-6">
          Missing reset token. Please use the link provided in your email.
        </div>
        <Link href="/forgot-password">
          <Button variant="secondary" className="w-full">Request New Link</Button>
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg text-sm mb-6">
          {message}
        </div>
        <Link href="/login">
          <Button variant="primary" className="w-full">Go to Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
          {message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-[#AFDDE5] mb-1">New Password</label>
        <div className="relative">
          <input 
            required 
            type={showPassword ? "text" : "password"}
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
            className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-3 pr-10 text-white focus:outline-none focus:border-[#00F0FF] transition-colors" 
            placeholder="••••••••" 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AFDDE5]/50 hover:text-[#00F0FF] transition-colors">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#AFDDE5] mb-1">Confirm New Password</label>
        <div className="relative">
          <input 
            required 
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword} 
            onChange={e => setForm({...form, confirmPassword: e.target.value})} 
            className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-3 pr-10 text-white focus:outline-none focus:border-[#00F0FF] transition-colors" 
            placeholder="••••••••" 
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AFDDE5]/50 hover:text-[#00F0FF] transition-colors">
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full mt-6 py-3 font-bold" disabled={status === "loading"}>
        {status === "loading" ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#001f22] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#02393e]/50 border border-[#0FA4AF]/30 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0FA4AF]/20 border border-[#0FA4AF] flex items-center justify-center text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <KeyRound size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">Create New Password</h1>
        <p className="text-[#AFDDE5]/70 text-center text-sm mb-8">Please enter and confirm your new password.</p>

        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
