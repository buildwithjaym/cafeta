"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  MessageCircle,
} from "lucide-react";

import {
  MemoryCommentForm,
} from "@/components/memories/memory-comment-form";

import {
  MemoryCommentItem,
} from "@/components/memories/memory-comment-item";

import type {
  MemoryComment,
  MemoryCommentAuthor,
  MemoryCommentThread,
} from "@/lib/memories/types";

type Props = {
  memoryId: string;

  currentUserId: string;

  currentProfile:
    MemoryCommentAuthor;

  initialComments:
    MemoryComment[];
};

export function MemoryComments({
  memoryId,
  currentUserId,
  currentProfile,
  initialComments,
}: Props) {
  const [
    comments,
    setComments,
  ] =
    useState<
      MemoryComment[]
    >(
      initialComments,
    );

  const threads =
    useMemo(
      () =>
        buildCommentThreads(
          comments,
        ),
      [
        comments,
      ],
    );

  const commentCount =
    comments.length;

  function handleCreated(
    comment:
      MemoryComment,
  ) {
    setComments(
      (current) => {
        if (
          current.some(
            (item) =>
              item.id ===
              comment.id,
          )
        ) {
          return current;
        }

        return [
          ...current,
          comment,
        ];
      },
    );
  }

  return (
    <section
      id="comments"
      className="rounded-[24px] border border-black/[0.055] bg-white p-4 shadow-[0_10px_35px_rgba(23,33,28,0.03)] sm:p-5"
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
          <MessageCircle className="size-3.5" />
        </div>

        <div>
          <h2 className="text-sm font-black text-[#17211c]">
            Comments
          </h2>

          <p className="text-[9px] text-black/35">
            {commentCount}{" "}
            {commentCount ===
            1
              ? "comment"
              : "comments"}
          </p>
        </div>
      </div>

      <div className="mt-4">
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
          onCreated={
            handleCreated
          }
        />
      </div>

      {threads.length >
      0 ? (
        <div className="mt-5 space-y-5 border-t border-black/[0.05] pt-5">
          {threads.map(
            (
              comment,
            ) => (
              <MemoryCommentItem
                key={
                  comment.id
                }
                comment={
                  comment
                }
                memoryId={
                  memoryId
                }
                currentUserId={
                  currentUserId
                }
                currentProfile={
                  currentProfile
                }
                onReplyCreated={
                  handleCreated
                }
              />
            ),
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-[16px] bg-[#f7f8f7] px-4 py-6 text-center">
          <p className="text-[10px] font-semibold text-black/40">
            No comments yet.
            Start the
            conversation.
          </p>
        </div>
      )}
    </section>
  );
}

function buildCommentThreads(
  comments:
    MemoryComment[],
): MemoryCommentThread[] {
  const topLevel =
    comments
      .filter(
        (comment) =>
          !comment.parent_comment_id,
      )
      .sort(
        (
          first,
          second,
        ) =>
          new Date(
            first.created_at,
          ).getTime() -
          new Date(
            second.created_at,
          ).getTime(),
      );

  const repliesByParent =
    new Map<
      string,
      MemoryComment[]
    >();

  for (
    const comment of
    comments
  ) {
    if (
      !comment.parent_comment_id
    ) {
      continue;
    }

    const current =
      repliesByParent.get(
        comment.parent_comment_id,
      ) ?? [];

    current.push(
      comment,
    );

    repliesByParent.set(
      comment.parent_comment_id,
      current,
    );
  }

  return topLevel.map(
    (comment) => ({
      ...comment,

      replies: (
        repliesByParent.get(
          comment.id,
        ) ?? []
      ).sort(
        (
          first,
          second,
        ) =>
          new Date(
            first.created_at,
          ).getTime() -
          new Date(
            second.created_at,
          ).getTime(),
      ),
    }),
  );
}