import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Store,
  UserRound,
} from "lucide-react";

import {
  BusinessStatusBadge,
  type BusinessStatus,
} from "@/components/admin/businesses/business-status-badge";

export type AdminBusiness = {
  id: string;
  name: string;
  slug: string;
  category: string;
  logo_url: string | null;

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

type BusinessTableProps = {
  businesses: AdminBusiness[];
};

function formatCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
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

function getOwnerName(owner: AdminBusiness["owner"]) {
  if (!owner) {
    return "No owner";
  }

  if (owner.username) {
    return `@${owner.username}`;
  }

  return owner.full_name?.trim() || "CAFÉTA user";
}

export function BusinessTable({ businesses }: BusinessTableProps) {
  if (businesses.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#006241]/8 text-[#006241]">
          <Store className="size-7" />
        </div>

        <h2 className="mt-5 text-base font-bold tracking-[-0.02em] text-[#111713]">
          No businesses found
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-black/40">
          No business records match the current filter or search.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-black/[0.06] bg-[#FAFBFA] text-left">
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/35">
                Business
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/35">
                Owner
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/35">
                Location
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/35">
                Status
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/35">
                Submitted
              </th>

              <th className="w-16 px-5 py-3.5">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/[0.05]">
            {businesses.map((business) => (
              <tr
                key={business.id}
                className="group transition-colors hover:bg-[#FAFCFA]"
              >
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt=""
                        className="size-11 shrink-0 rounded-xl border border-black/[0.06] object-cover"
                      />
                    ) : (
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#006241]/8 text-[#006241]">
                        <Store className="size-[18px]" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <Link
                        href={`/admin/businesses/${business.id}`}
                        className="block max-w-[220px] truncate text-sm font-bold text-[#111713] hover:text-[#006241]"
                      >
                        {business.name}
                      </Link>

                      <p className="mt-1 text-xs text-black/40">
                        {formatCategory(business.category)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {business.owner?.avatar_url ? (
                      <img
                        src={business.owner.avatar_url}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="size-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-full bg-black/[0.05] text-black/35">
                        <UserRound className="size-3.5" />
                      </div>
                    )}

                    <span className="max-w-[150px] truncate text-xs font-medium text-black/60">
                      {getOwnerName(business.owner)}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex max-w-[190px] items-start gap-2 text-xs text-black/50">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-black/30" />

                    <span className="leading-5">
                      {[business.barangay, business.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <BusinessStatusBadge
                    status={business.status}
                    verified={business.is_verified}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-xs text-black/45">
                    <CalendarDays className="size-3.5" />
                    {formatDate(business.submitted_at)}
                  </div>
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/businesses/${business.id}`}
                    aria-label={`Review ${business.name}`}
                    className="inline-flex size-9 items-center justify-center rounded-xl text-black/25 transition group-hover:bg-[#006241]/8 group-hover:text-[#006241]"
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-black/[0.06] lg:hidden">
        {businesses.map((business) => (
          <Link
            key={business.id}
            href={`/admin/businesses/${business.id}`}
            className="block p-4 transition-colors hover:bg-[#FAFCFA] sm:p-5"
          >
            <div className="flex items-start gap-3">
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
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-[#111713]">
                      {business.name}
                    </h3>

                    <p className="mt-1 text-xs text-black/40">
                      {formatCategory(business.category)}
                    </p>
                  </div>

                  <BusinessStatusBadge
                    status={business.status}
                    verified={business.is_verified}
                  />
                </div>

                <div className="mt-4 grid gap-2 text-xs text-black/45 sm:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <UserRound className="size-3.5 shrink-0" />

                    <span className="truncate">
                      {getOwnerName(business.owner)}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <MapPin className="size-3.5 shrink-0" />

                    <span className="truncate">
                      {[business.barangay, business.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3.5 shrink-0" />
                    {formatDate(business.submitted_at)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}