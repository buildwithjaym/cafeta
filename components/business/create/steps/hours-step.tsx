"use client";

import {
  Clock3,
  Copy,
} from "lucide-react";

import { toast } from "sonner";

import type {
  BusinessFormData,
  BusinessHour,
} from "@/lib/business/types";

type Props = {
  data: BusinessFormData;

  updateData: (
    values: Partial<BusinessFormData>,
  ) => void;
};

export function HoursStep({
  data,
  updateData,
}: Props) {
  function updateHour(
    dayOfWeek: number,
    values: Partial<BusinessHour>,
  ) {
    updateData({
      hours: data.hours.map(
        (hour) =>
          hour.dayOfWeek ===
          dayOfWeek
            ? {
                ...hour,
                ...values,
              }
            : hour,
      ),
    });
  }

  function applyMondayToAll() {
    const monday =
      data.hours.find(
        (hour) =>
          hour.dayOfWeek === 1,
      );

    if (!monday) {
      return;
    }

    updateData({
      hours: data.hours.map(
        (hour) => ({
          ...hour,

          isClosed:
            monday.isClosed,

          opensAt:
            monday.opensAt,

          closesAt:
            monday.closesAt,
        }),
      ),
    });

    toast.success(
      "Hours applied",
      {
        description:
          "Monday's schedule was applied to every day.",
      },
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006241]">
            Business hours
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#17211c] sm:text-[28px]">
            When are you open?
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
            These hours help customers
            know whether your business
            is open before they visit.
          </p>
        </div>

        <button
          type="button"
          onClick={
            applyMondayToAll
          }
          className="flex h-9 shrink-0 items-center justify-center gap-1.5 self-start rounded-full border border-black/[0.07] bg-white px-3 text-[11px] font-bold text-[#36423b] transition hover:border-[#006241]/20 hover:text-[#006241] sm:self-auto"
        >
          <Copy className="size-3.5" />
          Apply Monday to all
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-[20px] border border-black/[0.06]">
        {data.hours.map(
          (hour, index) => (
            <div
              key={hour.dayOfWeek}
              className={`grid gap-3 p-4 sm:grid-cols-[130px_90px_minmax(0,1fr)] sm:items-center ${
                index !== 0
                  ? "border-t border-black/[0.055]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock3 className="size-3.5 text-[#006241]" />

                <p className="text-xs font-bold text-[#17211c]">
                  {hour.label}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateHour(
                    hour.dayOfWeek,
                    {
                      isClosed:
                        !hour.isClosed,
                    },
                  )
                }
                className={`relative h-7 w-[54px] rounded-full transition ${
                  hour.isClosed
                    ? "bg-black/10"
                    : "bg-[#006241]"
                }`}
                aria-label={`Toggle ${hour.label}`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${
                    hour.isClosed
                      ? "left-1"
                      : "left-[30px]"
                  }`}
                />
              </button>

              {hour.isClosed ? (
                <div className="flex h-10 items-center rounded-[12px] bg-[#f6f7f6] px-4 text-xs font-semibold text-black/35">
                  Closed
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={
                      hour.opensAt
                    }
                    onChange={(
                      event,
                    ) =>
                      updateHour(
                        hour.dayOfWeek,
                        {
                          opensAt:
                            event
                              .target
                              .value,
                        },
                      )
                    }
                    className={timeClass}
                  />

                  <span className="text-[11px] text-black/30">
                    to
                  </span>

                  <input
                    type="time"
                    value={
                      hour.closesAt
                    }
                    onChange={(
                      event,
                    ) =>
                      updateHour(
                        hour.dayOfWeek,
                        {
                          closesAt:
                            event
                              .target
                              .value,
                        },
                      )
                    }
                    className={timeClass}
                  />
                </div>
              )}
            </div>
          ),
        )}
      </div>

      <div className="mt-4 rounded-[16px] bg-[#f5f8f6] px-4 py-3">
        <p className="text-[11px] leading-5 text-black/40">
          You&apos;ll be able to
          update business hours later
          from your business dashboard.
        </p>
      </div>
    </div>
  );
}

const timeClass =
  "h-10 min-w-0 flex-1 rounded-[12px] border border-black/[0.07] bg-[#fafbfa] px-3 text-xs font-semibold text-[#17211c] outline-none transition focus:border-[#006241]/35 focus:bg-white";