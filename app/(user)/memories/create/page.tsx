import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import {
  MemoryCreateForm,
} from "@/components/memories/memory-create-form";

import type {
  MemoryBusiness,
} from "@/lib/memories/types";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title:
    "Share a Memory",

  description:
    "Share a café moment with the CAFÉTA community.",
};

export default async function CreateMemoryPage() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error:
      authError,
  } =
    await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    redirect(
      "/auth/login?next=/memories/create",
    );
  }

  const [
    profileResult,
    businessesResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "profiles",
        )
        .select(`
          id,
          username,
          full_name,
          avatar_url
        `)
        .eq(
          "id",
          user.id,
        )
        .maybeSingle(),

      supabase
        .from(
          "businesses",
        )
        .select(`
          id,
          name,
          slug,
          category,
          logo_url,
          cover_url,
          barangay,
          city,
          province,
          is_verified
        `)
        .eq(
          "status",
          "approved",
        )
        .order(
          "name",
          {
            ascending:
              true,
          },
        ),
    ]);

  if (
    profileResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load memory profile:",
      profileResult.error,
    );
  }

  if (
    businessesResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load memory businesses:",
      businessesResult.error,
    );
  }

  if (
    !profileResult.data
  ) {
    redirect(
      "/profile/setup",
    );
  }

  return (
    <MemoryCreateForm
      userId={
        user.id
      }
      profile={
        profileResult.data
      }
      businesses={
        (
          businessesResult.data ??
          []
        ) as MemoryBusiness[]
      }
    />
  );
}