import type { Metadata } from "next";

import { CafetaMap } from "@/components/map/cafeta-map";
import { createClient } from "@/lib/supabase/server";

import type { MapBusiness } from "@/lib/map/types";

export const metadata: Metadata = {
  title: "Map | CAFÉTA",
  description:
    "Discover cafés, coffee shops, and milk tea spots around Basilan.",
};

export default async function MapPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .eq("status", "approved")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("name", {
      ascending: true,
    });

  if (error) {
    console.error(
      "CAFÉTA businesses query:",
      error,
    );
  }

  const businesses: MapBusiness[] = (data ?? []).filter(
    (
      business,
    ): business is MapBusiness =>
      typeof business.latitude === "number" &&
      typeof business.longitude === "number",
  );

  return (
    <main className="map-page">
      <CafetaMap
        businesses={businesses}
        databaseError={Boolean(error)}
      />
    </main>
  );
}