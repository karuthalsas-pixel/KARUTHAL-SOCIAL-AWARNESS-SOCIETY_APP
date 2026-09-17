"use client";

import { usePathname } from "next/navigation";
import { FloatingContactButtons } from "@/components/ui/FloatingContactButtons";
import { Chatbot } from "@/components/ui/Chatbot";

export function GlobalUI() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <Chatbot />
      <FloatingContactButtons />
    </>
  );
}