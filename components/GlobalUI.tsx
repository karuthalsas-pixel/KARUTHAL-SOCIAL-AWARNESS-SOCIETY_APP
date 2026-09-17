"use client";

import { usePathname } from "next/navigation";
import { FloatingContactButtons } from "@/components/ui/FloatingContactButtons";
import { Chatbot } from "@/components/ui/Chatbot";
import { FloatingAdminButton } from "@/components/ui/FloatingAdminButton";

export function GlobalUI({ isAdminUser = false }: { isAdminUser?: boolean }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/portal-karuthal-secure") || pathname?.startsWith("/login");

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <Chatbot />
      <FloatingContactButtons />
      {isAdminUser && <FloatingAdminButton />}
    </>
  );
}