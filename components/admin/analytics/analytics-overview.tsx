"use client";

import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  Heart,
  MessageCircle,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
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

import { AnalyticsStatCard } from "@/components/admin/analytics/analytics-stat-card";
import { GrowthChart } from "@/components/admin/analytics/growth-chart";
import type {
  AdminAnalytics,
  AnalyticsPeriod,
} from "@/lib/admin/get-admin-analytics";

type Props = {
  analytics: AdminAnalytics;
};

const periods: {
  value: AnalyticsPeriod;
  label: string;
}[] = [
  {
    value: 7,
    label: "7 days",
  },
  {
    value: 30,
    label: "30 days",
  },
  {
    value: 90,
    label: "90 days",
  },
];

export function AnalyticsOverview({
  analytics,
}: Props) {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [
    periodMenuOpen,
    setPeriodMenuOpen,
  ] = useState(false);

  const [
    isPending,
    startTransition,
  ] = useTransition();

  useEffect(() => {
    setPeriodMenuOpen(false);
  }, [analytics.period]);

  function changePeriod(
    period: AnalyticsPeriod,
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.set(
      "view",
      "analytics",
    );

    params.set(
      "period",
      String(period),
    );

    startTransition(() => {
      router.replace(
        `/admin?${params.toString()}`,
        {
          scroll: false,
        },
      );
    });
  }

  const currentPeriod =
    periods.find(
      (period) =>
        period.value ===
        analytics.period,
    );

  return (
    <div
      className={`transition duration-300 ${
        isPending
          ? "translate-y-0.5 opacity-60"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#006241]" />

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#006241]">
              Platform growth
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#122019]">
            Is CAFÉTA growing?
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-black/40">
            Track people joining
            CAFÉTA, businesses
            applying, Memories being
            shared, and reviews being
            created.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setPeriodMenuOpen(
                (current) =>
                  !current,
              )
            }
            className="flex h-10 min-w-[132px] items-center justify-between gap-3 rounded-xl border border-black/[0.07] bg-white px-3.5 text-xs font-semibold text-[#122019] shadow-sm transition duration-200 hover:border-[#006241]/20 hover:shadow-md"
          >
            {currentPeriod?.label ??
              "30 days"}

            <ChevronDown
              className={`size-3.5 text-black/30 transition-transform duration-200 ${
                periodMenuOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          <div
            className={`absolute right-0 top-[calc(100%+7px)] z-30 w-full min-w-[145px] origin-top-right rounded-xl border border-black/[0.07] bg-white p-1.5 shadow-[0_15px_40px_rgba(18,32,25,0.12)] transition-all duration-200 ${
              periodMenuOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
            }`}
          >
            {periods.map(
              (period) => (
                <button
                  key={
                    period.value
                  }
                  type="button"
                  onClick={() =>
                    changePeriod(
                      period.value,
                    )
                  }
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                    analytics.period ===
                    period.value
                      ? "bg-[#006241]/[0.07] text-[#006241]"
                      : "text-black/45 hover:bg-black/[0.03] hover:text-black/70"
                  }`}
                >
                  {period.label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          label="CAFÉTA users"
          metric={
            analytics.users
          }
          icon={UsersRound}
          period={
            analytics.period
          }
        />

        <AnalyticsStatCard
          label="Businesses"
          metric={
            analytics.businesses
          }
          icon={Building2}
          period={
            analytics.period
          }
        />

        <AnalyticsStatCard
          label="Memories"
          metric={
            analytics.memories
          }
          icon={Sparkles}
          period={
            analytics.period
          }
        />

        <AnalyticsStatCard
          label="Reviews"
          metric={
            analytics.reviews
          }
          icon={
            MessageSquareText
          }
          period={
            analytics.period
          }
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.7fr)]">
        <div className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white p-5 transition duration-300 hover:border-black/[0.08] sm:p-6">
          <div>
            <p className="text-sm font-bold text-[#122019]">
              Growth over time
            </p>

            <p className="mt-1 text-[11px] leading-5 text-black/35">
              Switch between Users,
              Businesses, Memories and
              Reviews to understand
              where growth is happening.
            </p>
          </div>

          <div className="mt-5">
            <GrowthChart
              data={
                analytics.chart
              }
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 sm:p-6">
          <p className="text-sm font-bold text-[#122019]">
            Community
          </p>

          <p className="mt-1 text-[11px] leading-5 text-black/35">
            Account and onboarding
            health across CAFÉTA.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <CommunityCard
              icon={UsersRound}
              label="Total users"
              value={
                analytics.users
                  .total
              }
            />

            <CommunityCard
              icon={
                CheckCircle2
              }
              label="Onboarded"
              value={
                analytics
                  .community
                  .completedOnboarding
              }
            />

            <CommunityCard
              icon={
                UserRoundCheck
              }
              label="With username"
              value={
                analytics
                  .community
                  .usersWithUsername
              }
            />

            <CommunityCard
              icon={Sparkles}
              label="Taste profiles"
              value={
                analytics
                  .community
                  .usersWithPreferences
              }
            />
          </div>

          <div className="mt-5 border-t border-black/[0.05] pt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-[#122019]">
                  Onboarding
                  completion
                </p>

                <p className="mt-0.5 text-[10px] text-black/30">
                  Registered users who
                  completed onboarding
                </p>
              </div>

              <span className="text-sm font-bold text-[#006241]">
                {analytics.community.onboardingRate.toFixed(
                  1,
                )}
                %
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/[0.045]">
              <div
                className="h-full rounded-full bg-[#006241] transition-[width] duration-700 ease-out"
                style={{
                  width: `${Math.min(
                    analytics
                      .community
                      .onboardingRate,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#122019]">
                Memories &
                engagement
              </p>

              <p className="mt-1 text-[11px] text-black/35">
                Community activity in
                the last{" "}
                {analytics.period} days.
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#006241]/[0.07] text-[#006241]">
              <Sparkles className="size-[18px]" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ActivityMetric
              icon={Sparkles}
              label="Memories"
              value={
                analytics.activity
                  .memories
              }
            />

            <ActivityMetric
              icon={Heart}
              label="Likes"
              value={
                analytics.activity
                  .likes
              }
            />

            <ActivityMetric
              icon={
                MessageCircle
              }
              label="Comments"
              value={
                analytics.activity
                  .comments
              }
            />

            <ActivityMetric
              icon={
                MessageSquareText
              }
              label="Reviews"
              value={
                analytics.activity
                  .reviews
              }
            />
          </div>

          <div className="mt-5 rounded-2xl bg-[#F7F9F8] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#122019]">
                  Total Memories
                </p>

                <p className="mt-1 text-[10px] text-black/35">
                  Shared across
                  CAFÉTA
                </p>
              </div>

              <p className="text-2xl font-bold tracking-[-0.04em] text-[#122019]">
                {formatNumber(
                  analytics
                    .memories.total,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 sm:p-6">
          <div>
            <p className="text-sm font-bold text-[#122019]">
              Business health
            </p>

            <p className="mt-1 text-[11px] text-black/35">
              Current moderation
              status across CAFÉTA.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatusMetric
              label="Pending"
              value={
                analytics
                  .moderation.pending
              }
            />

            <StatusMetric
              label="Approved"
              value={
                analytics
                  .moderation.approved
              }
            />

            <StatusMetric
              label="Verified"
              value={
                analytics
                  .moderation.verified
              }
            />

            <StatusMetric
              label="Rejected"
              value={
                analytics
                  .moderation.rejected
              }
            />

            <StatusMetric
              label="Suspended"
              value={
                analytics
                  .moderation.suspended
              }
            />

            <StatusMetric
              label="Total"
              value={
                analytics
                  .moderation.total
              }
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F7F9F8] p-4">
              <BadgeCheck className="size-4 text-[#006241]" />

              <p className="mt-3 text-xl font-bold tracking-[-0.04em] text-[#122019]">
                {analytics.moderation.approvalRate.toFixed(
                  1,
                )}
                %
              </p>

              <p className="mt-1 text-[10px] text-black/35">
                Approval rate
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F9F8] p-4">
              <MessageSquareText className="size-4 text-[#006241]" />

              <p className="mt-3 text-xl font-bold tracking-[-0.04em] text-[#122019]">
                {analytics.quality
                  .totalRatings > 0
                  ? analytics.quality.averageRating.toFixed(
                      1,
                    )
                  : "—"}
              </p>

              <p className="mt-1 text-[10px] text-black/35">
                Average rating
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UsersRound;
  label: string;
  value: number;
}) {
  return (
    <div className="group rounded-2xl bg-[#F7F9F8] p-3.5 transition duration-200 hover:-translate-y-0.5 hover:bg-[#F2F6F3]">
      <Icon className="size-4 text-[#006241]" />

      <p className="mt-3 text-xl font-bold tracking-[-0.04em] text-[#122019]">
        {formatNumber(value)}
      </p>

      <p className="mt-0.5 text-[10px] text-black/35">
        {label}
      </p>
    </div>
  );
}

function ActivityMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sparkles;
  label: string;
  value: number;
}) {
  return (
    <div className="group rounded-2xl border border-black/[0.05] p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-[#006241]/10 hover:shadow-sm">
      <Icon className="size-4 text-[#006241]" />

      <p className="mt-3 text-lg font-bold tracking-[-0.04em] text-[#122019]">
        {formatNumber(value)}
      </p>

      <p className="mt-0.5 text-[10px] text-black/35">
        {label}
      </p>
    </div>
  );
}

function StatusMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-[#F7F9F8] p-3.5 transition duration-200 hover:bg-[#F2F6F3]">
      <p className="text-lg font-bold tracking-[-0.035em] text-[#122019]">
        {formatNumber(value)}
      </p>

      <p className="mt-0.5 text-[10px] text-black/35">
        {label}
      </p>
    </div>
  );
}

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}