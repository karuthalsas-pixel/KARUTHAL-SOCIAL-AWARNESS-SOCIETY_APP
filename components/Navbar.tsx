"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/utils";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const ids = NAV_ITEMS.map((item) => item.id);

interface NavbarProps {
  isAuthenticated?: boolean;
  role?: string;
}

export function Navbar({ isAuthenticated = false, role }: NavbarProps) {
  const activeId = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setDrawerOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-signature",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <div className="container-page flex items-center justify-between gap-4">

          {/* Logo — outside the pill */}
          <a
            href="#home"
            onClick={handleNavClick("home")}
            className="flex flex-col items-center group shrink-0"
            aria-label="Karuthal home"
          >
            <img
              src="/logo.png"
              alt="Karuthal Logo"
              className="h-14 w-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-transform group-hover:scale-105"
            />
            <span className="font-display text-[#FBBF24] font-bold text-xs mt-1 drop-shadow-md">കരുതൽ</span>
          </a>

          {/* Pill nav container — desktop only */}
          <div
            className={cn(
              "hidden md:flex flex-1 items-center justify-between gap-1 rounded-full border px-6 py-2 transition-all duration-500 ease-signature",
              scrolled
                ? "border-white/20 bg-[#001f22]/85 shadow-2xl backdrop-blur-2xl"
                : "border-transparent bg-transparent"
            )}
          >
            <nav className="relative flex items-center gap-3" aria-label="Primary">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={handleNavClick(item.id)}
                  aria-current={activeId === item.id ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-6 py-2 text-sm transition-colors duration-300 font-medium",
                    activeId === item.id
                      ? "text-white font-semibold"
                      : "text-[#AFDDE5]/80 hover:text-[#0FA4AF]"
                  )}
                >
                  {activeId === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-white/25 bg-[#024950]/90 backdrop-blur-md shadow-lg shadow-[#024950]/40"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/15">
              {isAuthenticated && (
                <>
                  <Link href={role === "ADMIN" ? "/admin" : "/dashboard"}>
                    <Button size="sm" variant="secondary" className="px-4 py-1.5 h-auto text-xs">Dashboard</Button>
                  </Link>
                  <Button size="sm" variant="outline" className="px-4 py-1.5 h-auto text-xs bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 hover:text-red-300 transition-colors" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
              
              <Button size="sm" className="px-4 py-1.5 h-auto text-xs" onClick={handleNavClick("contact")}>
                School Mission
              </Button>
            </div>
          </div>

          {/* Mobile: hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-full p-2"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed right-0 top-0 z-[70] flex h-full w-[82%] max-w-sm flex-col bg-[#001f22] px-7 py-6 shadow-2xl md:hidden overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-white">Menu</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-white"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={handleNavClick(item.id)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "border-b border-white/10 py-4 font-display text-2xl hairline transition-colors",
                      activeId === item.id ? "text-[#00F0FF]" : "text-white"
                    )}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto pt-8 flex flex-col gap-3">
                {isAuthenticated && (
                  <>
                    <Link href={role === "ADMIN" ? "/admin" : "/dashboard"} className="w-full">
                      <Button className="w-full" variant="secondary">Dashboard</Button>
                    </Link>
                    <Button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )}
                
                <Button className="w-full" onClick={handleNavClick("contact")}>
                  School Mission
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
