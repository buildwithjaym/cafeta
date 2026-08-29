import type {
  MetadataRoute,
} from "next";

import { createClient } from "@/lib/supabase/server";

const siteUrl =
  "https://cafeta.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase =
    await createClient();

  const {
    data: businesses,
    error,
  } = await supabase
    .from("businesses")
    .select(
      `
        slug,
        updated_at
      `,
    )
    .eq(
      "status",
      "approved",
    )
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[CAFÉTA SEO] Failed to build business sitemap:",
      error,
    );
  }

  const staticPages: MetadataRoute.Sitemap =
    [
      {
        url: siteUrl,
        lastModified:
          new Date(),
        changeFrequency:
          "weekly",
        priority: 1,
      },

      {
        url: `${siteUrl}/explore`,
        lastModified:
          new Date(),
        changeFrequency:
          "daily",
        priority: 0.9,
      },

      {
        url: `${siteUrl}/map`,
        lastModified:
          new Date(),
        changeFrequency:
          "daily",
        priority: 0.8,
      },

      {
        url: `${siteUrl}/privacy`,
        changeFrequency:
          "monthly",
        priority: 0.3,
      },

      {
        url: `${siteUrl}/terms`,
        changeFrequency:
          "monthly",
        priority: 0.3,
      },
    ];

  const businessPages: MetadataRoute.Sitemap =
    (
      businesses ?? []
    ).map((business) => ({
      url: `${siteUrl}/business/${encodeURIComponent(
        business.slug,
      )}`,

      lastModified:
        business.updated_at
          ? new Date(
              business.updated_at,
            )
          : new Date(),

      changeFrequency:
        "weekly",

      priority: 0.8,
    }));

  return [
    ...staticPages,
    ...businessPages,
  ];
}