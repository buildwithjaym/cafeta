import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowRight,
  Coffee,
  Sparkles,
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

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title: "Explore | CAFÉTA",
  description:
    "Discover cafés, coffee shops, milk tea spots, and bakeries around Basilan.",
};

/* =========================================================
   TYPES
========================================================= */

type BusinessCategory =
  | "coffee_shop"
  | "milk_tea"
  | "cafe"
  | "bakery";

type ExploreBusiness = {
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

  total_count: number;
};

type ExploreRpcRow = {
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

  avg_rating:
    | number
    | string
    | null;

  review_count:
    | number
    | string
    | null;

  is_saved:
    | boolean
    | null;

  today_opens_at:
    | string
    | null;

  today_closes_at:
    | string
    | null;

  today_is_closed:
    | boolean
    | null;

  total_count:
    | number
    | string
    | null;
};

type ExplorePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
};

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 12;

const ALLOWED_CATEGORIES:
  BusinessCategory[] = [
    "coffee_shop",
    "milk_tea",
    "cafe",
    "bakery",
  ];

/* =========================================================
   PAGE
========================================================= */

export default async function ExplorePage({
  searchParams,
}: ExplorePageProps) {
  const params =
    await searchParams;

  /* -------------------------------------------------------
     URL PARAMS
  ------------------------------------------------------- */

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

  const parsedPage =
    Number.parseInt(
      params.page ?? "1",
      10,
    );

  const page =
    Number.isFinite(parsedPage) &&
    parsedPage > 0
      ? parsedPage
      : 1;

  const offset =
    (page - 1) *
    PAGE_SIZE;

  /* -------------------------------------------------------
     SUPABASE
  ------------------------------------------------------- */

  const supabase =
    await createClient();

  let businesses:
    ExploreBusiness[] = [];

  let totalCount = 0;

  let loadFailed = false;

  /* =======================================================
     PRIMARY QUERY — RPC
  ======================================================= */

  const rpcResult =
    await supabase.rpc(
      "explore_businesses",
      {
        search_term:
          search || null,

        category_filter:
          category,

        page_limit:
          PAGE_SIZE,

        page_offset:
          offset,
      },
    );

  if (!rpcResult.error) {
    const rows =
      (
        rpcResult.data ??
        []
      ) as ExploreRpcRow[];

    businesses =
      rows.map(
        normalizeRpcBusiness,
      );

    totalCount =
      businesses[0]
        ?.total_count ??
      0;
  }

  /* =======================================================
     FALLBACK QUERY

     Explore still works even if the RPC
     hasn't been created yet.
  ======================================================= */

  else {
    let query =
      supabase
        .from("businesses")
        .select(
          `
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
            is_verified
          `,
          {
            count: "exact",
          },
        )
        .eq(
          "status",
          "approved",
        );

    /* CATEGORY FILTER */

    if (category) {
      query =
        query.eq(
          "category",
          category,
        );
    }

    /* SEARCH */

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
        query =
          query.or(
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

    const fallbackResult =
      await query
        .order(
          "is_verified",
          {
            ascending: false,
          },
        )
        .order(
          "name",
          {
            ascending: true,
          },
        )
        .range(
          offset,
          offset +
            PAGE_SIZE -
            1,
        );

    if (
      fallbackResult.error
    ) {
      loadFailed = true;

      console.error(
        "Unable to load Explore businesses:",
        {
          rpc:
            rpcResult.error
              .message,

          fallback:
            fallbackResult.error
              .message,
        },
      );
    } else {
      totalCount =
        fallbackResult.count ??
        0;

      businesses =
        (
          fallbackResult.data ??
          []
        ).map(
          (
            business,
          ): ExploreBusiness => ({
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
              Boolean(
                business.is_verified,
              ),

            /*
             * These enhanced fields normally
             * come from explore_businesses().
             */

            avg_rating: 0,

            review_count: 0,

            is_saved: false,

            today_opens_at:
              null,

            today_closes_at:
              null,

            today_is_closed:
              true,

            total_count:
              fallbackResult.count ??
              0,
          }),
        );
    }
  }

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalCount /
          PAGE_SIZE,
      ),
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className="
        min-h-[calc(100dvh-72px)]
        bg-[#f7f8f6]
        pb-28
        md:pb-14
      "
    >
      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-black/[0.05]
          bg-white
        "
      >
        {/* Background decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-48
            size-[420px]
            rounded-full
            bg-[#006241]/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-48
            left-[15%]
            size-[360px]
            rounded-full
            bg-[#d4e9e2]/20
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
            md:py-12
            lg:px-8
          "
        >
          <div
            className="
              flex
              flex-col
              justify-between
              gap-8
              lg:flex-row
              lg:items-end
            "
          >
            {/* Hero copy */}

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
                  mb-4
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#006241]
                "
              >
                <Sparkles
                  className="size-3.5"
                />

                Discover Basilan
              </div>

              <h1
                className="
                  max-w-[680px]
                  text-[2.5rem]
                  font-black
                  leading-[1.02]
                  tracking-[-0.055em]
                  text-[#17211c]
                  sm:text-5xl
                  lg:text-[3.6rem]
                "
              >
                Find your next
                <br
                  className="
                    hidden
                    sm:block
                  "
                />{" "}
                favorite place.
              </h1>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-black/45
                  sm:text-base
                "
              >
                Discover cafés,
                coffee shops,
                milk-tea spots,
                bakeries, and local
                favorites around
                Basilan.
              </p>
            </div>

            {/* Desktop map link */}

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

          {/* =================================================
              YOUR EXISTING CONTROLS COMPONENT
          ================================================= */}

          <div
            className="
              mt-8
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

      {/* =================================================
          RESULTS
      ================================================= */}

      <section
        className="
          mx-auto
          max-w-[1440px]
          px-5
          py-9
          sm:px-6
          md:py-12
          lg:px-8
        "
      >
        {/* Heading */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-6
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
                text-[#006241]
              "
            >
              {search ||
              category
                ? "Search results"
                : "Discover"}
            </p>

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
              {search
                ? `Places matching “${search}”`
                : category
                  ? categoryLabel(
                      category,
                    )
                  : "Places worth trying"}
            </h2>

            {!loadFailed &&
              totalCount >
                0 && (
                <p
                  className="
                    mt-2
                    text-sm
                    text-black/40
                  "
                >
                  {totalCount}{" "}
                  {totalCount ===
                  1
                    ? "place"
                    : "places"}{" "}
                  found
                </p>
              )}
          </div>

          <Link
            href="/map"
            className="
              group
              hidden
              items-center
              gap-1.5
              text-sm
              font-bold
              text-[#006241]
              sm:flex
            "
          >
            View map

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

        {/* =================================================
            ERROR
        ================================================= */}

        {loadFailed ? (
          <ExploreError />
        ) : businesses.length ===
          0 ? (
          /* ===============================================
             YOUR EXISTING EMPTY STATE COMPONENT
          =============================================== */

          <ExploreEmptyState
            search={search}
            filtered={Boolean(
              search ||
                category,
            )}
          />
        ) : (
          <>
            {/* =============================================
                YOUR EXISTING BUSINESS CARD COMPONENT
            ============================================= */}

            <div
              className="
                mt-7
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

            {/* Pagination */}

            {totalPages >
              1 && (
              <Pagination
                page={page}
                totalPages={
                  totalPages
                }
                search={
                  search
                }
                category={
                  category
                }
              />
            )}
          </>
        )}
      </section>

      {/* =================================================
          QUICK DISCOVERY STRIP
      ================================================= */}

      {!search &&
        !category &&
        businesses.length >
          0 && (
          <section
            className="
              mx-auto
              max-w-[1440px]
              px-5
              pb-12
              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                rounded-[28px]
                border
                border-black/[0.055]
                bg-white
                px-5
                py-6
                sm:px-7
              "
            >
              <div
                className="
                  flex
                  flex-col
                  justify-between
                  gap-5
                  sm:flex-row
                  sm:items-center
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-[#006241]
                    "
                  >
                    Browse your way
                  </p>

                  <h2
                    className="
                      mt-1.5
                      text-xl
                      font-black
                      tracking-[-0.035em]
                      text-[#17211c]
                    "
                  >
                    What are you
                    looking for?
                  </h2>
                </div>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  <DiscoveryLink
                    href="/explore?category=coffee_shop"
                    label="Coffee shops"
                  />

                  <DiscoveryLink
                    href="/explore?category=cafe"
                    label="Cafés"
                  />

                  <DiscoveryLink
                    href="/explore?category=milk_tea"
                    label="Milk tea"
                  />

                  <DiscoveryLink
                    href="/explore?category=bakery"
                    label="Bakeries"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

      {/* =================================================
          MAP DISCOVERY SECTION
      ================================================= */}

      {!search &&
        !category && (
          <section
            className="
              mx-auto
              max-w-[1440px]
              px-5
              pb-12
              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-black/[0.055]
                bg-[#e8f2ed]
                px-6
                py-8
                sm:px-9
                sm:py-10
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-24
                  size-64
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
                  gap-7
                  sm:flex-row
                  sm:items-center
                "
              >
                <div>
                  <div
                    className="
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-full
                      bg-[#006241]
                      text-white
                    "
                  >
                    <Coffee
                      className="size-[18px]"
                    />
                  </div>

                  <h2
                    className="
                      mt-5
                      text-2xl
                      font-black
                      tracking-[-0.04em]
                      text-[#17211c]
                      sm:text-3xl
                    "
                  >
                    Explore places
                    near you.
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
                    Open the CAFÉTA
                    map to discover
                    cafés and local
                    spots by location.
                  </p>
                </div>

                <Link
                  href="/map"
                  className="
                    group
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
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#00754a]
                    hover:shadow-lg
                  "
                >
                  Open map

                  <ArrowRight
                    className="
                      size-4
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>
            </div>
          </section>
        )}

      {/* =================================================
          BUSINESS OWNER CTA
      ================================================= */}

      <section
        className="
          mx-auto
          max-w-[1440px]
          px-5
          pb-12
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[30px]
            bg-[#006241]
            px-6
            py-8
            text-white
            shadow-[0_16px_50px_rgba(0,98,65,0.12)]
            sm:px-9
            sm:py-10
          "
        >
          {/* Decorative circles */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-28
              size-72
              rounded-full
              border
              border-white/10
              transition-transform
              duration-700
              group-hover:scale-110
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              right-20
              size-64
              rounded-full
              border
              border-white/10
              transition-transform
              duration-700
              group-hover:scale-110
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              justify-between
              gap-7
              sm:flex-row
              sm:items-center
            "
          >
            <div>
              <div
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                "
              >
                <Coffee
                  className="size-[18px]"
                />
              </div>

              <h2
                className="
                  mt-5
                  text-2xl
                  font-black
                  tracking-[-0.04em]
                  sm:text-3xl
                "
              >
                Own a café or
                milk-tea shop?
              </h2>

              <p
                className="
                  mt-2
                  max-w-lg
                  text-sm
                  leading-6
                  text-white/65
                "
              >
                Create your
                business on CAFÉTA
                and help more people
                discover your place.
              </p>
            </div>

            <Link
              href="/business/create"
              className="
                group/button
                flex
                h-11
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                bg-white
                px-5
                text-sm
                font-bold
                text-[#006241]
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-lg
                active:translate-y-0
              "
            >
              Create your business

              <ArrowRight
                className="
                  size-4
                  transition-transform
                  group-hover/button:translate-x-1
                "
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   SMALL PAGE-ONLY COMPONENTS
========================================================= */

function DiscoveryLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        rounded-full
        border
        border-black/[0.07]
        bg-[#f7f8f6]
        px-4
        py-2.5
        text-xs
        font-bold
        text-[#17211c]
        transition-all
        duration-200
        hover:border-[#006241]/20
        hover:bg-[#e8f2ed]
        hover:text-[#006241]
      "
    >
      {label}
    </Link>
  );
}

/* =========================================================
   ERROR STATE
========================================================= */

function ExploreError() {
  return (
    <div
      className="
        mt-7
        rounded-[28px]
        border
        border-black/[0.06]
        bg-white
        px-6
        py-16
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          size-12
          items-center
          justify-center
          rounded-full
          bg-[#e8f2ed]
          text-[#006241]
        "
      >
        <Coffee
          className="size-5"
        />
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-black
          tracking-[-0.03em]
          text-[#17211c]
        "
      >
        Places are unavailable
        right now
      </h3>

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
        retrieve businesses from
        the database. Refresh the
        page and try again.
      </p>
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
  page,
  totalPages,
  search,
  category,
}: {
  page: number;

  totalPages: number;

  search: string;

  category:
    | BusinessCategory
    | null;
}) {
  function buildHref(
    targetPage: number,
  ) {
    const params =
      new URLSearchParams();

    if (search) {
      params.set(
        "q",
        search,
      );
    }

    if (category) {
      params.set(
        "category",
        category,
      );
    }

    if (targetPage > 1) {
      params.set(
        "page",
        String(
          targetPage,
        ),
      );
    }

    const query =
      params.toString();

    return query
      ? `/explore?${query}`
      : "/explore";
  }

  return (
    <div
      className="
        mt-10
        flex
        items-center
        justify-center
        gap-3
      "
    >
      {page > 1 && (
        <Link
          href={buildHref(
            page - 1,
          )}
          className="
            rounded-full
            border
            border-black/[0.07]
            bg-white
            px-5
            py-2.5
            text-xs
            font-bold
            text-[#17211c]
            transition
            hover:border-[#006241]/20
            hover:text-[#006241]
          "
        >
          Previous
        </Link>
      )}

      <span
        className="
          text-xs
          font-semibold
          text-black/35
        "
      >
        {page} of{" "}
        {totalPages}
      </span>

      {page <
        totalPages && (
        <Link
          href={buildHref(
            page + 1,
          )}
          className="
            rounded-full
            bg-[#006241]
            px-5
            py-2.5
            text-xs
            font-bold
            text-white
            transition
            hover:bg-[#00754a]
          "
        >
          Next
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   RPC NORMALIZER
========================================================= */

function normalizeRpcBusiness(
  business:
    ExploreRpcRow,
): ExploreBusiness {
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
      Boolean(
        business.is_verified,
      ),

    avg_rating:
      Number(
        business.avg_rating ??
          0,
      ),

    review_count:
      Number(
        business.review_count ??
          0,
      ),

    is_saved:
      Boolean(
        business.is_saved,
      ),

    today_opens_at:
      business.today_opens_at,

    today_closes_at:
      business.today_closes_at,

    today_is_closed:
      Boolean(
        business.today_is_closed,
      ),

    total_count:
      Number(
        business.total_count ??
          0,
      ),
  };
}

/* =========================================================
   CATEGORY LABEL
========================================================= */

function categoryLabel(
  category:
    BusinessCategory,
) {
  switch (category) {
    case "coffee_shop":
      return "Coffee shops";

    case "milk_tea":
      return "Milk tea";

    case "cafe":
      return "Cafés";

    case "bakery":
      return "Bakeries";
  }
}