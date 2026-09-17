"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Loader2 } from "lucide-react";

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  role: string | null;
};

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        if (data.ok) {
          setTestimonials(data.data);
        }
      } catch (err) {
        console.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#001f22] py-24 flex justify-center text-[#AFDDE5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#00F0FF]" />
      </section>
    );
  }

  // If there are no approved testimonials, we can hide the section entirely
  if (testimonials.length === 0) {
    return null; 
  }

  return (
    <section className="relative overflow-hidden bg-[#001f22] py-24 text-[#AFDDE5]">
      {/* Background glowing light flare */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#0FA4AF]/10 blur-[120px]" />

      <div className="container-page relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#00F0FF]"
          >
            Impact Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Voices from the Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-[#AFDDE5]/80"
          >
            Hear what educators and parents have to say about the impact of our school mission programs on the younger generation.
          </motion.p>
        </div>

        <div className="mt-20 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            // Modern vibrant themes for testimonials
            const themes = [
              { color: "cyan", border: "border-cyan-500/30", hoverBorder: "hover:border-cyan-400/60", shadow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]", quoteColor: "text-cyan-400/20", authorColor: "text-cyan-400", gradient: "from-cyan-500/20 to-transparent" },
              { color: "purple", border: "border-purple-500/30", hoverBorder: "hover:border-purple-400/60", shadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]", quoteColor: "text-purple-400/20", authorColor: "text-purple-400", gradient: "from-purple-500/20 to-transparent" },
              { color: "amber", border: "border-amber-500/30", hoverBorder: "hover:border-amber-400/60", shadow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]", quoteColor: "text-amber-400/20", authorColor: "text-amber-400", gradient: "from-amber-500/20 to-transparent" },
              { color: "emerald", border: "border-emerald-500/30", hoverBorder: "hover:border-emerald-400/60", shadow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]", quoteColor: "text-emerald-400/20", authorColor: "text-emerald-400", gradient: "from-emerald-500/20 to-transparent" },
              { color: "rose", border: "border-rose-500/30", hoverBorder: "hover:border-rose-400/60", shadow: "hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]", quoteColor: "text-rose-400/20", authorColor: "text-rose-400", gradient: "from-rose-500/20 to-transparent" },
              { color: "blue", border: "border-blue-500/30", hoverBorder: "hover:border-blue-400/60", shadow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]", quoteColor: "text-blue-400/20", authorColor: "text-blue-400", gradient: "from-blue-500/20 to-transparent" }
            ];
            const theme = themes[index % themes.length];

            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className={`relative group flex flex-col justify-between rounded-3xl border ${theme.border} ${theme.hoverBorder} bg-[#024950]/30 p-8 backdrop-blur-xl ${theme.shadow} transition-all duration-300 overflow-hidden cursor-default`}
              >
                {/* Decorative background gradient glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.gradient} rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <Quote className={`absolute right-6 top-6 h-12 w-12 ${theme.quoteColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`} />
                
                <div className="relative z-10 flex-grow">
                  <p className="text-base italic leading-relaxed text-white/90 group-hover:text-white transition-colors duration-300">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="mt-8 relative z-10">
                  <div className={`w-10 h-1 mb-4 rounded-full bg-gradient-to-r ${theme.gradient.replace(' to-transparent', '')} to-white/20`} />
                  <p className={`font-display text-xl font-bold ${theme.authorColor} drop-shadow-md`}>{testimonial.author}</p>
                  {testimonial.role && <p className="mt-1 text-sm font-medium text-[#AFDDE5]/80 uppercase tracking-wide">{testimonial.role}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
