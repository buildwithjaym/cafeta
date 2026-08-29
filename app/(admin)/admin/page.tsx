import { AdminBusinessBrowser } from "@/components/admin/admin-business-browser";
import { AdminWorkspaceTabs } from "@/components/admin/admin-workspace-tabs";
import { AnalyticsOverview } from "@/components/admin/analytics/analytics-overview";
import {
  getAdminAnalytics,
  type AnalyticsPeriod,
} from "@/lib/admin/get-admin-analytics";
import {
  getAdminBusinesses,
  type AdminBusinessSort,
  type AdminBusinessStatusFilter,
} from "@/lib/admin/get-admin-businesses";

export const dynamic =
  "force-dynamic";

type AdminView =
  | "businesses"
  | "analytics";

type AdminPageProps = {
  searchParams: Promise<{
    view?: string;
    period?: string;
    page?: string;
    status?: string;
    search?: string;
    sort?: string;
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
  if (
    value === "analytics"
  ) {
    return "analytics";
  }

  return "businesses";
}

function getStatus(
  value?: string,
): AdminBusinessStatusFilter {
  switch (value) {
    case "pending":
    case "approved":
    case "verified":
    case "rejected":
    case "suspended":
      return value;

    default:
      return "all";
  }
}

function getSort(
  value?: string,
): AdminBusinessSort {
  switch (value) {
    case "oldest":
    case "name":
      return value;

    default:
      return "newest";
  }
}

function getPage(
  value?: string,
) {
  const parsed =
    Number.parseInt(
      value ?? "1",
      10,
    );

  if (
    !Number.isFinite(parsed) ||
    parsed < 1
  ) {
    return 1;
  }

  return parsed;
}

export default async function AdminPage({
  searchParams,
}: AdminPageProps) {
  const params =
    await searchParams;

  const view = getView(
    params.view,
  );

  const period = getPeriod(
    params.period,
  );

  const status = getStatus(
    params.status,
  );

  const sort = getSort(
    params.sort,
  );

  const page = getPage(
    params.page,
  );

  const search =
    params.search
      ?.trim()
      .slice(0, 100) ?? "";

  const [
    businessData,
    analytics,
  ] = await Promise.all([
    getAdminBusinesses({
      page,
      status,
      search,
      sort,
    }),

    view === "analytics"
      ? getAdminAnalytics(
          period,
        )
      : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <section className="animate-[fadeIn_350ms_ease-out]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#006241]">
              CAFÉTA Control Center
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-[#122019] sm:text-4xl">
              {view ===
              "analytics"
                ? "Platform analytics"
                : "Business applications"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
              {view ===
              "analytics"
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
              businessData
                .counts
                .pending
            }
          />
        </div>
      </section>

      {view ===
      "businesses" ? (
        <section
          key="businesses"
          className="mt-7 animate-[adminSectionIn_350ms_ease-out]"
        >
          <AdminBusinessBrowser
            businesses={
              businessData.businesses
            }
            counts={
              businessData.counts
            }
            totalCount={
              businessData.totalCount
            }
            currentPage={
              businessData.currentPage
            }
            totalPages={
              businessData.totalPages
            }
            pageSize={
              businessData.pageSize
            }
            status={status}
            search={search}
            sort={sort}
          />
        </section>
      ) : null}

      {view ===
        "analytics" &&
      analytics ? (
        <section
          key="analytics"
          className="mt-8 animate-[adminSectionIn_350ms_ease-out]"
        >
          <AnalyticsOverview
            analytics={
              analytics
            }
          />
        </section>
      ) : null}
    </div>
  );
}