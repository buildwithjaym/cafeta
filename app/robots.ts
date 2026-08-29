import type { MetadataRoute } from "next";

const siteUrl =
  "https://cafeta.online";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",

        allow: "/",

        disallow: [
          "/admin/",
          "/auth/",
          "/onboarding/",
          "/api/",
        ],
      },
    ],

    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}