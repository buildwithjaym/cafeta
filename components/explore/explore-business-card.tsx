"use client";

import Link from "next/link";

import {
  BadgeCheck,
  Clock3,
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

  total_count:
    | number
    | string;
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
          index * 55,
          330,
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
        rounded-[26px]
        border
        border-black/[0.06]
        bg-white
        duration-500
        transition-[transform,box-shadow,border-color]
        hover:-translate-y-1
        hover:border-black/[0.09]
        hover:shadow-[0_22px_55px_rgba(0,0,0,0.08)]
      "
    >
      <div
        className="
          relative
          aspect-[4/3]
          overflow-hidden
          bg-[#e9eeeb]
        "
      >
        <Link
          href={`/place/${business.slug}`}
          className="block size-full"
        >
          {business.cover_url ? (
            <img
              src={
                business.cover_url
              }
              alt={business.name}
              loading="lazy"
              className="
                size-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.035]
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
                to-[#e5ece8]
              "
            >
              {business.logo_url ? (
                <img
                  src={
                    business.logo_url
                  }
                  alt=""
                  loading="lazy"
                  className="
                    size-20
                    rounded-[20px]
                    object-cover
                    shadow-sm
                  "
                />
              ) : (
                <span
                  className="
                    text-3xl
                    font-black
                    tracking-[-0.06em]
                    text-[#006241]/25
                  "
                >
                  CAFÉTA
                </span>
              )}
            </div>
          )}
        </Link>

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-24
            bg-gradient-to-b
            from-black/15
            to-transparent
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            right-3
            top-3
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

        {!business.today_is_closed && (
          <div
            className="
              absolute
              bottom-3
              left-3
              flex items-center
              gap-1.5
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-[#006241]
              shadow-sm
              backdrop-blur
            "
          >
            <span
              className="
                size-1.5
                rounded-full
                bg-[#006241]
              "
            />

            Open today
          </div>
        )}
      </div>

      <div className="p-5">
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <p
                className="
                  text-[10px]
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

              {business.is_verified && (
                <BadgeCheck
                  className="
                    size-3.5
                    fill-[#006241]
                    text-white
                  "
                />
              )}
            </div>

            <Link
              href={`/place/${business.slug}`}
            >
              <h3
                className="
                  mt-1
                  truncate
                  text-lg
                  font-black
                  tracking-[-0.03em]
                  text-[#17211c]
                  transition-colors
                  group-hover:text-[#006241]
                "
              >
                {business.name}
              </h3>
            </Link>
          </div>

          {reviews > 0 && (
            <div
              className="
                flex shrink-0
                items-center
                gap-1
                text-xs
                font-bold
                text-[#17211c]
              "
            >
              <Star
                className="
                  size-3.5
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
              text-xs
              leading-5
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
            mt-4 flex
            items-center
            justify-between
            gap-3
            border-t
            border-black/[0.05]
            pt-3
            text-[11px]
            text-black/40
          "
        >
          <span
            className="
              flex min-w-0
              items-center
              gap-1.5
            "
          >
            <MapPin className="size-3.5 shrink-0" />

            <span className="truncate">
              {location ||
                business.address}
            </span>
          </span>

          {reviews > 0 ? (
            <span className="shrink-0">
              {reviews}{" "}
              {reviews === 1
                ? "review"
                : "reviews"}
            </span>
          ) : (
            <span className="shrink-0">
              New
            </span>
          )}
        </div>

        {business.today_opens_at &&
          business.today_closes_at && (
            <div
              className="
                mt-2
                flex items-center
                gap-1.5
                text-[10px]
                font-medium
                text-black/35
              "
            >
              <Clock3 className="size-3" />

              {business.today_is_closed
                ? "Closed today"
                : `${formatTime(
                    business.today_opens_at,
                  )} – ${formatTime(
                    business.today_closes_at,
                  )}`}
            </div>
          )}
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

    case "milk_tea":
      return "Milk Tea";

    case "cafe":
      return "Café";

    case "bakery":
      return "Bakery";

    default:
      return category.replace(
        /_/g,
        " ",
      );
  }
}

function formatTime(
  value: string,
) {
  const [
    hours,
    minutes,
  ] = value.split(":");

  const date =
    new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0,
  );

  return new Intl.DateTimeFormat(
    "en-PH",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}