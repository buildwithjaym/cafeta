"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Coffee,
  CupSoda,
  Search,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import { SavedBusinessCard } from "@/components/saved/saved-business-card";
import { SavedEmptyState } from "@/components/saved/saved-empty-state";

type BusinessCategory =
  | "coffee_shop"
  | "cafe"
  | "milk_tea"
  | "bakery_cafe"
  | "restaurant_cafe"
  | "other";

type SavedBusiness = {
  savedId: string;

  savedAt: string;

  business: {
    id: string;
    name: string;
    slug: string;

    category: BusinessCategory;

    description: string | null;

    logo_url: string | null;
    cover_url: string | null;

    address: string;
    barangay: string | null;
    city: string;
    province: string;

    latitude: number;
    longitude: number;

    is_verified: boolean;
  };
};

type Props = {
  initialSaved: SavedBusiness[];
  hasError?: boolean;
};

type Filter =
  | "all"
  | "coffee"
  | "milk-tea";

const filters: {
  value: Filter;
  label: string;
  icon: typeof Coffee;
}[] = [
  {
    value: "all",
    label: "All",
    icon: Coffee,
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
];

export function SavedPageClient({
  initialSaved,
  hasError = false,
}: Props) {
  const [saved, setSaved] =
    useState(initialSaved);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<Filter>("all");

  const [removingId, setRemovingId] =
    useState<string | null>(null);

  const visibleSaved = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return saved.filter((item) => {
      const business = item.business;

      const matchesSearch =
        !query ||
        business.name
          .toLowerCase()
          .includes(query) ||
        business.address
          .toLowerCase()
          .includes(query) ||
        business.city
          .toLowerCase()
          .includes(query) ||
        business.province
          .toLowerCase()
          .includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (filter === "coffee") {
        return [
          "coffee_shop",
          "cafe",
          "bakery_cafe",
          "restaurant_cafe",
        ].includes(
          business.category,
        );
      }

      if (filter === "milk-tea") {
        return (
          business.category ===
          "milk_tea"
        );
      }

      return true;
    });
  }, [
    filter,
    saved,
    search,
  ]);

  async function removeSaved(
    item: SavedBusiness,
  ) {
    if (removingId) {
      return;
    }

    setRemovingId(item.savedId);

    const previous = saved;

    setSaved((current) =>
      current.filter(
        (savedItem) =>
          savedItem.savedId !==
          item.savedId,
      ),
    );

    const supabase =
      createClient();

    const { error } =
      await supabase
        .from("saved_businesses")
        .delete()
        .eq(
          "id",
          item.savedId,
        );

    if (error) {
      setSaved(previous);

      toast.error(
        "Couldn't remove saved place",
        {
          description:
            "Please try again.",
        },
      );

      setRemovingId(null);

      return;
    }

    toast.success(
      "Removed from saved",
      {
        description:
          `${item.business.name} was removed from your saved places.`,
      },
    );

    setRemovingId(null);
  }

  if (hasError) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-[#f7f8f6] px-5 pb-28 md:pb-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f2ed]">
            <Coffee className="size-5 text-[#006241]" />
          </div>

          <h1 className="mt-5 text-xl font-bold tracking-[-0.035em] text-[#17211c]">
            Saved places unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-black/45">
            We couldn&apos;t load your
            saved places right now.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-full bg-[#006241] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#00754a]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-[#f7f8f6] pb-28 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-9 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#006241]">
              Your collection
            </p>

            <h1 className="mt-2 text-[2rem] font-black tracking-[-0.055em] text-[#17211c] sm:text-[2.5rem]">
              Saved places
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-black/45">
              Keep the cafés and
              milk-tea shops you want
              to visit again.
            </p>
          </div>

          {saved.length > 0 && (
            <div className="text-sm text-black/40">
              <span className="font-bold text-[#17211c]">
                {saved.length}
              </span>{" "}
              {saved.length === 1
                ? "place"
                : "places"}{" "}
              saved
            </div>
          )}
        </div>

        {saved.length > 0 && (
          <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search saved places..."
                className="h-12 w-full rounded-full border border-black/[0.07] bg-white pl-11 pr-11 text-sm text-[#17211c] shadow-sm outline-none transition placeholder:text-black/30 focus:border-[#006241]/30 focus:ring-4 focus:ring-[#006241]/[0.06]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-black/35 transition hover:bg-black/[0.04]"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filters.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    filter ===
                    item.value;

                  return (
                    <button
                      key={
                        item.value
                      }
                      type="button"
                      onClick={() =>
                        setFilter(
                          item.value,
                        )
                      }
                      className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-xs font-bold transition active:scale-95 ${
                        active
                          ? "border-[#006241] bg-[#006241] text-white"
                          : "border-black/[0.07] bg-white text-[#455049] hover:border-[#006241]/20"
                      }`}
                    >
                      <Icon className="size-3.5" />

                      {item.label}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        )}

        {saved.length === 0 ? (
          <SavedEmptyState />
        ) : visibleSaved.length ===
          0 ? (
          <div className="py-24 text-center">
            <Search className="mx-auto size-6 text-black/25" />

            <h2 className="mt-4 text-base font-bold text-[#17211c]">
              No matching places
            </h2>

            <p className="mt-2 text-sm text-black/40">
              Try another search or
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-5 text-sm font-bold text-[#006241] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleSaved.map(
              (item) => (
                <SavedBusinessCard
                  key={
                    item.savedId
                  }
                  item={item}
                  removing={
                    removingId ===
                    item.savedId
                  }
                  onRemove={() =>
                    removeSaved(
                      item,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export type {
  SavedBusiness,
};