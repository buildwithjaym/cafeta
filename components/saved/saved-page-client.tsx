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

import {
  toast,
} from "sonner";

import {
  SavedBusinessCard,
} from "@/components/saved/saved-business-card";

import {
  SavedEmptyState,
} from "@/components/saved/saved-empty-state";

import {
  createClient,
} from "@/lib/supabase/client";

/* =========================================================
   TYPES
========================================================= */

export type SavedBusinessCategory =
  | "coffee_shop"
  | "cafe"
  | "milk_tea"
  | "bakery_cafe"
  | "restaurant_cafe"
  | "other";

export type SavedBusiness = {
  savedId: string;

  savedAt: string;

  business: {
    id: string;

    name: string;

    slug: string;

    category: SavedBusinessCategory;

    description:
      | string
      | null;

    logo_url:
      | string
      | null;

    cover_url:
      | string
      | null;

    address: string;

    barangay:
      | string
      | null;

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

/* =========================================================
   FILTERS
========================================================= */

const FILTERS: {
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

const COFFEE_CATEGORIES: SavedBusinessCategory[] =
  [
    "coffee_shop",
    "cafe",
    "bakery_cafe",
    "restaurant_cafe",
  ];

/* =========================================================
   COMPONENT
========================================================= */

export function SavedPageClient({
  initialSaved,
  hasError = false,
}: Props) {
  const [
    saved,
    setSaved,
  ] =
    useState<SavedBusiness[]>(
      initialSaved,
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    filter,
    setFilter,
  ] =
    useState<Filter>(
      "all",
    );

  const [
    removingId,
    setRemovingId,
  ] =
    useState<
      string | null
    >(null);

  /* =======================================================
     FILTERED SAVED BUSINESSES
  ======================================================= */

  const visibleSaved =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return saved.filter(
        (item) => {
          const business =
            item.business;

          const searchable =
            [
              business.name,
              business.address,
              business.barangay,
              business.city,
              business.province,
            ];

          const matchesSearch =
            !query ||
            searchable.some(
              (value) =>
                value
                  ?.toLowerCase()
                  .includes(
                    query,
                  ),
            );

          if (
            !matchesSearch
          ) {
            return false;
          }

          if (
            filter ===
            "coffee"
          ) {
            return COFFEE_CATEGORIES.includes(
              business.category,
            );
          }

          if (
            filter ===
            "milk-tea"
          ) {
            return (
              business.category ===
              "milk_tea"
            );
          }

          return true;
        },
      );
    }, [
      saved,
      search,
      filter,
    ]);

  /* =======================================================
     REMOVE SAVED BUSINESS
  ======================================================= */

  async function handleRemove(
    item: SavedBusiness,
  ) {
    if (removingId) {
      return;
    }

    setRemovingId(
      item.savedId,
    );

    const previousSaved =
      saved;

    /*
     * Optimistic UI.
     */
    setSaved(
      (current) =>
        current.filter(
          (savedItem) =>
            savedItem.savedId !==
            item.savedId,
        ),
    );

    try {
      const supabase =
        createClient();

      const {
        error,
      } =
        await supabase
          .from(
            "saved_businesses",
          )
          .delete()
          .eq(
            "id",
            item.savedId,
          );

      if (error) {
        throw error;
      }

      toast.success(
        "Removed from saved",
        {
          description:
            `${item.business.name} was removed from your saved places.`,
        },
      );
    } catch (error) {
      /*
       * Restore if the delete fails.
       */
      setSaved(
        previousSaved,
      );

      console.error(
        "[CAFÉTA] Failed to remove saved business:",
        error,
      );

      toast.error(
        "Couldn't remove saved place",
        {
          description:
            "Please try again.",
        },
      );
    } finally {
      setRemovingId(
        null,
      );
    }
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (hasError) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-[#f7f8f6] px-5 pb-28 md:pb-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 max-w-sm text-center duration-300">
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
            onClick={() => {
              window.location.reload();
            }}
            className="mt-5 rounded-full bg-[#006241] px-5 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00754a] active:translate-y-0 active:scale-[0.98]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-[#f7f8f6] pb-28 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-9 lg:px-8">

        {/* Header */}

        <header className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-5 duration-300 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#006241]">
              Your collection
            </p>

            <h1 className="mt-2 text-[2rem] font-black tracking-[-0.055em] text-[#17211c] sm:text-[2.5rem]">
              Saved places
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-black/45">
              Keep the cafés, coffee
              shops, and milk-tea places
              you want to visit again.
            </p>
          </div>

          {saved.length > 0 && (
            <p className="text-sm text-black/40">
              <span className="font-bold text-[#17211c]">
                {saved.length}
              </span>{" "}
              {saved.length === 1
                ? "place"
                : "places"}{" "}
              saved
            </p>
          )}
        </header>

        {/* Search + filters */}

        {saved.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 mt-7 flex flex-col gap-3 duration-500 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />

              <input
                type="search"
                value={search}
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target
                      .value,
                  );
                }}
                placeholder="Search saved places..."
                aria-label="Search saved places"
                className="h-12 w-full rounded-full border border-black/[0.07] bg-white pl-11 pr-11 text-sm text-[#17211c] shadow-sm outline-none transition-all duration-200 placeholder:text-black/30 hover:border-black/[0.12] focus:border-[#006241]/30 focus:ring-4 focus:ring-[#006241]/[0.06]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-black/35 transition-all hover:bg-black/[0.04] hover:text-black/60 active:scale-95"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:pb-0">
              {FILTERS.map(
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
                      onClick={() => {
                        setFilter(
                          item.value,
                        );
                      }}
                      aria-pressed={
                        active
                      }
                      className={[
                        "flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-xs font-bold transition-all duration-200 active:scale-95",

                        active
                          ? "border-[#006241] bg-[#006241] text-white shadow-[0_5px_14px_rgba(0,98,65,0.12)]"
                          : "border-black/[0.07] bg-white text-[#455049] hover:-translate-y-0.5 hover:border-[#006241]/20 hover:text-[#006241] hover:shadow-sm",
                      ].join(
                        " ",
                      )}
                    >
                      <Icon className="size-3.5" />

                      {item.label}
                    </button>
                  );
                },
              )}
            </div>
          </section>
        )}

        {/* No saved businesses */}

        {saved.length ===
        0 ? (
          <SavedEmptyState />
        ) : visibleSaved.length ===
          0 ? (
          <section className="animate-in fade-in py-24 text-center duration-300">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f2ed]">
              <Search className="size-5 text-[#006241]" />
            </div>

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
              className="mt-5 rounded-full px-4 py-2 text-sm font-bold text-[#006241] transition hover:bg-[#e8f2ed] active:scale-95"
            >
              Clear filters
            </button>
          </section>
        ) : (
          <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleSaved.map(
              (
                item,
                index,
              ) => (
                <div
                  key={
                    item.savedId
                  }
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{
                    animationDelay:
                      `${Math.min(
                        index * 45,
                        225,
                      )}ms`,

                    animationFillMode:
                      "both",
                  }}
                >
                  <SavedBusinessCard
                    item={item}
                    removing={
                      removingId ===
                      item.savedId
                    }
                    onRemove={() => {
                      void handleRemove(
                        item,
                      );
                    }}
                  />
                </div>
              ),
            )}
          </section>
        )}
      </div>
    </main>
  );
}