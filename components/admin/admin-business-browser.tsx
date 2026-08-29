"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Grid2X2,
  List,
  MapPin,
  Search,
  ShieldCheck,
  Store,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  BusinessStatusBadge,
  type BusinessStatus,
} from "@/components/admin/businesses/business-status-badge";

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

  status: BusinessStatus;
  is_verified: boolean;

  created_at: string;
  submitted_at: string | null;

  owner: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
};

type Filter =
  | "all"
  | "pending"
  | "approved"
  | "verified"
  | "rejected"
  | "suspended";

type Sort =
  | "newest"
  | "oldest"
  | "name";

type View = "grid" | "list";

type AdminBusinessBrowserProps = {
  businesses: AdminBusiness[];
};

const FILTERS: {
  id: Filter;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "verified", label: "Verified" },
  { id: "rejected", label: "Rejected" },
  { id: "suspended", label: "Suspended" },
];

function formatCategory(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not submitted";
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function ownerName(
  owner: AdminBusiness["owner"],
) {
  if (!owner) {
    return "No owner";
  }

  if (owner.username) {
    return `@${owner.username}`;
  }

  return (
    owner.full_name?.trim() ||
    "CAFÉTA user"
  );
}

export function AdminBusinessBrowser({
  businesses,
}: AdminBusinessBrowserProps) {
  const [filter, setFilter] =
    useState<Filter>("all");

  const [search, setSearch] =
    useState("");

  const [sort, setSort] =
    useState<Sort>("newest");

  const [view, setView] =
    useState<View>("grid");

  const counts = useMemo(() => {
    return {
      all: businesses.length,

      pending: businesses.filter(
        (business) =>
          business.status === "pending",
      ).length,

      approved: businesses.filter(
        (business) =>
          business.status === "approved",
      ).length,

      verified: businesses.filter(
        (business) =>
          business.status === "approved" &&
          business.is_verified,
      ).length,

      rejected: businesses.filter(
        (business) =>
          business.status === "rejected",
      ).length,

      suspended: businesses.filter(
        (business) =>
          business.status === "suspended",
      ).length,
    };
  }, [businesses]);

  const visibleBusinesses = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    let result = businesses.filter(
      (business) => {
        if (
          filter === "verified" &&
          !(
            business.status === "approved" &&
            business.is_verified
          )
        ) {
          return false;
        }

        if (
          filter !== "all" &&
          filter !== "verified" &&
          business.status !== filter
        ) {
          return false;
        }

        if (!query) {
          return true;
        }

        const searchable = [
          business.name,
          business.category,
          business.address,
          business.barangay,
          business.city,
          business.province,
          business.owner?.full_name,
          business.owner?.username,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      },
    );

    result = [...result].sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      const aDate = new Date(
        a.submitted_at || a.created_at,
      ).getTime();

      const bDate = new Date(
        b.submitted_at || b.created_at,
      ).getTime();

      return sort === "oldest"
        ? aDate - bDate
        : bDate - aDate;
    });

    return result;
  }, [
    businesses,
    filter,
    search,
    sort,
  ]);

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Applications"
          value={counts.all}
          description="Businesses in CAFÉTA"
          icon={Store}
        />

        <SummaryCard
          label="Waiting for review"
          value={counts.pending}
          description="Pending applications"
          icon={Clock3}
          important={counts.pending > 0}
        />

        <SummaryCard
          label="Approved"
          value={counts.approved}
          description="Active businesses"
          icon={CheckCircle2}
        />

        <SummaryCard
          label="Verified"
          value={counts.verified}
          description="Trusted businesses"
          icon={ShieldCheck}
        />
      </section>

      <section className="mt-7 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white">
        <div className="border-b border-black/[0.06] px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-max gap-2">
              {FILTERS.map((item) => {
                const active =
                  filter === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setFilter(item.id)
                    }
                    className={`flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition ${
                      active
                        ? "bg-[#006241] text-white shadow-sm"
                        : "bg-[#F5F7F5] text-black/50 hover:bg-[#EBEFEC] hover:text-black/70"
                    }`}
                  >
                    {item.label}

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                        active
                          ? "bg-white/15"
                          : "bg-black/[0.05]"
                      }`}
                    >
                      {counts[item.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-black/[0.06] p-4 sm:p-5 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search business, owner, location..."
              className="h-11 w-full rounded-2xl border border-black/[0.07] bg-[#F8F9F8] pl-11 pr-11 text-sm outline-none transition placeholder:text-black/30 focus:border-[#006241]/25 focus:bg-white focus:ring-4 focus:ring-[#006241]/5"
            />

            {search ? (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-black/30 hover:bg-black/[0.05]"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target
                      .value as Sort,
                  )
                }
                className="h-11 w-full appearance-none rounded-2xl border border-black/[0.07] bg-white pl-4 pr-10 text-xs font-semibold text-black/55 outline-none sm:w-[150px]"
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="oldest">
                  Oldest first
                </option>

                <option value="name">
                  Name A–Z
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-black/30" />
            </div>

            <div className="flex h-11 rounded-2xl border border-black/[0.07] bg-[#F8F9F8] p-1">
              <button
                type="button"
                onClick={() =>
                  setView("grid")
                }
                aria-label="Grid view"
                className={`flex size-9 items-center justify-center rounded-xl transition ${
                  view === "grid"
                    ? "bg-white text-[#006241] shadow-sm"
                    : "text-black/30"
                }`}
              >
                <Grid2X2 className="size-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setView("list")
                }
                aria-label="List view"
                className={`flex size-9 items-center justify-center rounded-xl transition ${
                  view === "list"
                    ? "bg-white text-[#006241] shadow-sm"
                    : "text-black/30"
                }`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-4 sm:px-5">
          <p className="text-xs text-black/40">
            <strong className="font-semibold text-black/65">
              {visibleBusinesses.length}
            </strong>{" "}
            {visibleBusinesses.length === 1
              ? "business"
              : "businesses"}
          </p>

          {filter !== "all" ||
          search ? (
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setSearch("");
              }}
              className="text-xs font-semibold text-[#006241]"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {visibleBusinesses.length === 0 ? (
          <EmptyBusinesses
            filter={filter}
            search={search}
          />
        ) : view === "grid" ? (
          <div className="grid gap-4 px-4 pb-5 sm:grid-cols-2 sm:px-5 xl:grid-cols-3">
            {visibleBusinesses.map(
              (business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                />
              ),
            )}
          </div>
        ) : (
          <div className="divide-y divide-black/[0.05] border-t border-black/[0.05]">
            {visibleBusinesses.map(
              (business) => (
                <BusinessRow
                  key={business.id}
                  business={business}
                />
              ),
            )}
          </div>
        )}
      </section>
    </>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  important = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Store;
  important?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 ${
        important
          ? "border-amber-200 bg-amber-50"
          : "border-black/[0.06] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-xs font-semibold ${
              important
                ? "text-amber-700"
                : "text-black/40"
            }`}
          >
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#122019]">
            {value}
          </p>

          <p className="mt-1 text-xs text-black/35">
            {description}
          </p>
        </div>

        <div
          className={`flex size-10 items-center justify-center rounded-2xl ${
            important
              ? "bg-amber-100 text-amber-700"
              : "bg-[#006241]/8 text-[#006241]"
          }`}
        >
          <Icon className="size-[18px]" />
        </div>
      </div>
    </div>
  );
}

function BusinessCard({
  business,
}: {
  business: AdminBusiness;
}) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-black/[0.07] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#006241]/15 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
      <div className="relative h-36 overflow-hidden bg-[#EAF0EC]">
        {business.cover_url ? (
          <img
            src={business.cover_url}
            alt=""
            className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[#006241]/20">
            <Store className="size-10" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        <div className="absolute right-3 top-3">
          <BusinessStatusBadge
            status={business.status}
            verified={
              business.is_verified
            }
          />
        </div>

        <div className="absolute -bottom-px left-4 translate-y-1/2">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt=""
              className="size-16 rounded-[18px] border-4 border-white bg-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-[18px] border-4 border-white bg-[#EAF0EC] text-[#006241] shadow-sm">
              <Store className="size-5" />
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-10">
        <h3 className="truncate text-base font-bold tracking-[-0.025em] text-[#122019]">
          {business.name}
        </h3>

        <p className="mt-1 text-xs font-medium text-[#006241]">
          {formatCategory(
            business.category,
          )}
        </p>

        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-black/40">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />

          <span className="line-clamp-2">
            {[
              business.barangay,
              business.city,
              business.province,
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-black/[0.05] pt-4">
          <div className="min-w-0">
            <p className="max-w-[150px] truncate text-xs font-semibold text-black/55">
              {ownerName(
                business.owner,
              )}
            </p>

            <p className="mt-0.5 text-[10px] text-black/30">
              {business.status ===
              "draft"
                ? "Created"
                : "Submitted"}{" "}
              {formatDate(
                business.submitted_at ||
                  business.created_at,
              )}
            </p>
          </div>

          <Link
            href={`/admin/businesses/${business.id}`}
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${
              business.status ===
              "pending"
                ? "bg-[#006241] text-white hover:bg-[#005438]"
                : "bg-[#F3F6F4] text-[#006241] hover:bg-[#E8EFEA]"
            }`}
          >
            {business.status ===
            "pending"
              ? "Review"
              : "Manage"}

            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function BusinessRow({
  business,
}: {
  business: AdminBusiness;
}) {
  return (
    <Link
      href={`/admin/businesses/${business.id}`}
      className="group flex items-center gap-4 px-4 py-4 transition hover:bg-[#FAFCFA] sm:px-5"
    >
      {business.logo_url ? (
        <img
          src={business.logo_url}
          alt=""
          className="size-12 shrink-0 rounded-2xl border border-black/[0.06] object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#006241]/8 text-[#006241]">
          <Store className="size-5" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-bold text-[#122019]">
            {business.name}
          </h3>

          <BusinessStatusBadge
            status={business.status}
            verified={
              business.is_verified
            }
          />
        </div>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/40">
          <span>
            {formatCategory(
              business.category,
            )}
          </span>

          <span>
            {[
              business.barangay,
              business.city,
            ]
              .filter(Boolean)
              .join(", ")}
          </span>

          <span>
            {ownerName(
              business.owner,
            )}
          </span>
        </div>
      </div>

      <div className="hidden text-right md:block">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-black/25">
          {business.status === "draft"
            ? "Created"
            : "Submitted"}
        </p>

        <p className="mt-1 text-xs font-medium text-black/50">
          {formatDate(
            business.submitted_at ||
              business.created_at,
          )}
        </p>
      </div>

      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl text-black/25 transition group-hover:bg-[#006241]/8 group-hover:text-[#006241]">
        <ArrowRight className="size-4" />
      </div>
    </Link>
  );
}

function EmptyBusinesses({
  filter,
  search,
}: {
  filter: Filter;
  search: string;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 pb-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-[#006241]/8 text-[#006241]">
        {filter === "rejected" ? (
          <XCircle className="size-7" />
        ) : (
          <Store className="size-7" />
        )}
      </div>

      <h3 className="mt-5 text-base font-bold text-[#122019]">
        No businesses found
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-black/40">
        {search
          ? `No businesses match “${search}”.`
          : filter === "pending"
            ? "There are currently no applications waiting for review."
            : `There are currently no ${filter === "all" ? "" : `${filter} `}businesses.`}
      </p>
    </div>
  );
}