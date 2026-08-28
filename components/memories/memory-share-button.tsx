"use client";

import {
  Share2,
} from "lucide-react";

import {
  toast,
} from "sonner";

type Props = {
  memoryId: string;

  businessName?: string | null;
};

export function MemoryShareButton({
  memoryId,
  businessName,
}: Props) {
  async function share() {
    const url =
      `${window.location.origin}/memories/${memoryId}`;

    const title =
      businessName
        ? `CAFÉTA Memory at ${businessName}`
        : "CAFÉTA Memory";

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title,
          text:
            businessName
              ? `Check out this café memory at ${businessName}.`
              : "Check out this café memory on CAFÉTA.",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(
        url,
      );

      toast.success(
        "Link copied",
      );
    } catch (
      error
    ) {
      if (
        error instanceof DOMException &&
        error.name ===
          "AbortError"
      ) {
        return;
      }

      toast.error(
        "Couldn't share memory",
      );
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void share();
      }}
      className="flex size-9 items-center justify-center rounded-full bg-black/[0.035] text-black/45 transition hover:bg-black/[0.06] active:scale-95"
      aria-label="Share memory"
    >
      <Share2 className="size-3.5" />
    </button>
  );
}