export type MemoryAuthor = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export type MemoryBusiness = {
  id: string;
  name: string;
  slug: string;
  category: string;

  logo_url: string | null;
  cover_url: string | null;

  barangay: string | null;
  city: string | null;
  province: string | null;

  is_verified: boolean;
};

export type MemoryCommentAuthor = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export type MemoryComment = {
  id: string;

  memory_id: string;
  user_id: string;

  parent_comment_id: string | null;

  content: string;

  created_at: string;
  updated_at: string;

  author: MemoryCommentAuthor | null;
};

export type MemoryCommentThread =
  MemoryComment & {
    replies: MemoryComment[];
  };

export type Memory = {
  id: string;

  user_id: string;
  business_id: string;

  image_url: string;
  caption: string | null;

  created_at: string;
  updated_at: string;

  author: MemoryAuthor | null;
  business: MemoryBusiness | null;

  likeCount: number;
  commentCount: number;

  likedByCurrentUser: boolean;
};

export type BusinessMemoryActivity = {
  business_id: string;

  memory_count: number;

  memories_24h: number;

  memories_7d: number;

  unique_posters_7d: number;

  latest_memory_at: string | null;

  activity_score: number;
};

export type MemoryActivityLabel =
  | "trending"
  | "active"
  | "recent"
  | null;

export type BusinessMemoryPreview = {
  id: string;

  image_url: string;

  caption: string | null;

  created_at: string;

  author: {
    id: string;

    username: string | null;

    full_name: string | null;

    avatar_url: string | null;
  } | null;
};

export function getMemoryActivityLabel(
  activity:
    | BusinessMemoryActivity
    | null
    | undefined,
): MemoryActivityLabel {
  if (!activity) {
    return null;
  }

  if (
    activity.activity_score >= 25 &&
    activity.unique_posters_7d >= 3
  ) {
    return "trending";
  }

  if (activity.memories_24h > 0) {
    return "active";
  }

  if (activity.memories_7d > 0) {
    return "recent";
  }

  return null;
}