"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  LoaderCircle,
  Star,
  Trash2,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  toast,
} from "sonner";

import {
  ReviewRatingInput,
} from "@/components/reviews/review-rating-input";

import type {
  Review,
  ReviewAuthor,
} from "@/lib/reviews/types";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  open: boolean;

  onClose: () => void;

  businessId: string;
  businessName: string;

  currentUserId: string;
  currentProfile: ReviewAuthor;

  existingReview?: Review | null;

  onSaved?: (
    review: Review,
  ) => void;

  onDeleted?: (
    reviewId: string,
  ) => void;
};

export function ReviewFormModal({
  open,
  onClose,
  businessId,
  businessName,
  currentUserId,
  currentProfile,
  existingReview = null,
  onSaved,
  onDeleted,
}: Props) {
  const router =
    useRouter();

  const [
    rating,
    setRating,
  ] = useState(
    existingReview?.rating ??
      0,
  );

  const [
    content,
    setContent,
  ] = useState(
    existingReview?.content ??
      "",
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const isEditing =
    Boolean(existingReview);

  useEffect(() => {
    if (!open) {
      return;
    }

    setRating(
      existingReview?.rating ??
        0,
    );

    setContent(
      existingReview?.content ??
        "",
    );
  }, [
    open,
    existingReview,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      rating < 1 ||
      rating > 5
    ) {
      toast.error(
        "Choose a rating",
        {
          description:
            "Select between 1 and 5 stars before publishing your review.",
        },
      );

      return;
    }

    const cleanContent =
      content.trim();

    if (
      cleanContent.length >
      1000
    ) {
      toast.error(
        "Review is too long",
        {
          description:
            "Keep your review within 1,000 characters.",
        },
      );

      return;
    }

    setSubmitting(true);

    try {
      const supabase =
        createClient();

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
        !user ||
        user.id !==
          currentUserId
      ) {
        throw new Error(
          "Your session has expired. Please sign in again.",
        );
      }

      if (
        existingReview
      ) {
        const {
          data,
          error,
        } =
          await supabase
            .from(
              "reviews",
            )
            .update({
              rating,
              content:
                cleanContent ||
                null,
            })
            .eq(
              "id",
              existingReview.id,
            )
            .eq(
              "user_id",
              user.id,
            )
            .select(`
              id,
              user_id,
              business_id,
              rating,
              content,
              created_at,
              updated_at
            `)
            .single();

        if (error) {
          throw error;
        }

        const review: Review =
          {
            ...data,

            author:
              currentProfile,
          };

        onSaved?.(
          review,
        );

        toast.success(
          "Review updated",
        );
      } else {
        const {
          data,
          error,
        } =
          await supabase
            .from(
              "reviews",
            )
            .insert({
              user_id:
                user.id,

              business_id:
                businessId,

              rating,

              content:
                cleanContent ||
                null,
            })
            .select(`
              id,
              user_id,
              business_id,
              rating,
              content,
              created_at,
              updated_at
            `)
            .single();

        if (error) {
          if (
            error.code ===
            "23505"
          ) {
            throw new Error(
              "You already reviewed this business. Refresh the page to edit your existing review.",
            );
          }

          throw error;
        }

        const review: Review =
          {
            ...data,

            author:
              currentProfile,
          };

        onSaved?.(
          review,
        );

        toast.success(
          "Review published",
          {
            description:
              `Your review for ${businessName} is now live.`,
          },
        );
      }

      onClose();

      router.refresh();
    } catch (error) {
      toast.error(
        isEditing
          ? "Couldn't update review"
          : "Couldn't publish review",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteReview() {
    if (
      !existingReview ||
      deleting ||
      submitting
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete your review? This cannot be undone.",
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const supabase =
        createClient();

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
        !user ||
        user.id !==
          currentUserId
      ) {
        throw new Error(
          "Your session has expired. Please sign in again.",
        );
      }

      const {
        error,
      } =
        await supabase
          .from(
            "reviews",
          )
          .delete()
          .eq(
            "id",
            existingReview.id,
          )
          .eq(
            "user_id",
            user.id,
          );

      if (error) {
        throw error;
      }

      onDeleted?.(
        existingReview.id,
      );

      toast.success(
        "Review deleted",
      );

      onClose();

      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't delete review",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );
    } finally {
      setDeleting(false);
    }
  }

  const busy =
    submitting ||
    deleting;

  return (
    <div
      className="
        fixed inset-0 z-[160]
        flex items-end justify-center
        bg-[#111814]/45
        backdrop-blur-[3px]
        sm:items-center sm:p-5
      "
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget &&
          !busy
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="
          w-full
          animate-in
          rounded-t-[30px]
          border border-black/[0.06]
          bg-white
          shadow-[0_30px_100px_rgba(0,0,0,0.20)]
          duration-200
          slide-in-from-bottom-5

          sm:max-w-[500px]
          sm:rounded-[30px]
          sm:zoom-in-95
        "
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-black/10" />
        </div>

        <div className="flex items-start justify-between gap-4 border-b border-black/[0.055] px-5 pb-4 pt-4 sm:px-6 sm:pt-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#fff5d9] text-[#d99000]">
                <Star className="size-4 fill-current" />
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#006241]">
                CAFÉTA Review
              </p>
            </div>

            <h2
              id="review-modal-title"
              className="mt-3 text-xl font-black tracking-[-0.045em] text-[#17211c]"
            >
              {isEditing
                ? "Edit your review"
                : "Write a review"}
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-black/40">
              Share your experience
              at{" "}
              <span className="font-bold text-black/55">
                {businessName}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={busy}
            aria-label="Close review form"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f5f3] text-black/50 transition hover:bg-[#e9eeeb] hover:text-[#17211c] disabled:pointer-events-none"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={
            submit
          }
        >
          <div className="px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-black text-[#17211c]">
                How was your
                experience?
              </p>

              <p className="mt-1 text-[10px] text-black/35">
                Tap a star to rate
                this business.
              </p>

              <div className="mt-3">
                <ReviewRatingInput
                  value={
                    rating
                  }
                  onChange={
                    setRating
                  }
                  disabled={
                    busy
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <label
                    htmlFor="review-content"
                    className="text-xs font-black text-[#17211c]"
                  >
                    Tell others
                    about your
                    visit
                  </label>

                  <p className="mt-1 text-[10px] text-black/35">
                    What stood out
                    about the food,
                    drinks, service,
                    or atmosphere?
                  </p>
                </div>

                <span
                  className={`
                    shrink-0
                    text-[9px]
                    font-semibold

                    ${
                      content.length >
                      900
                        ? "text-[#b85c36]"
                        : "text-black/30"
                    }
                  `}
                >
                  {
                    content.length
                  }
                  /1000
                </span>
              </div>

              <textarea
                id="review-content"
                value={
                  content
                }
                onChange={(
                  event,
                ) =>
                  setContent(
                    event.target
                      .value,
                  )
                }
                maxLength={
                  1000
                }
                disabled={
                  busy
                }
                rows={6}
                placeholder="Share what your experience was like..."
                className="
                  mt-3
                  min-h-[140px]
                  w-full
                  resize-none
                  rounded-[20px]
                  border border-black/[0.07]
                  bg-[#f7f8f7]
                  px-4 py-3.5
                  text-xs
                  leading-5
                  text-[#17211c]
                  outline-none
                  transition
                  placeholder:text-black/25
                  focus:border-[#006241]/30
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#006241]/[0.04]
                  disabled:opacity-60
                "
              />
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-black/[0.055] px-5 py-4 sm:px-6">
            {isEditing && (
              <button
                type="button"
                onClick={
                  deleteReview
                }
                disabled={
                  busy
                }
                className="
                  flex h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-red-500/10
                  bg-red-50
                  px-4
                  text-[10px]
                  font-black
                  text-red-600
                  transition
                  hover:bg-red-100
                  disabled:pointer-events-none
                  disabled:opacity-50
                "
              >
                {deleting ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}

                <span className="hidden sm:inline">
                  Delete
                </span>
              </button>
            )}

            <button
              type="submit"
              disabled={
                busy ||
                rating === 0
              }
              className="
                flex h-11
                flex-1
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#006241]
                px-5
                text-[10px]
                font-black
                text-white
                shadow-[0_8px_24px_rgba(0,98,65,0.16)]
                transition-all
                hover:-translate-y-0.5
                hover:bg-[#00754a]
                active:translate-y-0
                disabled:pointer-events-none
                disabled:bg-black/10
                disabled:text-black/30
                disabled:shadow-none
              "
            >
              {submitting ? (
                <>
                  <LoaderCircle className="size-3.5 animate-spin" />

                  {isEditing
                    ? "Saving..."
                    : "Publishing..."}
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Publish review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}