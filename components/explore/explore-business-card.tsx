"use client";

import Link from "next/link";

import {
  BadgeCheck,
  MapPin,
  Star,
} from "lucide-react";

import {
  SaveBusinessButton,
} from "@/components/explore/save-business-button";

type Business = {
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

  avg_rating:
    | number
    | string
    | null;

  review_count:
    | number
    | string
    | null;

  is_saved: boolean;

  today_opens_at:
    | string
    | null;

  today_closes_at:
    | string
    | null;

  today_is_closed: boolean;

  created_at?: string;
};

type Props = {
  business: Business;
  index: number;
};

export function ExploreBusinessCard({
  business,
  index,
}: Props) {
  const rating =
    Number(
      business.avg_rating ??
        0,
    );

  const reviews =
    Number(
      business.review_count ??
        0,
    );

  const location = [
    business.barangay,
    business.city,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      style={{
        animationDelay: `${Math.min(
          index * 45,
          270,
        )}ms`,
        animationFillMode:
          "both",
      }}
      className="
        group

        animate-in
        fade-in
        slide-in-from-bottom-3

        overflow-hidden

        rounded-[22px]

        border
        border-black/[0.055]

        bg-white

        shadow-[0_4px_18px_rgba(0,0,0,0.025)]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-black/[0.08]
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
      "
    >
      <div
        className="
          relative

          aspect-[16/10]
          overflow-hidden

          bg-[#e9eeeb]
        "
      >
        <Link
          href={`/place/${business.slug}`}
          className="
            block
            size-full
          "
        >
          {business.cover_url ? (
            <img
              src={
                business.cover_url
              }
              alt={business.name}
              loading="lazy"
              className="
                block
                size-full

                object-cover

                transition-transform
                duration-700
                ease-out

                group-hover:scale-[1.04]
              "
            />
          ) : business.logo_url ? (
            <img
              src={
                business.logo_url
              }
              alt={business.name}
              loading="lazy"
              className="
                block
                size-full

                object-cover

                transition-transform
                duration-700
                ease-out

                group-hover:scale-[1.04]
              "
            />
          ) : (
            <div
              className="
                flex
                size-full
                items-center
                justify-center

                bg-gradient-to-br
                from-[#edf5f1]
                to-[#dcebe3]
              "
            >
              <span
                className="
                  text-2xl
                  font-black
                  tracking-[-0.06em]
                  text-[#006241]/25
                "
              >
                CAFÉTA
              </span>
            </div>
          )}
        </Link>

        <div
          className="
            pointer-events-none

            absolute
            inset-x-0
            top-0

            h-20

            bg-gradient-to-b
            from-black/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            right-3
            top-3

            z-10
          "
        >
          <SaveBusinessButton
            businessId={
              business.id
            }
            initialSaved={
              business.is_saved
            }
          />
        </div>
      </div>

      <div className="p-4">
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.13em]
                text-[#006241]
              "
            >
              {formatCategory(
                business.category,
              )}
            </p>

            <div
              className="
                mt-1

                flex
                min-w-0
                items-center
                gap-1.5
              "
            >
              <Link
                href={`/place/${business.slug}`}
                className="min-w-0"
              >
                <h3
                  className="
                    truncate

                    text-[17px]
                    font-black
                    tracking-[-0.035em]
                    text-[#17211c]

                    transition-colors
                    duration-200

                    group-hover:text-[#006241]
                  "
                >
                  {business.name}
                </h3>
              </Link>

              {business.is_verified ===
                true && (
                <BadgeCheck
                  aria-label="Verified business"
                  className="
                    size-[16px]
                    shrink-0

                    fill-[#1683f3]
                    text-white
                  "
                />
              )}
            </div>
          </div>

          {reviews > 0 && (
            <div
              className="
                flex
                shrink-0
                items-center
                gap-1

                rounded-full

                bg-[#f4f7f5]

                px-2
                py-1

                text-[11px]
                font-bold
                text-[#17211c]
              "
            >
              <Star
                className="
                  size-3

                  fill-[#006241]
                  text-[#006241]
                "
              />

              {rating.toFixed(
                1,
              )}
            </div>
          )}
        </div>

        {business.description && (
          <p
            className="
              mt-2

              line-clamp-2

              text-[11px]
              leading-[18px]
              text-black/40
            "
          >
            {
              business.description
            }
          </p>
        )}

        <div
          className="
            mt-3

            flex
            items-center
            justify-between
            gap-3

            border-t
            border-black/[0.05]

            pt-3

            text-[10px]
            text-black/40
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
            "
          >
            <MapPin
              className="
                size-3.5
                shrink-0

                text-[#006241]
              "
            />

            <span className="truncate">
              {location ||
                business.address}
            </span>
          </div>

          <span
            className="
              shrink-0
              font-medium
            "
          >
            {reviews > 0
              ? `${reviews} ${
                  reviews === 1
                    ? "review"
                    : "reviews"
                }`
              : "New"}
          </span>
        </div>
      </div>
    </article>
  );
}

function formatCategory(
  category: string,
) {
  switch (category) {
    case "coffee_shop":
      return "Coffee Shop";

    case "cafe":
      return "Café";

    case "milk_tea":
      return "Milk Tea";

    case "bakery_cafe":
      return "Bakery Café";

    case "restaurant_cafe":
      return "Restaurant Café";

    case "other":
      return "Local Spot";

    default:
      return category.replace(
        /_/g,
        " ",
      );
  }
}