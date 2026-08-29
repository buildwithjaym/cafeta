import {
  BadgeCheck,
  CircleCheck,
  Clock3,
  ShieldAlert,
  Star,
  Store,
} from "lucide-react";

import type {
  AdminAnalytics,
} from "@/lib/admin/get-admin-analytics";

type Props = {
  analytics: AdminAnalytics;
};

export function PlatformHealth({
  analytics,
}: Props) {
  const {
    moderation,
    quality,
  } = analytics;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <HealthCard
          label="Pending"
          value={moderation.pending}
          icon={Clock3}
        />

        <HealthCard
          label="Approved"
          value={moderation.approved}
          icon={CircleCheck}
        />

        <HealthCard
          label="Verified"
          value={moderation.verified}
          icon={BadgeCheck}
        />

        <HealthCard
          label="Suspended"
          value={moderation.suspended}
          icon={ShieldAlert}
        />
      </div>

      <div className="mt-5 space-y-4 border-t border-black/[0.05] pt-5">
        <MetricRow
          icon={Store}
          label="Approval rate"
          value={`${moderation.approvalRate.toFixed(1)}%`}
        />

        <MetricRow
          icon={Star}
          label="Average rating"
          value={
            quality.totalRatings > 0
              ? `${quality.averageRating.toFixed(1)} / 5`
              : "No ratings yet"
          }
        />
      </div>
    </div>
  );
}

function HealthCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Clock3;
}) {
  return (
    <div className="group rounded-2xl bg-[#F7F9F8] p-3.5 transition duration-200 hover:-translate-y-0.5 hover:bg-[#F3F7F4]">
      <Icon className="size-4 text-[#006241]" />

      <p className="mt-3 text-xl font-bold tracking-[-0.04em] text-[#122019]">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-medium text-black/35">
        {label}
      </p>
    </div>
  );
}

function MetricRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Store;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-black/40">
        <Icon className="size-3.5" />

        <span className="text-[11px] font-medium">
          {label}
        </span>
      </div>

      <span className="text-xs font-bold text-[#122019]">
        {value}
      </span>
    </div>
  );
}