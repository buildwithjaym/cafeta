"use client";

import {
  BookOpenText,
  MapPinned,
  Sparkles,
} from "lucide-react";

type Props = {
  onContinue: () => void;
};

export function OnboardingWelcome({
  onContinue,
}: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#006241] text-white shadow-[0_12px_30px_rgba(0,98,65,0.22)]">
        <Sparkles className="size-6" />
      </div>

      <div className="mt-7 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006241]">
          Welcome to CAFÉTA
        </p>

        <h1 className="mx-auto mt-3 max-w-xl text-3xl font-black tracking-[-0.055em] text-[#17211c] sm:text-[42px] sm:leading-[1.05]">
          Find places worth going to.
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-black/45">
          Discover local cafés,
          explore their menus before
          you visit, and see real
          moments shared by the
          community.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Feature
          icon={MapPinned}
          title="Discover nearby"
          description="Find cafés and milk tea spots around Basilan."
        />

        <Feature
          icon={BookOpenText}
          title="Know before you go"
          description="Explore menus, prices, reviews, and what's being served."
        />

        <Feature
          icon={Sparkles}
          title="See real moments"
          description="Discover Memories shared by people who were actually there."
        />
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-[#006241] px-6 text-xs font-black text-white shadow-[0_10px_28px_rgba(0,98,65,0.18)] transition hover:-translate-y-0.5 hover:bg-[#00754a] active:scale-[0.99]"
      >
        Show me around
      </button>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MapPinned;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-black/[0.05] bg-[#f7f9f8] p-4 text-left">
      <div className="flex size-9 items-center justify-center rounded-full bg-[#e6f1ec] text-[#006241]">
        <Icon className="size-4" />
      </div>

      <h2 className="mt-4 text-xs font-black text-[#17211c]">
        {title}
      </h2>

      <p className="mt-1.5 text-[10px] leading-4 text-black/40">
        {description}
      </p>
    </div>
  );
}