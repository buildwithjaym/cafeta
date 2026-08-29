"use client";

import {
  BarChart3,
  ChevronRight,
  Store,
} from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useState,
  useTransition,
} from "react";

type AdminView =
  | "businesses"
  | "analytics";

type Props = {
  activeView: AdminView;
  pendingCount: number;
};

export function AdminWorkspaceTabs({
  activeView,
  pendingCount,
}: Props) {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    pendingView,
    setPendingView,
  ] =
    useState<AdminView | null>(
      null,
    );

  function changeView(
    view: AdminView,
  ) {
    if (
      view === activeView ||
      isPending
    ) {
      return;
    }

    setPendingView(view);

    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    if (view === "businesses") {
      params.delete("view");
      params.delete("period");
    } else {
      params.set(
        "view",
        "analytics",
      );

      if (
        !params.has("period")
      ) {
        params.set(
          "period",
          "30",
        );
      }
    }

    const query =
      params.toString();

    startTransition(() => {
      router.replace(
        query
          ? `/admin?${query}`
          : "/admin",
        {
          scroll: false,
        },
      );
    });
  }

  const displayedView =
    isPending && pendingView
      ? pendingView
      : activeView;

  return (
    <div className="inline-flex w-full rounded-[20px] border border-black/[0.06] bg-[#F5F7F6] p-1.5 sm:w-auto">
      <button
        type="button"
        onClick={() =>
          changeView(
            "businesses",
          )
        }
        className={`group relative flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[15px] px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:flex-none sm:justify-start ${
          displayedView ===
          "businesses"
            ? "bg-white text-[#122019] shadow-[0_2px_10px_rgba(18,32,25,0.06)]"
            : "text-black/40 hover:text-black/65"
        }`}
      >
        <Store
          className={`size-4 transition duration-300 ${
            displayedView ===
            "businesses"
              ? "text-[#006241]"
              : "text-black/30 group-hover:text-black/50"
          }`}
        />

        <span>
          Business Applications
        </span>

        {pendingCount > 0 ? (
          <span
            className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-bold transition ${
              displayedView ===
              "businesses"
                ? "bg-[#006241]/10 text-[#006241]"
                : "bg-black/[0.05] text-black/35"
            }`}
          >
            {pendingCount > 99
              ? "99+"
              : pendingCount}
          </span>
        ) : null}

        {displayedView ===
        "businesses" ? (
          <ChevronRight className="hidden size-3 text-black/20 sm:block" />
        ) : null}
      </button>

      <button
        type="button"
        onClick={() =>
          changeView(
            "analytics",
          )
        }
        className={`group flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[15px] px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:flex-none sm:justify-start ${
          displayedView ===
          "analytics"
            ? "bg-white text-[#122019] shadow-[0_2px_10px_rgba(18,32,25,0.06)]"
            : "text-black/40 hover:text-black/65"
        }`}
      >
        <BarChart3
          className={`size-4 transition duration-300 ${
            displayedView ===
            "analytics"
              ? "text-[#006241]"
              : "text-black/30 group-hover:text-black/50"
          }`}
        />

        <span>
          Analytics
        </span>

        {displayedView ===
        "analytics" ? (
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#006241]/30" />

            <span className="relative inline-flex size-1.5 rounded-full bg-[#006241]" />
          </span>
        ) : null}
      </button>
    </div>
  );
}