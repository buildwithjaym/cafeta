import type {
  LucideIcon,
} from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import type {
  GrowthMetric,
} from "@/lib/admin/get-admin-analytics";

type Props = {
  label: string;
  metric: GrowthMetric;
  icon: LucideIcon;
  period: number;
};

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}

export function AnalyticsStatCard({
  label,
  metric,
  icon: Icon,
  period,
}: Props) {
  const positive =
    metric.change !== null &&
    metric.change > 0;

  const negative =
    metric.change !== null &&
    metric.change < 0;

  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-black/[0.06] bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#006241]/10 hover:shadow-[0_16px_40px_rgba(18,32,25,0.07)]">
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-[#006241]/[0.025] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#006241]/[0.07] text-[#006241] transition duration-300 group-hover:scale-105">
            <Icon className="size-[18px]" />
          </div>

          <GrowthBadge
            change={metric.change}
            positive={positive}
            negative={negative}
          />
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/35">
          {label}
        </p>

        <p className="mt-1 text-[2rem] font-bold tracking-[-0.055em] text-[#122019]">
          {formatNumber(metric.total)}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-black/[0.05] pt-3">
          <span className="text-[11px] text-black/35">
            Last {period} days
          </span>

          <span className="text-xs font-semibold text-[#122019]">
            +{formatNumber(metric.current)}
          </span>
        </div>
      </div>
    </article>
  );
}

function GrowthBadge({
  change,
  positive,
  negative,
}: {
  change: number | null;
  positive: boolean;
  negative: boolean;
}) {
  if (change === null) {
    return (
      <span className="rounded-full bg-[#006241]/[0.07] px-2.5 py-1 text-[10px] font-bold text-[#006241]">
        New activity
      </span>
    );
  }

  if (
    !positive &&
    !negative
  ) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-bold text-black/40">
        <Minus className="size-3" />
        0%
      </span>
    );
  }

  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}

      {Math.abs(change).toFixed(1)}%
    </span>
  );
}