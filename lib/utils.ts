import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "What we do" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" }
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];
