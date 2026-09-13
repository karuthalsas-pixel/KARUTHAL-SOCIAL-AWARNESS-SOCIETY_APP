"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Ban, Smartphone, AlertTriangle, Apple, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

type ProgramItem = {
  id: number;
  imageUrl: string;
  title: string | null;
  description: string | null;
  order: number;
};

const programs = [
  {
    icon: ShieldCheck,
    tag: "Child Protection",
    title: "Child Protection & Safety",
    body: "Sensitizing students on child abuse awareness, personal boundaries, and ensuring their safety in vulnerable environments.",
    gradientLine: "from-[#00F0FF] via-[#0FA4AF] to-[#10B981]",
    cardStyle: "bg-gradient-to-b from-[#0FA4AF]/45 via-[#024950]/85 to-[#001f22]/95 border-[#00F0FF]/90 shadow-[0_0_45px_rgba(0,240,255,0.45)] hover:border-[#00F0FF] hover:shadow-[0_0_65px_rgba(0,240,255,0.7)]",
    iconColor: "text-[#00F0FF]",
    iconBg: "bg-[#00F0FF]/25 border-[#00F0FF]/70 shadow-[0_0_20px_rgba(0,240,255,0.5)]",
    glowBg: "bg-[#00F0FF]/30",
    tagStyle: "border-[#00F0FF]/70 bg-[#00F0FF]/20 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]"
  },
  {
    icon: Ban,
    tag: "De-Addiction",
    title: "Anti-Addiction Guidance",
    body: "Focusing on drug and substance abuse to educate youth on destructive physical and mental consequences, helping them build substance-free futures.",
    gradientLine: "from-[#FF5533] via-[#E2583E] to-[#FF9E0B]",
    cardStyle: "bg-gradient-to-b from-[#964734]/50 via-[#024950]/85 to-[#001f22]/95 border-[#FF5533]/90 shadow-[0_0_45px_rgba(255,85,51,0.45)] hover:border-[#FF5533] hover:shadow-[0_0_65px_rgba(255,85,51,0.7)]",
    iconColor: "text-[#FF7755]",
    iconBg: "bg-[#FF5533]/25 border-[#FF5533]/70 shadow-[0_0_20px_rgba(255,85,51,0.5)]",
    glowBg: "bg-[#FF5533]/30",
    tagStyle: "border-[#FF5533]/70 bg-[#FF5533]/20 text-[#FF9E85] shadow-[0_0_15px_rgba(255,85,51,0.3)]"
  },
  {
    icon: Smartphone,
    tag: "Cyber Prudence",
    title: "Cyber & Mobile Trap Safety",
    body: "Addressing the impact of excessive screen time and teaching prudent digital habits to protect children from online traps.",
    gradientLine: "from-[#818CF8] via-[#6366F1] to-[#00D2FE]",
    cardStyle: "bg-gradient-to-b from-[#6366F1]/45 via-[#024950]/85 to-[#001f22]/95 border-[#818CF8]/90 shadow-[0_0_45px_rgba(129,140,248,0.45)] hover:border-[#818CF8] hover:shadow-[0_0_65px_rgba(129,140,248,0.7)]",
    iconColor: "text-[#A5B4FC]",
    iconBg: "bg-[#818CF8]/25 border-[#818CF8]/70 shadow-[0_0_20px_rgba(129,140,248,0.5)]",
    glowBg: "bg-[#818CF8]/30",
    tagStyle: "border-[#818CF8]/70 bg-[#818CF8]/20 text-[#C7D2FE] shadow-[0_0_15px_rgba(129,140,248,0.3)]"
  },
  {
    icon: AlertTriangle,
    tag: "Road Safety",
    title: "Road Safety & Speed Caution",
    body: "Instilling strict traffic awareness and reminding adolescent youth that high-speed thrills on roads lead to tragic fatalities.",
    gradientLine: "from-[#FBBF24] via-[#F59E0B] to-[#FF4500]",
    cardStyle: "bg-gradient-to-b from-[#F59E0B]/45 via-[#024950]/85 to-[#001f22]/95 border-[#FBBF24]/90 shadow-[0_0_45px_rgba(251,191,36,0.45)] hover:border-[#FBBF24] hover:shadow-[0_0_65px_rgba(251,191,36,0.7)]",
    iconColor: "text-[#FDE047]",
    iconBg: "bg-[#FBBF24]/25 border-[#FBBF24]/70 shadow-[0_0_20px_rgba(251,191,36,0.5)]",
    glowBg: "bg-[#FBBF24]/30",
    tagStyle: "border-[#FBBF24]/70 bg-[#FBBF24]/20 text-[#FDE68A] shadow-[0_0_15px_rgba(251,191,36,0.3)]"
  },
  {
    icon: Apple,
    tag: "Wellness",
    title: "Healthy Lifestyle & Nutrition",
    body: "Highlighting the excessive consumption of junk food and its harmful effects, guiding children towards balanced nutrition and wellness.",
    gradientLine: "from-[#34D399] via-[#10B981] to-[#00F0FF]",
    cardStyle: "bg-gradient-to-b from-[#10B981]/45 via-[#024950]/85 to-[#001f22]/95 border-[#34D399]/90 shadow-[0_0_45px_rgba(52,211,153,0.45)] hover:border-[#34D399] hover:shadow-[0_0_65px_rgba(52,211,153,0.7)]",
    iconColor: "text-[#6EE7B7]",
    iconBg: "bg-[#34D399]/25 border-[#34D399]/70 shadow-[0_0_20px_rgba(52,211,153,0.5)]",
    glowBg: "bg-[#34D399]/30",
    tagStyle: "border-[#34D399]/70 bg-[#34D399]/20 text-[#A7F3D0] shadow-[0_0_15px_rgba(52,211,153,0.3)]"
  },
  {
    icon: Sparkles,
    tag: "Interactive Event",
    title: "Interactive School Mission",
    body: "A 1.5-hour child-friendly event featuring audio-visual presentations, songs, magic, puppetry, and engaging interactive activities.",
    gradientLine: "from-[#F472B6] via-[#EC4899] to-[#FBBF24]",
    cardStyle: "bg-gradient-to-b from-[#EC4899]/45 via-[#024950]/85 to-[#001f22]/95 border-[#F472B6]/90 shadow-[0_0_45px_rgba(244,114,182,0.45)] hover:border-[#F472B6] hover:shadow-[0_0_65px_rgba(244,114,182,0.7)]",
    iconColor: "text-[#F472B6]",
    iconBg: "bg-[#F472B6]/25 border-[#F472B6]/70 shadow-[0_0_20px_rgba(244,114,182,0.5)]",
    glowBg: "bg-[#F472B6]/30",
    tagStyle: "border-[#F472B6]/70 bg-[#F472B6]/20 text-[#FBCFE8] shadow-[0_0_15px_rgba(244,114,182,0.3)]"
  }
];

export function Services() {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/programs");
        const data = await res.json();
        if (data.ok) {
          setItems(data.data);
        }
      } catch (err) {
        console.error("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <section id="work" className="relative overflow-hidden border-t border-white/10 bg-[#001f22] py-28 sm:py-36 text-[#AFDDE5]">
      {/* Background ambient glowing light orbs */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-[#00F0FF]/55 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#EC4899]/55 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 top-2/3 h-[450px] w-[450px] rounded-full bg-[#FBBF24]/50 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/3 top-1/4 h-96 w-96 rounded-full bg-[#34D399]/30 blur-[120px]" />

      <div className="container-page relative z-10">
        <div className="max-w-2xl mb-14">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/50 bg-[#00F0FF]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <span className="h-2 w-2 rounded-full bg-[#00F0FF] animate-ping" />
              Our Awareness Programs
            </p>
            <h2 className="mt-4 font-display text-display-md text-balance text-white font-semibold tracking-tight">
              Empowering students, <span className="bg-gradient-to-r from-[#00F0FF] via-[#34D399] to-[#FBBF24] bg-clip-text text-transparent">shielding their future.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[#AFDDE5] leading-relaxed text-base">
              We deliver comprehensive social awareness programs tailored for students from LKG to +2, blending creative visual arts with direct counselor guidance.
            </p>
          </Reveal>
        </div>

        {/* RESTORED: Text Cards Section */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20">
          {programs.map((program, i) => {
            const Icon = program.icon;
            const floatDuration = 4.2 + (i % 3) * 0.7;
            const floatDelay = (i % 4) * 0.5;

            return (
              <Reveal key={program.title} delay={0.05 * i}>
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: floatDuration,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: floatDelay
                  }}
                  whileHover={{ scale: 1.03, y: -20 }}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-8 backdrop-blur-2xl transition-all duration-500 ${program.cardStyle}`}
                >
                  <div className={`absolute left-0 top-0 h-2 w-full bg-gradient-to-r ${program.gradientLine}`} />
                  <div className={`pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full blur-2xl transition-opacity duration-500 opacity-60 group-hover:opacity-100 ${program.glowBg}`} />

                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className={`flex h-13 w-13 items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-300 group-hover:scale-110 ${program.iconBg}`}>
                        <Icon className={`h-6 w-6 ${program.iconColor}`} aria-hidden="true" />
                      </div>
                      <span className={`inline-block rounded-full border px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${program.tagStyle}`}>
                        {program.tag}
                      </span>
                    </div>
                    <h3 className="mt-7 font-display text-xl text-white font-bold group-hover:text-white transition-colors">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#AFDDE5] font-normal">
                      {program.body}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        </div>

        {/* NEW CONTENT: Why Lecture When You Can Captivate? */}
        <div className="relative mt-28 pt-24 pb-12">
          {/* Section Background Effects */}
          <div className="absolute inset-0 z-0 bg-[#001f22]/50 backdrop-blur-3xl border-t border-b border-[#0FA4AF]/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-50" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#F472B6] to-transparent opacity-30" />
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[100px] pointer-events-none" 
          />
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1.1, 0.9, 1.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#F472B6]/10 rounded-full blur-[100px] pointer-events-none" 
          />

          <div className="relative z-10">
            <Reveal>
              <div className="max-w-4xl mx-auto text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex mb-6 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md"
                >
                  <span className="h-2 w-2 rounded-full bg-[#0FA4AF] animate-pulse" />
                  Our Philosophy
                </motion.div>
                
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
                  <span className="text-white">Why Lecture When You Can </span>
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#34D399] to-[#FBBF24] drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                      Captivate?
                    </span>
                    <motion.span 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 z-0 text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#34D399] to-[#FBBF24] blur-[12px] opacity-70"
                    >
                      Captivate?
                    </motion.span>
                  </span>
                </h2>
                
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light max-w-3xl mx-auto">
                  Serious conversations with children usually fail for one reason: <span className="font-semibold text-white">fear</span>. When adults use rigid warnings, young minds either tune out or feel overwhelmed.
                </p>
                <div className="mt-8 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#00F0FF] to-transparent" />
                <p className="mt-8 text-[#AFDDE5] leading-relaxed text-lg max-w-3xl mx-auto font-medium">
                  The Karuthal philosophy flips traditional awareness on its head. In Malayalam, <span className="text-[#00F0FF] font-bold tracking-wide drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">Karuthal means care and vigilance</span>. We believe that true protection doesn't come from scare tactics—it comes from confidence, clarity, and joy.
                </p>
              </div>
            </Reveal>

            <div className="grid lg:grid-cols-3 gap-8 px-4 sm:px-6">
              {/* Column 1 */}
              <Reveal delay={0.1}>
                <motion.div 
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group relative bg-gradient-to-b from-[#024950]/60 to-[#001f22]/80 border border-[#0FA4AF]/40 p-8 md:p-10 rounded-[2rem] backdrop-blur-xl h-full flex flex-col hover:border-[#00F0FF] shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(0,240,255,0.25)] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/0 to-[#00F0FF]/0 group-hover:from-[#00F0FF]/5 transition-colors duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white tracking-wide">Serious Truths</h3>
                    </div>
                    
                    <p className="text-[#AFDDE5] mb-8 font-medium leading-relaxed">
                      We transform complex, uncomfortable societal issues into accessible life lessons tailored from KG through Plus Two.
                    </p>
                    
                    <ul className="space-y-5 flex-grow">
                      {[
                        { title: "The Invisible Shield", desc: "Dismantling fear with intuition. Children learn bodily autonomy and boundary recognition.", color: "text-[#00F0FF]" },
                        { title: "The Clarity Code", desc: "Decoding peer pressure and empowering adolescents to take pride in saying no.", color: "text-[#34D399]" },
                        { title: "Fuel vs. Filler", desc: "Moving past \"eat your greens\" to teach how ultra-processed foods dull energy.", color: "text-[#FBBF24]" },
                        { title: "Reclaiming Reality", desc: "We don't demand they drop technology; we teach them how not to let it own them.", color: "text-[#F472B6]" }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-white/5 transition-colors duration-300 cursor-default">
                          <span className={`${item.color} mt-1 text-lg`}>✦</span>
                          <div>
                            <span className="font-bold text-white block mb-1 text-[15px]">{item.title}</span>
                            <span className="text-sm text-[#AFDDE5]/80 leading-snug block">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Reveal>

              {/* Column 2 */}
              <Reveal delay={0.2}>
                <motion.div 
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group relative bg-gradient-to-b from-[#4C1D95]/40 to-[#001f22]/80 border border-[#8B5CF6]/40 p-8 md:p-10 rounded-[2rem] backdrop-blur-xl h-full flex flex-col hover:border-[#A78BFA] shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(167,139,250,0.25)] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA]/0 to-[#A78BFA]/0 group-hover:from-[#A78BFA]/5 transition-colors duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-[#A78BFA] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white tracking-wide">Magic Over Monologues</h3>
                    </div>
                    
                    <p className="text-[#AFDDE5] mb-8 font-medium leading-relaxed">
                      Lectures fade by the next morning; emotions stick for years. Karuthal replaces slides with theatrical engagement.
                    </p>
                    
                    <ul className="space-y-5 flex-grow">
                      {[
                        { title: "Magic as Metaphor", desc: "Sleight-of-hand routines that visually demonstrate peer influence and boundaries.", icon: "🎩" },
                        { title: "The Voice of Puppetry", desc: "Relatable characters that tackle sensitive fears so young children feel safe.", icon: "🎭" },
                        { title: "Visual Rhythms", desc: "Catchy musical hooks that turn critical safety rules into natural instincts.", icon: "🎵" },
                        { title: "Interactive Arcs", desc: "Guided scenarios where students make choices and watch outcomes unfold live.", icon: "✨" }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-white/5 transition-colors duration-300 cursor-default">
                          <span className="text-xl mt-0.5">{item.icon}</span>
                          <div>
                            <span className="font-bold text-[#E9D5FF] block mb-1 text-[15px]">{item.title}</span>
                            <span className="text-sm text-[#AFDDE5]/80 leading-snug block">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Reveal>

              {/* Column 3 */}
              <Reveal delay={0.3}>
                <motion.div 
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group relative bg-gradient-to-b from-[#831843]/40 to-[#001f22]/80 border border-[#F472B6]/40 p-8 md:p-10 rounded-[2rem] backdrop-blur-xl h-full flex flex-col hover:border-[#F472B6] shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(244,114,182,0.25)] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F472B6]/0 to-[#F472B6]/0 group-hover:from-[#F472B6]/5 transition-colors duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#F472B6]/20 border border-[#F472B6]/50 text-[#F472B6] shadow-[0_0_15px_rgba(244,114,182,0.3)]">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white tracking-wide">Three Distinct Worlds</h3>
                    </div>
                    
                    <p className="text-[#AFDDE5] mb-8 font-medium leading-relaxed">
                      Rather than a one-size-fits-all approach, each session adapts dynamically to the developmental stage in the room.
                    </p>
                    
                    <div className="space-y-6 flex-grow">
                      <motion.div whileHover={{ x: 5 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group/card">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#818CF8] group-hover/card:w-2 transition-all duration-300" />
                        <div className="ml-2">
                          <span className="font-black text-[#818CF8] text-[11px] tracking-[0.2em] uppercase block mb-1">Foundations</span>
                          <span className="text-sm font-bold text-white block mb-2 opacity-90">(KG to Primary)</span>
                          <p className="text-sm text-[#AFDDE5]/80 leading-relaxed">Warm, colorful, and focused on safe circles, trusting gut instincts, and active play.</p>
                        </div>
                      </motion.div>
                      
                      <motion.div whileHover={{ x: 5 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group/card">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FBBF24] group-hover/card:w-2 transition-all duration-300" />
                        <div className="ml-2">
                          <span className="font-black text-[#FBBF24] text-[11px] tracking-[0.2em] uppercase block mb-1">Transitions</span>
                          <span className="text-sm font-bold text-white block mb-2 opacity-90">(Upper Primary & Middle)</span>
                          <p className="text-sm text-[#AFDDE5]/80 leading-relaxed">Interactive dilemmas, critical thinking, cyber traps, and resisting group pressure.</p>
                        </div>
                      </motion.div>
                      
                      <motion.div whileHover={{ x: 5 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group/card">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF5533] group-hover/card:w-2 transition-all duration-300" />
                        <div className="ml-2">
                          <span className="font-black text-[#FF5533] text-[11px] tracking-[0.2em] uppercase block mb-1">Realities</span>
                          <span className="text-sm font-bold text-white block mb-2 opacity-90">(High School & Plus Two)</span>
                          <p className="text-sm text-[#AFDDE5]/80 leading-relaxed">Direct discourse on chemical dependency, digital dopamine loops, and emotional resilience.</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* RESTORED: Masonry Grid Section */}
        {!loading && (
          <div className="mt-16 pt-16 border-t border-white/10">
            <Reveal>
              <h3 className="font-display text-3xl font-bold text-white mb-10 text-center">Program Highlights in Action</h3>
            </Reveal>
            
            {items.length === 0 ? (
              // Display Placeholder Masonry Grid so user can see the design before uploading
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 opacity-60">
                {[
                  { h: "h-96", label: "Portrait Layout" },
                  { h: "h-64", label: "Landscape Layout" },
                  { h: "h-80", label: "Medium Layout" },
                  { h: "h-48", label: "Short Layout" },
                  { h: "h-[28rem]", label: "Tall Layout" },
                ].map((ph, i) => (
                  <div key={i} className={`relative overflow-hidden rounded-2xl border border-[#00F0FF]/30 bg-[#002b2e]/60 break-inside-avoid shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center justify-center w-full ${ph.h}`}>
                    <div className="text-center p-6">
                      <p className="text-[#00F0FF] font-bold mb-2">{ph.label}</p>
                      <p className="text-xs text-[#AFDDE5]/70">Admin: Upload images to replace this placeholder</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Display actual uploaded images
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {items.map((item, i) => {
                  const colors = [
                    "from-[#FF007F] via-[#7000FF] to-[#00F0FF]",
                    "from-[#00F0FF] via-[#00FF88] to-[#7000FF]",
                    "from-[#FFD700] via-[#FF007F] to-[#7000FF]",
                    "from-[#00F0FF] via-[#FF007F] to-[#FFD700]",
                  ];
                  const bgGradient = colors[i % colors.length];

                  return (
                    <Reveal key={item.id} delay={0.05 * (i % 8)}>
                      <div className="relative break-inside-avoid group/wrapper">
                        {/* Continuous Multi-Color Glowing Backdrop */}
                        <motion.div
                          animate={{ 
                            opacity: [0.5, 1, 0.5], 
                            scale: [0.95, 1.05, 0.95],
                            rotate: [0, 3, -3, 0]
                          }}
                          transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                          className={`absolute -inset-1.5 bg-gradient-to-br ${bgGradient} rounded-2xl blur-xl opacity-70 z-0 pointer-events-none group-hover/wrapper:opacity-100 group-hover/wrapper:blur-2xl transition-all duration-700`}
                        />

                        {/* Main Card */}
                        <motion.div
                          whileHover={{ scale: 1.03, y: -8 }}
                          animate={{ 
                            borderColor: [
                              "rgba(15, 164, 175, 0.2)",
                              "rgba(255, 255, 255, 0.9)",
                              "rgba(15, 164, 175, 0.2)"
                            ]
                          }}
                          transition={{ 
                            type: "spring", stiffness: 300, damping: 20,
                            borderColor: { duration: 2 + (i % 2), repeat: Infinity, ease: "easeInOut" }
                          }}
                          className="relative z-10 overflow-hidden rounded-2xl border bg-[#001f22]/90 shadow-2xl cursor-pointer"
                        >
                          {/* Shimmer/Glow overlay on hover */}
                          <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#00F0FF]/0 via-white/10 to-transparent opacity-0 group-hover/wrapper:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />
                          
                          <Image
                            src={item.imageUrl}
                            alt={item.title || "Awareness Program"}
                            width={800}
                            height={600}
                            style={{ width: "100%", height: "auto" }}
                            className="object-cover transition-transform duration-700 group-hover/wrapper:scale-110"
                            loading="lazy"
                          />
                          
                          {(item.title || item.description) && (
                            <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#000000]/95 via-[#001f22]/60 to-transparent opacity-0 transition-opacity duration-500 group-hover/wrapper:opacity-100 flex flex-col justify-end p-6">
                              <div className="translate-y-6 transition-transform duration-500 group-hover/wrapper:translate-y-0">
                                {item.title && (
                                  <h3 className="font-display text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                                    {item.title}
                                  </h3>
                                )}
                                {item.description && (
                                  <p className="mt-2 text-sm text-white/90 line-clamp-3 leading-relaxed drop-shadow-md">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Continuous Inner Blinking Light */}
                          <motion.div 
                            animate={{ 
                              opacity: [0.1, 0.9, 0.1],
                              boxShadow: [
                                "inset 0 0 0px rgba(0,240,255,0)",
                                "inset 0 0 30px rgba(0,240,255,0.8)",
                                "inset 0 0 0px rgba(0,240,255,0)"
                              ]
                            }}
                            transition={{ duration: 1.5 + (i % 2), repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 z-30 border-[3px] border-[#00F0FF] rounded-2xl pointer-events-none mix-blend-screen" 
                          />
                        </motion.div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
