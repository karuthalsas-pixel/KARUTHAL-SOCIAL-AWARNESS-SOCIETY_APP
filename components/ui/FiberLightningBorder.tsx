"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface FiberLightningBorderProps {
  color1?: string;
  color2?: string;
  duration?: number;
  reverse?: boolean;
  className?: string;
  rx?: string;
}

export function FiberLightningBorder({
  color1 = "#00F0FF",
  color2 = "#10B981",
  duration = 4,
  reverse = false,
  rx = "24",
  className
}: FiberLightningBorderProps) {
  const id = useId().replace(/:/g, "");
  const gradientId = `fiber-grad-${id}`;
  const filterId = `fiber-glow-${id}`;

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]", className)}>
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} stopOpacity="1" />
            <stop offset="50%" stopColor={color2} stopOpacity="1" />
            <stop offset="100%" stopColor={color1} stopOpacity="0.2" />
          </linearGradient>

          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base fiber cable outline */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={rx}
          fill="none"
          stroke={color1}
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />

        {/* Primary glowing fiber optic lightning beam traveling around edges */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={rx}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeDasharray="180 800"
          filter={`url(#${filterId})`}
          className="animate-fiber-pulse"
          style={{
            animationDuration: `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal"
          }}
        />

        {/* High-speed intense electric white spark tip */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={rx}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeDasharray="35 945"
          filter={`url(#${filterId})`}
          className="animate-fiber-pulse"
          style={{
            animationDuration: `${duration * 0.8}s`,
            animationDirection: reverse ? "normal" : "reverse"
          }}
        />
      </svg>
    </div>
  );
}
