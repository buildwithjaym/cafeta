"use client";

import {
  Check,
  Compass,
  Map,
  MapPinned,
  Sparkles,
  UtensilsCrossed,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

type Props = {
  fullName: string | null;
  username: string;
  avatarUrl: string | null;

  preferences: string[];

  submitting: boolean;

  onExplore: () => void;
  onMap: () => void;
};

const labels: Record<
  string,
  string
> = {
  coffee: "Coffee",
  milk_tea: "Milk Tea",
  matcha: "Matcha",
  non_coffee:
    "Non-Coffee",
  pastries: "Pastries",
  desserts: "Desserts",
  meals: "Meals",
  snacks: "Snacks",
};

export function OnboardingComplete({
  fullName,
  username,
  avatarUrl,
  preferences,
  submitting,
  onExplore,
  onMap,
}: Props) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <div className="relative mx-auto w-fit">
          <ProfileAvatar
            avatarUrl={
              avatarUrl
            }
          />

          <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-4 border-white bg-[#006241] text-white">
            <Check className="size-3" />
          </div>
        </div>

        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#006241]">
          You're all set
        </p>

        <h1 className="mx-auto mt-3 max-w-lg text-3xl font-black tracking-[-0.055em] text-[#17211c] sm:text-[40px] sm:leading-[1.08]">
          Your next favorite café is out there.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-xs leading-5 text-black/40">
          Your CAFÉTA is ready.
          Discover local places,
          check the menu before you
          go, and see what the
          community is sharing.
        </p>
      </div>

      <div className="mx-auto mt-7 max-w-sm rounded-[24px] border border-[#006241]/10 bg-[#f2f8f5] p-5 text-center">
        <p className="text-sm font-black text-[#17211c]">
          @{username}
        </p>

        {fullName && (
          <p className="mt-1 text-[10px] text-black/40">
            {fullName}
          </p>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {preferences.map(
            (preference) => (
              <span
                key={
                  preference
                }
                className="rounded-full border border-[#006241]/10 bg-white px-2.5 py-1 text-[8px] font-bold text-[#006241]"
              >
                {labels[
                  preference
                ] ??
                  preference}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <ProductFeature
          icon={MapPinned}
          title="Map"
          description="Find what's nearby."
        />

        <ProductFeature
          icon={Sparkles}
          title="Memories"
          description="See what's happening."
        />

        <ProductFeature
          icon={
            UtensilsCrossed
          }
          title="Menus"
          description="Know what to order."
        />
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={onExplore}
        className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#006241] px-6 text-xs font-black text-white shadow-[0_10px_28px_rgba(0,98,65,0.18)] transition hover:-translate-y-0.5 hover:bg-[#00754a] disabled:pointer-events-none disabled:opacity-60"
      >
        {submitting ? (
          <>
            <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Getting CAFÉTA ready
          </>
        ) : (
          <>
            <Compass className="size-4" />
            Start exploring
          </>
        )}
      </button>

      <button
        type="button"
        disabled={submitting}
        onClick={onMap}
        className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[10px] font-bold text-[#006241] transition hover:bg-[#f4f8f6] disabled:pointer-events-none"
      >
        <Map className="size-3.5" />
        Open the map
      </button>
    </div>
  );
}

function ProfileAvatar({
  avatarUrl,
}: {
  avatarUrl: string | null;
}) {
  const [failed, setFailed] =
    useState(false);

  return (
    <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e7f1ec] shadow-[0_10px_30px_rgba(23,33,28,0.12)]">
      {avatarUrl &&
      !failed ? (
        <img
          src={avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(true)
          }
          className="size-full object-cover"
        />
      ) : (
        <UserRound className="size-7 text-[#006241]" />
      )}
    </div>
  );
}

function ProductFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[18px] border border-black/[0.05] bg-[#f8f9f8] px-2 py-4 text-center">
      <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-[#e7f1ec] text-[#006241]">
        <Icon className="size-3.5" />
      </div>

      <p className="mt-2 text-[9px] font-black text-[#17211c]">
        {title}
      </p>

      <p className="mt-1 hidden text-[8px] leading-3 text-black/35 sm:block">
        {description}
      </p>
    </div>
  );
}