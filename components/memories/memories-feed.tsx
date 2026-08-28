"use client";

import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  Coffee,
  ImagePlus,
  Images,
  X,
} from "lucide-react";

import {
  MemoryCard,
} from "@/components/memories/memory-card";

import type {
  Memory,
} from "@/lib/memories/types";

type FilteredBusiness = {
  id: string;
  name: string;
  slug: string;

  logo_url: string | null;
  is_verified: boolean;
};

type Props = {
  memories: Memory[];

  currentUserId: string;

  filteredBusiness?:
    | FilteredBusiness
    | null;
};

export function MemoriesFeed({
  memories,
  currentUserId,
  filteredBusiness = null,
}: Props) {
  const createUrl =
    filteredBusiness
      ? `/memories/create?business=${encodeURIComponent(
          filteredBusiness.slug,
        )}`
      : "/memories/create";

  return (
    <main className="min-h-screen bg-[#f6f7f5] pb-28 md:pb-12">
      <div
        className="
          mx-auto w-full
          max-w-[760px]
          px-4 py-6
          sm:px-6 sm:py-8
        "
      >
        <header>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex size-7
                    items-center
                    justify-center

                    rounded-full
                    bg-[#e7f1ec]
                    text-[#006241]
                  "
                >
                  <Coffee className="size-3.5" />
                </div>

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.17em]
                    text-[#006241]
                  "
                >
                  CAFÉTA
                </p>
              </div>

              <h1
                className="
                  mt-3
                  text-3xl
                  font-black
                  tracking-[-0.055em]
                  text-[#17211c]

                  sm:text-[34px]
                "
              >
                Memories
              </h1>

              <p
                className="
                  mt-1.5
                  max-w-md

                  text-xs
                  leading-5
                  text-black/40
                "
              >
                Café moments shared
                by the community.
              </p>
            </div>

            <Link
              href={
                createUrl
              }
              className="
                hidden h-10
                items-center
                gap-2

                rounded-full
                bg-[#006241]
                px-4

                text-[10px]
                font-bold
                text-white

                shadow-[0_6px_18px_rgba(0,98,65,0.15)]

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#00754a]

                sm:flex
              "
            >
              <Camera className="size-3.5" />

              Share memory
            </Link>
          </div>

          {filteredBusiness && (
            <div
              className="
                mt-6

                animate-in
                fade-in
                slide-in-from-top-2
                duration-300

                overflow-hidden

                rounded-[22px]
                border
                border-[#006241]/[0.07]

                bg-white

                shadow-[0_6px_24px_rgba(23,33,28,0.04)]
              "
            >
              <div className="flex items-center gap-3 p-3.5">
                <Link
                  href={`/business/${encodeURIComponent(
                    filteredBusiness.slug,
                  )}`}
                  className="
                    flex size-11
                    shrink-0
                    items-center
                    justify-center

                    overflow-hidden
                    rounded-[13px]

                    bg-[#e8f2ed]
                    text-[#006241]
                  "
                >
                  {filteredBusiness.logo_url ? (
                    <img
                      src={
                        filteredBusiness.logo_url
                      }
                      alt={`${filteredBusiness.name} logo`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Coffee className="size-4" />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/business/${encodeURIComponent(
                        filteredBusiness.slug,
                      )}`}
                      className="
                        truncate
                        text-[12px]
                        font-black
                        text-[#17211c]

                        transition-colors
                        hover:text-[#006241]
                      "
                    >
                      {
                        filteredBusiness.name
                      }
                    </Link>

                    {filteredBusiness.is_verified && (
                      <BadgeCheck
                        className="
                          size-3.5
                          shrink-0
                          fill-[#1689e8]
                          text-white
                        "
                      />
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <Images className="size-3 text-[#006241]" />

                    <p className="text-[9px] font-semibold text-black/35">
                      Showing community
                      memories from this
                      café
                    </p>
                  </div>
                </div>

                <Link
                  href="/memories"
                  aria-label="Show all memories"
                  className="
                    flex size-8
                    shrink-0
                    items-center
                    justify-center

                    rounded-full
                    bg-black/[0.035]
                    text-black/35

                    transition-all
                    duration-200

                    hover:bg-black/[0.06]
                    hover:text-[#17211c]
                  "
                >
                  <X className="size-3.5" />
                </Link>
              </div>
            </div>
          )}
        </header>

        {memories.length >
        0 ? (
          <div className="mt-6 space-y-5">
            {memories.map(
              (memory) => (
                <MemoryCard
                  key={
                    memory.id
                  }
                  memory={
                    memory
                  }
                  currentUserId={
                    currentUserId
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div
            className="
              mt-7

              flex min-h-[420px]
              items-center
              justify-center

              rounded-[28px]
              border
              border-dashed
              border-black/[0.08]

              bg-white
              px-6
            "
          >
            <div className="max-w-sm text-center">
              <div
                className="
                  mx-auto
                  flex size-14
                  items-center
                  justify-center

                  rounded-full
                  bg-[#e7f1ec]
                  text-[#006241]
                "
              >
                <ImagePlus className="size-5" />
              </div>

              <h2
                className="
                  mt-5
                  text-lg
                  font-black
                  tracking-[-0.035em]
                  text-[#17211c]
                "
              >
                {filteredBusiness
                  ? "No memories here yet"
                  : "No memories yet"}
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-[300px]

                  text-xs
                  leading-5
                  text-black/40
                "
              >
                {filteredBusiness
                  ? `Be the first to share a café moment from ${filteredBusiness.name}.`
                  : "Be the first to share a café moment with the CAFÉTA community."}
              </p>

              <Link
                href={
                  createUrl
                }
                className="
                  mt-5
                  inline-flex h-10
                  items-center
                  gap-2

                  rounded-full
                  bg-[#006241]
                  px-5

                  text-[10px]
                  font-bold
                  text-white

                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#00754a]
                "
              >
                <Camera className="size-3.5" />

                Share a memory
              </Link>

              {filteredBusiness && (
                <Link
                  href="/memories"
                  className="
                    mx-auto mt-3
                    flex w-fit
                    items-center
                    gap-1.5

                    text-[10px]
                    font-bold
                    text-black/35

                    transition-colors
                    hover:text-[#006241]
                  "
                >
                  <ArrowLeft className="size-3" />

                  All memories
                </Link>
              )}
            </div>
          </div>
        )}

        <Link
          href={
            createUrl
          }
          aria-label="Share a memory"
          className="
            fixed
            bottom-[86px]
            right-4
            z-30

            flex size-12
            items-center
            justify-center

            rounded-full
            bg-[#006241]
            text-white

            shadow-[0_10px_30px_rgba(0,98,65,0.28)]

            transition-all
            duration-200

            hover:scale-105
            hover:bg-[#00754a]

            active:scale-95

            sm:hidden
          "
        >
          <Camera className="size-[18px]" />
        </Link>
      </div>
    </main>
  );
}