"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  MessageCircle,
  PenLine,
  Star,
} from "lucide-react";

import {
  ReviewCard,
} from "@/components/reviews/review-card";

import {
  ReviewFormModal,
} from "@/components/reviews/review-form-modal";

import {
  ReviewSummary,
} from "@/components/reviews/review-summary";

import {
  calculateReviewSummary,
  type Review,
  type ReviewAuthor,
  type ReviewBusiness,
  type ReviewSort,
} from "@/lib/reviews/types";

type Props = {
  business: ReviewBusiness;

  reviews: Review[];

  currentUserId: string;

  currentProfile: ReviewAuthor;
};

export function BusinessReviewsPage({
  business,
  reviews:
    initialReviews,
  currentUserId,
  currentProfile,
}: Props) {
  const [
    reviews,
    setReviews,
  ] = useState(
    initialReviews,
  );

  const [
    sort,
    setSort,
  ] =
    useState<ReviewSort>(
      "recent",
    );

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const currentUserReview =
    useMemo(
      () =>
        reviews.find(
          (review) =>
            review.user_id ===
            currentUserId,
        ) ?? null,
      [
        reviews,
        currentUserId,
      ],
    );

  const summary =
    useMemo(
      () =>
        calculateReviewSummary(
          reviews,
        ),
      [reviews],
    );

  const sortedReviews =
    useMemo(() => {
      const next = [
        ...reviews,
      ];

      if (
        sort ===
        "highest"
      ) {
        return next.sort(
          (a, b) =>
            b.rating -
              a.rating ||
            new Date(
              b.created_at,
            ).getTime() -
              new Date(
                a.created_at,
              ).getTime(),
        );
      }

      if (
        sort ===
        "lowest"
      ) {
        return next.sort(
          (a, b) =>
            a.rating -
              b.rating ||
            new Date(
              b.created_at,
            ).getTime() -
              new Date(
                a.created_at,
              ).getTime(),
        );
      }

      return next.sort(
        (a, b) =>
          new Date(
            b.created_at,
          ).getTime() -
          new Date(
            a.created_at,
          ).getTime(),
      );
    }, [
      reviews,
      sort,
    ]);

  function handleSaved(
    review: Review,
  ) {
    setReviews(
      (current) => {
        const exists =
          current.some(
            (item) =>
              item.id ===
              review.id,
          );

        if (exists) {
          return current.map(
            (item) =>
              item.id ===
              review.id
                ? review
                : item,
          );
        }

        return [
          review,
          ...current,
        ];
      },
    );
  }

  function handleDeleted(
    reviewId: string,
  ) {
    setReviews(
      (current) =>
        current.filter(
          (review) =>
            review.id !==
            reviewId,
        ),
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#f5f7f5] pb-28 md:pb-14">
        <div className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6 sm:py-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/business/${encodeURIComponent(
                business.slug,
              )}`}
              aria-label={`Back to ${business.name}`}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#17211c] shadow-sm transition hover:bg-[#f1f5f2]"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <BusinessIdentity
              business={
                business
              }
            />
          </div>

          <div className="mt-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#006241]">
                  Community reviews
                </p>

                <h1 className="mt-1.5 text-3xl font-black tracking-[-0.055em] text-[#17211c] sm:text-[34px]">
                  Reviews
                </h1>

                <p className="mt-1.5 text-[11px] leading-5 text-black/40">
                  See what the
                  CAFÉTA community
                  thinks about{" "}
                  {business.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalOpen(
                    true,
                  )
                }
                className="hidden h-10 shrink-0 items-center gap-2 rounded-full bg-[#006241] px-4 text-[10px] font-black text-white shadow-[0_7px_20px_rgba(0,98,65,0.16)] transition hover:-translate-y-0.5 hover:bg-[#00754a] sm:flex"
              >
                <PenLine className="size-3.5" />

                {currentUserReview
                  ? "Edit review"
                  : "Write a review"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <ReviewSummary
              summary={
                summary
              }
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setModalOpen(
                true,
              )
            }
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#006241] px-5 text-[10px] font-black text-white shadow-[0_8px_24px_rgba(0,98,65,0.14)] transition hover:bg-[#00754a] sm:hidden"
          >
            <PenLine className="size-3.5" />

            {currentUserReview
              ? "Edit your review"
              : "Write a review"}
          </button>

          {currentUserReview && (
            <section className="mt-5 overflow-hidden rounded-[24px] border border-[#006241]/10 bg-white px-5 shadow-[0_10px_35px_rgba(23,33,28,0.03)]">
              <div className="flex items-center justify-between gap-3 border-b border-black/[0.05] py-4">
                <div>
                  <p className="text-xs font-black text-[#17211c]">
                    Your review
                  </p>

                  <p className="mt-0.5 text-[9px] text-black/35">
                    Your experience
                    at{" "}
                    {
                      business.name
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(
                      true,
                    )
                  }
                  className="rounded-full bg-[#e8f2ed] px-3 py-1.5 text-[9px] font-black text-[#006241] transition hover:bg-[#dcece4]"
                >
                  Edit
                </button>
              </div>

              <ReviewCard
                review={
                  currentUserReview
                }
                isCurrentUser
                onEdit={() =>
                  setModalOpen(
                    true,
                  )
                }
              />
            </section>
          )}

          <section className="mt-5 overflow-hidden rounded-[24px] border border-black/[0.055] bg-white shadow-[0_10px_35px_rgba(23,33,28,0.03)]">
            <div className="flex items-center justify-between gap-4 border-b border-black/[0.055] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
                  <MessageCircle className="size-3.5" />
                </div>

                <div>
                  <h2 className="text-sm font-black tracking-[-0.025em] text-[#17211c]">
                    All reviews
                  </h2>

                  <p className="text-[9px] text-black/35">
                    {
                      reviews.length
                    }{" "}
                    {reviews.length ===
                    1
                      ? "review"
                      : "reviews"}
                  </p>
                </div>
              </div>

              {reviews.length >
                1 && (
                <div className="relative">
                  <select
                    value={
                      sort
                    }
                    onChange={(
                      event,
                    ) =>
                      setSort(
                        event
                          .target
                          .value as ReviewSort,
                      )
                    }
                    aria-label="Sort reviews"
                    className="h-9 appearance-none rounded-full border border-black/[0.07] bg-[#f7f8f7] pl-3 pr-8 text-[9px] font-bold text-[#39443e] outline-none transition hover:bg-[#f1f5f2] focus:border-[#006241]/20"
                  >
                    <option value="recent">
                      Most recent
                    </option>

                    <option value="highest">
                      Highest rated
                    </option>

                    <option value="lowest">
                      Lowest rated
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-black/35" />
                </div>
              )}
            </div>

            {sortedReviews.length >
            0 ? (
              <div className="px-5 sm:px-6">
                {sortedReviews.map(
                  (review) => (
                    <ReviewCard
                      key={
                        review.id
                      }
                      review={
                        review
                      }
                      isCurrentUser={
                        review.user_id ===
                        currentUserId
                      }
                      onEdit={
                        review.user_id ===
                        currentUserId
                          ? () =>
                              setModalOpen(
                                true,
                              )
                          : undefined
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptyReviews
                onWrite={() =>
                  setModalOpen(
                    true,
                  )
                }
              />
            )}
          </section>
        </div>
      </main>

      <ReviewFormModal
        open={
          modalOpen
        }
        onClose={() =>
          setModalOpen(
            false,
          )
        }
        businessId={
          business.id
        }
        businessName={
          business.name
        }
        currentUserId={
          currentUserId
        }
        currentProfile={
          currentProfile
        }
        existingReview={
          currentUserReview
        }
        onSaved={
          handleSaved
        }
        onDeleted={
          handleDeleted
        }
      />
    </>
  );
}

function BusinessIdentity({
  business,
}: {
  business: ReviewBusiness;
}) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="size-10 shrink-0 overflow-hidden rounded-full border border-black/[0.06] bg-[#e8f2ed]">
        {business.logo_url &&
        !failed ? (
          <img
            src={
              business.logo_url
            }
            alt=""
            onError={() =>
              setFailed(true)
            }
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs font-black text-[#006241]">
            {business.name
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-black text-[#17211c]">
            {
              business.name
            }
          </p>

          {business.is_verified && (
            <BadgeCheck className="size-3.5 shrink-0 fill-[#006241] text-white" />
          )}
        </div>

        <p className="mt-0.5 truncate text-[9px] text-black/35">
          {formatLocation(
            business,
          )}
        </p>
      </div>
    </div>
  );
}

function EmptyReviews({
  onWrite,
}: {
  onWrite: () => void;
}) {
  return (
    <div className="flex min-h-[310px] items-center justify-center px-6 py-10">
      <div className="max-w-xs text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#fff5d9] text-[#d99000]">
          <Star className="size-5" />
        </div>

        <h3 className="mt-5 text-base font-black tracking-[-0.035em] text-[#17211c]">
          No reviews yet
        </h3>

        <p className="mt-2 text-[10px] leading-5 text-black/40">
          Be the first to share
          your experience with the
          CAFÉTA community.
        </p>

        <button
          type="button"
          onClick={
            onWrite
          }
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[#006241] px-5 text-[10px] font-black text-white transition hover:bg-[#00754a]"
        >
          <PenLine className="size-3.5" />

          Write a review
        </button>
      </div>
    </div>
  );
}

function formatLocation(
  business: ReviewBusiness,
) {
  return [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");
}