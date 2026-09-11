"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300 ease-signature disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary:
    "bg-gradient-to-r from-[#00F0FF] via-[#0FA4AF] to-[#2EC6D1] text-[#001f22] font-bold shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:shadow-[0_0_50px_rgba(0,240,255,0.9)] border border-white/40 active:scale-95",
  secondary:
    "border-2 border-[#00F0FF]/60 bg-[#00F0FF]/20 text-white font-bold hover:bg-[#00F0FF]/35 hover:border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.4)] backdrop-blur-xl active:scale-95",
  ghost: "text-[#AFDDE5] hover:text-[#00F0FF] hover:bg-[#00F0FF]/15",
  outline: "border border-[#0FA4AF]/30 text-[#AFDDE5] hover:bg-[#0FA4AF]/10 active:scale-95",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        transition={{ duration: 0.15 }}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
