import {
  CheckCircle2,
  Clock3,
  History,
  RotateCcw,
  ShieldCheck,
  ShieldOff,
  TriangleAlert,
  XCircle,
} from "lucide-react";

export type ModerationLog = {
  id: string;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  previous_verified: boolean | null;
  new_verified: boolean | null;
  reason: string | null;
  created_at: string;

  admin: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
};

type ModerationHistoryProps = {
  logs: ModerationLog[];
};

function getAction(action: string) {
  switch (action) {
    case "approved":
      return {
        label: "Business approved",
        icon: CheckCircle2,
        iconClass: "bg-emerald-50 text-emerald-600",
      };

    case "rejected":
      return {
        label: "Application rejected",
        icon: XCircle,
        iconClass: "bg-red-50 text-red-600",
      };

    case "verified":
      return {
        label: "Business verified",
        icon: ShieldCheck,
        iconClass: "bg-[#006241]/8 text-[#006241]",
      };

    case "verification_removed":
      return {
        label: "Verification removed",
        icon: ShieldOff,
        iconClass: "bg-black/[0.05] text-black/50",
      };

    case "suspended":
      return {
        label: "Business suspended",
        icon: TriangleAlert,
        iconClass: "bg-orange-50 text-orange-600",
      };

    case "restored":
      return {
        label: "Business restored",
        icon: RotateCcw,
        iconClass: "bg-emerald-50 text-emerald-600",
      };

    case "submitted":
    case "resubmitted":
      return {
        label:
          action === "resubmitted"
            ? "Application resubmitted"
            : "Application submitted",
        icon: Clock3,
        iconClass: "bg-amber-50 text-amber-600",
      };

    default:
      return {
        label: action.replaceAll("_", " "),
        icon: History,
        iconClass: "bg-black/[0.05] text-black/50",
      };
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getAdminName(admin: ModerationLog["admin"]) {
  if (!admin) {
    return "CAFÉTA Admin";
  }

  return (
    admin.full_name?.trim() ||
    (admin.username ? `@${admin.username}` : "CAFÉTA Admin")
  );
}

export function ModerationHistory({
  logs,
}: ModerationHistoryProps) {
  return (
    <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#006241]/8 text-[#006241]">
          <History className="size-[18px]" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#111713]">
            Moderation history
          </h2>

          <p className="mt-0.5 text-xs text-black/40">
            Administrative activity for this business.
          </p>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="mt-6 space-y-5">
          {logs.map((log) => {
            const action = getAction(log.action);
            const Icon = action.icon;

            return (
              <div key={log.id} className="flex gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${action.iconClass}`}
                >
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold capitalize text-[#111713]">
                    {action.label}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {getAdminName(log.admin)}
                    {" · "}
                    {formatDate(log.created_at)}
                  </p>

                  {log.previous_status &&
                  log.new_status &&
                  log.previous_status !== log.new_status ? (
                    <p className="mt-2 text-xs text-black/45">
                      <span className="capitalize">
                        {log.previous_status}
                      </span>
                      {" → "}
                      <span className="font-semibold capitalize text-black/65">
                        {log.new_status}
                      </span>
                    </p>
                  ) : null}

                  {log.reason ? (
                    <div className="mt-3 rounded-xl bg-[#F7F8F7] p-3 text-xs leading-5 text-black/55">
                      {log.reason}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-[#F7F9F7] px-4 py-8 text-center">
          <p className="text-xs text-black/35">
            No moderation activity recorded yet.
          </p>
        </div>
      )}
    </section>
  );
}