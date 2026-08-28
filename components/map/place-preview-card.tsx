"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Heart,
  MapPin,
  Navigation,
  Star,
} from "lucide-react";

export type MapPlace = {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  open: boolean;
  image: string;
  latitude: number;
  longitude: number;
};

export function PlacePreviewCard({
  place,
  onDirections,
}: {
  place: MapPlace;
  onDirections: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-white shadow-[0_15px_45px_rgba(0,0,0,0.15)]">
      <div className="flex">
        <div className="h-[150px] w-[130px] shrink-0 bg-[#edf0ed] sm:w-[170px]">
          <img
            src={place.image}
            alt={place.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#006241]">
                {place.category}
              </p>

              <h3 className="mt-1 truncate text-base font-bold tracking-[-0.025em] text-[#17211c]">
                {place.name}
              </h3>
            </div>

            <button
              type="button"
              aria-label="Save place"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f4f6f4] text-black/55 transition hover:text-[#006241]"
            >
              <Heart className="size-4" />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-[#17211c]">
              <Star className="size-3 fill-[#006241] text-[#006241]" />
              {place.rating}
            </span>

            <span className="text-black/30">
              {place.reviews} reviews
            </span>

            <span className="text-black/20">•</span>

            <span
              className={
                place.open
                  ? "font-medium text-[#006241]"
                  : "font-medium text-red-600"
              }
            >
              {place.open ? "Open" : "Closed"}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-black/40">
            <MapPin className="size-3 shrink-0" />

            <span className="truncate">
              {place.address}
            </span>

            <span>·</span>

            <span className="shrink-0">
              {place.distance}
            </span>
          </div>

          <div className="mt-auto flex gap-2 pt-3">
            <button
              type="button"
              onClick={onDirections}
              className="flex h-8 items-center gap-1.5 rounded-full bg-[#006241] px-3 text-[11px] font-semibold text-white"
            >
              <Navigation className="size-3" />
              Directions
            </button>

            <Link
              href={`/place/${place.slug}`}
              className="flex h-8 items-center gap-1.5 rounded-full border border-black/[0.08] px-3 text-[11px] font-semibold text-[#17211c]"
            >
              View
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}