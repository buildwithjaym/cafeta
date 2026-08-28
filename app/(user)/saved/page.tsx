import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import {
  SavedPageClient,
} from "@/components/saved/saved-page-client";

import type {
  SavedBusiness,
} from "@/components/saved/saved-page-client";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Saved Places",

  description:
    "View and manage your saved cafés, coffee shops, milk-tea shops, and local favorites on CAFÉTA.",
};

export default async function SavedPage() {
  const supabase =
    await createClient();

  /* =====================================================
     AUTH
  ===================================================== */

  const {
    data: {
      user,
    },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    redirect(
      "/auth/login?next=/saved",
    );
  }

  /* =====================================================
     LOAD SAVED BUSINESSES
  ===================================================== */

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "saved_businesses",
      )
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
      .eq(
        "user_id",
        user.id,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      );

  /* =====================================================
     QUERY ERROR
  ===================================================== */

  if (error) {
    console.error(
      "[CAFÉTA] Failed to load saved businesses:",
      {
        code:
          error.code,

        message:
          error.message,

        details:
          error.details,

        hint:
          error.hint,
      },
    );

    return (
      <SavedPageClient
        initialSaved={[]}
        hasError
      />
    );
  }

  /* =====================================================
     NORMALIZE SUPABASE RELATION
  ===================================================== */

  const savedBusinesses: SavedBusiness[] =
    [];

  for (
    const item of
    data ?? []
  ) {
    const business =
      Array.isArray(
        item.business,
      )
        ? item.business[0]
        : item.business;

    if (!business) {
      continue;
    }

    savedBusinesses.push({
      savedId:
        item.id,

      savedAt:
        item.created_at,

      business: {
        id:
          business.id,

        name:
          business.name,

        slug:
          business.slug,

        category:
          business.category as SavedBusiness["business"]["category"],

        description:
          business.description,

        /*
         * These URLs come directly
         * from public.businesses.
         */
        logo_url:
          business.logo_url,

        cover_url:
          business.cover_url,

        address:
          business.address,

        barangay:
          business.barangay,

        city:
          business.city,

        province:
          business.province,

        latitude:
          business.latitude,

        longitude:
          business.longitude,

        is_verified:
          business.is_verified,
      },
    });
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <SavedPageClient
      initialSaved={
        savedBusinesses
      }
    />
  );
}