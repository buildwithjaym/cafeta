"use client";

import {
  useState,
} from "react";

import {
  Star,
} from "lucide-react";

import type {
  Review,
} from "@/lib/reviews/types";

type Props = {
  review: Review;

  isCurrentUser?: boolean;

  onEdit?: () => void;
};

export function ReviewCard({
  review,
  isCurrentUser = false,
  onEdit,
}: Props) {
  const author =
    review.author;

  const displayName =
    author?.username
      ? `@${author.username}`
      : author?.full_name ||
        "CAFÉTA user";

  return (
    <article className="border-b border-black/[0.055] py-5 last:border-b-0">
      <div className="flex gap-3">
        <ReviewAvatar
          author={author}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-xs font-black text-[#17211c]">
                  {displayName}
                </p>

                {isCurrentUser && (
                  <span className="rounded-full bg-[#e8f2ed] px-2 py-0.5 text-[8px] font-black text-[#006241]">
                    You
                  </span>
                )}
              </div>

              {author?.username &&
                author.full_name && (
                  <p className="mt-0.5 truncate text-[9px] text-black/35">
                    {author.full_name}
                  </p>
                )}
            </div>

            {isCurrentUser &&
              onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="shrink-0 text-[9px] font-black text-[#006241] transition hover:text-[#00754a]"
                >
                  Edit
                </button>
              )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <ReviewStars
              rating={
                review.rating
              }
            />

            <span className="text-[9px] text-black/30">
              {formatReviewDate(
                review.created_at,
              )}
            </span>
          </div>

          {review.content && (
            <p className="mt-3 whitespace-pre-wrap break-words text-[11px] leading-5 text-black/65 sm:text-xs">
              {review.content}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function ReviewStars({
  rating,
  size = "small",
}: {
  rating: number;

  size?: "small" | "medium";
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <Star
            key={star}
            className={`
              ${
                size ===
                "medium"
                  ? "size-4"
                  : "size-3"
              }

              ${
                star <= rating
                  ? "fill-[#f5a623] text-[#f5a623]"
                  : "fill-black/[0.06] text-black/[0.08]"
              }
            `}
            strokeWidth={1.5}
          />
        ),
      )}
    </div>
  );
}

function ReviewAvatar({
  author,
}: {
  author:
    | Review["author"]
    | null;
}) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  const name =
    author?.full_name ||
    author?.username ||
    "CAFÉTA";

  return (
    <div className="size-10 shrink-0 overflow-hidden rounded-full bg-[#e8f2ed]">
      {author?.avatar_url &&
      !failed ? (
        <img
          src={
            author.avatar_url
          }
          alt=""
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(true)
          }
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-[9px] font-black text-[#006241]">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}

function formatReviewDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

function getInitials(
  value: string,
) {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part[0] ?? "",
    )
    .join("")
    .toUpperCase();
}