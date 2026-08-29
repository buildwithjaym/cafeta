import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";

export type BusinessStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

type BusinessStatusBadgeProps = {
  status: BusinessStatus;
  verified?: boolean;
};

export function BusinessStatusBadge({
  status,
  verified = false,
}: BusinessStatusBadgeProps) {
  if (status === "approved" && verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006241] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
        <ShieldCheck className="size-3" />
        Verified
      </span>
    );
  }

  const config = {
    draft: {
      label: "Draft",
      icon: CircleDashed,
      style: "bg-black/[0.06] text-black/50",
    },

    pending: {
      label: "Pending",
      icon: Clock3,
      style: "bg-amber-100 text-amber-800",
    },

    approved: {
      label: "Approved",
      icon: CheckCircle2,
      style: "bg-emerald-100 text-emerald-700",
    },

    rejected: {
      label: "Rejected",
      icon: XCircle,
      style: "bg-red-100 text-red-700",
    },

    suspended: {
      label: "Suspended",
      icon: TriangleAlert,
      style: "bg-orange-100 text-orange-700",
    },
  };

  const item = config[status];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${item.style}`}
    >
      <Icon className="size-3" />
      {item.label}
    </span>
  );
}