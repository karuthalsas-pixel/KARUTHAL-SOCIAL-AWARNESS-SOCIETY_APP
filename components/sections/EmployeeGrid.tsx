"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { User, MapPin, Phone, X } from "lucide-react";

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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEmployee(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
                onClick={() => setSelectedEmployee(emp)}
                className={`cursor-pointer group relative bg-[#024950]/40 backdrop-blur-md rounded-2xl border ${theme.border} ${theme.hoverBorder} overflow-hidden ${theme.shadow} ${theme.hoverShadow} transition-all duration-500 h-full flex flex-col`}
              >
                {/* Image Section */}
                <div className="relative aspect-square sm:h-72 sm:aspect-auto w-full overflow-hidden bg-[#001f22]">
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
                  
                  {/* Subtle bottom gradient just for text legibility */}
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

      <AnimatePresence>
        {selectedEmployee && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmployee(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col rounded-3xl border border-[#0FA4AF]/30 bg-gradient-to-br from-[#002b2e] to-[#001f22] shadow-[0_0_50px_rgba(0,0,0,0.5)] scrollbar-hide"
            >
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="relative h-[280px] sm:h-[400px] w-full shrink-0 bg-[#001f22]">
                {selectedEmployee.imageUrl ? (
                  <Image
                    src={selectedEmployee.imageUrl}
                    alt={selectedEmployee.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#024950] to-[#002b2e]">
                    <User size={80} className="text-[#0FA4AF]/50" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#002b2e] to-transparent z-10" />
              </div>

              <div className="relative -mt-8 sm:-mt-12 p-6 sm:p-8 pt-0 shrink-0 z-10">
                <div className="mb-4 inline-flex items-center rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00F0FF] backdrop-blur-md">
                  {selectedEmployee.role}
                </div>
                <h3 className="mb-6 font-display text-3xl font-bold text-white">
                  {selectedEmployee.name}
                </h3>

                <div className="space-y-4">
                  {selectedEmployee.phone && (
                    <div className="flex items-center gap-4 text-[#AFDDE5]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#00F0FF]">
                        <Phone size={18} />
                      </div>
                      <span className="text-lg">{selectedEmployee.phone}</span>
                    </div>
                  )}
                  {selectedEmployee.address && (
                    <div className="flex items-start gap-4 text-[#AFDDE5]">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#00F0FF]">
                        <MapPin size={18} />
                      </div>
                      <span className="text-lg leading-relaxed">{selectedEmployee.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
