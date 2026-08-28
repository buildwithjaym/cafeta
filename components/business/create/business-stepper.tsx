"use client";

import {
  Check,
  Clock3,
  ImageIcon,
  MapPin,
  Menu,
  Store,
  ClipboardCheck,
} from "lucide-react";

import type {
  BusinessWizardStep,
} from "@/lib/business/types";

type Props = {
  currentStep: BusinessWizardStep;
};

const steps = [
  {
    number: 1,
    label: "Basics",
    shortLabel: "Basics",
    icon: Store,
  },
  {
    number: 2,
    label: "Location",
    shortLabel: "Location",
    icon: MapPin,
  },
  {
    number: 3,
    label: "Hours",
    shortLabel: "Hours",
    icon: Clock3,
  },
  {
    number: 4,
    label: "Menu",
    shortLabel: "Menu",
    icon: Menu,
  },
  {
    number: 5,
    label: "Media",
    shortLabel: "Media",
    icon: ImageIcon,
  },
  {
    number: 6,
    label: "Review",
    shortLabel: "Review",
    icon: ClipboardCheck,
  },
] as const;

export function BusinessStepper({
  currentStep,
}: Props) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="relative">
          <div className="absolute left-5 right-5 top-5 h-px bg-black/[0.07]" />

          <div
            className="absolute left-5 top-5 h-px bg-[#006241] transition-[width] duration-500 ease-out"
            style={{
              width: `calc((${
                currentStep - 1
              } / 5) * (100% - 40px))`,
            }}
          />

          <div className="relative grid grid-cols-6">
            {steps.map((step) => {
              const Icon = step.icon;

              const complete =
                currentStep > step.number;

              const active =
                currentStep === step.number;

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`
                      flex size-10 items-center
                      justify-center rounded-full
                      border transition-all
                      duration-300
                      ${
                        complete
                          ? "border-[#006241] bg-[#006241] text-white"
                          : active
                            ? "border-[#006241] bg-white text-[#006241] shadow-[0_0_0_5px_rgba(0,98,65,0.07)]"
                            : "border-black/[0.08] bg-white text-black/30"
                      }
                    `}
                  >
                    {complete ? (
                      <Check
                        className="size-4"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Icon
                        className="size-4"
                        strokeWidth={
                          active ? 2.4 : 2
                        }
                      />
                    )}
                  </div>

                  <p
                    className={`
                      mt-2 text-[11px]
                      font-semibold
                      transition-colors
                      ${
                        active ||
                        complete
                          ? "text-[#006241]"
                          : "text-black/35"
                      }
                    `}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006241]">
              Step {currentStep} of{" "}
              {steps.length}
            </p>

            <p className="mt-1 text-sm font-bold text-[#17211c]">
              {
                steps[currentStep - 1]
                  .label
              }
            </p>
          </div>

          <span className="text-xs font-semibold text-black/30">
            {Math.round(
              (currentStep /
                steps.length) *
                100,
            )}
            %
          </span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-[#006241] transition-[width] duration-500 ease-out"
            style={{
              width: `${
                (currentStep /
                  steps.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </>
  );
}