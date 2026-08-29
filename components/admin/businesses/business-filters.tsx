"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type BusinessFilter =
  | "all"
  | "pending"
  | "approved"
  | "verified"
  | "rejected"
  | "suspended";

type BusinessFiltersProps = {
  activeFilter: BusinessFilter;
  counts: {
    all: number;
    pending: number;
    approved: number;
    verified: number;
    rejected: number;
    suspended: number;
  };
  initialSearch: string;
};

const filters: {
  value: BusinessFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

export function BusinessFilters({
  activeFilter,
  counts,
  initialSearch,
}: BusinessFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);

  function updateParams({
    status,
    query,
  }: {
    status?: BusinessFilter;
    query?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    if (status !== undefined) {
      if (status === "all") {
        params.delete("status");
      } else {
        params.set("status", status);
      }
    }

    if (query !== undefined) {
      const cleanQuery = query.trim();

      if (cleanQuery) {
        params.set("q", cleanQuery);
      } else {
        params.delete("q");
      }
    }

    const queryString = params.toString();

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false },
    );
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (search.trim() !== initialSearch.trim()) {
        updateParams({ query: search });
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  return (
    <div className="border-b border-black/[0.06]">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-1">
            {filters.map((filter) => {
              const active = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => updateParams({ status: filter.value })}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-[#006241] text-white"
                      : "text-black/50 hover:bg-black/[0.04] hover:text-black"
                  }`}
                >
                  {filter.label}

                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      active ? "bg-white/15 text-white" : "bg-black/[0.05]"
                    }`}
                  >
                    {counts[filter.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full lg:w-[300px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/30" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search businesses..."
            className="h-10 w-full rounded-xl border border-black/[0.07] bg-[#FAFBFA] pl-10 pr-10 text-sm text-[#111713] outline-none transition focus:border-[#006241]/30 focus:bg-white focus:ring-4 focus:ring-[#006241]/5"
          />

          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateParams({ query: "" });
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-black/35 hover:bg-black/[0.05] hover:text-black"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}