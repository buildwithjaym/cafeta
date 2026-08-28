import type {
  Metadata,
} from "next";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

import {
  MemoryCard,
} from "@/components/memories/memory-card";

import {
  MemoryComments,
} from "@/components/memories/memory-comments";

import type {
  Memory,
  MemoryAuthor,
  MemoryBusiness,
  MemoryComment,
  MemoryCommentAuthor,
} from "@/lib/memories/types";

import {
  createClient,
} from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title:
    "Memory | CAFÉTA",

  description:
    "A café memory shared on CAFÉTA.",
};

export default async function MemoryPage({
  params,
}: Props) {
  const {
    id,
  } =
    await params;

  const supabase =
    await createClient();

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
    redirect(
      `/auth/login?next=${encodeURIComponent(
        `/memories/${id}`,
      )}`,
    );
  }

  /*
   * Load the Memory first.
   *
   * Comments and likes depend on the
   * requested Memory ID, while the
   * profile belongs to the signed-in user.
   */
  const [
    memoryResult,
    profileResult,
    commentsResult,
    likesResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "memories",
        )
        .select(`
          id,
          user_id,
          business_id,
          image_url,
          caption,
          created_at,
          updated_at,

          author:profiles!memories_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),

          business:businesses!memories_business_id_fkey (
            id,
            name,
            slug,
            category,
            logo_url,
            cover_url,
            barangay,
            city,
            province,
            is_verified
          )
        `)
        .eq(
          "id",
          id,
        )
        .maybeSingle(),

      supabase
        .from(
          "profiles",
        )
        .select(`
          id,
          username,
          full_name,
          avatar_url
        `)
        .eq(
          "id",
          user.id,
        )
        .maybeSingle(),

      /*
       * parent_comment_id is required
       * for building reply threads.
       */
      supabase
        .from(
          "memory_comments",
        )
        .select(`
          id,
          memory_id,
          user_id,
          parent_comment_id,
          content,
          created_at,
          updated_at,

          author:profiles!memory_comments_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq(
          "memory_id",
          id,
        )
        .order(
          "created_at",
          {
            ascending:
              true,
          },
        ),

      supabase
        .from(
          "memory_likes",
        )
        .select(
          "user_id",
        )
        .eq(
          "memory_id",
          id,
        ),
    ]);

  /*
   * Memory errors.
   */
  if (
    memoryResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load memory:",
      memoryResult.error,
    );

    notFound();
  }

  if (
    !memoryResult.data
  ) {
    notFound();
  }

  /*
   * Current user's profile is required
   * so newly posted comments/replies
   * can immediately show their identity.
   */
  if (
    profileResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load current profile:",
      profileResult.error,
    );
  }

  if (
    !profileResult.data
  ) {
    redirect(
      "/profile/setup",
    );
  }

  /*
   * Comments failing should not prevent
   * the actual Memory from opening.
   */
  if (
    commentsResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load Memory comments:",
      commentsResult.error,
    );
  }

  /*
   * Same for likes.
   */
  if (
    likesResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load Memory likes:",
      likesResult.error,
    );
  }

  const raw =
    memoryResult.data;

  const author =
    firstRelation(
      raw.author,
    ) as
      | MemoryAuthor
      | null;

  const business =
    firstRelation(
      raw.business,
    ) as
      | MemoryBusiness
      | null;

  const likes =
    likesResult.data ??
    [];

  /*
   * Convert Supabase relations into
   * our application's MemoryComment
   * shape.
   *
   * parent_comment_id:
   *
   * null    = top-level comment
   * UUID    = reply
   */
  const comments: MemoryComment[] =
    (
      commentsResult.data ??
      []
    ).map(
      (
        comment,
      ) => ({
        id:
          comment.id,

        memory_id:
          comment.memory_id,

        user_id:
          comment.user_id,

        parent_comment_id:
          comment.parent_comment_id,

        content:
          comment.content,

        created_at:
          comment.created_at,

        updated_at:
          comment.updated_at,

        author:
          firstRelation(
            comment.author,
          ) as
            | MemoryCommentAuthor
            | null,
      }),
    );

  const memory: Memory = {
    id:
      raw.id,

    user_id:
      raw.user_id,

    business_id:
      raw.business_id,

    image_url:
      raw.image_url,

    caption:
      raw.caption,

    created_at:
      raw.created_at,

    updated_at:
      raw.updated_at,

    author,

    business,

    likeCount:
      likes.length,

    /*
     * Includes both comments and replies.
     */
    commentCount:
      comments.length,

    likedByCurrentUser:
      likes.some(
        (
          like,
        ) =>
          like.user_id ===
          user.id,
      ),
  };

  return (
    <main className="min-h-screen bg-[#f6f7f5] pb-28 md:pb-12">
      <div className="mx-auto w-full max-w-[680px] px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-5 flex items-center gap-3">
          <Link
            href="/memories"
            aria-label="Back to Memories"
            className="flex size-10 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#17211c] shadow-sm transition hover:bg-[#f3f6f4] active:scale-95"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#006241]">
              CAFÉTA Memories
            </p>

            <h1 className="mt-0.5 text-lg font-black tracking-[-0.035em] text-[#17211c]">
              Memory
            </h1>
          </div>
        </div>

        <MemoryCard
          memory={
            memory
          }
          currentUserId={
            user.id
          }
        />

        <div className="mt-5">
          <MemoryComments
            memoryId={
              id
            }
            currentUserId={
              user.id
            }
            currentProfile={
              profileResult.data
            }
            initialComments={
              comments
            }
          />
        </div>
      </div>
    </main>
  );
}

function firstRelation<T>(
  value:
    | T
    | T[]
    | null,
): T | null {
  if (
    Array.isArray(
      value,
    )
  ) {
    return (
      value[0] ??
      null
    );
  }

  return value;
}