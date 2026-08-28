"use client";

import {
  Coffee,
  CupSoda,
  Flame,
  Images,
  MapPin,
  Sparkles,
} from "lucide-react";

import type {
  MapFilter,
} from "@/lib/map/types";

type MapFiltersProps = {
  active: MapFilter;

  onChange: (
    filter: MapFilter,
  ) => void;
};

const filters: {
  value: MapFilter;
  label: string;
  icon: typeof Coffee;
}[] = [
  {
    value: "all",
    label: "All",
    icon: Sparkles,
  },
  {
    value: "trending",
    label: "Trending",
    icon: Flame,
  },
  {
    value: "memories",
    label: "Memories",
    icon: Images,
  },
  {
    value: "coffee",
    label: "Coffee",
    icon: Coffee,
  },
  {
    value: "milk-tea",
    label: "Milk Tea",
    icon: CupSoda,
  },
  {
    value: "nearby",
    label: "Nearby",
    icon: MapPin,
  },
];

export function MapFilters({
  active,
  onChange,
}: MapFiltersProps) {
  return (
    <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filters.map(
        (filter) => {
          const Icon =
            filter.icon;

          const isActive =
            active ===
            filter.value;

          const trending =
            filter.value ===
            "trending";

          return (
            <button
              key={
                filter.value
              }
              type="button"
              onClick={() =>
                onChange(
                  filter.value,
                )
              }
              aria-pressed={
                isActive
              }
              className={`
                flex h-9 shrink-0
                items-center
                justify-center
                gap-1.5
                rounded-full
                border px-3.5
                text-xs font-semibold
                shadow-sm
                transition-all
                duration-200
                active:scale-95

                ${
                  isActive &&
                  trending
                    ? "border-[#e76f22] bg-[#e76f22] text-white shadow-[0_5px_16px_rgba(231,111,34,0.20)]"
                    : isActive
                      ? "border-[#006241] bg-[#006241] text-white shadow-[0_5px_16px_rgba(0,98,65,0.18)]"
                      : "border-black/[0.07] bg-white/95 text-[#39443e] hover:border-[#006241]/20 hover:bg-[#f7faf8]"
                }
              `}
            >
              <Icon
                className="size-3.5"
                strokeWidth={
                  isActive
                    ? 2.5
                    : 2
                }
              />

              {
                filter.label
              }
            </button>
          );
        },
      )}
    </div>
  );
}