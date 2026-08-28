"use client";

import {
  useState,
} from "react";

import {
  Heart,
  LoaderCircle,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  businessId: string;
  initialSaved: boolean;
};

export function SaveBusinessButton({
  businessId,
  initialSaved,
}: Props) {
  const [saved, setSaved] =
    useState(initialSaved);

  const [loading, setLoading] =
    useState(false);

  async function toggleSaved() {
    if (loading) {
      return;
    }

    setLoading(true);

    const supabase =
      createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      toast.error(
        "Sign in to save places.",
      );

      setLoading(false);
      return;
    }

    if (saved) {
      const { error } =
        await supabase
          .from(
            "saved_businesses",
          )
          .delete()
          .eq(
            "user_id",
            user.id,
          )
          .eq(
            "business_id",
            businessId,
          );

      if (error) {
        console.error(
          "Failed to remove saved business:",
          error,
        );

        toast.error(
          "Couldn't remove this place.",
        );

        setLoading(false);
        return;
      }

      setSaved(false);

      toast.success(
        "Removed from saved",
      );
    } else {
      const { error } =
        await supabase
          .from(
            "saved_businesses",
          )
          .insert({
            user_id:
              user.id,
            business_id:
              businessId,
          });

      if (error) {
        console.error(
          "Failed to save business:",
          error,
        );

        toast.error(
          "Couldn't save this place.",
        );

        setLoading(false);
        return;
      }

      setSaved(true);

      toast.success(
        "Saved to your places",
      );
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={
        toggleSaved
      }
      disabled={loading}
      aria-label={
        saved
          ? "Remove from saved"
          : "Save place"
      }
      aria-pressed={
        saved
      }
      className={`
        flex size-10
        items-center
        justify-center
        rounded-full
        bg-white/95
        shadow-sm
        backdrop-blur
        transition-all
        duration-200
        hover:scale-105
        active:scale-90
        disabled:pointer-events-none

        ${
          saved
            ? "text-[#006241]"
            : "text-[#17211c] hover:text-[#006241]"
        }
      `}
    >
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Heart
          className={
            saved
              ? "size-4 fill-[#006241]"
              : "size-4"
          }
        />
      )}
    </button>
  );
}