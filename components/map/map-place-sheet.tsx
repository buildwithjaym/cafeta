"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Coffee,
  MapPin,
  Navigation,
  X,
} from "lucide-react";
import {
  useState,
} from "react";

import type {
  MapBusiness,
} from "@/lib/map/types";

type Props = {
  business: MapBusiness;
  onDirections: () => void;
  onClose: () => void;
};

const CATEGORY_LABELS: Record<
  MapBusiness["category"],
  string
> = {
  coffee_shop: "Coffee Shop",
  cafe: "Café",
  milk_tea: "Milk Tea",
  bakery_cafe: "Bakery Café",
  restaurant_cafe: "Restaurant Café",
  other: "Other",
};

export function MapPlaceSheet({
  business,
  onDirections,
  onClose,
}: Props) {
  const [logoError, setLogoError] =
    useState(false);

  const categoryLabel =
    CATEGORY_LABELS[
      business.category
    ];

  const location = [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");

  const showLogo =
    Boolean(
      business.logo_url,
    ) && !logoError;

  return (
    <div
      className="
        absolute
        inset-x-3
        bottom-[100px]
        z-30

        animate-in
        fade-in
        slide-in-from-bottom-3
        duration-300

        md:bottom-6
        md:left-6
        md:right-auto
        md:w-[430px]
      "
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-black/[0.06]
          bg-white/95
          shadow-[0_20px_60px_rgba(0,0,0,0.18)]
          backdrop-blur-2xl
        "
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close business preview"
          className="
            absolute
            right-3
            top-3
            z-20

            flex
            size-9
            items-center
            justify-center

            rounded-full
            border
            border-black/[0.06]
            bg-white

            text-black/45

            shadow-[0_4px_14px_rgba(0,0,0,0.10)]

            transition-all
            duration-200

            hover:scale-105
            hover:bg-[#f5f7f5]
            hover:text-black/70

            active:scale-95
          "
        >
          <X
            className="size-4"
            strokeWidth={2}
          />
        </button>

        {/* Business information */}
        <div
          className="
            flex
            items-start
            gap-4
            p-4
            pr-14
          "
        >
          {/* Business logo */}
          <div
            className="
              relative
              size-[88px]
              shrink-0
              overflow-hidden

              rounded-[22px]
              border
              border-black/[0.06]

              bg-[#f1f5f2]

              shadow-[0_8px_22px_rgba(0,0,0,0.08)]

              animate-in
              zoom-in-95
              fade-in
              duration-300
            "
          >
            {showLogo ? (
              <Image
                src={
                  business.logo_url!
                }
                alt={`${business.name} logo`}
                fill
                sizes="88px"
                className="
                  object-cover
                  transition-transform
                  duration-300
                  hover:scale-[1.04]
                "
                onError={() => {
                  setLogoError(
                    true,
                  );
                }}
              />
            ) : (
              <div
                className="
                  flex
                  size-full
                  items-center
                  justify-center
                  bg-[#edf5f1]
                "
              >
                <div
                  className="
                    flex
                    size-11
                    items-center
                    justify-center
                    rounded-full
                    bg-[#006241]
                    text-white
                  "
                >
                  <Coffee
                    className="size-5"
                    strokeWidth={2}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Information */}
          <div
            className="
              min-w-0
              flex-1
              pt-1
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
              <h3
                className="
                  truncate
                  text-[16px]
                  font-black
                  tracking-[-0.035em]
                  text-[#17211c]
                "
              >
                {business.name}
              </h3>

              {business.is_verified && (
                <BadgeCheck
                  className="
                    size-4
                    shrink-0
                    text-[#006241]
                  "
                  aria-label="Verified business"
                />
              )}
            </div>

            <p
              className="
                mt-1
                text-[10px]
                font-bold
                uppercase
                tracking-[0.11em]
                text-[#006241]
              "
            >
              {categoryLabel}
            </p>

            <div
              className="
                mt-3
                flex
                items-start
                gap-1.5
                text-[11px]
                leading-4
                text-black/45
              "
            >
              <MapPin
                className="
                  mt-[1px]
                  size-3.5
                  shrink-0
                  text-[#006241]
                "
                strokeWidth={2}
              />

              <span className="line-clamp-2">
                {business.address}
              </span>
            </div>

            {location && (
              <p
                className="
                  mt-1.5
                  truncate
                  pl-5
                  text-[10px]
                  text-black/30
                "
              >
                {location}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          className="
            grid
            grid-cols-2
            gap-2
            border-t
            border-black/[0.05]
            bg-[#fcfdfc]
            p-3
          "
        >
          <button
            type="button"
            onClick={
              onDirections
            }
            className="
              group
              flex
              h-11
              items-center
              justify-center
              gap-2

              rounded-[15px]
              bg-[#e8f2ed]

              text-xs
              font-bold
              text-[#006241]

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:bg-[#dcebe3]

              active:translate-y-0
              active:scale-[0.98]
            "
          >
            <Navigation
              className="
                size-3.5
                transition-transform
                duration-200

                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />

            Directions
          </button>

          <Link
            href={`/place/${business.slug}`}
            className="
              group
              flex
              h-11
              items-center
              justify-center
              gap-2

              rounded-[15px]
              bg-[#006241]

              text-xs
              font-bold
              text-white

              shadow-[0_5px_14px_rgba(0,98,65,0.15)]

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:bg-[#00754a]

              active:translate-y-0
              active:scale-[0.98]
            "
          >
            View place

            <ArrowRight
              className="
                size-3.5
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
            />
          </Link>
        </div>
      </div>
    </div>
  );
}