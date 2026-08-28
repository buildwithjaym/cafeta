"use client";

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  Coffee,
  Flame,
  Images,
  MapPin,
  Navigation,
  Sparkles,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
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
  other: "Local Spot",
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

  useEffect(() => {
    setLogoFailed(false);
  }, [
    business.id,
    business.logo_url,
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
          .filter(Boolean)
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

  const showLogo =
    Boolean(
      business.logo_url,
    ) &&
    !logoFailed;

  const memoryCount =
    business.memoryActivity
      ?.memory_count ?? 0;

  const hasMemories =
    memoryCount > 0;

  const activityLabel =
    business.memoryActivityLabel;

  return (
    <div
      key={business.id}
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
          relative overflow-hidden
          rounded-[28px]
          border border-black/[0.06]
          bg-white/95

          shadow-[0_20px_60px_rgba(0,0,0,0.16)]
          backdrop-blur-xl

          transition-[transform,box-shadow]
          duration-300

          hover:shadow-[0_24px_70px_rgba(0,0,0,0.18)]
        "
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close business preview"
          className="
            absolute right-3 top-3 z-30

            flex size-9
            items-center
            justify-center

            rounded-full
            border border-black/[0.06]
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
            strokeWidth={2}
          />
        </button>

        <div className="flex items-center gap-4 p-4 pr-14">
          <Link
            href={businessUrl}
            aria-label={`View ${business.name} business profile`}
            className="
              group/logo
              relative

              size-[88px]
              shrink-0
              overflow-hidden

              rounded-[22px]
              border border-black/[0.06]
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
                  block size-full
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
                    strokeWidth={2}
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
                  strokeWidth={2.4}
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
                    {memoryCount}{" "}
                    {memoryCount ===
                    1
                      ? "memory"
                      : "memories"}
                  </span>
                )}
              </div>
            )}

            <div
              className="
                mt-3
                flex items-start
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
                {
                  business.address
                }
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

        {hasMemories && (
          <div className="px-3 pb-3">
            <Link
              href={memoriesUrl}
              className="
                group/memories

                flex items-center
                justify-between
                gap-3

                rounded-[17px]
                border border-[#006241]/[0.07]
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
                    {memoryCount}{" "}
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
                  duration-200

                  group-hover/memories:translate-x-0.5
                "
              />
            </Link>
          </div>
        )}

        <div
          className="
            grid grid-cols-2
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
              strokeWidth={2}
            />

            Directions
          </button>

          <Link
            href={businessUrl}
            aria-label={`View ${business.name} business profile`}
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
              duration-200

              hover:-translate-y-0.5
              hover:bg-[#00754a]

              hover:shadow-[0_8px_18px_rgba(0,98,65,0.18)]

              active:translate-y-0
              active:scale-[0.98]
            "
          >
            View business

            <ArrowRight
              className="
                size-3.5

                transition-transform
                duration-200

                group-hover:translate-x-0.5
              "
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ActivityBadge({
  icon,
  label,
  variant,
}: {
  icon: React.ReactNode;
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