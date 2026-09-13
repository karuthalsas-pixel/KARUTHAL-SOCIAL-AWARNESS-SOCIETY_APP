"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
};

const line = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }
};

export function Hero() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden text-[#AFDDE5]"
    >
      {/* Full-screen background image */}
      <Image
        src="/hero-banner.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover object-center -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#001f22]/60 via-[#002b2e]/40 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#001f22]/70 via-[#001f22]/20 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/4 h-[450px] w-[450px] rounded-full bg-[#00F0FF]/30 blur-3xl -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-[#EC4899]/25 blur-3xl -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/3 bottom-1/4 h-[300px] w-[400px] rounded-full bg-[#A78BFA]/20 blur-3xl -z-10" />

      {/* Main content */}
      <div className="container-page flex-1 flex flex-col justify-center pt-36 pb-4 lg:pt-40">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mb-3 inline-flex items-center gap-2.5 rounded-full border border-[#00F0FF]/80 bg-[#00F0FF]/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.5)]"
            >
              <span className="h-2 w-2 rounded-full bg-[#00F0FF] animate-pulse" />
              Karuthal Social Awareness Society
            </motion.p>
            <motion.h1
              variants={container}
              initial="hidden"
              animate="visible"
              className="font-display text-[clamp(1.8rem,4.5vw,3.5rem)] text-balance text-white font-bold tracking-tight leading-none"
            >
              <motion.span className="block" variants={line}>Empowering Students &rarr;</motion.span>
              <motion.span className="block" variants={line}>Against Social</motion.span>
              <motion.span className="block italic text-[#00F0FF] font-semibold drop-shadow-[0_0_35px_rgba(0,240,255,0.8)]" variants={line}>Evils &amp; Hazards.</motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-2 max-w-xl text-sm leading-relaxed text-[#AFDDE5] font-sans"
            >
              Guiding the next generation against substance abuse, cyber traps, child abuse,
              road safety hazards, and unhealthy lifestyle habits through 1.5-hour interactive school mission programs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" variant="primary" onClick={scrollTo("contact")}>Invite School Mission</Button>
              <Button size="lg" variant="secondary" onClick={scrollTo("work")}>
                Explore Programs
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, y: [0, -16, 0] }}
              transition={{
                opacity: { duration: 0.8, delay: 0.4 },
                scale: { duration: 0.8, delay: 0.4 },
                y: { duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
              }}
              className="relative rounded-2xl border-2 bg-white/5 p-4 backdrop-blur-md overflow-hidden animate-border-color-cycle animate-glow-pulse"
            >
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-[#00F0FF]">School Mission Module</span>
                <span className="rounded-full bg-[#00F0FF]/25 px-3 py-1 text-xs text-[#00F0FF] font-bold border border-[#00F0FF]/60">Reg. PTM/TC/15/2023</span>
              </div>
              <div className="mt-4 space-y-3">
                <h3 className="font-display text-xl text-white font-bold">1.5-Hour Interactive Session</h3>
                <p className="text-xs leading-relaxed text-[#AFDDE5] font-normal">
                  Specially crafted for students from LKG through +2 featuring Puppet Shows, Magic, Video Presentations, Interactive Games, Music &amp; Student Counseling.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#AFDDE5] font-semibold">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#FF5533] animate-pulse" /> Thiruvalla, Kerala</span>
                  <span>&bull;</span>
                  <span className="text-[#00F0FF]">Ph: +91 9656217909</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Metric strip pinned to bottom */}
      <div className="container-page grid grid-cols-3 gap-3 pb-5">
        {[
          ["10+", "Years of Mission", "text-[#00F0FF]", "border-[#00F0FF]/50 bg-[#00F0FF]/10"],
          ["1000s", "Students Reached", "text-[#34D399]", "border-[#34D399]/50 bg-[#34D399]/10"],
          ["5", "Core Awareness Programs", "text-[#FBBF24]", "border-[#FBBF24]/50 bg-[#FBBF24]/10"]
        ].map(([n, label, color, style]) => (
          <div key={label} className={`rounded-xl border ${style} backdrop-blur-sm p-3`}>
            <p className={`font-display text-2xl font-extrabold ${color}`}>{n}</p>
            <p className="mt-0.5 text-xs font-semibold text-white/80">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
