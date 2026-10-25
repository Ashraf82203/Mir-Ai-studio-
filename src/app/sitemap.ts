import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mirai.app";
  const now = new Date();

  return [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/mobile`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/mobile-preview`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/refund`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
