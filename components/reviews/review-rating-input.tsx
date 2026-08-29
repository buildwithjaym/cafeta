"use client";

import {
  Star,
} from "lucide-react";

import {
  getReviewRatingLabel,
} from "@/lib/reviews/types";

type Props = {
  value: number;

  onChange: (
    rating: number,
  ) => void;

  disabled?: boolean;
};

export function ReviewRatingInput({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {[
          1,
          2,
          3,
          4,
          5,
        ].map((rating) => {
          const selected =
            rating <= value;

          return (
            <button
              key={rating}
              type="button"
              disabled={disabled}
              onClick={() =>
                onChange(rating)
              }
              aria-label={`${rating} star${
                rating === 1
                  ? ""
                  : "s"
              }`}
              className="
                group
                flex
                size-11
                items-center
                justify-center
                rounded-full
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#fff7df]
                active:scale-95
                disabled:pointer-events-none
              "
            >
              <Star
                className={`
                  size-7
                  transition-all
                  duration-200

                  ${
                    selected
                      ? "fill-[#f5a623] text-[#f5a623]"
                      : "text-black/20 group-hover:text-[#f5a623]"
                  }
                `}
                strokeWidth={1.8}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-2 min-h-5">
        <p
          className={`
            text-xs
            font-bold
            transition

            ${
              value > 0
                ? "text-[#17211c]"
                : "text-black/35"
            }
          `}
        >
          {getReviewRatingLabel(
            value,
          )}
        </p>
      </div>
    </div>
  );
}