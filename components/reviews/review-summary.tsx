import {
  Star,
} from "lucide-react";

import type {
  ReviewSummaryData,
} from "@/lib/reviews/types";

type Props = {
  summary: ReviewSummaryData;
};

export function ReviewSummary({
  summary,
}: Props) {
  const {
    averageRating,
    reviewCount,
    distribution,
  } = summary;

  return (
    <section className="rounded-[24px] border border-black/[0.055] bg-white p-5 shadow-[0_10px_35px_rgba(23,33,28,0.03)] sm:p-6">
      <div className="grid gap-6 sm:grid-cols-[150px_1fr] sm:items-center">
        <div className="text-center sm:text-left">
          <p className="text-5xl font-black tracking-[-0.06em] text-[#17211c]">
            {reviewCount > 0
              ? averageRating.toFixed(
                  1,
                )
              : "—"}
          </p>

          <div className="mt-2 flex justify-center gap-0.5 sm:justify-start">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  className={`
                    size-4

                    ${
                      star <=
                      Math.round(
                        averageRating,
                      )
                        ? "fill-[#f5a623] text-[#f5a623]"
                        : "fill-black/[0.06] text-black/[0.08]"
                    }
                  `}
                />
              ),
            )}
          </div>

          <p className="mt-2 text-[10px] text-black/40">
            {reviewCount}{" "}
            {reviewCount === 1
              ? "review"
              : "reviews"}
          </p>
        </div>

        <div className="space-y-2">
          {[
            5,
            4,
            3,
            2,
            1,
          ].map((rating) => {
            const count =
              distribution[
                rating as keyof typeof distribution
              ];

            const percentage =
              reviewCount > 0
                ? (count /
                    reviewCount) *
                  100
                : 0;

            return (
              <div
                key={rating}
                className="grid grid-cols-[28px_1fr_28px] items-center gap-2"
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-black/50">
                  {rating}

                  <Star className="size-2.5 fill-[#f5a623] text-[#f5a623]" />
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.055]">
                  <div
                    className="h-full rounded-full bg-[#f5a623] transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="text-right text-[9px] text-black/30">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}