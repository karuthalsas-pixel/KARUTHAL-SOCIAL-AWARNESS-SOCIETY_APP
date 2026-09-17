"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Image as ImageIcon, LayoutDashboard, Globe, MessageSquare, Images, Heart, Inbox, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, colorClass: "text-emerald-400", bgClass: "from-emerald-500/20 to-emerald-400/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]" },
  { name: "Inbox Messages", href: "/admin/messages", icon: Inbox, colorClass: "text-violet-400", bgClass: "from-violet-500/20 to-violet-400/10 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]" },
  { name: "Manage Employees", href: "/admin/employees", icon: Users, colorClass: "text-indigo-400", bgClass: "from-indigo-500/20 to-indigo-400/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]" },
  { name: "Awareness Programs", href: "/admin/programs", icon: Heart, colorClass: "text-rose-400", bgClass: "from-rose-500/20 to-rose-400/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]" },
  { name: "Event Gallery", href: "/admin/gallery", icon: ImageIcon, colorClass: "text-pink-400", bgClass: "from-pink-500/20 to-pink-400/10 border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)]" },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare, colorClass: "text-amber-400", bgClass: "from-amber-500/20 to-amber-400/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]" },
  { name: "Home Carousel", href: "/admin/carousel", icon: Images, colorClass: "text-sky-400", bgClass: "from-sky-500/20 to-sky-400/10 border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.15)]" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#001416] font-sans text-[#AFDDE5] relative selection:bg-[#00F0FF]/30 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dynamic Colorful Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/15 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/15 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-500/15 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute top-[60%] left-[10%] w-[30%] h-[30%] rounded-full bg-amber-500/10 blur-[100px]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-[#001f22]/90 backdrop-blur-xl border-b border-[#0FA4AF]/20 px-4 flex items-center justify-between shadow-lg">
        <Link href="/admin" className="flex items-center gap-3">
          <img src="/logo.png" alt="Karuthal Logo" className="h-8 w-auto" />
          <span className="font-display font-bold text-white tracking-wider text-sm">KARUTHAL ADMIN</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-[#00F0FF] p-2 focus:outline-none rounded-lg hover:bg-white/5 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-[#0FA4AF]/20 bg-[#001f22]/95 md:bg-[#001f22]/80 backdrop-blur-2xl flex flex-col shadow-[4px_0_30px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="h-24 flex items-center px-8 border-b border-[#0FA4AF]/20 bg-gradient-to-b from-white/5 to-transparent shrink-0">
          <Link href="/admin" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/logo.png"
                alt="Karuthal Logo"
                className="relative h-12 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white tracking-wider drop-shadow-md">KARUTHAL</h2>
              <p className="text-[11px] uppercase text-[#0FA4AF] font-bold tracking-[0.2em] leading-none mt-1">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
               <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium relative group overflow-hidden",
                  isActive
                    ? cn(item.colorClass, item.bgClass.split(" ").find(c => c.startsWith("shadow")))
                    : "text-[#AFDDE5]/70 hover:text-white"
                )}
              >
                {isActive && (
                  <div className={cn("absolute inset-0 bg-gradient-to-r border rounded-xl", item.bgClass.split(" ").filter(c => !c.startsWith("shadow")).join(" "))} />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors duration-300" />
                )}
                <Icon size={18} className={cn("relative z-10 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#0FA4AF]/20 space-y-2 bg-gradient-to-t from-black/20 to-transparent shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#AFDDE5]/70 hover:bg-[#0FA4AF]/15 hover:text-white transition-all duration-300 border border-transparent hover:border-[#0FA4AF]/30"
          >
            <Globe size={18} />
            Back to Website
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout Securely
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 h-screen overflow-y-auto overflow-x-hidden custom-scrollbar md:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}
