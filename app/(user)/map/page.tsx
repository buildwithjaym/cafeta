import type {
  Metadata,
} from "next";

import {
  CafetaMap,
} from "@/components/map/cafeta-map";

import {
  getMemoryActivityLabel,
  type BusinessMemoryActivity,
} from "@/lib/memories/types";

import type {
  MapBusiness,
  MapBusinessCategory,
} from "@/lib/map/types";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Map | CAFÉTA",

  description:
    "Discover cafés, coffee shops, milk tea spots, and community activity around Basilan.",
};

type RawBusiness = {
  id: string;
  name: string;
  slug: string;
  category: MapBusinessCategory;

  description: string | null;

  logo_url: string | null;
  cover_url: string | null;

  address: string;
  barangay: string | null;
  city: string;
  province: string;

  latitude: number | null;
  longitude: number | null;

  is_verified: boolean;
};

type RawActivity = {
  business_id: string;

  memory_count:
    | number
    | string;

  memories_24h:
    | number
    | string;

  memories_7d:
    | number
    | string;

  unique_posters_7d:
    | number
    | string;

  latest_memory_at:
    | string
    | null;

  activity_score:
    | number
    | string;
};

export default async function MapPage() {
  const supabase =
    await createClient();

  const [
    businessesResult,
    activityResult,
  ] =
    await Promise.all([
      supabase
        .from("businesses")
        .select(`
          id,
          name,
          slug,
          category,
          description,
          logo_url,
          cover_url,
          address,
          barangay,
          city,
          province,
          latitude,
          longitude,
          is_verified
        `)
        .eq(
          "status",
          "approved",
        )
        .not(
          "latitude",
          "is",
          null,
        )
        .not(
          "longitude",
          "is",
          null,
        )
        .order(
          "name",
          {
            ascending:
              true,
          },
        ),

      supabase
        .from(
          "business_memory_activity",
        )
        .select(`
          business_id,
          memory_count,
          memories_24h,
          memories_7d,
          unique_posters_7d,
          latest_memory_at,
          activity_score
        `),
    ]);

  if (
    businessesResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load map businesses:",
      businessesResult.error,
    );
  }

  if (
    activityResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load Memory activity:",
      activityResult.error,
    );
  }

  const activityMap =
    new Map<
      string,
      BusinessMemoryActivity
    >();

  for (
    const raw of
    (activityResult.data ??
      []) as RawActivity[]
  ) {
    activityMap.set(
      raw.business_id,
      {
        business_id:
          raw.business_id,

        memory_count:
          Number(
            raw.memory_count,
          ),

        memories_24h:
          Number(
            raw.memories_24h,
          ),

        memories_7d:
          Number(
            raw.memories_7d,
          ),

        unique_posters_7d:
          Number(
            raw.unique_posters_7d,
          ),

        latest_memory_at:
          raw.latest_memory_at,

        activity_score:
          Number(
            raw.activity_score,
          ),
      },
    );
  }

  const businesses: MapBusiness[] =
    (
      (businessesResult.data ??
        []) as RawBusiness[]
    )
      .filter(
        (business) =>
          typeof business.latitude ===
            "number" &&
          typeof business.longitude ===
            "number",
      )
      .map(
        (business) => {
          const memoryActivity =
            activityMap.get(
              business.id,
            ) ?? null;

          return {
            ...business,

            latitude:
              business.latitude!,

            longitude:
              business.longitude!,

            memoryActivity,

            memoryActivityLabel:
              getMemoryActivityLabel(
                memoryActivity,
              ),
          };
        },
      );

  return (
    <main className="map-page">
      <CafetaMap
        businesses={
          businesses
        }
        databaseError={
          Boolean(
            businessesResult.error,
          )
        }
      />
    </main>
  );
}