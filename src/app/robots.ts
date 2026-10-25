import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mirai.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/mobile", "/mobile-preview", "/privacy", "/terms", "/refund"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
