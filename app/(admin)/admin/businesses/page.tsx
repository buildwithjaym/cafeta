import { Building2, Clock3, ShieldCheck } from "lucide-react";

import {
  BusinessFilters,
  type BusinessFilter,
} from "@/components/admin/businesses/business-filters";
import {
  BusinessTable,
  type AdminBusiness,
} from "@/components/admin/businesses/business-table";
import { createClient } from "@/lib/supabase/server";

type BusinessesPageProps = {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
};

const allowedFilters = new Set<BusinessFilter>([
  "all",
  "pending",
  "approved",
  "verified",
  "rejected",
  "suspended",
]);

function normalizeFilter(value: string | undefined): BusinessFilter {
  if (value && allowedFilters.has(value as BusinessFilter)) {
    return value as BusinessFilter;
  }

  return "all";
}

export default async function AdminBusinessesPage({
  searchParams,
}: BusinessesPageProps) {
  const params = await searchParams;

  const activeFilter = normalizeFilter(params.status);
  const search = params.q?.trim() ?? "";

  const supabase = await createClient();

  const [
    allResult,
    pendingResult,
    approvedResult,
    verifiedResult,
    rejectedResult,
    suspendedResult,
  ] = await Promise.all([
    supabase
      .from("businesses")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),

    supabase
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .eq("is_verified", true),

    supabase
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected"),

    supabase
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .eq("status", "suspended"),
  ]);

  const counts = {
    all: allResult.count ?? 0,
    pending: pendingResult.count ?? 0,
    approved: approvedResult.count ?? 0,
    verified: verifiedResult.count ?? 0,
    rejected: rejectedResult.count ?? 0,
    suspended: suspendedResult.count ?? 0,
  };

  let query = supabase
    .from("businesses")
    .select(
      `
        id,
        name,
        slug,
        category,
        logo_url,
        barangay,
        city,
        province,
        status,
        is_verified,
        created_at,
        submitted_at,
        owner:profiles!businesses_created_by_fkey (
          full_name,
          username,
          avatar_url
        )
      `,
    );

  switch (activeFilter) {
    case "pending":
      query = query.eq("status", "pending");
      break;

    case "approved":
      query = query.eq("status", "approved");
      break;

    case "verified":
      query = query
        .eq("status", "approved")
        .eq("is_verified", true);
      break;

    case "rejected":
      query = query.eq("status", "rejected");
      break;

    case "suspended":
      query = query.eq("status", "suspended");
      break;
  }

  if (search) {
    const safeSearch = search
      .replaceAll("%", "")
      .replaceAll(",", " ")
      .trim();

    if (safeSearch) {
      query = query.or(
        `name.ilike.%${safeSearch}%,city.ilike.%${safeSearch}%,barangay.ilike.%${safeSearch}%`,
      );
    }
  }

  const { data, error } = await query
    .order("submitted_at", {
      ascending: false,
      nullsFirst: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(100);

  if (error) {
    console.error("Failed to load admin businesses:", error);
  }

  const businesses = (data ?? []).map((business) => ({
    ...business,
    owner: Array.isArray(business.owner)
      ? business.owner[0] ?? null
      : business.owner ?? null,
  })) as AdminBusiness[];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#006241]">
            Business Management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#111713] sm:text-4xl">
            Businesses
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
            Review applications, manage listing status, and maintain trusted
            business information across CAFÉTA.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3 py-2 text-xs text-black/50">
            <Building2 className="size-3.5 text-[#006241]" />
            <strong className="text-[#111713]">{counts.all}</strong>
            total
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <Clock3 className="size-3.5" />
            <strong>{counts.pending}</strong>
            awaiting review
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-[#006241]/10 bg-[#006241]/5 px-3 py-2 text-xs text-[#006241]">
            <ShieldCheck className="size-3.5" />
            <strong>{counts.verified}</strong>
            verified
          </div>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[26px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <BusinessFilters
          activeFilter={activeFilter}
          counts={counts}
          initialSearch={search}
        />

        {error ? (
          <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
            <div>
              <h2 className="text-sm font-bold text-[#111713]">
                Businesses couldn&apos;t be loaded
              </h2>

              <p className="mt-2 text-xs text-black/40">
                Check the server console for the Supabase error.
              </p>
            </div>
          </div>
        ) : (
          <BusinessTable businesses={businesses} />
        )}
      </section>

      <p className="mt-4 text-xs leading-5 text-black/35">
        Showing up to 100 businesses. We can add server-side pagination as the
        CAFÉTA business directory grows.
      </p>
    </div>
  );
}