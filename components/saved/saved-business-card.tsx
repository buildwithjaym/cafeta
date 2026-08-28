"use client";

import Link from "next/link";
import {
  useState,
} from "react";

import {
  ArrowUpRight,
  BadgeCheck,
  Coffee,
  Heart,
  LoaderCircle,
  MapPin,
} from "lucide-react";

import type {
  SavedBusiness,
} from "@/components/saved/saved-page-client";

type Props = {
  item: SavedBusiness;
  removing: boolean;
  onRemove: () => void;
  index?: number;
};

const categoryLabels: Record<
  string,
  string
> = {
  coffee_shop: "Coffee Shop",
  cafe: "Café",
  milk_tea: "Milk Tea",
  bakery: "Bakery",
  bakery_cafe: "Bakery Café",
  restaurant_cafe:
    "Restaurant Café",
  other: "Other",
};

export function SavedBusinessCard({
  item,
  removing,
  onRemove,
  index = 0,
}: Props) {
  const business =
    item.business;

  const [
    logoFailed,
    setLogoFailed,
  ] = useState(false);

  const category =
    categoryLabels[
      business.category
    ] ??
    business.category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (value) =>
        value.toUpperCase(),
      );

  const location = [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");

  const hasLogo =
    Boolean(
      business.logo_url,
    ) &&
    !logoFailed;

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
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
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
          bg-[#e8eeea]
        "
      >
        <Link
          href={`/business/${business.slug}`}
          className="block size-full"
        >
          {hasLogo ? (
            <img
              src={
                business.logo_url!
              }
              alt={`${business.name} logo`}
              loading="lazy"
              onError={() =>
                setLogoFailed(
                  true,
                )
              }
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
                flex
                size-full
                items-center
                justify-center
                bg-gradient-to-br
                from-[#edf5f1]
                to-[#e2ece7]
              "
            >
              <div
                className="
                  flex
                  size-16
                  items-center
                  justify-center
                  rounded-[20px]
                  bg-white/90
                  text-[#006241]
                  shadow-sm
                  backdrop-blur
                "
              >
                <Coffee className="size-7" />
              </div>
            </div>
          )}
        </Link>

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-28
            bg-gradient-to-b
            from-black/10
            to-transparent
          "
        />

        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          aria-label={`Remove ${business.name} from saved`}
          className="
            absolute
            right-3
            top-3
            z-10
            flex
            size-10
            items-center
            justify-center
            rounded-full
            border
            border-white/40
            bg-white/95
            text-[#006241]
            shadow-[0_4px_14px_rgba(0,0,0,0.08)]
            backdrop-blur-md
            transition-all
            duration-200
            hover:scale-105
            hover:bg-white
            hover:shadow-md
            active:scale-90
            disabled:pointer-events-none
            disabled:opacity-60
          "
        >
          {removing ? (
            <LoaderCircle
              className="
                size-4
                animate-spin
              "
            />
          ) : (
            <Heart
              className="
                size-[18px]
                fill-[#006241]
              "
            />
          )}
        </button>

        <div
          className="
            absolute
            bottom-3
            left-3
            z-10
            rounded-full
            border
            border-white/50
            bg-white/95
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.08em]
            text-[#006241]
            shadow-sm
            backdrop-blur-md
          "
        >
          {category}
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
            <div
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <Link
                href={`/business/${business.slug}`}
                className="min-w-0"
              >
                <h2
                  className="
                    truncate
                    text-[16px]
                    font-bold
                    tracking-[-0.025em]
                    text-[#17211c]
                    transition-colors
                    duration-200
                    group-hover:text-[#006241]
                  "
                >
                  {business.name}
                </h2>
              </Link>

              {business.is_verified && (
                <BadgeCheck
                  className="
                    size-4
                    shrink-0
                    text-[#006241]
                  "
                />
              )}
            </div>

            <div
              className="
                mt-2
                flex
                items-start
                gap-1.5
                text-xs
                text-black/40
              "
            >
              <MapPin
                className="
                  mt-0.5
                  size-3.5
                  shrink-0
                  text-[#006241]
                "
              />

              <span className="line-clamp-1">
                {location ||
                  business.address}
              </span>
            </div>
          </div>
        </div>

        {business.description && (
          <p
            className="
              mt-3
              line-clamp-2
              min-h-10
              text-xs
              leading-5
              text-black/45
            "
          >
            {
              business.description
            }
          </p>
        )}

        <Link
          href={`/business/${business.slug}`}
          className="
            group/link
            mt-4
            flex
            h-10
            items-center
            justify-between
            rounded-[14px]
            bg-[#f2f6f3]
            px-3.5
            text-xs
            font-bold
            text-[#006241]
            transition-all
            duration-200
            hover:bg-[#e6efe9]
            active:scale-[0.99]
          "
        >
          View place

          <ArrowUpRight
            className="
              size-3.5
              transition-transform
              duration-200
              group-hover/link:-translate-y-0.5
              group-hover/link:translate-x-0.5
            "
          />
        </Link>
      </div>
    </article>
  );
}