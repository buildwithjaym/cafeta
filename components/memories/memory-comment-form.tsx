"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  LoaderCircle,
  Send,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  MemoryComment,
  MemoryCommentAuthor,
} from "@/lib/memories/types";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  memoryId: string;

  currentUserId: string;

  currentProfile:
    MemoryCommentAuthor;

  parentCommentId?:
    | string
    | null;

  replyingToUsername?:
    | string
    | null;

  autoFocus?: boolean;

  onCancelReply?: () => void;

  onCreated: (
    comment: MemoryComment,
  ) => void;
};

export function MemoryCommentForm({
  memoryId,
  currentUserId,
  currentProfile,
  parentCommentId = null,
  replyingToUsername = null,
  autoFocus = false,
  onCancelReply,
  onCreated,
}: Props) {
  const [
    content,
    setContent,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null,
    );

  useEffect(() => {
    if (
      autoFocus &&
      textareaRef.current
    ) {
      textareaRef.current.focus();
    }
  }, [
    autoFocus,
  ]);

  async function submit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const clean =
      content.trim();

    if (!clean) {
      return;
    }

    if (
      clean.length > 500
    ) {
      toast.error(
        parentCommentId
          ? "Reply is too long"
          : "Comment is too long",
      );

      return;
    }

    setSubmitting(true);

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
        !user ||
        user.id !==
          currentUserId
      ) {
        throw new Error(
          "Your session has expired.",
        );
      }

      /*
       * For replies, make sure the parent
       * belongs to the same Memory.
       */
      if (
        parentCommentId
      ) {
        const {
          data:
            parentComment,
          error:
            parentError,
        } =
          await supabase
            .from(
              "memory_comments",
            )
            .select(
              "id, memory_id, parent_comment_id",
            )
            .eq(
              "id",
              parentCommentId,
            )
            .maybeSingle();

        if (
          parentError
        ) {
          throw parentError;
        }

        if (
          !parentComment ||
          parentComment.memory_id !==
            memoryId
        ) {
          throw new Error(
            "The comment you're replying to is unavailable.",
          );
        }

        /*
         * We keep the UI to one reply level.
         *
         * If a nested reply somehow reaches
         * this form, attach it to the root
         * comment instead.
         */
        const rootParentId =
          parentComment.parent_comment_id ??
          parentComment.id;

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "memory_comments",
            )
            .insert({
              memory_id:
                memoryId,

              user_id:
                user.id,

              parent_comment_id:
                rootParentId,

              content:
                clean,
            })
            .select(`
              id,
              memory_id,
              user_id,
              parent_comment_id,
              content,
              created_at,
              updated_at
            `)
            .single();

        if (error) {
          throw error;
        }

        onCreated({
          ...data,

          author:
            currentProfile,
        });

        setContent("");

        onCancelReply?.();

        return;
      }

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "memory_comments",
          )
          .insert({
            memory_id:
              memoryId,

            user_id:
              user.id,

            parent_comment_id:
              null,

            content:
              clean,
          })
          .select(`
            id,
            memory_id,
            user_id,
            parent_comment_id,
            content,
            created_at,
            updated_at
          `)
          .single();

      if (error) {
        throw error;
      }

      onCreated({
        ...data,

        author:
          currentProfile,
      });

      setContent("");
    } catch (error) {
      toast.error(
        parentCommentId
          ? "Couldn't post reply"
          : "Couldn't post comment",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isReply =
    Boolean(
      parentCommentId,
    );

  return (
    <div>
      {isReply &&
        replyingToUsername && (
          <div className="mb-2 flex items-center justify-between gap-3 rounded-[12px] bg-[#f2f6f3] px-3 py-2">
            <p className="min-w-0 truncate text-[9px] text-black/45">
              Replying to{" "}
              <span className="font-bold text-[#006241]">
                {replyingToUsername.startsWith(
                  "@",
                )
                  ? replyingToUsername
                  : `@${replyingToUsername}`}
              </span>
            </p>

            {onCancelReply && (
              <button
                type="button"
                onClick={
                  onCancelReply
                }
                disabled={
                  submitting
                }
                aria-label="Cancel reply"
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-black/30 transition hover:bg-black/[0.05] hover:text-[#17211c] disabled:pointer-events-none"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        )}

      <form
        onSubmit={
          submit
        }
        className="flex items-end gap-2"
      >
        <textarea
          ref={
            textareaRef
          }
          value={
            content
          }
          disabled={
            submitting
          }
          maxLength={
            500
          }
          rows={
            1
          }
          onChange={(
            event,
          ) =>
            setContent(
              event.target
                .value,
            )
          }
          onKeyDown={(
            event,
          ) => {
            if (
              event.key ===
                "Escape" &&
              isReply &&
              onCancelReply
            ) {
              onCancelReply();
            }
          }}
          placeholder={
            isReply
              ? "Write a reply..."
              : "Add a comment..."
          }
          className="min-h-10 max-h-28 flex-1 resize-none rounded-[15px] border border-black/[0.07] bg-[#f7f8f7] px-3.5 py-2.5 text-xs leading-5 outline-none transition placeholder:text-black/30 focus:border-[#006241]/30 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={
            submitting ||
            !content.trim()
          }
          aria-label={
            isReply
              ? "Post reply"
              : "Post comment"
          }
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#006241] text-white transition hover:bg-[#00754a] active:scale-95 disabled:pointer-events-none disabled:bg-black/10 disabled:text-black/25"
        >
          {submitting ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
        </button>
      </form>

      {content.length >
        440 && (
        <p
          className={`mt-1.5 text-right text-[8px] ${
            content.length >=
            500
              ? "font-bold text-red-500"
              : "text-black/30"
          }`}
        >
          {content.length}
          /500
        </p>
      )}
    </div>
  );
}