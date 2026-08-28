"use client";

import {
  Coffee,
  CupSoda,
  Store,
  Wheat,
} from "lucide-react";

import {
  createBusinessSlug,
} from "@/lib/business/slug";

import type {
  BusinessCategory,
  BusinessFormData,
} from "@/lib/business/types";

type Props = {
  data: BusinessFormData;
  updateData: (
    values: Partial<BusinessFormData>,
  ) => void;
};

const categories: {
  value: BusinessCategory;
  label: string;
  description: string;
  icon: typeof Coffee;
}[] = [
  {
    value: "coffee_shop",
    label: "Coffee Shop",
    description:
      "Coffee-focused shops and specialty brewers.",
    icon: Coffee,
  },
  {
    value: "milk_tea",
    label: "Milk Tea",
    description:
      "Milk tea, fruit tea and similar drinks.",
    icon: CupSoda,
  },
  {
    value: "cafe",
    label: "Café",
    description:
      "Cafés serving drinks, food and desserts.",
    icon: Store,
  },
  {
    value: "bakery",
    label: "Bakery",
    description:
      "Bakeries with coffee, pastries or café service.",
    icon: Wheat,
  },
];

export function BasicsStep({
  data,
  updateData,
}: Props) {
  function handleNameChange(
    value: string,
  ) {
    updateData({
      name: value,
      slug: createBusinessSlug(
        value,
      ),
    });
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006241]">
          Business basics
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#17211c] sm:text-[28px]">
          Tell us about your place
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
          Start with the information
          people will see when they
          discover your business on
          CAFÉTA.
        </p>
      </div>

      <div className="mt-8 space-y-7">
        <div>
          <label
            htmlFor="business-name"
            className="text-xs font-bold text-[#26322b]"
          >
            Business name
            <span className="ml-1 text-[#006241]">
              *
            </span>
          </label>

          <input
            id="business-name"
            value={data.name}
            onChange={(event) =>
              handleNameChange(
                event.target.value,
              )
            }
            maxLength={120}
            autoComplete="organization"
            placeholder="e.g. Brew & Co."
            className="
              mt-2 h-12 w-full
              rounded-[15px]
              border border-black/[0.08]
              bg-[#fafbfa] px-4
              text-sm font-medium
              text-[#17211c]
              outline-none
              transition-all
              placeholder:text-black/25
              focus:border-[#006241]/40
              focus:bg-white
              focus:ring-4
              focus:ring-[#006241]/[0.06]
            "
          />

          <div className="mt-2 flex justify-between gap-3">
            <p className="text-[11px] text-black/35">
              Use the name customers
              know your business by.
            </p>

            <span className="shrink-0 text-[10px] text-black/25">
              {data.name.length}/120
            </span>
          </div>
        </div>

        {data.slug && (
          <div className="rounded-[15px] border border-[#006241]/10 bg-[#f5f9f7] px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
              CAFÉTA address
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-[#006241]">
              cafeta.app/place/
              {data.slug}
            </p>
          </div>
        )}

        <div>
          <div>
            <p className="text-xs font-bold text-[#26322b]">
              What kind of place is
              this?
              <span className="ml-1 text-[#006241]">
                *
              </span>
            </p>

            <p className="mt-1 text-[11px] text-black/35">
              Choose the category that
              best describes your
              business.
            </p>
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {categories.map(
              (category) => {
                const Icon =
                  category.icon;

                const selected =
                  data.category ===
                  category.value;

                return (
                  <button
                    key={
                      category.value
                    }
                    type="button"
                    onClick={() =>
                      updateData({
                        category:
                          category.value,
                      })
                    }
                    className={`
                      group flex items-start
                      gap-3 rounded-[18px]
                      border p-4 text-left
                      transition-all
                      duration-200
                      active:scale-[0.99]
                      ${
                        selected
                          ? "border-[#006241]/30 bg-[#f3f8f5] shadow-[0_5px_18px_rgba(0,98,65,0.06)]"
                          : "border-black/[0.07] bg-white hover:border-[#006241]/20 hover:bg-[#fafcfa]"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex size-10
                        shrink-0 items-center
                        justify-center
                        rounded-[13px]
                        transition-colors
                        ${
                          selected
                            ? "bg-[#006241] text-white"
                            : "bg-[#f2f5f3] text-black/45 group-hover:text-[#006241]"
                        }
                      `}
                    >
                      <Icon className="size-[17px]" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`
                          text-sm
                          font-bold
                          ${
                            selected
                              ? "text-[#006241]"
                              : "text-[#17211c]"
                          }
                        `}
                      >
                        {
                          category.label
                        }
                      </p>

                      <p className="mt-1 text-[11px] leading-[17px] text-black/40">
                        {
                          category.description
                        }
                      </p>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label
              htmlFor="business-description"
              className="text-xs font-bold text-[#26322b]"
            >
              Description
            </label>

            <span className="text-[10px] text-black/25">
              {data.description.length}
              /500
            </span>
          </div>

          <textarea
            id="business-description"
            value={data.description}
            onChange={(event) =>
              updateData({
                description:
                  event.target.value,
              })
            }
            maxLength={500}
            rows={5}
            placeholder="Tell people what makes your place worth visiting..."
            className="
              mt-2 w-full resize-none
              rounded-[16px]
              border border-black/[0.08]
              bg-[#fafbfa] px-4 py-3.5
              text-sm leading-6
              text-[#17211c]
              outline-none
              transition-all
              placeholder:text-black/25
              focus:border-[#006241]/40
              focus:bg-white
              focus:ring-4
              focus:ring-[#006241]/[0.06]
            "
          />
        </div>
      </div>
    </div>
  );
}