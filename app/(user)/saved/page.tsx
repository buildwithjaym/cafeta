import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SavedPageClient } from "@/components/saved/saved-page-client";

export default async function SavedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("saved_businesses")
    .select(`
      id,
      created_at,
      business:businesses (
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
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load saved businesses:",
      error,
    );

    return (
      <SavedPageClient
        initialSaved={[]}
        hasError
      />
    );
  }

  const savedBusinesses =
    data
      ?.filter((item) => item.business)
      .map((item) => ({
        savedId: item.id,
        savedAt: item.created_at,
        business: Array.isArray(item.business)
          ? item.business[0]
          : item.business,
      }))
      .filter(
        (
          item,
        ): item is {
          savedId: string;
          savedAt: string;
          business: NonNullable<
            typeof item.business
          >;
        } => Boolean(item.business),
      ) ?? [];

  return (
    <SavedPageClient
      initialSaved={savedBusinesses}
    />
  );
}