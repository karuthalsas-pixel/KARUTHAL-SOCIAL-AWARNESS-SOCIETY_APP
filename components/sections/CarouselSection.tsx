"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type CarouselItem = {
  id: number;
  imageUrl: string;
  title: string;
  description: string | null;
  order: number;
};

export function CarouselSection() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/carousel");
        const data = await res.json();
        if (data.ok) {
          setItems(data.data);
        }
      } catch (err) {
        console.error("Failed to load carousel");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading || items.length === 0) return null;

  // Only apply infinite scroll animation if there are enough items
  const shouldAnimate = items.length >= 4;
  const duplicatedItems = shouldAnimate ? [...items, ...items, ...items] : items;

  return (
    <section className="relative overflow-hidden bg-[#001f22] py-20">
      {/* Top and bottom subtle borders */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0FA4AF]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0FA4AF]/30 to-transparent" />

      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">
          Our Journey
        </h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FBBF24]" />
      </div>

      <div className="relative flex w-full overflow-hidden">
        {/* Left and Right gradient fades for smooth visual edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#001f22] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#001f22] to-transparent" />

        <motion.div
          className={`flex gap-6 px-4 ${!shouldAnimate ? 'justify-center w-full' : 'whitespace-nowrap'}`}
          animate={shouldAnimate ? {
            x: ["0%", "-33.333333%"] // Move exactly one full set of items
          } : { x: 0 }}
          transition={shouldAnimate ? {
            ease: "linear",
            duration: 8, // Much faster moving
            repeat: Infinity,
          } : {}}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="relative h-64 w-96 shrink-0 overflow-hidden rounded-2xl border border-white/10 group"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001f22] via-[#001f22]/40 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-display text-xl font-bold text-white shadow-sm truncate">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-[#AFDDE5] opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 whitespace-normal leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
