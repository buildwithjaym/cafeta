import {
  AdminBusinessBrowser,
  type AdminBusiness,
} from "@/components/admin/admin-business-browser";
import { AdminWorkspaceTabs } from "@/components/admin/admin-workspace-tabs";
import { AnalyticsOverview } from "@/components/admin/analytics/analytics-overview";
import {
  getAdminAnalytics,
  type AnalyticsPeriod,
} from "@/lib/admin/get-admin-analytics";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AdminView =
  | "businesses"
  | "analytics";

type AdminPageProps = {
  searchParams: Promise<{
    view?: string;
    period?: string;
  }>;
};

function getPeriod(
  value?: string,
): AnalyticsPeriod {
  if (value === "7") {
    return 7;
  }

  if (value === "90") {
    return 90;
  }

  return 30;
}

function getView(
  value?: string,
): AdminView {
  if (value === "analytics") {
    return "analytics";
  }

  return "businesses";
}

export default async function AdminPage({
  searchParams,
}: AdminPageProps) {
  const params = await searchParams;

  const view = getView(
    params.view,
  );

  const period = getPeriod(
    params.period,
  );

  const supabase =
    await createClient();

  const businessesPromise =
    supabase
      .from("businesses")
      .select(`
        id,
        name,
        slug,
        category,
        description,
        logo_url,
        cover_url,
        address,
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
      `)
      .order("submitted_at", {
        ascending: false,
        nullsFirst: false,
      })
      .order("created_at", {
        ascending: false,
      });

  const [
    businessesResult,
    analytics,
  ] = await Promise.all([
    businessesPromise,

    view === "analytics"
      ? getAdminAnalytics(period)
      : Promise.resolve(null),
  ]);

  if (businessesResult.error) {
    console.error(
      "[CAFÉTA Admin] Failed to load businesses:",
      businessesResult.error,
    );
  }

  const businesses = (
    businessesResult.data ?? []
  ).map((business) => ({
    ...business,

    owner: Array.isArray(
      business.owner,
    )
      ? business.owner[0] ?? null
      : business.owner ?? null,
  })) as unknown as AdminBusiness[];

  const pendingCount =
    businesses.filter(
      (business) =>
        business.status === "pending",
    ).length;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <section className="animate-[fadeIn_350ms_ease-out]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#006241]">
              CAFÉTA Control Center
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-[#122019] sm:text-4xl">
              {view === "analytics"
                ? "Platform analytics"
                : "Business applications"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
              {view === "analytics"
                ? "Understand how the CAFÉTA community, businesses, Memories, reviews, and engagement are growing."
                : "Review, approve, verify, reject, suspend, and manage businesses joining CAFÉTA."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-[#006241]/10 bg-[#006241]/[0.045] px-3 py-2 lg:self-auto">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#006241]/30" />

              <span className="relative inline-flex size-2 rounded-full bg-[#006241]" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#006241]">
              Live platform data
            </span>
          </div>
        </div>

        <div className="mt-7">
          <AdminWorkspaceTabs
            activeView={view}
            pendingCount={
              pendingCount
            }
          />
        </div>
      </section>

      {view === "businesses" ? (
        <section
          key="businesses"
          className="mt-7 animate-[adminSectionIn_350ms_ease-out]"
        >
          <AdminBusinessBrowser
            businesses={businesses}
          />
        </section>
      ) : null}

      {view === "analytics" &&
      analytics ? (
        <section
          key="analytics"
          className="mt-8 animate-[adminSectionIn_350ms_ease-out]"
        >
          <AnalyticsOverview
            analytics={analytics}
          />
        </section>
      ) : null}
    </div>
  );
}