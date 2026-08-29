import {
  Building2,
  Heart,
  MessageCircle,
  MessageSquareText,
  Sparkles,
  UsersRound,
} from "lucide-react";

import type {
  AdminAnalytics,
} from "@/lib/admin/get-admin-analytics";

type Props = {
  analytics: AdminAnalytics;
};

const numberFormatter =
  new Intl.NumberFormat("en-US");

export function ActivityBreakdown({
  analytics,
}: Props) {
  const activity = [
    {
      label: "New users",
      value:
        analytics.activity
          .newUsers,
      icon: UsersRound,
    },
    {
      label: "New businesses",
      value:
        analytics.activity
          .newBusinesses,
      icon: Building2,
    },
    {
      label: "Memories",
      value:
        analytics.activity
          .memories,
      icon: Sparkles,
    },
    {
      label: "Reviews",
      value:
        analytics.activity
          .reviews,
      icon: MessageSquareText,
    },
    {
      label: "Memory likes",
      value:
        analytics.activity.likes,
      icon: Heart,
    },
    {
      label: "Comments",
      value:
        analytics.activity
          .comments,
      icon: MessageCircle,
    },
  ];

  return (
    <div className="space-y-1">
      {activity.map(
        ({
          label,
          value,
          icon: Icon,
        }) => (
          <div
            key={label}
            className="group flex items-center justify-between rounded-2xl px-3 py-2.5 transition duration-200 hover:bg-black/[0.025]"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#006241]/[0.06] text-[#006241] transition duration-200 group-hover:scale-105">
                <Icon className="size-3.5" />
              </div>

              <span className="text-xs font-medium text-black/50">
                {label}
              </span>
            </div>

            <span className="text-xs font-bold text-[#122019]">
              {numberFormatter.format(
                value,
              )}
            </span>
          </div>
        ),
      )}
    </div>
  );
}