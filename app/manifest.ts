import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aterna Studio | Architecture & Interior Design",
    short_name: "Aterna Studio",
    description:
      "Boutique architecture and interior design studio crafting residential, hospitality, and adaptive-reuse projects.",
    start_url: "/",
    display: "standalone",
    background_color: "#EFEAE0",
    theme_color: "#171512",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
