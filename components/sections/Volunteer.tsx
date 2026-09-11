"use client";

import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Volunteer() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden bg-[#001f22] py-28 text-white">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/images/grain.svg')" }} />
      
      {/* Multi-color glowing orbs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-[#EC4899]/30 blur-[120px] mix-blend-screen" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-[#00F0FF]/30 blur-[130px] mix-blend-screen" />
      <div className="pointer-events-none absolute left-1/3 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#FBBF24]/20 blur-[100px] mix-blend-screen" />
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/25 blur-[120px] mix-blend-screen" />

      <div className="container-page relative z-10 grid items-center gap-12 lg:grid-cols-2">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-xl border border-white/20 animate-pulse"
          >
            <HeartHandshake className="h-8 w-8 text-[#00F0FF]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Join the Movement. <br />
            Make a Difference.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-[#AFDDE5]"
          >
            We are always looking for passionate volunteers, artists, and educators to join our school mission team. Together, we can guide the next generation towards a safer and healthier future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button size="lg" variant="secondary" className="bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]" onClick={scrollTo("contact")}>
              Become a Volunteer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        {/* Right side graphic/stats */}
        <div className="grid gap-6 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group transition-transform hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#00F0FF]/30 blur-2xl group-hover:bg-[#00F0FF]/50 transition-colors" />
            <h3 className="relative z-10 font-display text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F0FF]">50+</h3>
            <p className="relative z-10 mt-2 text-sm font-bold text-[#AFDDE5] uppercase tracking-wider">Active Volunteers</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] sm:translate-y-12 relative overflow-hidden group transition-transform hover:-translate-y-4 hover:border-white/30 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FBBF24]/30 blur-2xl group-hover:bg-[#FBBF24]/50 transition-colors" />
            <h3 className="relative z-10 font-display text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FBBF24]">100%</h3>
            <p className="relative z-10 mt-2 text-sm font-bold text-[#AFDDE5] uppercase tracking-wider">Non-Profit Focus</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
