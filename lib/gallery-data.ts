import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { galleryItems, type GalleryItem } from "@/lib/schema";

// Static fallback so the page still renders a full gallery before the
// database is provisioned, or if the DB connection fails at build/runtime.
export const FALLBACK_GALLERY: Omit<GalleryItem, "createdAt">[] = [
  {
    id: 1,
    title: "Interactive Puppet Shows",
    category: "Visual Arts",
    location: "Kerala Schools",
    year: 2024,
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1600&auto=format&fit=crop",
    description: "Captivating young children with colorful puppet performances that communicate body safety, child protection, and moral values.",
    featured: true,
    order: 1
  },
  {
    id: 2,
    title: "Magic & Awareness Illusions",
    category: "Live Performance",
    location: "Thiruvalla",
    year: 2024,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop",
    description: "Engaging students through magic shows that vividly illustrate the deceptive traps of addiction and digital distractions.",
    featured: true,
    order: 2
  },
  {
    id: 3,
    title: "Student Counseling Sessions",
    category: "Mental Support",
    location: "Campus Missions",
    year: 2024,
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    description: "Personalized guidance by experienced counselors helping students navigate peer pressure and psychological well-being.",
    featured: false,
    order: 3
  },
  {
    id: 4,
    title: "Cyber Safety & Mobile Trap Seminars",
    category: "Digital Prudence",
    location: "Higher Secondary",
    year: 2023,
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop",
    description: "Educating adolescents on online safety, social media traps, and preventing gaming & internet addiction.",
    featured: false,
    order: 4
  },
  {
    id: 5,
    title: "Road Safety & Speed Caution",
    category: "Civic Awareness",
    location: "Youth Forums",
    year: 2023,
    imageUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1600&auto=format&fit=crop",
    description: "Empowering young students to value human life, obey traffic guidelines, and reject thrill-seeking speed driving.",
    featured: true,
    order: 5
  },
  {
    id: 6,
    title: "Healthy Living & Anti-Junk Food",
    category: "Lifestyle Guidance",
    location: "Primary Schools",
    year: 2023,
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1600&auto=format&fit=crop",
    description: "Inspiring children towards physical health, balanced nutrition, and steering away from harmful fast-food habits.",
    featured: false,
    order: 6
  }
];

export async function getGalleryItems() {
  if (!process.env.DATABASE_URL) {
    return FALLBACK_GALLERY;
  }
  try {
    const items = await db.select().from(galleryItems).orderBy(asc(galleryItems.order));
    return items.length > 0 ? items : FALLBACK_GALLERY;
  } catch (error) {
    console.error("Falling back to static gallery data:", error);
    return FALLBACK_GALLERY;
  }
}
