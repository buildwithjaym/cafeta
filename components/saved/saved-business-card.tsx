"use client";

import Image from "next/image";
import Link from "next/link";

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
};

const categoryLabels = {
  coffee_shop: "Coffee Shop",
  cafe: "Café",
  milk_tea: "Milk Tea",
  bakery_cafe: "Bakery Café",
  restaurant_cafe:
    "Restaurant Café",
  other: "Other",
};

export function SavedBusinessCard({
  item,
  removing,
  onRemove,
}: Props) {
  const business =
    item.business;

  const category =
    categoryLabels[
      business.category
    ];

  const location = [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group overflow-hidden rounded-[26px] border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8eeea]">
        {business.cover_url ? (
          <Image
            src={
              business.cover_url
            }
            alt={business.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#edf4f0] to-[#dfeae4]">
            <div className="flex size-14 items-center justify-center rounded-full bg-white/80 shadow-sm">
              <Coffee className="size-6 text-[#006241]" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          aria-label={`Remove ${business.name} from saved`}
          className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/95 text-[#006241] shadow-sm backdrop-blur transition hover:scale-105 disabled:pointer-events-none"
        >
          {removing ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Heart className="size-[18px] fill-[#006241]" />
          )}
        </button>

        <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#006241] shadow-sm backdrop-blur">
          {category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-[16px] font-bold tracking-[-0.025em] text-[#17211c]">
                {business.name}
              </h2>

              {business.is_verified && (
                <BadgeCheck className="size-4 shrink-0 text-[#006241]" />
              )}
            </div>

            <div className="mt-2 flex items-start gap-1.5 text-xs text-black/40">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#006241]" />

              <span className="line-clamp-1">
                {location ||
                  business.address}
              </span>
            </div>
          </div>
        </div>

        {business.description && (
          <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-black/45">
            {business.description}
          </p>
        )}

        <Link
          href={`/place/${business.slug}`}
          className="mt-4 flex h-10 items-center justify-between rounded-[14px] bg-[#f2f6f3] px-3.5 text-xs font-bold text-[#006241] transition hover:bg-[#e6efe9]"
        >
          View place

          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}