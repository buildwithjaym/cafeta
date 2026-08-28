"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

type MapSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onFilterClick: () => void;
};

export function MapSearch({
  value,
  onChange,
  onFilterClick,
}: MapSearchProps) {
  return (
    <div className="flex h-12 w-full items-center rounded-2xl border border-black/[0.07] bg-white/95 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-xl sm:h-13 sm:rounded-full">
      <Search className="ml-3.5 size-[18px] shrink-0 text-[#006241]" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search cafés or milk tea..."
        className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#17211c] outline-none placeholder:text-black/35"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="mr-1 flex size-8 items-center justify-center rounded-full text-black/35 transition hover:bg-black/[0.05] hover:text-black/70"
        >
          <X className="size-4" />
        </button>
      )}

      <button
        type="button"
        onClick={onFilterClick}
        aria-label="Open filters"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#006241] text-white transition hover:bg-[#004f35]"
      >
        <SlidersHorizontal className="size-4" />
      </button>
    </div>
  );
}