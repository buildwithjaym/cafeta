"use client";

import Link from "next/link";

import {
  ArrowRight,
  Camera,
  Images,
  UserRound,
} from "lucide-react";

import type {
  BusinessMemoryPreview,
} from "@/lib/memories/types";

type Props = {
  businessSlug: string;
  businessName: string;

  memories:
    BusinessMemoryPreview[];
};

export function BusinessMemories({
  businessSlug,
  businessName,
  memories,
}: Props) {
  const allMemoriesUrl =
    `/memories?business=${encodeURIComponent(
      businessSlug,
    )}`;

  const createUrl =
    `/memories/create?business=${encodeURIComponent(
      businessSlug,
    )}`;

  if (
    memories.length === 0
  ) {
    return (
      <section
        className="
          rounded-[14px]
          border
          border-black/[0.055]
          bg-white

          p-6
          text-center

          shadow-[0_1px_2px_rgba(0,0,0,0.07)]
        "
      >
        <div
          className="
            mx-auto
            flex size-12
            items-center
            justify-center

            rounded-full
            bg-[#e8f2ed]
            text-[#006241]
          "
        >
          <Images className="size-5" />
        </div>

        <h3 className="mt-4 text-sm font-black text-[#17211c]">
          No memories yet
        </h3>

        <p
          className="
            mx-auto mt-1
            max-w-sm

            text-[11px]
            leading-5
            text-black/40
          "
        >
          Be the first to share a
          moment from{" "}
          {businessName}.
        </p>

        <Link
          href={
            createUrl
          }
          className="
            mt-4
            inline-flex h-9
            items-center
            gap-2

            rounded-full
            bg-[#006241]
            px-4

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
      </section>
    );
  }

  return (
    <section
      className="
        rounded-[14px]
        border
        border-black/[0.055]
        bg-white

        p-4
        shadow-[0_1px_2px_rgba(0,0,0,0.07)]

        sm:p-5
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="
                flex size-7
                items-center
                justify-center

                rounded-full
                bg-[#e8f2ed]
                text-[#006241]
              "
            >
              <Images className="size-3.5" />
            </div>

            <h2
              className="
                text-[17px]
                font-black
                tracking-[-0.025em]
                text-[#17211c]
              "
            >
              Memories
            </h2>
          </div>

          <p className="mt-1.5 text-[10px] text-black/35">
            Moments shared by the
            CAFÉTA community.
          </p>
        </div>

        <Link
          href={
            allMemoriesUrl
          }
          className="
            group
            inline-flex
            items-center
            gap-1

            text-[10px]
            font-bold
            text-[#006241]

            hover:underline
          "
        >
          See all

          <ArrowRight
            className="
              size-3
              transition-transform
              group-hover:translate-x-0.5
            "
          />
        </Link>
      </div>

      <div
        className="
          mt-4
          grid grid-cols-2
          gap-2

          sm:grid-cols-3
        "
      >
        {memories.map(
          (memory) => {
            const authorName =
              memory.author
                ?.username ||
              memory.author
                ?.full_name ||
              "CAFÉTA User";

            return (
              <Link
                key={
                  memory.id
                }
                href={`/memories/${memory.id}`}
                aria-label={`View memory by ${authorName}`}
                className="
                  group
                  relative
                  aspect-[4/5]
                  overflow-hidden

                  rounded-[14px]
                  bg-[#e8eeeb]
                "
              >
                <img
                  src={
                    memory.image_url
                  }
                  alt={
                    memory.caption ??
                    `Memory at ${businessName}`
                  }
                  loading="lazy"
                  decoding="async"
                  className="
                    size-full
                    object-cover

                    transition-transform
                    duration-500
                    ease-out

                    group-hover:scale-[1.04]
                  "
                />

                <div
                  className="
                    absolute inset-0

                    bg-gradient-to-t
                    from-black/70
                    via-black/5
                    to-transparent
                  "
                />

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="flex items-center gap-1.5 text-white">
                    {memory.author
                      ?.avatar_url ? (
                      <img
                        src={
                          memory
                            .author
                            .avatar_url
                        }
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="
                          size-5
                          shrink-0
                          rounded-full
                          object-cover
                        "
                      />
                    ) : (
                      <span
                        className="
                          flex size-5
                          shrink-0
                          items-center
                          justify-center

                          rounded-full
                          bg-white/20
                          backdrop-blur-sm
                        "
                      >
                        <UserRound className="size-2.5" />
                      </span>
                    )}

                    <span className="truncate text-[9px] font-bold">
                      {memory.author
                        ?.username
                        ? `@${memory.author.username}`
                        : authorName}
                    </span>
                  </div>

                  {memory.caption && (
                    <p
                      className="
                        mt-1.5
                        line-clamp-2

                        text-[9px]
                        leading-4
                        text-white/80
                      "
                    >
                      {
                        memory.caption
                      }
                    </p>
                  )}
                </div>
              </Link>
            );
          },
        )}
      </div>

      <div
        className="
          mt-4
          flex items-center
          justify-between
          gap-3

          border-t
          border-black/[0.05]
          pt-4
        "
      >
        <p className="text-[9px] text-black/30">
          Shared by CAFÉTA
          community members.
        </p>

        <Link
          href={
            createUrl
          }
          className="
            inline-flex h-8
            shrink-0
            items-center
            gap-1.5

            rounded-full
            bg-[#e8f2ed]
            px-3

            text-[9px]
            font-bold
            text-[#006241]

            transition-colors
            hover:bg-[#dcebe3]
          "
        >
          <Camera className="size-3" />

          Share
        </Link>
      </div>
    </section>
  );
}