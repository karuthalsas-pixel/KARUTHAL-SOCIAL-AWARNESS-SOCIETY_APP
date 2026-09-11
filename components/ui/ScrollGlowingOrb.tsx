"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollGlowingOrb() {
  const { scrollYProgress } = useScroll();

  // Smooth liquid spring physics for scroll movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Map scroll 0 -> 1 to top 5% -> 95% of the page
  const yPos = useTransform(smoothProgress, [0, 1], ["6%", "94%"]);
  // Rotate the orb continuously as it scrolls down
  const rotateDeg = useTransform(smoothProgress, [0, 1], [0, 1080]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex justify-center overflow-hidden">
      {/* Central subtle glowing laser track line */}
      <div className="h-full w-[1.5px] bg-gradient-to-b from-transparent via-[#00F0FF]/25 via-[#EC4899]/25 to-transparent" />

      {/* Scroll-Driven Multi-Color Glowing Orb */}
      <motion.div
        style={{
          top: yPos,
          rotate: rotateDeg
        }}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Outer ambient multi-color halo blur */}
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#EC4899] via-[#FBBF24] to-[#818CF8] blur-md opacity-80 animate-pulse" />

        {/* Small Multi-Colored Glowing Orb */}
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#FBBF24] p-[2px] shadow-[0_0_25px_rgba(0,240,255,0.9),0_0_40px_rgba(236,72,153,0.7)] sm:h-10 sm:w-10">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#001f22]/80 backdrop-blur-md">
            {/* Luminous Inner Core */}
            <div className="h-3 w-3 rounded-full bg-gradient-to-tr from-[#00F0FF] via-[#34D399] to-[#FBBF24] shadow-[0_0_12px_#00F0FF]">
              <span className="block h-full w-full rounded-full bg-white animate-ping opacity-90" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
