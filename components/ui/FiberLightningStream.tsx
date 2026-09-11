"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface FiberLightningStreamProps {
  className?: string;
  rx?: string;
  duration?: number;
}

export function FiberLightningStream({
  rx = "36",
  duration = 6,
  className
}: FiberLightningStreamProps) {
  const id = useId().replace(/:/g, "");

  return (
    <div className={cn("pointer-events-none absolute -inset-6 z-0 overflow-visible", className)}>
      <svg
        className="h-full w-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Multi-colored glowing Fiber 1 (Cyan -> Pink -> Gold) */}
          <linearGradient id={`fiber-grad1-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="33%" stopColor="#EC4899" stopOpacity="1" />
            <stop offset="66%" stopColor="#FBBF24" stopOpacity="1" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.4" />
          </linearGradient>

          {/* Multi-colored glowing Fiber 2 (Violet -> Mint -> Orange) */}
          <linearGradient id={`fiber-grad2-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="1" />
            <stop offset="40%" stopColor="#34D399" stopOpacity="1" />
            <stop offset="80%" stopColor="#FF5533" stopOpacity="1" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
          </linearGradient>

          {/* Intense Multi-Color Outer Glow Filter */}
          <filter id={`fiber-glow-filter-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient fiber wire track line running outside grid */}
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx={rx}
          fill="none"
          stroke="#00F0FF"
          strokeOpacity="0.15"
          strokeWidth="2"
        />

        {/* Strand 1: Cyan-Pink-Gold fiber beam moving clockwise */}
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx={rx}
          fill="none"
          stroke={`url(#fiber-grad1-${id})`}
          strokeWidth="4"
          strokeDasharray="240 900"
          filter={`url(#fiber-glow-filter-${id})`}
          className="animate-fiber-pulse"
          style={{ animationDuration: `${duration}s` }}
        />

        {/* Strand 2: Violet-Mint-Orange fiber beam moving counter-clockwise */}
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx={rx}
          fill="none"
          stroke={`url(#fiber-grad2-${id})`}
          strokeWidth="4"
          strokeDasharray="200 950"
          filter={`url(#fiber-glow-filter-${id})`}
          className="animate-fiber-pulse"
          style={{
            animationDuration: `${duration * 1.3}s`,
            animationDirection: "reverse"
          }}
        />

        {/* Strand 3: Bright Neon Magenta-Gold glowing pulse */}
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx={rx}
          fill="none"
          stroke="#EC4899"
          strokeWidth="3.5"
          strokeDasharray="100 1100"
          filter={`url(#fiber-glow-filter-${id})`}
          className="animate-fiber-pulse"
          style={{
            animationDuration: `${duration * 0.85}s`
          }}
        />
      </svg>
    </div>
  );
}
