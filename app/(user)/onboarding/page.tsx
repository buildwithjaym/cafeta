import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import {
  OnboardingClient,
} from "@/components/onboarding/onboarding-client";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Welcome to CAFÉTA",

  description:
    "Set up your CAFÉTA profile and start discovering cafés around you.",
};

export default async function OnboardingPage() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=${encodeURIComponent(
        "/onboarding",
      )}`,
    );
  }

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        username,
        avatar_url,
        bio,
        onboarding_completed
      `)
      .eq(
        "id",
        user.id,
      )
      .maybeSingle();

  if (profileError) {
    console.error(
      "[CAFÉTA] Failed to load onboarding profile:",
      profileError,
    );
  }

  if (
    profile?.onboarding_completed
  ) {
    redirect(
      "/explore",
    );
  }

  return (
    <main
      className="
        h-dvh
        w-full
        overflow-hidden
        bg-[#f5f7f5]
      "
    >
      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-center
          p-3
          sm:p-5
          lg:p-6
        "
      >
        <OnboardingClient
          userId={
            user.id
          }
          email={
            user.email ??
            ""
          }
          initialProfile={{
            full_name:
              profile?.full_name ??
              user.user_metadata
                ?.full_name ??
              user.user_metadata
                ?.name ??
              "",

            username:
              profile?.username ??
              "",

            avatar_url:
              profile?.avatar_url ??
              user.user_metadata
                ?.avatar_url ??
              user.user_metadata
                ?.picture ??
              null,

            bio:
              profile?.bio ??
              "",
          }}
        />
      </div>
    </main>
  );
}