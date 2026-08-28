import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowRight,
  Coffee,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import {
  ExploreBusinessCard,
} from "@/components/explore/explore-business-card";

import {
  ExploreControls,
} from "@/components/explore/explore-controls";

import {
  ExploreEmptyState,
} from "@/components/explore/explore-empty-state";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Explore | CAFÉTA",
  description:
    "Discover cafés, coffee shops, milk tea spots, and local favorites around Basilan.",
};

type BusinessCategory =
  | "coffee_shop"
  | "cafe"
  | "milk_tea"
  | "bakery_cafe"
  | "restaurant_cafe"
  | "other";

export type ExploreBusiness = {
  id: string;
  name: string;
  slug: string;

  category: string;
  description: string | null;

  cover_url: string | null;
  logo_url: string | null;

  address: string;
  barangay: string | null;
  city: string;
  province: string;

  latitude: number | null;
  longitude: number | null;

  is_verified: boolean;

  avg_rating: number;
  review_count: number;

  is_saved: boolean;

  today_opens_at: string | null;
  today_closes_at: string | null;
  today_is_closed: boolean;

  created_at: string;
};

type BusinessRow = {
  id: string;
  name: string;
  slug: string;

  category: string;
  description: string | null;

  cover_url: string | null;
  logo_url: string | null;

  address: string;
  barangay: string | null;
  city: string;
  province: string;

  latitude:
    | number
    | string
    | null;

  longitude:
    | number
    | string
    | null;

  is_verified:
    | boolean
    | null;

  created_at: string;
};

type ReviewRow = {
  business_id: string;
  rating:
    | number
    | string
    | null;
};

type SavedRow = {
  business_id: string;
};

type ExplorePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
};

const ALLOWED_CATEGORIES:
  BusinessCategory[] = [
    "coffee_shop",
    "cafe",
    "milk_tea",
    "bakery_cafe",
    "restaurant_cafe",
    "other",
  ];

export default async function ExplorePage({
  searchParams,
}: ExplorePageProps) {
  const params =
    await searchParams;

  const search =
    params.q?.trim() ?? "";

  const requestedCategory =
    params.category ?? "";

  const category =
    ALLOWED_CATEGORIES.includes(
      requestedCategory as BusinessCategory,
    )
      ? (requestedCategory as BusinessCategory)
      : null;

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  let businessQuery =
    supabase
      .from("businesses")
      .select(`
        id,
        name,
        slug,
        category,
        description,
        cover_url,
        logo_url,
        address,
        barangay,
        city,
        province,
        latitude,
        longitude,
        is_verified,
        created_at
      `)
      .eq(
        "status",
        "approved",
      );

  if (category) {
    businessQuery =
      businessQuery.eq(
        "category",
        category,
      );
  }

  if (search) {
    const safeSearch =
      search
        .replace(
          /[%_]/g,
          "",
        )
        .replace(
          /,/g,
          " ",
        )
        .trim();

    if (safeSearch) {
      businessQuery =
        businessQuery.or(
          [
            `name.ilike.%${safeSearch}%`,
            `description.ilike.%${safeSearch}%`,
            `address.ilike.%${safeSearch}%`,
            `barangay.ilike.%${safeSearch}%`,
            `city.ilike.%${safeSearch}%`,
            `province.ilike.%${safeSearch}%`,
          ].join(","),
        );
    }
  }

  const {
    data: businessData,
    error: businessError,
  } =
    await businessQuery
      .order(
        "is_verified",
        {
          ascending: false,
        },
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      );

  if (businessError) {
    console.error(
      "[CAFÉTA] Unable to load Explore businesses:",
      businessError,
    );
  }

  const rows =
    (businessData ??
      []) as BusinessRow[];

  const businessIds =
    rows.map(
      (business) =>
        business.id,
    );

  let savedRows:
    SavedRow[] = [];

  let reviewRows:
    ReviewRow[] = [];

  if (
    businessIds.length > 0
  ) {
    const [
      savedResult,
      reviewsResult,
    ] = await Promise.all([
      user
        ? supabase
            .from(
              "saved_businesses",
            )
            .select(
              "business_id",
            )
            .eq(
              "user_id",
              user.id,
            )
            .in(
              "business_id",
              businessIds,
            )
        : Promise.resolve({
            data: [],
            error: null,
          }),

      supabase
        .from("reviews")
        .select(`
          business_id,
          rating
        `)
        .in(
          "business_id",
          businessIds,
        ),
    ]);

    if (
      savedResult.error
    ) {
      console.error(
        "[CAFÉTA] Unable to load saved businesses:",
        savedResult.error,
      );
    }

    if (
      reviewsResult.error
    ) {
      console.error(
        "[CAFÉTA] Unable to load business reviews:",
        reviewsResult.error,
      );
    }

    savedRows =
      (savedResult.data ??
        []) as SavedRow[];

    reviewRows =
      (reviewsResult.data ??
        []) as ReviewRow[];
  }

  const savedBusinessIds =
    new Set(
      savedRows.map(
        (row) =>
          row.business_id,
      ),
    );

  const reviewStats =
    buildReviewStats(
      reviewRows,
    );

  const businesses:
    ExploreBusiness[] =
    rows.map(
      (business) => {
        const stats =
          reviewStats.get(
            business.id,
          );

        return {
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

          cover_url:
            business.cover_url,

          logo_url:
            business.logo_url,

          address:
            business.address,

          barangay:
            business.barangay,

          city:
            business.city,

          province:
            business.province,

          latitude:
            business.latitude ===
            null
              ? null
              : Number(
                  business.latitude,
                ),

          longitude:
            business.longitude ===
            null
              ? null
              : Number(
                  business.longitude,
                ),

          is_verified:
            business.is_verified ===
            true,

          avg_rating:
            stats?.average ??
            0,

          review_count:
            stats?.count ??
            0,

          is_saved:
            savedBusinessIds.has(
              business.id,
            ),

          today_opens_at:
            null,

          today_closes_at:
            null,

          today_is_closed:
            false,

          created_at:
            business.created_at,
        };
      },
    );

  const hasFilters =
    Boolean(
      search ||
        category,
    );

  const trending =
    [...businesses]
      .filter(
        (business) =>
          business.review_count >
          0,
      )
      .sort(
        (
          first,
          second,
        ) => {
          if (
            second.review_count !==
            first.review_count
          ) {
            return (
              second.review_count -
              first.review_count
            );
          }

          return (
            second.avg_rating -
            first.avg_rating
          );
        },
      )
      .slice(0, 6);

  const newPlaces =
    [...businesses]
      .sort(
        (
          first,
          second,
        ) =>
          new Date(
            second.created_at,
          ).getTime() -
          new Date(
            first.created_at,
          ).getTime(),
      )
      .slice(0, 6);

  return (
    <main
      className="
        min-h-[calc(100dvh-72px)]
        bg-[#f7f8f6]
        pb-28

        md:pb-16
      "
    >
      <section
        className="
          relative
          overflow-hidden

          border-b
          border-black/[0.05]

          bg-white
        "
      >
        <div
          className="
            pointer-events-none

            absolute
            -right-32
            -top-40

            size-[420px]

            rounded-full

            bg-[#006241]/[0.04]

            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none

            absolute
            -bottom-40
            left-[10%]

            size-[320px]

            rounded-full

            bg-[#dcebe3]/40

            blur-3xl
          "
        />

        <div
          className="
            relative

            mx-auto
            max-w-[1440px]

            px-5
            py-8

            sm:px-6
            md:py-11
            lg:px-8
          "
        >
          <div
            className="
              flex
              flex-col
              justify-between
              gap-7

              lg:flex-row
              lg:items-end
            "
          >
            <div
              className="
                animate-in
                fade-in
                slide-in-from-bottom-2
                duration-500
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#006241]
                "
              >
                <Sparkles className="size-3.5" />

                Discover Basilan
              </div>

              <h1
                className="
                  mt-3

                  max-w-[650px]

                  text-[2.4rem]
                  font-black
                  leading-[1.02]
                  tracking-[-0.055em]
                  text-[#17211c]

                  sm:text-5xl
                  lg:text-[3.5rem]
                "
              >
                Find the place that fits your moment.
              </h1>

              <p
                className="
                  mt-3

                  max-w-lg

                  text-sm
                  leading-6
                  text-black/45

                  sm:text-base
                "
              >
                Discover coffee,
                cafés, milk tea,
                and local favorites
                around Basilan.
              </p>
            </div>

            <Link
              href="/map"
              className="
                group

                hidden
                items-center
                gap-2

                text-sm
                font-bold
                text-[#006241]

                lg:flex
              "
            >
              <MapPin className="size-4" />

              Explore the map

              <ArrowRight
                className="
                  size-4

                  transition-transform
                  duration-200

                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>

          <div
            className="
              mt-7

              animate-in
              fade-in
              slide-in-from-bottom-2
              duration-500
            "
          >
            <ExploreControls
              search={search}
              category={
                category
              }
            />
          </div>
        </div>
      </section>

      <div
        className="
          mx-auto
          max-w-[1440px]

          px-5
          py-8

          sm:px-6
          md:py-10
          lg:px-8
        "
      >
        {businessError ? (
          <ExploreError />
        ) : businesses.length ===
          0 ? (
          <ExploreEmptyState
            search={search}
            filtered={
              hasFilters
            }
          />
        ) : hasFilters ? (
          <section>
            <SectionHeader
              eyebrow="Search results"
              title={
                search
                  ? `Places matching “${search}”`
                  : category
                    ? categoryLabel(
                        category,
                      )
                    : "Explore"
              }
              description={`${businesses.length} ${
                businesses.length ===
                1
                  ? "place"
                  : "places"
              } found`}
            />

            <div
              className="
                mt-6

                grid
                gap-5

                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {businesses.map(
                (
                  business,
                  index,
                ) => (
                  <ExploreBusinessCard
                    key={
                      business.id
                    }
                    business={
                      business
                    }
                    index={
                      index
                    }
                  />
                ),
              )}
            </div>
          </section>
        ) : (
          <div className="space-y-12">
            {trending.length >
              0 && (
              <section>
                <SectionHeader
                  icon={
                    <TrendingUp className="size-[18px]" />
                  }
                  eyebrow="Popular right now"
                  title="Trending Now"
                  description="Places the CAFÉTA community is reviewing and discovering."
                />

                <div
                  className="
                    mt-6

                    grid
                    gap-5

                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >
                  {trending.map(
                    (
                      business,
                      index,
                    ) => (
                      <ExploreBusinessCard
                        key={
                          business.id
                        }
                        business={
                          business
                        }
                        index={
                          index
                        }
                      />
                    ),
                  )}
                </div>
              </section>
            )}

            <section>
              <SectionHeader
                icon={
                  <Sparkles className="size-[18px]" />
                }
                eyebrow="Fresh discoveries"
                title="New on CAFÉTA"
                description="Recently added places waiting to be discovered."
              />

              <div
                className="
                  mt-6

                  grid
                  gap-5

                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {newPlaces.map(
                  (
                    business,
                    index,
                  ) => (
                    <ExploreBusinessCard
                      key={
                        business.id
                      }
                      business={
                        business
                      }
                      index={
                        index
                      }
                    />
                  ),
                )}
              </div>
            </section>

            <section>
              <SectionHeader
                icon={
                  <Coffee className="size-[18px]" />
                }
                eyebrow="Browse Basilan"
                title="All Places"
                description={`${businesses.length} ${
                  businesses.length ===
                  1
                    ? "place"
                    : "places"
                } available to explore.`}
              />

              <div
                className="
                  mt-6

                  grid
                  gap-5

                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {businesses.map(
                  (
                    business,
                    index,
                  ) => (
                    <ExploreBusinessCard
                      key={
                        business.id
                      }
                      business={
                        business
                      }
                      index={
                        index
                      }
                    />
                  ),
                )}
              </div>
            </section>

            <section
              className="
                relative
                overflow-hidden

                rounded-[28px]

                bg-[#e8f2ed]

                px-6
                py-8

                sm:px-8
                sm:py-9
              "
            >
              <div
                className="
                  pointer-events-none

                  absolute
                  -right-16
                  -top-20

                  size-56

                  rounded-full

                  bg-[#006241]/5
                "
              />

              <div
                className="
                  relative

                  flex
                  flex-col
                  justify-between
                  gap-6

                  sm:flex-row
                  sm:items-center
                "
              >
                <div>
                  <div
                    className="
                      flex
                      size-9
                      items-center
                      justify-center

                      rounded-full

                      bg-[#006241]

                      text-white
                    "
                  >
                    <MapPin className="size-4" />
                  </div>

                  <h2
                    className="
                      mt-4

                      text-2xl
                      font-black
                      tracking-[-0.04em]
                      text-[#17211c]
                    "
                  >
                    Explore by
                    location.
                  </h2>

                  <p
                    className="
                      mt-2

                      max-w-lg

                      text-sm
                      leading-6
                      text-black/45
                    "
                  >
                    Find cafés and
                    milk-tea shops
                    around Basilan
                    using the CAFÉTA
                    map.
                  </p>
                </div>

                <Link
                  href="/map"
                  className="
                    flex
                    h-11
                    shrink-0
                    items-center
                    justify-center
                    gap-2

                    rounded-full

                    bg-[#006241]

                    px-5

                    text-sm
                    font-bold
                    text-white

                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:bg-[#00754a]
                  "
                >
                  Open map

                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon?: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        flex
        items-end
        justify-between
        gap-5
      "
    >
      <div>
        <div
          className="
            flex
            items-center
            gap-2

            text-[#006241]
          "
        >
          {icon && (
            <span
              className="
                flex
                size-8
                items-center
                justify-center

                rounded-full

                bg-[#e8f2ed]
              "
            >
              {icon}
            </span>
          )}

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
            "
          >
            {eyebrow}
          </p>
        </div>

        <h2
          className="
            mt-2

            text-2xl
            font-black
            tracking-[-0.04em]
            text-[#17211c]

            sm:text-3xl
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1.5

            text-sm
            text-black/40
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function ExploreError() {
  return (
    <div
      className="
        rounded-[26px]

        border
        border-black/[0.06]

        bg-white

        px-6
        py-14

        text-center
      "
    >
      <div
        className="
          mx-auto

          flex
          size-11
          items-center
          justify-center

          rounded-full

          bg-[#e8f2ed]

          text-[#006241]
        "
      >
        <Coffee className="size-5" />
      </div>

      <h2
        className="
          mt-4

          text-lg
          font-black
          tracking-[-0.03em]
          text-[#17211c]
        "
      >
        Places are unavailable
      </h2>

      <p
        className="
          mx-auto
          mt-2
          max-w-sm

          text-sm
          leading-6
          text-black/40
        "
      >
        CAFÉTA couldn&apos;t
        retrieve businesses right
        now. Refresh the page and
        try again.
      </p>
    </div>
  );
}

function buildReviewStats(
  reviews: ReviewRow[],
) {
  const accumulator =
    new Map<
      string,
      {
        total: number;
        count: number;
      }
    >();

  for (const review of reviews) {
    const rating =
      Number(
        review.rating ?? 0,
      );

    if (
      !Number.isFinite(
        rating,
      )
    ) {
      continue;
    }

    const current =
      accumulator.get(
        review.business_id,
      ) ?? {
        total: 0,
        count: 0,
      };

    current.total +=
      rating;

    current.count += 1;

    accumulator.set(
      review.business_id,
      current,
    );
  }

  const result =
    new Map<
      string,
      {
        average: number;
        count: number;
      }
    >();

  for (
    const [
      businessId,
      stats,
    ] of accumulator
  ) {
    result.set(
      businessId,
      {
        average:
          stats.count > 0
            ? stats.total /
              stats.count
            : 0,

        count:
          stats.count,
      },
    );
  }

  return result;
}

function categoryLabel(
  category:
    BusinessCategory,
) {
  switch (category) {
    case "coffee_shop":
      return "Coffee Shops";

    case "cafe":
      return "Cafés";

    case "milk_tea":
      return "Milk Tea";

    case "bakery_cafe":
      return "Bakery Cafés";

    case "restaurant_cafe":
      return "Restaurant Cafés";

    case "other":
      return "Other Places";
  }
}