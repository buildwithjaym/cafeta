"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Grid2X2,
  List,
  MapPin,
  Search,
  ShieldAlert,
  Store,
  X,
  XCircle,
} from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  useState,
  useTransition,
} from "react";

import { BusinessPagination } from "@/components/admin/businesses/business-pagination";
import { BusinessStatusBadge } from "@/components/admin/businesses/business-status-badge";
import type {
  AdminBusinessCounts,
  AdminBusinessSort,
  AdminBusinessStatusFilter,
} from "@/lib/admin/get-admin-businesses";

export type AdminBusiness = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  address: string;
  barangay: string | null;
  city: string;
  province: string;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "rejected"
    | "suspended";
  is_verified: boolean;
  created_at: string;
  submitted_at: string | null;
  owner: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
};

type AdminBusinessBrowserProps = {
  businesses: AdminBusiness[];
  counts: AdminBusinessCounts;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  status: AdminBusinessStatusFilter;
  search: string;
  sort: AdminBusinessSort;
};

type ViewMode =
  | "grid"
  | "list";

const filters: {
  value: AdminBusinessStatusFilter;
  label: string;
  icon: typeof Store;
}[] = [
  {
    value: "all",
    label: "All",
    icon: Store,
  },
  {
    value: "pending",
    label: "Pending",
    icon: Clock3,
  },
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle2,
  },
  {
    value: "verified",
    label: "Verified",
    icon: BadgeCheck,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
  },
  {
    value: "suspended",
    label: "Suspended",
    icon: ShieldAlert,
  },
];

const sortOptions: {
  value: AdminBusinessSort;
  label: string;
}[] = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "oldest",
    label: "Oldest first",
  },
  {
    value: "name",
    label: "Name A–Z",
  },
];

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}

function formatCategory(
  category: string,
) {
  return category
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Not submitted";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(value));
}

function getOwnerName(
  business: AdminBusiness,
) {
  if (
    business.owner?.username
  ) {
    return `@${business.owner.username}`;
  }

  if (
    business.owner?.full_name
  ) {
    return business.owner.full_name;
  }

  return "CAFÉTA owner";
}

function getLocation(
  business: AdminBusiness,
) {
  return [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");
}

export function AdminBusinessBrowser({
  businesses,
  counts,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  status,
  search,
  sort,
}: AdminBusinessBrowserProps) {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [
    searchValue,
    setSearchValue,
  ] = useState(search);

  const [
    viewMode,
    setViewMode,
  ] =
    useState<ViewMode>(
      "grid",
    );

  const [
    sortOpen,
    setSortOpen,
  ] = useState(false);

  const [
    isPending,
    startTransition,
  ] = useTransition();

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    const normalized =
      searchValue.trim();

    if (
      normalized === search
    ) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        const params =
          new URLSearchParams(
            searchParams.toString(),
          );

        if (normalized) {
          params.set(
            "search",
            normalized,
          );
        } else {
          params.delete(
            "search",
          );
        }

        params.delete("page");

        navigate(params);
      }, 400);

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    searchValue,
    search,
    searchParams,
  ]);

  function navigate(
    params: URLSearchParams,
  ) {
    const query =
      params.toString();

    startTransition(() => {
      router.replace(
        query
          ? `/admin?${query}`
          : "/admin",
        {
          scroll: false,
        },
      );
    });
  }

  function changeStatus(
    nextStatus: AdminBusinessStatusFilter,
  ) {
    if (
      nextStatus === status
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    if (
      nextStatus === "all"
    ) {
      params.delete(
        "status",
      );
    } else {
      params.set(
        "status",
        nextStatus,
      );
    }

    params.delete("page");

    navigate(params);
  }

  function changeSort(
    nextSort: AdminBusinessSort,
  ) {
    setSortOpen(false);

    if (
      nextSort === sort
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    if (
      nextSort === "newest"
    ) {
      params.delete("sort");
    } else {
      params.set(
        "sort",
        nextSort,
      );
    }

    params.delete("page");

    navigate(params);
  }

  function clearSearch() {
    setSearchValue("");

    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.delete("search");
    params.delete("page");

    navigate(params);
  }

  const selectedSort =
    sortOptions.find(
      (option) =>
        option.value === sort,
    ) ?? sortOptions[0];

  return (
    <div
      className={`overflow-hidden rounded-[24px] border border-black/[0.06] bg-white transition-opacity duration-200 ${
        isPending
          ? "opacity-60"
          : "opacity-100"
      }`}
    >
      <div className="border-b border-black/[0.06] px-4 py-4 sm:px-5">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map(
            (filter) => {
              const active =
                filter.value ===
                status;

              const count =
                counts[
                  filter.value
                ];

              return (
                <button
                  key={
                    filter.value
                  }
                  type="button"
                  onClick={() =>
                    changeStatus(
                      filter.value,
                    )
                  }
                  disabled={
                    isPending
                  }
                  className={`group flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-semibold transition-all duration-200 disabled:pointer-events-none ${
                    active
                      ? "bg-[#006241] text-white shadow-[0_4px_12px_rgba(0,98,65,0.15)]"
                      : "bg-[#F5F7F6] text-black/45 hover:bg-[#EEF3F0] hover:text-[#006241]"
                  }`}
                >
                  <span>
                    {filter.label}
                  </span>

                  <span
                    className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-white text-black/30"
                    }`}
                  >
                    {count >
                    999
                      ? formatNumber(
                          count,
                        )
                      : count}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="border-b border-black/[0.06] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/25" />

            <input
              type="search"
              value={
                searchValue
              }
              onChange={(
                event,
              ) =>
                setSearchValue(
                  event.target
                    .value,
                )
              }
              placeholder="Search business, location..."
              className="h-11 w-full rounded-2xl border border-black/[0.08] bg-[#FAFBFA] pl-11 pr-11 text-xs text-[#122019] outline-none transition duration-200 placeholder:text-black/25 focus:border-[#006241]/25 focus:bg-white focus:ring-4 focus:ring-[#006241]/[0.05]"
            />

            {searchValue ? (
              <button
                type="button"
                onClick={
                  clearSearch
                }
                aria-label="Clear search"
                className="absolute right-4 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-black/25 transition hover:bg-black/[0.05] hover:text-black/50"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:flex-none">
              <button
                type="button"
                onClick={() =>
                  setSortOpen(
                    (current) =>
                      !current,
                  )
                }
                className="flex h-11 w-full min-w-[150px] items-center justify-between gap-3 rounded-2xl border border-black/[0.08] bg-white px-4 text-[11px] font-semibold text-black/45 transition hover:border-black/[0.13] hover:text-black/65"
              >
                {
                  selectedSort.label
                }

                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    sortOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 top-[calc(100%+7px)] z-30 w-full min-w-[170px] origin-top-right rounded-2xl border border-black/[0.07] bg-white p-1.5 shadow-[0_15px_40px_rgba(18,32,25,0.12)] transition-all duration-200 ${
                  sortOpen
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                }`}
              >
                {sortOptions.map(
                  (option) => (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        changeSort(
                          option.value,
                        )
                      }
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-[11px] font-semibold transition ${
                        option.value ===
                        sort
                          ? "bg-[#006241]/[0.07] text-[#006241]"
                          : "text-black/45 hover:bg-black/[0.03] hover:text-black/70"
                      }`}
                    >
                      {
                        option.label
                      }
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="flex rounded-2xl border border-black/[0.08] bg-[#F7F8F7] p-1">
              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    "grid",
                  )
                }
                aria-label="Grid view"
                className={`flex size-9 items-center justify-center rounded-xl transition duration-200 ${
                  viewMode ===
                  "grid"
                    ? "bg-white text-[#006241] shadow-sm"
                    : "text-black/25 hover:text-black/50"
                }`}
              >
                <Grid2X2 className="size-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    "list",
                  )
                }
                aria-label="List view"
                className={`flex size-9 items-center justify-center rounded-xl transition duration-200 ${
                  viewMode ===
                  "list"
                    ? "bg-white text-[#006241] shadow-sm"
                    : "text-black/25 hover:text-black/50"
                }`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-black/35">
            <span className="font-bold text-[#122019]">
              {formatNumber(
                totalCount,
              )}
            </span>{" "}
            {totalCount === 1
              ? "business"
              : "businesses"}
          </p>

          {search ? (
            <p className="max-w-full truncate text-[10px] text-black/30">
              Results for{" "}
              <span className="font-semibold text-[#122019]">
                “{search}”
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {businesses.length >
        0 ? (
          viewMode ===
          "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {businesses.map(
                (business) => (
                  <BusinessGridCard
                    key={
                      business.id
                    }
                    business={
                      business
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {businesses.map(
                (business) => (
                  <BusinessListCard
                    key={
                      business.id
                    }
                    business={
                      business
                    }
                  />
                ),
              )}
            </div>
          )
        ) : (
          <EmptyState
            search={search}
            status={status}
          />
        )}
      </div>

      <BusinessPagination
        currentPage={
          currentPage
        }
        totalPages={
          totalPages
        }
        totalCount={
          totalCount
        }
        pageSize={pageSize}
      />
    </div>
  );
}

function BusinessGridCard({
  business,
}: {
  business: AdminBusiness;
}) {
  const location =
    getLocation(business);

  return (
    <article className="group overflow-hidden rounded-[22px] border border-black/[0.07] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#006241]/10 hover:shadow-[0_14px_35px_rgba(18,32,25,0.07)]">
      <div className="relative h-[130px] overflow-hidden bg-[#EDF2EF]">
        {business.cover_url ? (
          <img
            src={
              business.cover_url
            }
            alt=""
            referrerPolicy="no-referrer"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-[#F1F5F2]">
            <Building2 className="size-8 text-[#006241]/20" />
          </div>
        )}

        <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1.5">
          <BusinessStatusBadge
            status={
              business.status
            }
          />

          {business.is_verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#006241] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.06em] text-white shadow-sm">
              <BadgeCheck className="size-3" />
              Verified
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3">
          {business.logo_url ? (
            <img
              src={
                business.logo_url
              }
              alt=""
              referrerPolicy="no-referrer"
              className="size-12 rounded-2xl border-2 border-white bg-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-2xl border-2 border-white bg-[#006241] text-white shadow-sm">
              <Store className="size-5" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-bold tracking-[-0.025em] text-[#122019]">
          {business.name}
        </h3>

        <p className="mt-1 text-[11px] font-medium text-[#006241]">
          {formatCategory(
            business.category,
          )}
        </p>

        <div className="mt-4 flex min-w-0 items-center gap-2 text-black/35">
          <MapPin className="size-3.5 shrink-0" />

          <span className="truncate text-[10px]">
            {location ||
              business.address}
          </span>
        </div>

        <div className="mt-4 border-t border-black/[0.06] pt-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-black/45">
                {getOwnerName(
                  business,
                )}
              </p>

              <p className="mt-1 text-[9px] text-black/25">
                {business.submitted_at
                  ? `Submitted ${formatDate(
                      business.submitted_at,
                    )}`
                  : `Created ${formatDate(
                      business.created_at,
                    )}`}
              </p>
            </div>

            <Link
              href={`/admin/businesses/${business.id}`}
              className="group/button flex h-9 shrink-0 items-center gap-2 rounded-full bg-[#F3F7F4] px-4 text-[10px] font-bold text-[#006241] transition duration-200 hover:bg-[#006241] hover:text-white"
            >
              Manage

              <ArrowRight className="size-3 transition-transform duration-200 group-hover/button:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function BusinessListCard({
  business,
}: {
  business: AdminBusiness;
}) {
  const location =
    getLocation(business);

  return (
    <article className="group flex flex-col gap-4 rounded-[20px] border border-black/[0.06] p-3 transition-all duration-200 hover:border-[#006241]/10 hover:bg-[#FAFCFB] sm:flex-row sm:items-center">
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-[#EDF2EF] sm:size-20">
        {business.cover_url ? (
          <img
            src={
              business.cover_url
            }
            alt=""
            referrerPolicy="no-referrer"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Store className="size-5 text-[#006241]/25" />
          </div>
        )}

        {business.logo_url ? (
          <img
            src={
              business.logo_url
            }
            alt=""
            referrerPolicy="no-referrer"
            className="absolute bottom-1.5 left-1.5 size-8 rounded-xl border-2 border-white bg-white object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-bold text-[#122019]">
            {business.name}
          </h3>

          <BusinessStatusBadge
            status={
              business.status
            }
          />

          {business.is_verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#006241]/[0.07] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.06em] text-[#006241]">
              <BadgeCheck className="size-2.5" />
              Verified
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-[10px] font-medium text-[#006241]">
          {formatCategory(
            business.category,
          )}
        </p>

        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-black/30">
          <MapPin className="size-3 shrink-0" />

          <span className="truncate text-[10px]">
            {location ||
              business.address}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-black/[0.05] pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
        <div className="min-w-0 sm:text-right">
          <p className="max-w-[150px] truncate text-[10px] font-medium text-black/45">
            {getOwnerName(
              business,
            )}
          </p>

          <p className="mt-1 text-[9px] text-black/25">
            {business.submitted_at
              ? formatDate(
                  business.submitted_at,
                )
              : formatDate(
                  business.created_at,
                )}
          </p>
        </div>

        <Link
          href={`/admin/businesses/${business.id}`}
          className="group/button flex h-9 items-center gap-2 rounded-full bg-[#F3F7F4] px-4 text-[10px] font-bold text-[#006241] transition duration-200 hover:bg-[#006241] hover:text-white"
        >
          Manage

          <ArrowRight className="size-3 transition-transform group-hover/button:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

function EmptyState({
  search,
  status,
}: {
  search: string;
  status: AdminBusinessStatusFilter;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
      <div className="flex size-14 items-center justify-center rounded-[20px] bg-[#006241]/[0.06] text-[#006241]">
        <Store className="size-6" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#122019]">
        No businesses found
      </h3>

      <p className="mt-1.5 max-w-sm text-xs leading-5 text-black/35">
        {search
          ? `No businesses match “${search}”. Try a different search.`
          : status === "all"
            ? "Business applications will appear here when owners submit them to CAFÉTA."
            : `There are currently no ${status} businesses.`}
      </p>
    </div>
  );
}