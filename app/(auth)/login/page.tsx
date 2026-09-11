"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {registered && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg text-sm mb-6 text-center">
          Registration successful! Please log in.
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#AFDDE5] mb-1">Email Address</label>
          <input 
            required 
            type="email" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
            className="w-full bg-[#001f22] border border-[#0FA4AF]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#00F0FF] transition-colors" 
            placeholder="you@example.com" 
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-[#AFDDE5]">Password</label>
            <Link href="/forgot-password" className="text-xs text-[#00F0FF] hover:underline">Forgot password?</Link>
          </div>
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

        <Button type="submit" variant="primary" className="w-full mt-6 py-3 font-bold" disabled={loading}>
          {loading ? "Authenticating..." : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[#AFDDE5] text-sm">
        Don&apos;t have an account? <Link href="/register" className="text-[#00F0FF] hover:underline">Register</Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#001f22] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#02393e]/50 border border-[#0FA4AF]/30 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0FA4AF]/20 border border-[#0FA4AF] flex items-center justify-center text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <ShieldCheck size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h1>
        <p className="text-[#AFDDE5]/70 text-center text-sm mb-8">Sign in to your account</p>

        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
