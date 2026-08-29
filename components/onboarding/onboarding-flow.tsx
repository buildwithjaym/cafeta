"use client";

import {
  useState,
} from "react";

import {
  Coffee,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  toast,
} from "sonner";

import {
  OnboardingComplete,
} from "@/components/onboarding/onboarding-complete";

import {
  OnboardingIdentity,
} from "@/components/onboarding/onboarding-identity";

import {
  OnboardingPreferences,
} from "@/components/onboarding/onboarding-preferences";

import {
  OnboardingProgress,
} from "@/components/onboarding/onboarding-progress";

import {
  OnboardingWelcome,
} from "@/components/onboarding/onboarding-welcome";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  userId: string;

  profile: {
    full_name:
      string | null;

    username:
      string | null;

    avatar_url:
      string | null;

    cafe_preferences:
      string[];
  };
};

export function OnboardingFlow({
  userId,
  profile,
}: Props) {
  const router =
    useRouter();

  const [
    step,
    setStep,
  ] =
    useState(1);

  const [
    username,
    setUsername,
  ] =
    useState(
      profile.username ??
        "",
    );

  const [
    preferences,
    setPreferences,
  ] =
    useState<string[]>(
      profile.cafe_preferences,
    );

  const [
    completing,
    setCompleting,
  ] =
    useState(false);

  async function savePreferences() {
    if (
      preferences.length ===
      0
    ) {
      toast.error(
        "Choose at least one favorite.",
      );

      return;
    }

    try {
      const supabase =
        createClient();

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (
        !user ||
        user.id !== userId
      ) {
        throw new Error(
          "Your session has expired.",
        );
      }

      const {
        error,
      } =
        await supabase
          .from("profiles")
          .update({
            cafe_preferences:
              preferences,
          })
          .eq(
            "id",
            userId,
          );

      if (error) {
        throw error;
      }

      setStep(4);
    } catch (error) {
      toast.error(
        "Couldn't save your preferences",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );
    }
  }

  async function complete(
    destination:
      | "/explore"
      | "/map",
  ) {
    if (completing) {
      return;
    }

    setCompleting(true);

    try {
      const supabase =
        createClient();

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (
        !user ||
        user.id !== userId
      ) {
        throw new Error(
          "Your session has expired.",
        );
      }

      const {
        error,
      } =
        await supabase
          .from("profiles")
          .update({
            username,
            cafe_preferences:
              preferences,
            onboarding_completed:
              true,
          })
          .eq(
            "id",
            userId,
          );

      if (error) {
        throw error;
      }

      toast.success(
        "Your CAFÉTA is ready",
      );

      router.replace(
        destination,
      );

      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't finish onboarding",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );

      setCompleting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7f5]">
      <div className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-[#006241]/[0.055] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 size-[460px] rounded-full bg-[#b8d7c7]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[820px] flex-col px-4 py-5 sm:px-7 sm:py-7">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#006241] text-white shadow-[0_5px_16px_rgba(0,98,65,0.18)]">
              <Coffee className="size-4" />
            </div>

            <span className="text-base font-black tracking-[-0.04em] text-[#006241]">
              CAFÉTA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <OnboardingProgress
              step={step}
            />

            <span className="hidden text-[9px] font-black tabular-nums text-black/25 sm:block">
              {String(
                step,
              ).padStart(
                2,
                "0",
              )}
              /04
            </span>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-7 sm:py-10">
          <section className="w-full rounded-[30px] border border-black/[0.05] bg-white p-5 shadow-[0_20px_70px_rgba(23,33,28,0.07)] sm:rounded-[36px] sm:p-9">
            {step === 1 && (
              <OnboardingWelcome
                onContinue={() =>
                  setStep(2)
                }
              />
            )}

            {step === 2 && (
              <OnboardingIdentity
                userId={
                  userId
                }
                fullName={
                  profile.full_name
                }
                avatarUrl={
                  profile.avatar_url
                }
                initialUsername={
                  username ||
                  null
                }
                onBack={() =>
                  setStep(1)
                }
                onComplete={(
                  value,
                ) => {
                  setUsername(
                    value,
                  );

                  setStep(3);
                }}
              />
            )}

            {step === 3 && (
              <OnboardingPreferences
                selected={
                  preferences
                }
                onChange={
                  setPreferences
                }
                onBack={() =>
                  setStep(2)
                }
                onContinue={
                  savePreferences
                }
              />
            )}

            {step === 4 && (
              <OnboardingComplete
                fullName={
                  profile.full_name
                }
                username={
                  username
                }
                avatarUrl={
                  profile.avatar_url
                }
                preferences={
                  preferences
                }
                submitting={
                  completing
                }
                onExplore={() =>
                  complete(
                    "/explore",
                  )
                }
                onMap={() =>
                  complete(
                    "/map",
                  )
                }
              />
            )}
          </section>
        </div>

        <p className="pb-1 text-center text-[8px] leading-4 text-black/25">
          Discover local. Support
          local. Remember the places
          worth coming back to.
        </p>
      </div>
    </main>
  );
}