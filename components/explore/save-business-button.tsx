"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Heart,
  LoaderCircle,
} from "lucide-react";

import { toast } from "sonner";

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
  const [
    saved,
    setSaved,
  ] = useState(
    initialSaved,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    setSaved(
      initialSaved,
    );
  }, [
    businessId,
    initialSaved,
  ]);

  async function toggleSaved() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const supabase =
        createClient();

      const {
        data: { user },
        error:
          authError,
      } =
        await supabase.auth.getUser();

      if (
        authError ||
        !user
      ) {
        toast.error(
          "Sign in to save places.",
        );

        return;
      }

      const {
        data:
          existingSaved,
        error:
          checkError,
      } =
        await supabase
          .from(
            "saved_businesses",
          )
          .select("id")
          .eq(
            "user_id",
            user.id,
          )
          .eq(
            "business_id",
            businessId,
          )
          .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      const isCurrentlySaved =
        Boolean(
          existingSaved,
        );

      if (
        isCurrentlySaved
      ) {
        const {
          error:
            deleteError,
        } =
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

        if (deleteError) {
          throw deleteError;
        }

        setSaved(false);

        toast.success(
          "Removed from saved",
        );

        return;
      }

      const {
        error:
          insertError,
      } =
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

      if (insertError) {
        throw insertError;
      }

      setSaved(true);

      toast.success(
        "Saved to your places",
      );
    } catch (error) {
      console.error(
        "[CAFÉTA] Failed to update saved business:",
        error,
      );

      toast.error(
        "Couldn't update saved places.",
        {
          description:
            "Please try again.",
        },
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={
        toggleSaved
      }
      disabled={
        loading
      }
      aria-label={
        saved
          ? "Remove from saved"
          : "Save place"
      }
      aria-pressed={
        saved
      }
      className={`
        flex
        size-9
        items-center
        justify-center

        rounded-full

        border
        border-white/50

        bg-white/95

        shadow-[0_3px_12px_rgba(0,0,0,0.10)]

        backdrop-blur-md

        transition-all
        duration-200

        hover:scale-105

        active:scale-90

        disabled:pointer-events-none
        disabled:opacity-70

        ${
          saved
            ? "text-[#006241]"
            : "text-[#17211c] hover:text-[#006241]"
        }
      `}
    >
      {loading ? (
        <LoaderCircle
          className="
            size-4
            animate-spin
          "
        />
      ) : (
        <Heart
          className={
            saved
              ? "size-4 fill-[#006241] stroke-[#006241]"
              : "size-4"
          }
        />
      )}
    </button>
  );
}