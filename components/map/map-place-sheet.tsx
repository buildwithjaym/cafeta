"use client";

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  Coffee,
  Flame,
  Images,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  MapBusiness,
} from "@/lib/map/types";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  business: MapBusiness;

  onDirections: () => void;

  onClose: () => void;
};

type ReviewPreview = {
  id: string;

  rating: number;

  content: string | null;

  created_at: string;

  author: {
    id: string;

    username: string | null;

    full_name: string | null;

    avatar_url: string | null;
  } | null;
};

type RawReview = {
  id: string;

  rating: number;

  content: string | null;

  created_at: string;

  author:
    | ReviewPreview["author"]
    | NonNullable<
        ReviewPreview["author"]
      >[]
    | null;
};

type ReviewsState = {
  averageRating: number;

  reviewCount: number;

  preview: ReviewPreview | null;
};

const CATEGORY_LABELS: Record<
  MapBusiness["category"],
  string
> = {
  coffee_shop:
    "Coffee Shop",

  cafe:
    "Café",

  milk_tea:
    "Milk Tea",

  bakery_cafe:
    "Bakery Café",

  restaurant_cafe:
    "Restaurant Café",

  other:
    "Local Spot",
};

export function MapPlaceSheet({
  business,
  onDirections,
  onClose,
}: Props) {
  const [
    logoFailed,
    setLogoFailed,
  ] = useState(false);

  const [
    reviewAvatarFailed,
    setReviewAvatarFailed,
  ] = useState(false);

  const [
    reviews,
    setReviews,
  ] = useState<ReviewsState>({
    averageRating: 0,
    reviewCount: 0,
    preview: null,
  });

  const [
    reviewsLoading,
    setReviewsLoading,
  ] = useState(true);

  useEffect(() => {
    setLogoFailed(false);

    setReviewAvatarFailed(
      false,
    );
  }, [
    business.id,
    business.logo_url,
  ]);

  useEffect(() => {
    let cancelled =
      false;

    async function loadReviews() {
      setReviewsLoading(
        true,
      );

      setReviews({
        averageRating: 0,
        reviewCount: 0,
        preview: null,
      });

      try {
        const supabase =
          createClient();

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "reviews",
            )
            .select(`
              id,
              rating,
              content,
              created_at,

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

        if (error) {
          throw error;
        }

        if (cancelled) {
          return;
        }

        const rawReviews =
          (
            data ??
            []
          ) as unknown as RawReview[];

        const reviewCount =
          rawReviews.length;

        const averageRating =
          reviewCount > 0
            ? rawReviews.reduce(
                (
                  total,
                  review,
                ) =>
                  total +
                  Number(
                    review.rating,
                  ),
                0,
              ) /
              reviewCount
            : 0;

        const previewSource =
          rawReviews.find(
            (review) =>
              Boolean(
                review.content
                  ?.trim(),
              ),
          ) ??
          rawReviews[0] ??
          null;

        const preview:
          | ReviewPreview
          | null =
          previewSource
            ? {
                id:
                  previewSource.id,

                rating:
                  Number(
                    previewSource.rating,
                  ),

                content:
                  previewSource.content,

                created_at:
                  previewSource.created_at,

                author:
                  firstRelation(
                    previewSource.author,
                  ),
              }
            : null;

        setReviews({
          averageRating,
          reviewCount,
          preview,
        });
      } catch (error) {
        if (
          !cancelled
        ) {
          console.error(
            "[CAFÉTA] Failed to load map review preview:",
            error,
          );

          setReviews({
            averageRating: 0,
            reviewCount: 0,
            preview: null,
          });
        }
      } finally {
        if (
          !cancelled
        ) {
          setReviewsLoading(
            false,
          );
        }
      }
    }

    void loadReviews();

    return () => {
      cancelled =
        true;
    };
  }, [
    business.id,
  ]);

  const categoryLabel =
    CATEGORY_LABELS[
      business.category
    ];

  const location =
    useMemo(
      () =>
        [
          business.barangay,
          business.city,
          business.province,
        ]
          .filter(
            Boolean,
          )
          .join(", "),
      [
        business.barangay,
        business.city,
        business.province,
      ],
    );

  const businessUrl =
    `/business/${encodeURIComponent(
      business.slug,
    )}`;

  const memoriesUrl =
    `/memories?business=${encodeURIComponent(
      business.slug,
    )}`;

  const reviewsUrl =
    `/business/${encodeURIComponent(
      business.slug,
    )}/reviews`;

  const showLogo =
    Boolean(
      business.logo_url,
    ) &&
    !logoFailed;

  const memoryCount =
    business
      .memoryActivity
      ?.memory_count ??
    0;

  const hasMemories =
    memoryCount > 0;

  const activityLabel =
    business
      .memoryActivityLabel;

  return (
    <div
      key={
        business.id
      }
      className="
        absolute inset-x-3
        bottom-[100px] z-30

        animate-in
        fade-in
        slide-in-from-bottom-4
        duration-300

        md:bottom-6
        md:left-6
        md:right-auto
        md:w-[420px]
      "
    >
      <div
        className="
          relative
          max-h-[calc(100dvh-180px)]
          overflow-y-auto
          rounded-[28px]

          border
          border-black/[0.06]

          bg-white/95

          shadow-[0_20px_60px_rgba(0,0,0,0.16)]
          backdrop-blur-xl

          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <button
          type="button"
          onClick={
            onClose
          }
          aria-label="Close business preview"
          className="
            absolute
            right-3 top-3
            z-30

            flex size-9
            items-center
            justify-center

            rounded-full
            border
            border-black/[0.06]
            bg-white/95

            text-black/40

            shadow-[0_4px_14px_rgba(0,0,0,0.08)]
            backdrop-blur-md

            transition-all
            duration-200

            hover:scale-105
            hover:bg-white
            hover:text-[#17211c]

            active:scale-90
          "
        >
          <X
            className="size-4"
            strokeWidth={
              2
            }
          />
        </button>

        <div className="flex items-center gap-4 p-4 pr-14">
          <Link
            href={
              businessUrl
            }
            aria-label={`View ${business.name} business profile`}
            className="
              group/logo
              relative

              size-[88px]
              shrink-0
              overflow-hidden

              rounded-[22px]
              border
              border-black/[0.06]
              bg-[#edf5f1]

              shadow-[0_8px_24px_rgba(0,0,0,0.07)]

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]

              active:scale-[0.98]
            "
          >
            {showLogo ? (
              <img
                src={
                  business.logo_url!
                }
                alt={`${business.name} logo`}
                loading="eager"
                decoding="async"
                onError={() =>
                  setLogoFailed(
                    true,
                  )
                }
                className="
                  block
                  size-full
                  object-cover

                  transition-transform
                  duration-500
                  ease-out

                  group-hover/logo:scale-[1.04]
                "
              />
            ) : (
              <div
                className="
                  flex size-full
                  items-center
                  justify-center

                  bg-gradient-to-br
                  from-[#edf5f1]
                  to-[#e4eee9]
                "
              >
                <div
                  className="
                    flex size-11
                    items-center
                    justify-center

                    rounded-full
                    bg-[#006241]
                    text-white
                    shadow-sm
                  "
                >
                  <Coffee
                    className="size-5"
                    strokeWidth={
                      2
                    }
                  />
                </div>
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <Link
                href={
                  businessUrl
                }
                className="group/name min-w-0"
              >
                <h3
                  className="
                    truncate
                    text-[16px]
                    font-black
                    tracking-[-0.035em]
                    text-[#17211c]

                    transition-colors
                    duration-200

                    group-hover/name:text-[#006241]
                  "
                >
                  {
                    business.name
                  }
                </h3>
              </Link>

              {business.is_verified && (
                <BadgeCheck
                  aria-label="Verified business"
                  className="
                    size-[17px]
                    shrink-0
                    fill-[#1689e8]
                    text-white
                  "
                  strokeWidth={
                    2.4
                  }
                />
              )}
            </div>

            <p
              className="
                mt-1
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#006241]
              "
            >
              {
                categoryLabel
              }
            </p>

            {activityLabel && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {activityLabel ===
                  "trending" && (
                  <ActivityBadge
                    icon={
                      <Flame className="size-3" />
                    }
                    label="Trending"
                    variant="trending"
                  />
                )}

                {activityLabel ===
                  "active" && (
                  <ActivityBadge
                    icon={
                      <Sparkles className="size-3" />
                    }
                    label="Active today"
                    variant="active"
                  />
                )}

                {activityLabel ===
                  "recent" && (
                  <ActivityBadge
                    icon={
                      <Images className="size-3" />
                    }
                    label="Recent memories"
                    variant="recent"
                  />
                )}

                {hasMemories && (
                  <span className="text-[9px] font-semibold text-black/30">
                    {
                      memoryCount
                    }{" "}
                    {memoryCount ===
                    1
                      ? "memory"
                      : "memories"}
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 flex items-start gap-1.5 text-[11px] leading-4 text-black/45">
              <MapPin
                className="
                  mt-[1px]
                  size-3.5
                  shrink-0
                  text-[#006241]
                "
                strokeWidth={
                  2
                }
              />

              <span className="line-clamp-2">
                {
                  business.address
                }
              </span>
            </div>

            {location && (
              <p className="mt-1.5 truncate pl-5 text-[10px] text-black/30">
                {
                  location
                }
              </p>
            )}
          </div>
        </div>

        {hasMemories && (
          <div className="px-3 pb-2">
            <Link
              href={
                memoriesUrl
              }
              className="
                group/memories

                flex
                items-center
                justify-between
                gap-3

                rounded-[17px]

                border
                border-[#006241]/[0.07]

                bg-[#f3f8f5]
                px-3.5 py-3

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#eaf4ef]
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex size-9
                    shrink-0
                    items-center
                    justify-center

                    rounded-full
                    bg-[#deece5]
                    text-[#006241]
                  "
                >
                  <Images className="size-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-black text-[#17211c]">
                    Community
                    memories
                  </p>

                  <p className="mt-0.5 truncate text-[9px] text-black/35">
                    {
                      memoryCount
                    }{" "}
                    shared café{" "}
                    {memoryCount ===
                    1
                      ? "moment"
                      : "moments"}
                  </p>
                </div>
              </div>

              <ArrowRight
                className="
                  size-3.5
                  shrink-0
                  text-[#006241]

                  transition-transform

                  group-hover/memories:translate-x-0.5
                "
              />
            </Link>
          </div>
        )}

        <div className="px-3 pb-3">
          <ReviewsPreview
            businessName={
              business.name
            }
            reviewsUrl={
              reviewsUrl
            }
            loading={
              reviewsLoading
            }
            averageRating={
              reviews.averageRating
            }
            reviewCount={
              reviews.reviewCount
            }
            review={
              reviews.preview
            }
            avatarFailed={
              reviewAvatarFailed
            }
            onAvatarFailed={() =>
              setReviewAvatarFailed(
                true,
              )
            }
          />
        </div>

        <div
          className="
            sticky bottom-0

            grid
            grid-cols-2
            gap-2

            border-t
            border-black/[0.05]

            bg-[#fcfdfc]/95
            p-3

            backdrop-blur-xl
          "
        >
          <button
            type="button"
            onClick={
              onDirections
            }
            className="
              group

              flex h-11
              items-center
              justify-center
              gap-2

              rounded-[15px]
              bg-[#e8f2ed]

              text-xs
              font-bold
              text-[#006241]

              transition-all

              hover:-translate-y-0.5
              hover:bg-[#dcebe3]

              active:translate-y-0
              active:scale-[0.98]
            "
          >
            <Navigation
              className="size-3.5"
              strokeWidth={
                2
              }
            />

            Directions
          </button>

          <Link
            href={
              businessUrl
            }
            className="
              group

              flex h-11
              items-center
              justify-center
              gap-2

              rounded-[15px]
              bg-[#006241]

              text-xs
              font-bold
              text-white

              shadow-[0_5px_14px_rgba(0,98,65,0.14)]

              transition-all

              hover:-translate-y-0.5
              hover:bg-[#00754a]

              active:translate-y-0
              active:scale-[0.98]
            "
          >
            View business

            <ArrowRight
              className="size-3.5"
              strokeWidth={
                2
              }
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ReviewsPreview({
  businessName,
  reviewsUrl,
  loading,
  averageRating,
  reviewCount,
  review,
  avatarFailed,
  onAvatarFailed,
}: {
  businessName: string;

  reviewsUrl: string;

  loading: boolean;

  averageRating: number;

  reviewCount: number;

  review: ReviewPreview | null;

  avatarFailed: boolean;

  onAvatarFailed: () => void;
}) {
  if (loading) {
    return (
      <div
        className="
          rounded-[18px]
          border
          border-black/[0.055]
          bg-white
          p-3.5
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="h-3 w-20 animate-pulse rounded-full bg-black/[0.07]" />

            <div className="mt-2 h-2 w-28 animate-pulse rounded-full bg-black/[0.05]" />
          </div>

          <div className="h-8 w-20 animate-pulse rounded-full bg-black/[0.05]" />
        </div>
      </div>
    );
  }

  if (
    reviewCount ===
    0
  ) {
    return (
      <Link
        href={
          reviewsUrl
        }
        className="
          group

          flex items-center
          justify-between
          gap-3

          rounded-[18px]
          border
          border-black/[0.055]

          bg-white
          p-3.5

          transition-all

          hover:-translate-y-0.5
          hover:border-[#006241]/10
          hover:bg-[#fbfdfc]
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff7df] text-[#d99000]">
            <Star className="size-4" />
          </div>

          <div>
            <p className="text-[11px] font-black text-[#17211c]">
              No reviews yet
            </p>

            <p className="mt-0.5 text-[9px] text-black/35">
              Be the first to
              review{" "}
              {
                businessName
              }.
            </p>
          </div>
        </div>

        <ArrowRight className="size-3.5 shrink-0 text-[#006241] transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }

  const author =
    review?.author;

  const displayName =
    author?.username
      ? `@${author.username}`
      : author?.full_name ||
        "CAFÉTA user";

  const avatarName =
    author?.full_name ||
    author?.username ||
    "CAFÉTA";

  return (
    <div
      className="
        overflow-hidden
        rounded-[18px]
        border
        border-black/[0.055]
        bg-white
      "
    >
      <div className="flex items-center justify-between gap-3 px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#fff7df] text-[#d99000]">
            <Star className="size-4 fill-current" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[16px] font-black tracking-[-0.04em] text-[#17211c]">
                {averageRating.toFixed(
                  1,
                )}
              </span>

              <span className="text-[9px] font-semibold text-black/35">
                / 5
              </span>
            </div>

            <p className="text-[9px] text-black/35">
              {
                reviewCount
              }{" "}
              {reviewCount ===
              1
                ? "review"
                : "reviews"}
            </p>
          </div>
        </div>

        <div className="flex gap-0.5">
          {[
            1,
            2,
            3,
            4,
            5,
          ].map(
            (
              star,
            ) => (
              <Star
                key={
                  star
                }
                className={`
                  size-3

                  ${
                    star <=
                    Math.round(
                      averageRating,
                    )
                      ? "fill-[#f4b740] text-[#f4b740]"
                      : "fill-transparent text-black/15"
                  }
                `}
              />
            ),
          )}
        </div>
      </div>

      {review && (
        <div className="border-t border-black/[0.045] px-3.5 py-3">
          <div className="flex gap-2.5">
            <div className="size-8 shrink-0 overflow-hidden rounded-full bg-[#e8f2ed]">
              {author?.avatar_url &&
              !avatarFailed ? (
                <img
                  src={
                    author.avatar_url
                  }
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={
                    onAvatarFailed
                  }
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-[8px] font-black text-[#006241]">
                  {getInitials(
                    avatarName,
                  )}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[9px] font-black text-[#17211c]">
                  {
                    displayName
                  }
                </p>

                <div className="flex shrink-0 items-center gap-1">
                  <Star className="size-2.5 fill-[#f4b740] text-[#f4b740]" />

                  <span className="text-[8px] font-black text-black/45">
                    {
                      review.rating
                    }
                  </span>
                </div>
              </div>

              {review.content && (
                <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-black/50">
                  {
                    review.content
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Link
        href={
          reviewsUrl
        }
        className="
          group

          flex h-10
          items-center
          justify-between

          border-t
          border-black/[0.045]

          bg-[#fafcfa]
          px-3.5

          text-[9px]
          font-black
          text-[#006241]

          transition-colors

          hover:bg-[#f0f7f3]
        "
      >
        <span className="flex items-center gap-1.5">
          <MessageCircle className="size-3" />

          Read all reviews
        </span>

        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function ActivityBadge({
  icon,
  label,
  variant,
}: {
  icon: ReactNode;

  label: string;

  variant:
    | "trending"
    | "active"
    | "recent";
}) {
  const style =
    variant ===
    "trending"
      ? "bg-[#fff1e8] text-[#d85f17]"
      : variant ===
          "active"
        ? "bg-[#e8f2ed] text-[#006241]"
        : "bg-[#f1f3f1] text-black/50";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1

        rounded-full
        px-2 py-1

        text-[9px]
        font-black

        ${style}
      `}
    >
      {icon}

      {label}
    </span>
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

function getInitials(
  value: string,
) {
  return value
    .trim()
    .split(/\s+/)
    .slice(
      0,
      2,
    )
    .map(
      (part) =>
        part[0] ??
        "",
    )
    .join("")
    .toUpperCase();
}