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

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <Quote className="absolute right-6 top-6 h-12 w-12 text-white/5" />
              <p className="relative text-base italic leading-relaxed text-white/90">
                "{testimonial.quote}"
              </p>
              <div className="mt-8">
                <p className="font-display text-lg font-bold text-[#00F0FF]">{testimonial.author}</p>
                {testimonial.role && <p className="mt-1 text-sm text-[#AFDDE5]/70">{testimonial.role}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
