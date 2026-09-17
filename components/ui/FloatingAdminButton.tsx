"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingAdminButton() {
  return (
    <div className="fixed bottom-6 left-6 z-[90] flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Link
        href="/portal-karuthal-secure"
        className={cn(
          "group relative flex items-center justify-center w-[60px] h-[60px] rounded-full",
          "bg-gradient-to-br from-[#00F0FF] to-[#0080FF] shadow-[0_4px_20px_rgba(0,240,255,0.4)]",
          "hover:scale-110 hover:-translate-y-2 transition-all duration-300",
          "border-2 border-white/20"
        )}
        aria-label="Admin Dashboard"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
        <ShieldCheck className="text-white relative z-10 drop-shadow-md" size={28} />
        
        {/* Tooltip */}
        <span className="absolute left-full ml-4 px-3 py-1.5 bg-[#001f22]/90 backdrop-blur-md border border-[#0FA4AF]/30 text-[#AFDDE5] text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-xl">
          Admin Dashboard
        </span>
      </Link>
    </div>
  );
}
