import Link from "next/link";

import {
  ArrowRight,
  Coffee,
  Heart,
} from "lucide-react";

export function SavedEmptyState() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center py-12">
      <div className="max-w-md text-center">
        <div className="relative mx-auto flex size-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#e8f2ed]" />

          <Coffee className="relative size-7 text-[#006241]" />

          <div className="absolute -right-1 top-0 flex size-8 items-center justify-center rounded-full border-4 border-[#f7f8f6] bg-white shadow-sm">
            <Heart className="size-3.5 text-[#006241]" />
          </div>
        </div>

        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[#006241]">
          Your collection
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#17211c]">
          Nothing saved yet
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/45">
          Found a café or milk-tea
          shop you want to remember?
          Save it and it&apos;ll appear
          here.
        </p>

        <Link
          href="/explore"
          className="group mx-auto mt-6 flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-[#006241] px-5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(0,98,65,0.18)] transition hover:bg-[#00754a]"
        >
          Explore places

          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}