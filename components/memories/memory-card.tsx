"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  BadgeCheck,
  Coffee,
  MapPin,
  MessageCircle,
  Store,
  UserRound,
} from "lucide-react";

import {
  MemoryLikeButton,
} from "@/components/memories/memory-like-button";

import {
  MemoryShareButton,
} from "@/components/memories/memory-share-button";

import type {
  Memory,
  MemoryAuthor,
  MemoryBusiness,
} from "@/lib/memories/types";

type Props = {
  memory: Memory;

  currentUserId: string;
};

export function MemoryCard({
  memory,
}: Props) {
  const author =
    memory.author;

  const authorName =
    getAuthorDisplayName(
      author,
    );

  const relativeTime =
    formatRelativeDate(
      memory.created_at,
    );

  const fullDate =
    formatFullDate(
      memory.created_at,
    );

  return (
    <article
      className="
        overflow-hidden
        rounded-[24px]
        border
        border-black/[0.055]
        bg-white
        shadow-[0_10px_35px_rgba(23,33,28,0.035)]
        transition-shadow
        duration-300
        hover:shadow-[0_14px_42px_rgba(23,33,28,0.055)]
      "
    >
      <header
        className="
          flex
          items-start
          gap-3
          px-4
          py-4
          sm:px-5
        "
      >
        <AuthorAvatar
          author={
            author
          }
        />

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <p
              className="
                truncate
                text-[12px]
                font-black
                tracking-[-0.015em]
                text-[#17211c]
              "
            >
              {authorName}
            </p>

            <span
              aria-hidden="true"
              className="shrink-0 text-[9px] text-black/20"
            >
              ·
            </span>

            <time
              dateTime={
                memory.created_at
              }
              title={
                fullDate
              }
              className="
                shrink-0
                text-[9px]
                font-medium
                text-black/35
              "
            >
              {relativeTime}
            </time>
          </div>

          {memory.business && (
            <Link
              href={`/business/${encodeURIComponent(
                memory.business
                  .slug,
              )}`}
              className="
                mt-1
                inline-flex
                max-w-full
                items-center
                gap-1
                text-[9px]
                font-bold
                text-[#006241]
                transition
                hover:text-[#00754a]
                hover:underline
              "
            >
              <Coffee className="size-2.5 shrink-0" />

              <span className="truncate">
                {
                  memory.business
                    .name
                }
              </span>

              {memory.business
                .is_verified && (
                <BadgeCheck
                  className="
                    size-3
                    shrink-0
                    fill-[#1689e8]
                    text-white
                  "
                />
              )}
            </Link>
          )}
        </div>
      </header>

      <MemoryPhoto
        memory={
          memory
        }
      />

      <div
        className="
          px-4
          pb-4
          pt-4
          sm:px-5
          sm:pb-5
        "
      >
        {memory.caption && (
          <p
            className="
              whitespace-pre-wrap
              break-words
              text-[12px]
              leading-[1.7]
              text-[#17211c]/80
              sm:text-[13px]
            "
          >
            {
              memory.caption
            }
          </p>
        )}

        {memory.business && (
          <BusinessIdentity
            business={
              memory.business
            }
          />
        )}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            border-t
            border-black/[0.05]
            pt-3
          "
        >
          <MemoryLikeButton
            memoryId={
              memory.id
            }
            initialLiked={
              memory.likedByCurrentUser
            }
            initialCount={
              memory.likeCount
            }
          />

          <Link
            href={`/memories/${memory.id}#comments`}
            className="
              flex
              h-9
              items-center
              gap-1.5
              rounded-full
              bg-black/[0.035]
              px-3
              text-[10px]
              font-bold
              text-black/45
              transition-all
              hover:bg-black/[0.06]
              hover:text-black/60
              active:scale-95
            "
          >
            <MessageCircle className="size-3.5" />

            {memory.commentCount >
            0
              ? memory.commentCount
              : "Comment"}
          </Link>

          <div className="ml-auto">
            <MemoryShareButton
              memoryId={
                memory.id
              }
              businessName={
                memory.business
                  ?.name
              }
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function MemoryPhoto({
  memory,
}: {
  memory: Memory;
}) {
  const [
    loaded,
    setLoaded,
  ] = useState(false);

  const [
    failed,
    setFailed,
  ] = useState(false);

  if (failed) {
    return (
      <div
        className="
          flex
          min-h-[260px]
          items-center
          justify-center
          bg-[#edf1ee]
          px-6
          text-center
        "
      >
        <div>
          <div
            className="
              mx-auto
              flex
              size-11
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#006241]
              shadow-sm
            "
          >
            <Coffee className="size-4" />
          </div>

          <p
            className="
              mt-3
              text-[10px]
              font-bold
              text-black/40
            "
          >
            This photo could not be
            loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/memories/${memory.id}`}
      aria-label="Open memory"
      className="
        relative
        block
        overflow-hidden
        bg-[#e9eeeb]
      "
    >
      {!loaded && (
        <div
          className="
            absolute
            inset-0
            z-10
            animate-pulse
            bg-black/[0.055]
          "
        />
      )}

      <div
        className="
          flex
          min-h-[220px]
          w-full
          items-center
          justify-center
          overflow-hidden
          sm:min-h-[260px]
          lg:max-h-[680px]
        "
      >
        <img
          src={
            memory.image_url
          }
          alt={
            memory.business
              ? `Memory at ${memory.business.name}`
              : "CAFÉTA memory"
          }
          loading="lazy"
          onLoad={() =>
            setLoaded(
              true,
            )
          }
          onError={() =>
            setFailed(
              true,
            )
          }
          className={`
            block
            max-h-[680px]
            w-full
            object-contain
            transition-opacity
            duration-300

            ${
              loaded
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        />
      </div>
    </Link>
  );
}

function BusinessIdentity({
  business,
}: {
  business:
    MemoryBusiness;
}) {
  const location =
    [
      business.barangay,
      business.city,
      business.province,
    ]
      .filter(Boolean)
      .join(", ");

  return (
    <Link
      href={`/business/${encodeURIComponent(
        business.slug,
      )}`}
      className="
        mt-4
        flex
        items-center
        gap-3
        rounded-[15px]
        border
        border-transparent
        bg-[#f6f8f6]
        p-2.5
        transition-all
        hover:border-[#006241]/10
        hover:bg-[#eef4f0]
      "
    >
      <BusinessLogo
        business={
          business
        }
      />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1">
          <p
            className="
              truncate
              text-[10px]
              font-bold
              text-[#17211c]
            "
          >
            {
              business.name
            }
          </p>

          {business.is_verified && (
            <BadgeCheck
              className="
                size-3
                shrink-0
                fill-[#1689e8]
                text-white
              "
            />
          )}
        </div>

        {location && (
          <p
            className="
              mt-0.5
              flex
              min-w-0
              items-center
              gap-1
              text-[8px]
              text-black/35
            "
          >
            <MapPin className="size-2.5 shrink-0" />

            <span className="truncate">
              {location}
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}

function AuthorAvatar({
  author,
}: {
  author:
    MemoryAuthor | null;
}) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  const name =
    author?.username ||
    author?.full_name ||
    "CAFÉTA user";

  if (
    author?.avatar_url &&
    !failed
  ) {
    return (
      <div
        className="
          size-10
          shrink-0
          overflow-hidden
          rounded-full
          border
          border-black/[0.05]
          bg-[#e8f2ed]
          shadow-sm
        "
      >
        <img
          src={
            author.avatar_url
          }
          alt={`${getAuthorDisplayName(
            author,
          )} profile photo`}
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(
              true,
            )
          }
          className="
            size-full
            object-cover
          "
        />
      </div>
    );
  }

  const initials =
    getInitials(
      name,
    );

  return (
    <div
      className="
        flex
        size-10
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-[#006241]/[0.06]
        bg-[#e8f2ed]
        text-[#006241]
      "
      aria-label={`${getAuthorDisplayName(
        author,
      )} profile`}
    >
      {initials ? (
        <span className="text-[10px] font-black uppercase">
          {initials}
        </span>
      ) : (
        <UserRound className="size-4" />
      )}
    </div>
  );
}

function BusinessLogo({
  business,
}: {
  business:
    MemoryBusiness;
}) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  return (
    <div
      className="
        flex
        size-9
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-[10px]
        border
        border-black/[0.04]
        bg-[#e8f2ed]
        text-[#006241]
      "
    >
      {business.logo_url &&
      !failed ? (
        <img
          src={
            business.logo_url
          }
          alt={`${business.name} logo`}
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(
              true,
            )
          }
          className="
            size-full
            object-cover
          "
        />
      ) : (
        <Store className="size-3.5" />
      )}
    </div>
  );
}

function getAuthorDisplayName(
  author:
    MemoryAuthor | null,
) {
  if (
    author?.username
  ) {
    return `@${author.username}`;
  }

  if (
    author?.full_name
  ) {
    return author.full_name;
  }

  return "CAFÉTA user";
}

function formatRelativeDate(
  value: string,
) {
  const created =
    new Date(
      value,
    );

  const timestamp =
    created.getTime();

  if (
    Number.isNaN(
      timestamp,
    )
  ) {
    return "";
  }

  const now =
    Date.now();

  const seconds =
    Math.max(
      0,
      Math.floor(
        (
          now -
          timestamp
        ) /
          1000,
      ),
    );

  if (
    seconds < 60
  ) {
    return "now";
  }

  const minutes =
    Math.floor(
      seconds / 60,
    );

  if (
    minutes < 60
  ) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (
    hours < 24
  ) {
    return `${hours}h`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  if (
    days < 7
  ) {
    return `${days}d`;
  }

  const weeks =
    Math.floor(
      days / 7,
    );

  if (
    days < 30
  ) {
    return `${weeks}w`;
  }

  return created.toLocaleDateString(
    undefined,
    {
      month:
        "short",

      day:
        "numeric",

      ...(created.getFullYear() !==
      new Date().getFullYear()
        ? {
            year:
              "numeric" as const,
          }
        : {}),
    },
  );
}

function formatFullDate(
  value: string,
) {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date.toLocaleString(
    undefined,
    {
      month:
        "long",

      day:
        "numeric",

      year:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",
    },
  );
}

function getInitials(
  name: string,
) {
  return name
    .replace(
      /^@/,
      "",
    )
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(
      0,
      2,
    )
    .map(
      (part) =>
        part.charAt(
          0,
        ),
    )
    .join("")
    .toUpperCase();
}