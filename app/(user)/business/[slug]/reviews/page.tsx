import type {
  Metadata,
} from "next";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  BusinessReviewsPage,
} from "@/components/reviews/business-reviews-page";

import type {
  Review,
  ReviewAuthor,
  ReviewBusiness,
} from "@/lib/reviews/types";

import {
  createClient,
} from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type RawReview = {
  id: string;

  user_id: string;
  business_id: string;

  rating: number;
  content: string | null;

  created_at: string;
  updated_at: string;

  author:
    | ReviewAuthor
    | ReviewAuthor[]
    | null;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const supabase =
    await createClient();

  const {
    data:
      business,
  } =
    await supabase
      .from(
        "businesses",
      )
      .select(
        "name",
      )
      .eq(
        "slug",
        slug,
      )
      .eq(
        "status",
        "approved",
      )
      .maybeSingle();

  if (!business) {
    return {
      title:
        "Reviews | CAFÉTA",

      description:
        "Read community reviews on CAFÉTA.",
    };
  }

  return {
    title:
      `${business.name} Reviews | CAFÉTA`,

    description:
      `Read customer reviews and ratings for ${business.name} on CAFÉTA.`,
  };
}

export default async function BusinessReviewsRoute({
  params,
}: Props) {
  const {
    slug,
  } = await params;

  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=${encodeURIComponent(
        `/business/${slug}/reviews`,
      )}`,
    );
  }

  const [
    businessResult,
    profileResult,
  ] =
    await Promise.all([
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
          "slug",
          slug,
        )
        .eq(
          "status",
          "approved",
        )
        .maybeSingle(),

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
    ]);

  if (
    businessResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load reviews business:",
      businessResult.error,
    );
  }

  if (
    !businessResult.data
  ) {
    notFound();
  }

  if (
    profileResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load review profile:",
      profileResult.error,
    );
  }

  if (
    !profileResult.data
  ) {
    redirect(
      "/profile/setup",
    );
  }

  const business =
    businessResult.data as ReviewBusiness;

  const {
    data:
      reviewsData,
    error:
      reviewsError,
  } =
    await supabase
      .from(
        "reviews",
      )
      .select(`
        id,
        user_id,
        business_id,
        rating,
        content,
        created_at,
        updated_at,

        author:profiles!reviews_user_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq(
        "business_id",
        business.id,
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      );

  if (
    reviewsError
  ) {
    console.error(
      "[CAFÉTA] Failed to load business reviews:",
      {
        code:
          reviewsError.code,

        message:
          reviewsError.message,

        details:
          reviewsError.details,

        hint:
          reviewsError.hint,
      },
    );
  }

  const rawReviews =
    (
      reviewsData ??
      []
    ) as unknown as RawReview[];

  const reviews: Review[] =
    rawReviews.map(
      (review) => ({
        id:
          review.id,

        user_id:
          review.user_id,

        business_id:
          review.business_id,

        rating:
          Number(
            review.rating,
          ),

        content:
          review.content,

        created_at:
          review.created_at,

        updated_at:
          review.updated_at,

        author:
          firstRelation(
            review.author,
          ),
      }),
    );

  return (
    <BusinessReviewsPage
      business={
        business
      }
      reviews={
        reviews
      }
      currentUserId={
        user.id
      }
      currentProfile={
        profileResult.data
      }
    />
  );
}

function firstRelation<T>(
  value:
    | T
    | T[]
    | null,
): T | null {
  if (
    Array.isArray(
      value,
    )
  ) {
    return (
      value[0] ??
      null
    );
  }

  return value;
}