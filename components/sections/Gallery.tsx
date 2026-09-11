"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { GalleryItem } from "@/lib/schema";

interface GalleryProps {
  items: Omit<GalleryItem, "createdAt">[];
}

export function Gallery({ items }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const next = () => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  const prev = () => setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <section id="gallery" className="relative overflow-hidden border-t border-white/10 bg-[#001f22] py-28 sm:py-36 text-[#AFDDE5]">
      {/* Background glowing light flare */}
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-[#0FA4AF]/55 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#34D399]/50 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 rounded-full bg-[#818CF8]/30 blur-[120px]" />
      
      <div className="container-page relative z-10">
        <div className="max-w-2xl">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#964734]/50 bg-[#964734]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#AFDDE5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#964734]" />
              Event Gallery
            </p>
            <h2 className="mt-4 font-display text-display-md text-balance text-white font-medium">
              Moments from our School Mission sessions.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={0.04 * i} className={i % 5 === 0 ? "col-span-2 row-span-1" : ""}>
              <button
                onClick={() => setActiveIndex(i)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#024950]/40 border border-white/30 focus-visible:outline-[#0FA4AF] shadow-[0_0_30px_rgba(0,240,255,0.2)] backdrop-blur-md hover:shadow-[0_0_45px_rgba(0,240,255,0.4)] transition-shadow duration-500"
                aria-label={`View ${item.title} in ${item.location}`}
              >
                <Image
                  src={item.imageUrl}
                  alt={`${item.title} — ${item.category} project in ${item.location}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-signature group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001f22]/95 via-[#001f22]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-left">
                  <p className="font-display text-lg text-white font-medium">{item.title}</p>
                  <p className="text-xs font-semibold text-[#0FA4AF]">{item.category}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#001f22]/90 p-4 backdrop-blur-xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} preview`}
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#024950]/90 shadow-2xl backdrop-blur-2xl text-[#AFDDE5]"
            >
              <div className="relative aspect-[16/10] w-full bg-[#001f22]">
                <Image
                  src={active.imageUrl}
                  alt={`${active.title} — ${active.category} project in ${active.location}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-wrap items-start justify-between gap-4 p-6">
                <div>
                  <h3 className="font-display text-2xl text-white font-medium">{active.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#0FA4AF]">
                    <MapPin className="h-3.5 w-3.5 text-[#964734]" aria-hidden="true" />
                    {active.location} &middot; {active.year}
                  </p>
                  {active.description && (
                    <p className="mt-3 max-w-md text-sm text-[#AFDDE5]/85 leading-relaxed">
                      {active.description}
                    </p>
                  )}
                </div>
                <span className="rounded-full border border-white/20 bg-[#0FA4AF]/20 px-3.5 py-1 text-xs font-semibold text-[#AFDDE5]">
                  {active.category}
                </span>
              </div>

              <button
                onClick={close}
                aria-label="Close preview"
                className="absolute right-4 top-4 rounded-full bg-ink/60 p-2 text-paper backdrop-blur-md transition hover:bg-ink/80"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={prev}
                aria-label="Previous project"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-ink/40 p-2 text-paper backdrop-blur-md transition hover:bg-ink/70"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={next}
                aria-label="Next project"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-ink/40 p-2 text-paper backdrop-blur-md transition hover:bg-ink/70"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
