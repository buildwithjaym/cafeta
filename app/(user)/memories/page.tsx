import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import {
  MemoriesFeed,
} from "@/components/memories/memories-feed";

import type {
  Memory,
  MemoryAuthor,
  MemoryBusiness,
} from "@/lib/memories/types";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title:
    "Memories | CAFÉTA",

  description:
    "Discover café moments shared by the CAFÉTA community.",
};

type PageProps = {
  searchParams: Promise<{
    business?: string;
  }>;
};

type RawMemory = {
  id: string;

  user_id: string;
  business_id: string;

  image_url: string;
  caption: string | null;

  created_at: string;
  updated_at: string;

  author:
    | MemoryAuthor
    | MemoryAuthor[]
    | null;

  business:
    | MemoryBusiness
    | MemoryBusiness[]
    | null;
};

type FilteredBusiness = {
  id: string;

  name: string;
  slug: string;

  logo_url: string | null;

  is_verified: boolean;
};

type LikeRow = {
  memory_id: string;
  user_id: string;
};

type CommentCountRow = {
  memory_id: string;
};

export default async function MemoriesPage({
  searchParams,
}: PageProps) {
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
    const next =
      "/memories";

    redirect(
      `/auth/login?next=${encodeURIComponent(
        next,
      )}`,
    );
  }

  const {
    business:
      requestedBusinessSlug,
  } =
    await searchParams;

  let filteredBusiness:
    | FilteredBusiness
    | null = null;

  /*
   * Resolve ?business=brew-cafe
   * into the actual business UUID.
   */
  if (
    requestedBusinessSlug
  ) {
    const {
      data:
        businessData,
      error:
        businessError,
    } =
      await supabase
        .from(
          "businesses",
        )
        .select(`
          id,
          name,
          slug,
          logo_url,
          is_verified
        `)
        .eq(
          "slug",
          requestedBusinessSlug,
        )
        .eq(
          "status",
          "approved",
        )
        .maybeSingle();

    if (
      businessError
    ) {
      console.error(
        "[CAFÉTA] Failed to resolve Memories business:",
        businessError,
      );
    }

    if (
      businessData
    ) {
      filteredBusiness =
        businessData as
          FilteredBusiness;
    }
  }

  /*
   * Base Memories query.
   */
  let memoriesQuery =
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
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      )
      .limit(30);

  /*
   * Business-specific Memories.
   */
  if (
    requestedBusinessSlug
  ) {
    if (
      filteredBusiness
    ) {
      memoriesQuery =
        memoriesQuery.eq(
          "business_id",
          filteredBusiness.id,
        );
    } else {
      /*
       * Unknown/non-approved business slug.
       *
       * Force an empty result without
       * accidentally exposing another
       * business's Memories.
       */
      memoriesQuery =
        memoriesQuery.eq(
          "business_id",
          "00000000-0000-0000-0000-000000000000",
        );
    }
  }

  const {
    data:
      memoriesData,
    error:
      memoriesError,
  } =
    await memoriesQuery;

  if (
    memoriesError
  ) {
    console.error(
      "[CAFÉTA] Failed to load Memories:",
      {
        code:
          memoriesError.code,

        message:
          memoriesError.message,
      },
    );
  }

  const rawMemories =
    (
      memoriesData ??
      []
    ) as unknown as
      RawMemory[];

  const memoryIds =
    rawMemories.map(
      (
        memory,
      ) =>
        memory.id,
    );

  let likeRows:
    LikeRow[] =
    [];

  let commentRows:
    CommentCountRow[] =
    [];

  /*
   * Only request social data when
   * there are Memories on screen.
   */
  if (
    memoryIds.length >
    0
  ) {
    const [
      likesResult,
      commentsResult,
    ] =
      await Promise.all([
        supabase
          .from(
            "memory_likes",
          )
          .select(
            "memory_id, user_id",
          )
          .in(
            "memory_id",
            memoryIds,
          ),

        /*
         * We intentionally don't filter
         * parent_comment_id here.
         *
         * Both top-level comments and
         * replies count toward the total
         * conversation count displayed
         * on a Memory card.
         */
        supabase
          .from(
            "memory_comments",
          )
          .select(
            "memory_id",
          )
          .in(
            "memory_id",
            memoryIds,
          ),
      ]);

    if (
      likesResult.error
    ) {
      console.error(
        "[CAFÉTA] Failed to load Memory likes:",
        likesResult.error,
      );
    } else {
      likeRows =
        (
          likesResult.data ??
          []
        ) as LikeRow[];
    }

    if (
      commentsResult.error
    ) {
      console.error(
        "[CAFÉTA] Failed to load Memory comment counts:",
        commentsResult.error,
      );
    } else {
      commentRows =
        (
          commentsResult.data ??
          []
        ) as CommentCountRow[];
    }
  }

  /*
   * Build social counters without
   * running another query per Memory.
   */
  const likeCountMap =
    new Map<
      string,
      number
    >();

  const commentCountMap =
    new Map<
      string,
      number
    >();

  const likedMemoryIds =
    new Set<string>();

  for (
    const like of
    likeRows
  ) {
    likeCountMap.set(
      like.memory_id,
      (
        likeCountMap.get(
          like.memory_id,
        ) ??
        0
      ) + 1,
    );

    if (
      like.user_id ===
      user.id
    ) {
      likedMemoryIds.add(
        like.memory_id,
      );
    }
  }

  for (
    const comment of
    commentRows
  ) {
    commentCountMap.set(
      comment.memory_id,
      (
        commentCountMap.get(
          comment.memory_id,
        ) ??
        0
      ) + 1,
    );
  }

  const memories:
    Memory[] =
    rawMemories.map(
      (
        memory,
      ) => ({
        id:
          memory.id,

        user_id:
          memory.user_id,

        business_id:
          memory.business_id,

        image_url:
          memory.image_url,

        caption:
          memory.caption,

        created_at:
          memory.created_at,

        updated_at:
          memory.updated_at,

        author:
          firstRelation(
            memory.author,
          ),

        business:
          firstRelation(
            memory.business,
          ),

        likeCount:
          likeCountMap.get(
            memory.id,
          ) ??
          0,

        /*
         * Includes replies.
         */
        commentCount:
          commentCountMap.get(
            memory.id,
          ) ??
          0,

        likedByCurrentUser:
          likedMemoryIds.has(
            memory.id,
          ),
      }),
    );

  return (
    <MemoriesFeed
      memories={
        memories
      }
      currentUserId={
        user.id
      }
      filteredBusiness={
        filteredBusiness
      }
    />
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