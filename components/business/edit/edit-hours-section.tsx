"use client";

import {
  Check,
  Clock3,
} from "lucide-react";

export type EditableBusinessHour = {
  id?: string;

  day_of_week: number;

  opens_at: string;

  closes_at: string;

  is_closed: boolean;
};

type Props = {
  hours: EditableBusinessHour[];

  onChange: (
    hours: EditableBusinessHour[],
  ) => void;
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function EditHoursSection({
  hours,
  onChange,
}: Props) {
  function updateHour(
    day: number,
    field:
      | "opens_at"
      | "closes_at"
      | "is_closed",
    value:
      | string
      | boolean,
  ) {
    onChange(
      hours.map(
        (hour) =>
          hour.day_of_week ===
          day
            ? {
                ...hour,
                [field]:
                  value,
              }
            : hour,
      ),
    );
  }

  function copyMonday() {
    const monday =
      hours.find(
        (hour) =>
          hour.day_of_week ===
          1,
      );

    if (!monday) {
      return;
    }

    onChange(
      hours.map(
        (hour) => ({
          ...hour,

          opens_at:
            monday.opens_at,

          closes_at:
            monday.closes_at,

          is_closed:
            monday.is_closed,
        }),
      ),
    );
  }

  return (
    <section
      className="
        rounded-[22px]
        border
        border-black/[0.055]
        bg-white
        p-5
        shadow-[0_2px_12px_rgba(23,33,28,0.035)]
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-300
        sm:p-6
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <div
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-[13px]
              bg-[#e8f2ed]
              text-[#006241]
            "
          >
            <Clock3 className="size-4" />
          </div>

          <div>
            <h2
              className="
                text-[17px]
                font-black
                text-[#17211c]
              "
            >
              Business hours
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                leading-4
                text-black/35
              "
            >
              Tell customers
              when your business
              is open.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            copyMonday
          }
          className="
            h-9
            rounded-full
            border
            border-black/[0.07]
            bg-[#fafbfa]
            px-4
            text-[9px]
            font-bold
            text-[#39433e]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#006241]/15
            hover:bg-[#f4f8f6]
            hover:text-[#006241]
          "
        >
          Apply Monday to all
        </button>
      </div>

      <div
        className="
          mt-6
          space-y-2
        "
      >
        {hours.map(
          (hour) => {
            const day =
              DAYS[
                hour.day_of_week
              ];

            return (
              <div
                key={
                  hour.day_of_week
                }
                className={`
                  rounded-[16px]
                  border
                  p-4
                  transition-all
                  duration-200

                  ${
                    hour.is_closed
                      ? "border-black/[0.05] bg-[#fafbfa]"
                      : "border-[#006241]/10 bg-white hover:border-[#006241]/15"
                  }
                `}
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-black
                        text-[#17211c]
                      "
                    >
                      {day}
                    </p>

                    <p
                      className={`
                        mt-0.5
                        text-[9px]
                        font-semibold

                        ${
                          hour.is_closed
                            ? "text-black/25"
                            : "text-[#006241]"
                        }
                      `}
                    >
                      {hour.is_closed
                        ? "Closed"
                        : "Open"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateHour(
                        hour.day_of_week,
                        "is_closed",
                        !hour.is_closed,
                      )
                    }
                    className={`
                      relative
                      h-7
                      w-12
                      rounded-full
                      transition-colors
                      duration-200

                      ${
                        hour.is_closed
                          ? "bg-black/10"
                          : "bg-[#006241]"
                      }
                    `}
                    aria-label={`Toggle ${day}`}
                  >
                    <span
                      className={`
                        absolute
                        top-1
                        flex
                        size-5
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        shadow-sm
                        transition-all
                        duration-200

                        ${
                          hour.is_closed
                            ? "left-1"
                            : "left-7"
                        }
                      `}
                    >
                      {!hour.is_closed && (
                        <Check className="size-2.5 text-[#006241]" />
                      )}
                    </span>
                  </button>
                </div>

                {!hour.is_closed && (
                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-[1fr_auto_1fr]
                      items-center
                      gap-2
                      animate-in
                      fade-in
                      slide-in-from-top-1
                      duration-200
                    "
                  >
                    <input
                      type="time"
                      value={
                        hour.opens_at
                      }
                      onChange={(
                        event,
                      ) =>
                        updateHour(
                          hour.day_of_week,
                          "opens_at",
                          event
                            .target
                            .value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />

                    <span
                      className="
                        text-[9px]
                        font-medium
                        text-black/25
                      "
                    >
                      to
                    </span>

                    <input
                      type="time"
                      value={
                        hour.closes_at
                      }
                      onChange={(
                        event,
                      ) =>
                        updateHour(
                          hour.day_of_week,
                          "closes_at",
                          event
                            .target
                            .value,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>
                )}
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}

const inputClass = `
  h-11
  min-w-0
  w-full
  rounded-[12px]
  border
  border-black/[0.07]
  bg-[#fafbfa]
  px-3
  text-[11px]
  font-semibold
  text-[#17211c]
  outline-none
  transition-all
  focus:border-[#006241]/25
  focus:bg-white
  focus:ring-4
  focus:ring-[#006241]/[0.04]
`;