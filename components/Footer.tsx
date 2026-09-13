import { NAV_ITEMS } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#001c1f] py-12 text-[#AFDDE5]">
      {/* Background glowing light flare */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 rounded-full bg-[#00F0FF]/30 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-[#EC4899]/25 blur-[100px]" />

      <div className="container-page relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <img src="/logo.png" alt="Karuthal Logo" className="h-14 w-auto" />
            <span className="font-display text-[#FBBF24] font-bold text-[10px]">കരുതൽ</span>
          </div>
          <div className="text-[11px] text-[#AFDDE5]/70 mt-2 space-y-1 text-center sm:text-left">
            <p className="font-bold text-[#0FA4AF]">Reg No: PTM/TC/15/2023</p>
            <p>PB.No.22, Kuttapuzha P.O., Thiruvalla - 689103</p>
            <p>Kerala, India</p>
            <p className="pt-1">Tel: +91 9656217909</p>
            <p>Email: <a href="mailto:karuthalsas@gmail.com" className="hover:text-[#00F0FF]">karuthalsas@gmail.com</a></p>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2 text-sm text-[#AFDDE5]/80">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="transition hover:text-[#0FA4AF] font-medium">
              {item.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-[#AFDDE5]/60">
          <a href="/login" title="" className="cursor-default hover:text-[#AFDDE5]/60 transition-none select-none">&copy;</a>{" "}
          {new Date().getFullYear()} Karuthal Social Awareness Society. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
