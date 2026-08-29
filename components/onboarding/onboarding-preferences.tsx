"use client";

import {
  Check,
  ChevronLeft,
  Coffee,
  Cookie,
  CupSoda,
  IceCreamBowl,
  Sandwich,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

type Props = {
  selected: string[];

  onChange: (
    values: string[],
  ) => void;

  onContinue: () => void;

  onBack: () => void;
};

const preferences = [
  {
    id: "coffee",
    label: "Coffee",
    description:
      "Espresso, iced coffee and more.",
    icon: Coffee,
  },
  {
    id: "milk_tea",
    label: "Milk Tea",
    description:
      "Classic, flavored and specialty milk tea.",
    icon: CupSoda,
  },
  {
    id: "matcha",
    label: "Matcha",
    description:
      "Creamy, earthy and refreshing.",
    icon: Sparkles,
  },
  {
    id: "non_coffee",
    label: "Non-Coffee",
    description:
      "Refreshers, chocolate and other drinks.",
    icon: CupSoda,
  },
  {
    id: "pastries",
    label: "Pastries",
    description:
      "Fresh baked treats for your coffee.",
    icon: Cookie,
  },
  {
    id: "desserts",
    label: "Desserts",
    description:
      "Something sweet after every visit.",
    icon: IceCreamBowl,
  },
  {
    id: "meals",
    label: "Meals",
    description:
      "Places serving more than drinks.",
    icon: UtensilsCrossed,
  },
  {
    id: "snacks",
    label: "Snacks",
    description:
      "Quick bites worth adding to your order.",
    icon: Sandwich,
  },
] as const;

export function OnboardingPreferences({
  selected,
  onChange,
  onContinue,
  onBack,
}: Props) {
  function toggle(
    id: string,
  ) {
    if (
      selected.includes(id)
    ) {
      onChange(
        selected.filter(
          (value) =>
            value !== id,
        ),
      );

      return;
    }

    onChange([
      ...selected,
      id,
    ]);
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006241]">
          Your CAFÉTA
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-[-0.055em] text-[#17211c] sm:text-[38px]">
          Tell us what looks good.
        </h1>

        <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-black/40">
          Pick a few favorites.
          We'll use them to make
          discovery feel more like
          your kind of CAFÉTA.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3">
        {preferences.map(
          (preference) => {
            const Icon =
              preference.icon;

            const active =
              selected.includes(
                preference.id,
              );

            return (
              <button
                key={
                  preference.id
                }
                type="button"
                aria-pressed={
                  active
                }
                onClick={() =>
                  toggle(
                    preference.id,
                  )
                }
                className={`relative min-h-[130px] rounded-[22px] border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                  active
                    ? "border-[#006241]/25 bg-[#edf6f1] shadow-[0_8px_25px_rgba(0,98,65,0.07)]"
                    : "border-black/[0.055] bg-[#f8f9f8] hover:border-[#006241]/15 hover:bg-white"
                }`}
              >
                <div
                  className={`flex size-9 items-center justify-center rounded-full transition ${
                    active
                      ? "bg-[#006241] text-white"
                      : "bg-white text-[#006241] shadow-sm"
                  }`}
                >
                  <Icon className="size-4" />
                </div>

                {active && (
                  <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#006241] text-white">
                    <Check className="size-3" />
                  </div>
                )}

                <p className="mt-4 text-xs font-black text-[#17211c]">
                  {
                    preference.label
                  }
                </p>

                <p className="mt-1 hidden text-[9px] leading-4 text-black/35 sm:block">
                  {
                    preference.description
                  }
                </p>
              </button>
            );
          },
        )}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-[18px] bg-[#f5f8f6] px-4 py-3">
        <p className="text-[10px] text-black/40">
          {selected.length ===
          0
            ? "Pick anything you'd love to discover."
            : `${selected.length} ${
                selected.length ===
                1
                  ? "favorite"
                  : "favorites"
              } selected`}
        </p>

        {selected.length >
          0 && (
          <p className="text-[9px] font-black text-[#006241]">
            Looking good.
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-black/[0.07] text-black/40 transition hover:bg-black/[0.025]"
        >
          <ChevronLeft className="size-4" />
        </button>

        <button
          type="button"
          disabled={
            selected.length ===
            0
          }
          onClick={
            onContinue
          }
          className="h-12 flex-1 rounded-full bg-[#006241] px-6 text-xs font-black text-white shadow-[0_8px_24px_rgba(0,98,65,0.16)] transition hover:bg-[#00754a] disabled:pointer-events-none disabled:bg-black/10 disabled:text-black/25"
        >
          Build my CAFÉTA
        </button>
      </div>
    </div>
  );
}