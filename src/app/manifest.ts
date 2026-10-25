import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mir AI Studio — AI Video Generator (Urdu / Hindi)",
    short_name: "Mir AI",
    description: "AI Video Generator for Urdu / Hindi creators — Text-to-Video, AI Avatars, voices, subtitles & 4K export. Installable mobile app.",
    id: "/mobile",
    start_url: "/mobile",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0e15",
    theme_color: "#0b0e15",
    categories: ["photo", "video", "productivity", "entertainment"],
    icons: [
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Create AI Video", short_name: "Create", url: "/mobile?tab=create", icons: [{ src: "/icons/icon-512.png", sizes: "192x192" }] },
      { name: "My Projects", short_name: "Projects", url: "/mobile?tab=projects", icons: [{ src: "/icons/icon-512.png", sizes: "192x192" }] },
      { name: "Buy Credits", short_name: "Wallet", url: "/mobile?tab=wallet", icons: [{ src: "/icons/icon-512.png", sizes: "192x192" }] },
    ],
  };
}
