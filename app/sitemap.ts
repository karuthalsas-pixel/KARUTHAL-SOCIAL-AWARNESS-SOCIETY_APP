import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aternastudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const sections = ["", "#about", "#work", "#gallery", "#contact"];
  return sections.map((path) => ({
    url: `${SITE_URL}/${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7
  }));
}
