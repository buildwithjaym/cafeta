import type { Metadata } from "next";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  BusinessProfileClient,
} from "@/components/business/create-business-profile";

import type {
  BusinessMemoryPreview,
} from "@/lib/memories/types";

import {
  createClient,
} from "@/lib/supabase/server";

const REGISTER_ROUTE =
  "/auth/register";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type BusinessHour = {
  id: string;
  business_id: string;
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
};

type MenuCategory = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
};

type MenuItem = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
};

type ReviewProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type Review = {
  id: string;
  user_id: string;
  business_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  updated_at: string;

  profile:
    | ReviewProfile
    | ReviewProfile[]
    | null;
};

type MemoryAuthor = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type RawBusinessMemory = {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;

  author:
    | MemoryAuthor
    | MemoryAuthor[]
    | null;
};

type BusinessMember = {
  role: string;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } =
    await params;

  const supabase =
    await createClient();

  const {
    data: business,
  } =
    await supabase
      .from("businesses")
      .select(`
        name,
        description,
        cover_url
      `)
      .eq("slug", slug)
      .eq(
        "status",
        "approved",
      )
      .maybeSingle();

  if (!business) {
    return {
      title:
        "Business | CAFÉTA",
    };
  }

  return {
    title:
      `${business.name} | CAFÉTA`,

    description:
      business.description ??
      `Discover ${business.name} on CAFÉTA.`,

    openGraph: {
      title:
        `${business.name} | CAFÉTA`,

      description:
        business.description ??
        `Discover ${business.name} on CAFÉTA.`,

      images:
        business.cover_url
          ? [
              business.cover_url,
            ]
          : [],
    },
  };
}

export default async function BusinessPage({
  params,
}: PageProps) {
  const { slug } =
    await params;

  const supabase =
    await createClient();

  const {
    data: {
      session,
    },
  } =
    await supabase.auth.getSession();

  if (!session?.user) {
    const next =
      `/business/${encodeURIComponent(
        slug,
      )}`;

    redirect(
      `${REGISTER_ROUTE}?next=${encodeURIComponent(
        next,
      )}`,
    );
  }

  const {
    data: {
      user,
    },
    error:
      userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
    const next =
      `/business/${encodeURIComponent(
        slug,
      )}`;

    redirect(
      `${REGISTER_ROUTE}?next=${encodeURIComponent(
        next,
      )}`,
    );
  }

  const {
    data: business,
    error:
      businessError,
  } =
    await supabase
      .from("businesses")
      .select(`
        id,
        name,
        slug,
        category,
        description,
        logo_url,
        cover_url,
        phone,
        email,
        facebook_url,
        instagram_url,
        website_url,
        address,
        barangay,
        city,
        province,
        latitude,
        longitude,
        status,
        is_verified,
        created_by,
        created_at,
        updated_at
      `)
      .eq("slug", slug)
      .eq(
        "status",
        "approved",
      )
      .maybeSingle();

  if (
    businessError ||
    !business
  ) {
    if (
      businessError
    ) {
      console.error(
        "[CAFÉTA] Failed to load business:",
        businessError,
      );
    }

    notFound();
  }

  let membership:
    | BusinessMember
    | null = null;

  if (
    business.created_by !==
    user.id
  ) {
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "business_members",
        )
        .select("role")
        .eq(
          "business_id",
          business.id,
        )
        .eq(
          "user_id",
          user.id,
        )
        .maybeSingle();

    if (error) {
      console.error(
        "[CAFÉTA] Failed to load business membership:",
        error,
      );
    }

    membership =
      data as
        | BusinessMember
        | null;
  }

  const isCreator =
    business.created_by ===
    user.id;

  const isOwner =
    membership?.role ===
    "owner";

  const isManager =
    membership?.role ===
    "manager";

  const canEdit =
    isCreator ||
    isOwner ||
    isManager;

  const [
    hoursResult,
    categoriesResult,
    itemsResult,
    reviewsResult,
    savedResult,
    memoriesResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "business_hours",
        )
        .select(`
          id,
          business_id,
          day_of_week,
          opens_at,
          closes_at,
          is_closed
        `)
        .eq(
          "business_id",
          business.id,
        )
        .order(
          "day_of_week",
          {
            ascending:
              true,
          },
        ),

      supabase
        .from(
          "menu_categories",
        )
        .select(`
          id,
          business_id,
          name,
          sort_order
        `)
        .eq(
          "business_id",
          business.id,
        )
        .order(
          "sort_order",
          {
            ascending:
              true,
          },
        )
        .order(
          "created_at",
          {
            ascending:
              true,
          },
        ),

      supabase
        .from(
          "menu_items",
        )
        .select(`
          id,
          business_id,
          category_id,
          name,
          description,
          price,
          image_url,
          is_available,
          sort_order
        `)
        .eq(
          "business_id",
          business.id,
        )
        .order(
          "sort_order",
          {
            ascending:
              true,
          },
        )
        .order(
          "created_at",
          {
            ascending:
              true,
          },
        ),

      supabase
        .from("reviews")
        .select(`
          id,
          user_id,
          business_id,
          rating,
          content,
          created_at,
          updated_at,

          profile:profiles (
            id,
            full_name,
            username,
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
        ),

      supabase
        .from(
          "saved_businesses",
        )
        .select("id")
        .eq(
          "user_id",
          user.id,
        )
        .eq(
          "business_id",
          business.id,
        )
        .maybeSingle(),

      supabase
        .from("memories")
        .select(`
          id,
          image_url,
          caption,
          created_at,

          author:profiles!memories_user_id_fkey (
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
        )
        .limit(6),
    ]);

  if (
    hoursResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load business hours:",
      hoursResult.error,
    );
  }

  if (
    categoriesResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load menu categories:",
      categoriesResult.error,
    );
  }

  if (
    itemsResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load menu items:",
      itemsResult.error,
    );
  }

  if (
    reviewsResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load reviews:",
      reviewsResult.error,
    );
  }

  if (
    savedResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load saved state:",
      savedResult.error,
    );
  }

  if (
    memoriesResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load business memories:",
      memoriesResult.error,
    );
  }

  const hours =
    (
      hoursResult.data ??
      []
    ) as BusinessHour[];

  const categories =
    (
      categoriesResult.data ??
      []
    ) as MenuCategory[];

  const menuItems =
    (
      itemsResult.data ??
      []
    ) as MenuItem[];

  const rawReviews =
    (
      reviewsResult.data ??
      []
    ) as Review[];

  const reviews =
    rawReviews.map(
      (review) => {
        const profile =
          Array.isArray(
            review.profile,
          )
            ? review
                .profile[0] ??
              null
            : review.profile;

        return {
          id:
            review.id,

          user_id:
            review.user_id,

          rating:
            Number(
              review.rating,
            ),

          content:
            review.content,

          created_at:
            review.created_at,

          profile,
        };
      },
    );

  const rawMemories =
    (
      memoriesResult.data ??
      []
    ) as unknown as RawBusinessMemory[];

  const memories: BusinessMemoryPreview[] =
    rawMemories.map(
      (memory) => {
        const author =
          Array.isArray(
            memory.author,
          )
            ? memory
                .author[0] ??
              null
            : memory.author;

        return {
          id:
            memory.id,

          image_url:
            memory.image_url,

          caption:
            memory.caption,

          created_at:
            memory.created_at,

          author,
        };
      },
    );

  const reviewCount =
    reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce(
          (
            total,
            review,
          ) =>
            total +
            review.rating,
          0,
        ) /
        reviewCount
      : 0;

  return (
    <BusinessProfileClient
      business={{
        id:
          business.id,

        name:
          business.name,

        slug:
          business.slug,

        category:
          business.category,

        description:
          business.description,

        logo_url:
          business.logo_url,

        cover_url:
          business.cover_url,

        phone:
          business.phone,

        email:
          business.email,

        facebook_url:
          business.facebook_url,

        instagram_url:
          business.instagram_url,

        website_url:
          business.website_url,

        address:
          business.address,

        barangay:
          business.barangay,

        city:
          business.city,

        province:
          business.province,

        latitude:
          Number(
            business.latitude,
          ),

        longitude:
          Number(
            business.longitude,
          ),

        is_verified:
          business.is_verified ===
          true,
      }}
      hours={hours}
      categories={
        categories
      }
      menuItems={
        menuItems.map(
          (item) => ({
            ...item,

            price:
              Number(
                item.price,
              ),
          }),
        )
      }
      reviews={
        reviews
      }
      memories={
        memories
      }
      averageRating={
        averageRating
      }
      reviewCount={
        reviewCount
      }
      initialSaved={
        Boolean(
          savedResult.data,
        )
      }
      canEdit={
        canEdit
      }
    />
  );
}