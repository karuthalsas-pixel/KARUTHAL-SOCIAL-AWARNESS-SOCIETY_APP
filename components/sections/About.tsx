"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { EmployeeGrid } from "./EmployeeGrid";
import { MapPin, Phone, Mail, Globe, Award, BookOpen, Users } from "lucide-react";

const values = [
  {
    title: "Interactive Awareness",
    body: "Captivating young minds through puppet shows, magic, video presentations, interactive games, and music for lasting impact.",
    accentLine: "from-[#00F0FF] via-[#0FA4AF] to-[#10B981]",
    cardStyle: "border-[#00F0FF] bg-[#00F0FF]/25 shadow-[0_0_50px_rgba(0,240,255,0.5)] hover:border-[#00F0FF] hover:bg-[#00F0FF]/35 hover:shadow-[0_0_65px_rgba(0,240,255,0.75)]"
  },
  {
    title: "Expert Counselors",
    body: "Conducted by experienced student counselors providing compassionate, age-appropriate guidance and mental well-being support.",
    accentLine: "from-[#818CF8] via-[#6366F1] to-[#F472B6]",
    cardStyle: "border-[#818CF8] bg-[#818CF8]/25 shadow-[0_0_50px_rgba(129,140,248,0.5)] hover:border-[#818CF8] hover:bg-[#818CF8]/35 hover:shadow-[0_0_65px_rgba(129,140,248,0.75)]"
  },
  {
    title: "Holistic Protection",
    body: "Addressing child protection, anti-addiction, cyber safety, road safety, and healthy living in one unified 1.5-hour session.",
    accentLine: "from-[#FF5533] via-[#E2583E] to-[#FBBF24]",
    cardStyle: "border-[#FF5533] bg-[#FF5533]/25 shadow-[0_0_50px_rgba(255,85,51,0.5)] hover:border-[#FF5533] hover:bg-[#FF5533]/35 hover:shadow-[0_0_65px_rgba(255,85,51,0.75)]"
  }
];

const milestones = [
  { value: 10, suffix: "+", label: "Years of service", color: "text-[#00F0FF]" },
  { value: 100, suffix: "%", label: "Student engagement", color: "text-[#34D399]" },
  { value: 1.5, suffix: "h", label: "Session duration", color: "text-[#FF7755]" },
  { value: 12, suffix: "th", label: "Grade reach (LKG to +2)", color: "text-[#A5B4FC]" }
];

export function About() {
  return (
    <section id="about" className="relative overflow-x-hidden border-t border-white/10 bg-[#001f22] pt-10 pb-28 sm:pb-36 text-[#AFDDE5]">
      {/* Background glowing light flare */}
      <div className="pointer-events-none absolute right-10 top-1/3 h-[500px] w-[500px] rounded-full bg-[#00F0FF]/55 blur-[100px]" />
      <div className="pointer-events-none absolute left-10 bottom-10 h-[500px] w-[500px] rounded-full bg-[#6366F1]/55 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 rounded-full bg-[#FF5533]/30 blur-[120px]" />

      <div className="container-page relative z-10 overflow-x-hidden">
        {/* Official Organization Info Banner */}
        <Reveal>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20 rounded-3xl border border-[#0FA4AF]/30 bg-gradient-to-br from-[#002b2e]/80 to-[#001f22]/90 p-8 md:p-12 shadow-[0_0_40px_rgba(15,164,175,0.15)] backdrop-blur-xl"
          >
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Organization Identity */}
              <div className="lg:w-5/12 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#0FA4AF] mb-2">
                    KARUTHAL
                  </h1>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
                    SOCIAL AWARENESS SOCIETY
                  </h2>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 border border-white/10">
                    <Award size={16} className="text-[#FBBF24]" />
                    <span className="text-sm font-medium text-[#AFDDE5]">Reg No: PTM/TC/15/2023</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-[#AFDDE5]/80">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#00F0FF] mt-1 shrink-0" />
                    <p>PB.No.22, Kuttapuzha P.O.,<br/>Thiruvalla - 689103, Kerala, India</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#00F0FF] shrink-0" />
                    <p>+91 9656217909</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-[#00F0FF] shrink-0" />
                    <a href="mailto:karuthalsas@gmail.com" className="hover:text-white transition-colors">karuthalsas@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[#00F0FF] shrink-0" />
                    <a href="https://www.karuthalsas.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">www.karuthalsas.org</a>
                  </div>
                </div>
              </div>

              {/* Programme Description */}
              <div className="lg:w-7/12 space-y-6 border-t lg:border-t-0 lg:border-l border-[#0FA4AF]/20 pt-8 lg:pt-0 lg:pl-10">
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                    <BookOpen className="text-[#FF5533]" /> 
                    The "Karuthal" Programme
                  </h3>
                  <p className="text-[#AFDDE5] leading-relaxed mb-4 text-base md:text-lg">
                    Karuthal is a <strong className="text-white">1.5-hour child-friendly awareness programme</strong> designed for students from KG to Plus Two. 
                    We focus on critical issues including child abuse and safety, drug and substance abuse, excessive consumption of junk food, and the impact of excessive screen time.
                  </p>
                  <p className="text-[#AFDDE5]/80 leading-relaxed">
                    Presented in an age-appropriate manner using audio-visual presentations, songs, magic, puppetry, and interactive activities to help children understand serious issues in an enjoyable and meaningful way.
                  </p>
                </div>

                <div className="flex flex-wrap gap-8 pt-6 border-t border-[#0FA4AF]/10">
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-[#818CF8]" />
                    <div>
                      <p className="text-xs text-[#AFDDE5]/60 uppercase tracking-wider">Secretary</p>
                      <p className="font-semibold text-white">Kurian Mathew</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-[#818CF8]" />
                    <div>
                      <p className="text-xs text-[#AFDDE5]/60 uppercase tracking-wider">Secretary</p>
                      <p className="font-semibold text-white">Blessen David</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5533]/60 bg-[#FF5533]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF7755] shadow-[0_0_15px_rgba(255,85,51,0.3)]">
                <span className="h-2 w-2 rounded-full bg-[#FF5533] animate-ping" />
                About Karuthal Society
              </p>
              <h2 className="mt-4 font-display text-display-md text-balance text-white font-bold tracking-tight">
                Guiding the next generation towards light and safety.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-prose text-[#AFDDE5] leading-relaxed text-base">
                For over a decade, <strong className="text-white">Karuthal Social Awareness Society</strong> (Reg No: PTM/TC/15/2023, Thiruvalla) has been at the forefront of safeguarding children and youth across India.
              </p>
              <p className="mt-4 max-w-prose text-[#AFDDE5] leading-relaxed text-base">
                Through our immersive visual and audio School Mission programs, we equip students from LKG to +2 with moral clarity, digital prudence, and critical life skills to overcome modern social hazards.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={0.1 + i * 0.08}>
                  <motion.div
                    animate={{ y: [0, -14, 0] }}
                    transition={{
                      duration: 4.5 + i * 0.6,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: i * 0.4
                    }}
                    whileHover={{ scale: 1.04, y: -18 }}
                    className={`relative overflow-hidden h-full rounded-3xl border-2 p-6 backdrop-blur-2xl transition-all duration-500 ${v.cardStyle}`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${v.accentLine}`} />
                    <h3 className="mt-2 font-display text-xl text-white font-bold">{v.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#AFDDE5] font-normal">
                      {v.body}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.35}>
              <dl className="relative overflow-hidden mt-10 grid grid-cols-2 gap-4 rounded-3xl border-2 border-[#00F0FF]/80 bg-gradient-to-r from-[#024950]/90 via-[#002b2e]/95 to-[#024950]/90 p-8 shadow-[0_0_60px_rgba(0,240,255,0.5)] backdrop-blur-2xl sm:grid-cols-4 text-white">
                {milestones.map((m) => (
                  <div key={m.label} className="text-center sm:text-left">
                    <dt className="sr-only">{m.label}</dt>
                    <dd className={`font-display text-3xl sm:text-4xl font-extrabold ${m.color} drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]`}>
                      <Counter to={m.value} suffix={m.suffix} />
                    </dd>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-[#AFDDE5]">{m.label}</p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
        
        {/* Employee Directory Section */}
        <EmployeeGrid />
        
      </div>
    </section>
  );
}
