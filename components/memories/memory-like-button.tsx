"use client";

import {
  useState,
} from "react";

import {
  Heart,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  memoryId: string;

  initialLiked: boolean;

  initialCount: number;
};

export function MemoryLikeButton({
  memoryId,
  initialLiked,
  initialCount,
}: Props) {
  const [
    liked,
    setLiked,
  ] =
    useState(
      initialLiked,
    );

  const [
    count,
    setCount,
  ] =
    useState(
      initialCount,
    );

  const [
    working,
    setWorking,
  ] =
    useState(false);

  async function toggleLike() {
    if (working) {
      return;
    }

    setWorking(
      true,
    );

    const previousLiked =
      liked;

    const previousCount =
      count;

    const nextLiked =
      !liked;

    setLiked(
      nextLiked,
    );

    setCount(
      Math.max(
        0,
        count +
          (nextLiked
            ? 1
            : -1),
      ),
    );

    try {
      const supabase =
        createClient();

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
        throw new Error(
          "Please sign in to like memories.",
        );
      }

      if (
        nextLiked
      ) {
        const {
          error,
        } =
          await supabase
            .from(
              "memory_likes",
            )
            .insert({
              memory_id:
                memoryId,

              user_id:
                user.id,
            });

        if (error) {
          throw error;
        }
      } else {
        const {
          error,
        } =
          await supabase
            .from(
              "memory_likes",
            )
            .delete()
            .eq(
              "memory_id",
              memoryId,
            )
            .eq(
              "user_id",
              user.id,
            );

        if (error) {
          throw error;
        }
      }
    } catch (
      error
    ) {
      setLiked(
        previousLiked,
      );

      setCount(
        previousCount,
      );

      toast.error(
        "Couldn't update like",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );
    } finally {
      setWorking(
        false,
      );
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void toggleLike();
      }}
      disabled={
        working
      }
      aria-pressed={
        liked
      }
      className={`
        flex
        h-9
        items-center
        gap-1.5

        rounded-full

        px-3

        text-[10px]
        font-bold

        transition-all

        active:scale-95

        disabled:pointer-events-none
        disabled:opacity-60

        ${
          liked
            ? "bg-red-50 text-red-600"
            : "bg-black/[0.035] text-black/45 hover:bg-black/[0.06]"
        }
      `}
    >
      <Heart
        className={`
          size-3.5

          ${
            liked
              ? "fill-current"
              : ""
          }
        `}
      />

      {count >
      0
        ? count
        : "Like"}
    </button>
  );
}