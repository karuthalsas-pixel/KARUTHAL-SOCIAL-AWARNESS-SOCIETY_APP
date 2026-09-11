"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { User, MapPin, Phone } from "lucide-react";

type Employee = {
  id: number;
  name: string;
  role: string;
  address: string | null;
  phone: string | null;
  imageUrl: string | null;
  order: number;
};

const cardThemes = [
  { // Cyan
    border: "border-cyan-500/30",
    hoverBorder: "group-hover:border-cyan-400/70",
    shadow: "shadow-[0_0_20px_rgba(6,182,212,0.05)]",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]",
    gradient: "from-cyan-400 to-blue-500",
    badgeBg: "bg-cyan-950/40",
    badgeText: "text-cyan-300",
    badgeBorder: "border-cyan-500/50",
    badgeShadow: "shadow-[0_0_10px_rgba(6,182,212,0.3)]",
    icon: "text-cyan-400"
  },
  { // Purple
    border: "border-purple-500/30",
    hoverBorder: "group-hover:border-purple-400/70",
    shadow: "shadow-[0_0_20px_rgba(168,85,247,0.05)]",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]",
    gradient: "from-purple-400 to-pink-500",
    badgeBg: "bg-purple-950/40",
    badgeText: "text-purple-300",
    badgeBorder: "border-purple-500/50",
    badgeShadow: "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    icon: "text-purple-400"
  },
  { // Gold/Amber
    border: "border-amber-500/30",
    hoverBorder: "group-hover:border-amber-400/70",
    shadow: "shadow-[0_0_20px_rgba(245,158,11,0.05)]",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]",
    gradient: "from-amber-400 to-orange-500",
    badgeBg: "bg-amber-950/40",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-500/50",
    badgeShadow: "shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    icon: "text-amber-400"
  },
  { // Emerald
    border: "border-emerald-500/30",
    hoverBorder: "group-hover:border-emerald-400/70",
    shadow: "shadow-[0_0_20px_rgba(16,185,129,0.05)]",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]",
    gradient: "from-emerald-400 to-teal-500",
    badgeBg: "bg-emerald-950/40",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-500/50",
    badgeShadow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    icon: "text-emerald-400"
  },
  { // Ruby Red
    border: "border-rose-500/30",
    hoverBorder: "group-hover:border-rose-400/70",
    shadow: "shadow-[0_0_20px_rgba(244,63,94,0.05)]",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]",
    gradient: "from-rose-400 to-red-500",
    badgeBg: "bg-rose-950/40",
    badgeText: "text-rose-300",
    badgeBorder: "border-rose-500/50",
    badgeShadow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]",
    icon: "text-rose-400"
  },
  { // Sapphire Blue
    border: "border-blue-500/30",
    hoverBorder: "group-hover:border-blue-400/70",
    shadow: "shadow-[0_0_20px_rgba(59,130,246,0.05)]",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
    gradient: "from-blue-400 to-indigo-500",
    badgeBg: "bg-blue-950/40",
    badgeText: "text-blue-300",
    badgeBorder: "border-blue-500/50",
    badgeShadow: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    icon: "text-blue-400"
  },
  { // Lime/Neon
    border: "border-lime-500/30",
    hoverBorder: "group-hover:border-lime-400/70",
    shadow: "shadow-[0_0_20px_rgba(132,204,22,0.05)]",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(132,204,22,0.3)]",
    gradient: "from-lime-400 to-green-500",
    badgeBg: "bg-lime-950/40",
    badgeText: "text-lime-300",
    badgeBorder: "border-lime-500/50",
    badgeShadow: "shadow-[0_0_10px_rgba(132,204,22,0.3)]",
    icon: "text-lime-400"
  },
  { // Fuschia
    border: "border-fuchsia-500/30",
    hoverBorder: "group-hover:border-fuchsia-400/70",
    shadow: "shadow-[0_0_20px_rgba(217,70,239,0.05)]",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(217,70,239,0.3)]",
    gradient: "from-fuchsia-400 to-purple-500",
    badgeBg: "bg-fuchsia-950/40",
    badgeText: "text-fuchsia-300",
    badgeBorder: "border-fuchsia-500/50",
    badgeShadow: "shadow-[0_0_10px_rgba(217,70,239,0.3)]",
    icon: "text-fuchsia-400"
  }
];

export function EmployeeGrid() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/employees");
        const data = await res.json();
        if (data.ok) {
          setEmployees(data.items);
        }
      } catch (error) {
        console.error("Failed to fetch employees", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  if (loading || employees.length === 0) {
    return null;
  }

  return (
    <div className="mt-32 relative z-10">
      <Reveal>
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/60 bg-[#00F0FF]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <span className="h-2 w-2 rounded-full bg-[#00F0FF] animate-ping" />
            Our Team
          </p>
          <h3 className="mt-4 font-display text-4xl text-white font-bold tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            The Executive Members
          </h3>
          <p className="mt-4 text-[#AFDDE5] max-w-2xl mx-auto">
            Dedicated individuals working tirelessly to guide the next generation towards light and safety.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {employees.map((emp, i) => {
          const theme = cardThemes[i % cardThemes.length];
          return (
            <Reveal key={emp.id} delay={0.1 + (i % 4) * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
                className={`group relative bg-[#024950]/40 backdrop-blur-md rounded-2xl border ${theme.border} ${theme.hoverBorder} overflow-hidden ${theme.shadow} ${theme.hoverShadow} transition-all duration-500 h-full flex flex-col`}
              >
                {/* Image Section - REMOVED OPACITY OVERLAYS FOR MAXIMUM CLARITY */}
                <div className="relative h-72 overflow-hidden bg-[#001f22]">
                  {emp.imageUrl ? (
                    <Image
                      src={emp.imageUrl}
                      alt={emp.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#024950] to-[#002b2e]">
                      <User size={64} className="text-[#0FA4AF]/50" />
                    </div>
                  )}
                  
                  {/* Subtle bottom gradient just for text legibility, doesn't affect face */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#024950] to-transparent opacity-90 z-20" />
                </div>
  
                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow relative z-30 -mt-8">
                  <div className={`${theme.badgeBg} border ${theme.badgeBorder} px-3 py-1 text-[10px] uppercase tracking-wider font-bold ${theme.badgeText} rounded-full inline-flex w-max mb-3 ${theme.badgeShadow} transition-all duration-300`}>
                    {emp.role}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 font-display group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">{emp.name}</h4>
                  
                  <div className="mt-auto pt-4 space-y-2.5">
                    {emp.phone && (
                      <div className="flex items-start gap-3 text-sm text-[#AFDDE5] group/item">
                        <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 ${theme.icon} group-hover/item:scale-110 transition-transform`}>
                          <Phone size={14} />
                        </div>
                        <span className="mt-1 group-hover/item:text-white transition-colors">{emp.phone}</span>
                      </div>
                    )}
                    {emp.address && (
                      <div className="flex items-start gap-3 text-sm text-[#AFDDE5] group/item">
                        <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 ${theme.icon} group-hover/item:scale-110 transition-transform`}>
                          <MapPin size={14} />
                        </div>
                        <span className="line-clamp-3 mt-1 group-hover/item:text-white transition-colors">{emp.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Decorative animated border line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r ${theme.gradient} group-hover:w-full transition-all duration-500 ease-out z-40`} />
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
