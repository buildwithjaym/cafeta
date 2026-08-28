"use client";

import {
  useState,
} from "react";

import {
  CornerUpLeft,
  MessageCircle,
} from "lucide-react";

import {
  MemoryCommentForm,
} from "@/components/memories/memory-comment-form";

import type {
  MemoryComment,
  MemoryCommentAuthor,
  MemoryCommentThread,
} from "@/lib/memories/types";

type Props = {
  comment:
    MemoryCommentThread;

  memoryId: string;

  currentUserId: string;

  currentProfile:
    MemoryCommentAuthor;

  onReplyCreated: (
    reply: MemoryComment,
  ) => void;
};

export function MemoryCommentItem({
  comment,
  memoryId,
  currentUserId,
  currentProfile,
  onReplyCreated,
}: Props) {
  const [
    replying,
    setReplying,
  ] = useState(false);

  const [
    showReplies,
    setShowReplies,
  ] = useState(true);

  const author =
    comment.author;

  const displayName =
    getDisplayName(
      author,
    );

  const replyUsername =
    getReplyUsername(
      author,
    );

  return (
    <article className="flex gap-3">
      <CommentAvatar
        author={
          author
        }
      />

      <div className="min-w-0 flex-1">
        <div className="rounded-[16px] bg-[#f6f8f6] px-3.5 py-3">
          <p className="text-[10px] font-bold text-[#17211c]">
            {displayName}
          </p>

          <p className="mt-1 whitespace-pre-wrap break-words text-[11px] leading-5 text-black/65">
            {
              comment.content
            }
          </p>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 px-1">
          <button
            type="button"
            onClick={() =>
              setReplying(
                (current) =>
                  !current,
              )
            }
            className={`inline-flex items-center gap-1 text-[9px] font-bold transition ${
              replying
                ? "text-[#006241]"
                : "text-black/40 hover:text-[#006241]"
            }`}
          >
            <CornerUpLeft className="size-2.5" />

            Reply
          </button>

          <span className="text-[8px] text-black/25">
            {formatCommentDate(
              comment.created_at,
            )}
          </span>
        </div>

        {replying && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <MemoryCommentForm
              memoryId={
                memoryId
              }
              currentUserId={
                currentUserId
              }
              currentProfile={
                currentProfile
              }
              parentCommentId={
                comment.id
              }
              replyingToUsername={
                replyUsername
              }
              autoFocus
              onCancelReply={() =>
                setReplying(
                  false,
                )
              }
              onCreated={(
                reply,
              ) => {
                onReplyCreated(
                  reply,
                );

                setShowReplies(
                  true,
                );

                setReplying(
                  false,
                );
              }}
            />
          </div>
        )}

        {comment.replies.length >
          0 && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() =>
                setShowReplies(
                  (current) =>
                    !current,
                )
              }
              className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#006241] transition hover:text-[#00754a]"
            >
              <MessageCircle className="size-3" />

              {showReplies
                ? "Hide"
                : "View"}{" "}
              {comment.replies.length}{" "}
              {comment.replies.length ===
              1
                ? "reply"
                : "replies"}
            </button>

            {showReplies && (
              <div className="relative mt-3 space-y-3 pl-5 before:absolute before:bottom-1 before:left-[5px] before:top-1 before:w-px before:bg-black/[0.07]">
                {comment.replies.map(
                  (
                    reply,
                  ) => (
                    <ReplyRow
                      key={
                        reply.id
                      }
                      reply={
                        reply
                      }
                      onReply={() =>
                        setReplying(
                          true,
                        )
                      }
                    />
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ReplyRow({
  reply,
  onReply,
}: {
  reply:
    MemoryComment;

  onReply: () => void;
}) {
  const author =
    reply.author;

  const displayName =
    getDisplayName(
      author,
    );

  return (
    <div className="relative flex gap-2.5">
      <CommentAvatar
        author={
          author
        }
        size="small"
      />

      <div className="min-w-0 flex-1">
        <div className="rounded-[14px] bg-[#f6f8f6] px-3 py-2.5">
          <p className="text-[9px] font-bold text-[#17211c]">
            {displayName}
          </p>

          <p className="mt-1 whitespace-pre-wrap break-words text-[10px] leading-[18px] text-black/60">
            {
              reply.content
            }
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 px-1">
          <button
            type="button"
            onClick={
              onReply
            }
            className="text-[8px] font-bold text-black/35 transition hover:text-[#006241]"
          >
            Reply
          </button>

          <span className="text-[7px] text-black/25">
            {formatCommentDate(
              reply.created_at,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function CommentAvatar({
  author,
  size = "normal",
}: {
  author:
    | MemoryCommentAuthor
    | null;

  size?:
    | "normal"
    | "small";
}) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  const name =
    author?.full_name ||
    author?.username ||
    "CAFÉTA";

  const sizeClass =
    size ===
    "small"
      ? "size-7"
      : "size-8";

  return (
    <div
      className={`${sizeClass} shrink-0 overflow-hidden rounded-full bg-[#e8f2ed]`}
    >
      {author?.avatar_url &&
      !failed ? (
        <img
          src={
            author.avatar_url
          }
          alt=""
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(
              true,
            )
          }
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-[8px] font-black text-[#006241]">
          {getInitials(
            name,
          )}
        </div>
      )}
    </div>
  );
}

function getDisplayName(
  author:
    | MemoryCommentAuthor
    | null,
) {
  if (
    author?.username
  ) {
    return `@${author.username}`;
  }

  return (
    author?.full_name ||
    "CAFÉTA user"
  );
}

function getReplyUsername(
  author:
    | MemoryCommentAuthor
    | null,
) {
  if (
    author?.username
  ) {
    return author.username;
  }

  return (
    author?.full_name ||
    "CAFÉTA user"
  );
}

function formatCommentDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleString(
    undefined,
    {
      month:
        "short",

      day:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",
    },
  );
}

function getInitials(
  value: string,
) {
  return value
    .trim()
    .split(/\s+/)
    .slice(
      0,
      2,
    )
    .map(
      (part) =>
        part[0] ??
        "",
    )
    .join("")
    .toUpperCase();
}