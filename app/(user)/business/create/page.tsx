import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import {
  BusinessCreateWizard,
} from "@/components/business/create/business-create-wizard";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Add your business",

  description:
    "Create your café, coffee shop, milk-tea shop, or bakery on CAFÉTA.",
};

export default async function CreateBusinessPage() {
  const supabase =
    await createClient();

  /*
   * Authentication is checked here,
   * on the server.
   *
   * If this page renders, we already
   * know that Supabase recognizes
   * the current signed-in user.
   */
  const {
    data: {
      user,
    },
    error:
      authError,
  } =
    await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    redirect(
      "/auth/login?next=/business/create",
    );
  }

  /*
   * A CAFÉTA profile must exist
   * because businesses.created_by
   * and business_members.user_id
   * reference profiles.id.
   */
  const {
    data: profile,
    error:
      profileError,
  } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        username,
        avatar_url,
        role
      `)
      .eq(
        "id",
        user.id,
      )
      .maybeSingle();

  if (profileError) {
    console.error(
      "[CAFÉTA] Failed to load profile:",
      {
        message:
          profileError.message,

        code:
          profileError.code,

        details:
          profileError.details,

        hint:
          profileError.hint,
      },
    );

    /*
     * Don't pretend this is an
     * authentication failure.
     */
    throw new Error(
      "CAFÉTA could not load your profile.",
    );
  }

  if (!profile) {
    redirect(
      "/profile",
    );
  }

  return (
    <main
      className="
        min-h-[calc(100dvh-72px)]
        bg-[#f7f8f6]
        pb-28
        md:pb-14
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1180px]
          px-4
          py-5
          sm:px-6
          md:py-9
          lg:px-8
        "
      >
        <BusinessCreateWizard
          userId={
            user.id
          }
        />
      </div>
    </main>
  );
}