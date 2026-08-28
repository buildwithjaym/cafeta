import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfilePageClient } from "@/components/profile/profile-page-client";

import type {
  BusinessCategory,
  BusinessMemberRole,
  BusinessStatus,
  ProfileBusiness,
} from "@/lib/profile/types";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile",

  description:
    "Manage your CAFÉTA profile, businesses, and account.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(
      "/auth/login?next=/profile",
    );
  }

  const [
    profileResult,
    membershipsResult,
    savedResult,
    reviewsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        username,
        bio,
        avatar_url,
        role,
        created_at,
        updated_at
      `)
      .eq("id", user.id)
      .maybeSingle(),

    supabase
      .from("business_members")
      .select(`
        role,
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

          status,
          is_verified,

          created_at,
          updated_at
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("saved_businesses")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id),

    supabase
      .from("reviews")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id),
  ]);

  if (profileResult.error) {
    console.error(
      "[CAFÉTA] Failed to load profile:",
      {
        code:
          profileResult.error.code,

        message:
          profileResult.error.message,
      },
    );
  }

  if (membershipsResult.error) {
    console.error(
      "[CAFÉTA] Failed to load business memberships:",
      {
        code:
          membershipsResult.error.code,

        message:
          membershipsResult.error.message,
      },
    );
  }

  if (savedResult.error) {
    console.error(
      "[CAFÉTA] Failed to load saved businesses:",
      {
        code:
          savedResult.error.code,

        message:
          savedResult.error.message,
      },
    );
  }

  if (reviewsResult.error) {
    console.error(
      "[CAFÉTA] Failed to load reviews:",
      {
        code:
          reviewsResult.error.code,

        message:
          reviewsResult.error.message,
      },
    );
  }

  const profile =
    profileResult.data;

  if (!profile) {
    redirect("/profile/setup");
  }

  const businesses: ProfileBusiness[] =
    [];

  for (
    const membership of
    membershipsResult.data ?? []
  ) {
    const business =
      Array.isArray(
        membership.business,
      )
        ? membership.business[0]
        : membership.business;

    if (!business) {
      continue;
    }

    businesses.push({
      id:
        business.id,

      name:
        business.name,

      slug:
        business.slug,

      category:
        business.category as BusinessCategory,

      description:
        business.description,

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

      status:
        business.status as BusinessStatus,

      is_verified:
        business.is_verified,

      created_at:
        business.created_at,

      updated_at:
        business.updated_at,

      memberRole:
        membership.role as BusinessMemberRole,

      membershipCreatedAt:
        membership.created_at,
    });
  }

  return (
    <ProfilePageClient
      user={{
        id:
          user.id,

        email:
          user.email ?? "",
      }}
      profile={{
        id:
          profile.id,

        full_name:
          profile.full_name,

        username:
          profile.username,

        bio:
          profile.bio,

        avatar_url:
          profile.avatar_url,

        role:
          profile.role,

        created_at:
          profile.created_at,

        updated_at:
          profile.updated_at,
      }}
      businesses={
        businesses
      }
      stats={{
        saved:
          savedResult.count ?? 0,

        reviews:
          reviewsResult.count ?? 0,

        businesses:
          businesses.length,
      }}
    />
  );
}