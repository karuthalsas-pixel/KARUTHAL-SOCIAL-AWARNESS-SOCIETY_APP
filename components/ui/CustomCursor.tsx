"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  // Avoid rendering anything server-side to prevent hydration mismatch on positioning
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      animate={{
        x: mousePosition.x - 24,
        y: mousePosition.y - 24,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        x: { type: "spring", stiffness: 1000, damping: 40, mass: 0.1 },
        y: { type: "spring", stiffness: 1000, damping: 40, mass: 0.1 },
        opacity: { duration: 0.2 },
      }}
    >
      <motion.div
        animate={{ filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="relative h-12 w-12"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00F0FF] via-[#FF5533] to-[#FBBF24] blur-[10px] opacity-90 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-3.5 rounded-full bg-white opacity-100 blur-[2px] shadow-[0_0_15px_rgba(255,255,255,1)]" />
      </motion.div>
    </motion.div>
  );
}
