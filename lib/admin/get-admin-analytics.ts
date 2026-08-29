import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AnalyticsPeriod =
  | 7
  | 30
  | 90;

export type GrowthMetric = {
  total: number;
  current: number;
  previous: number;
  change: number | null;
};

export type GrowthPoint = {
  date: string;
  label: string;
  users: number;
  businesses: number;
  memories: number;
  reviews: number;
};

export type AdminAnalytics = {
  period: AnalyticsPeriod;

  users: GrowthMetric;
  businesses: GrowthMetric;
  memories: GrowthMetric;
  reviews: GrowthMetric;

  engagement: {
    likes: GrowthMetric;
    comments: GrowthMetric;
  };

  moderation: {
    total: number;
    pending: number;
    approved: number;
    verified: number;
    rejected: number;
    suspended: number;
    approvalRate: number;
  };

  quality: {
    averageRating: number;
    totalRatings: number;
  };

  community: {
    completedOnboarding: number;
    onboardingRate: number;
    usersWithUsername: number;
    usersWithPreferences: number;
  };

  activity: {
    newUsers: number;
    newBusinesses: number;
    memories: number;
    reviews: number;
    likes: number;
    comments: number;
  };

  chart: GrowthPoint[];
};

type ProfileRow = {
  created_at: string;
  username: string | null;
  onboarding_completed: boolean;
  cafe_preferences:
    | string[]
    | null;
};

type BusinessRow = {
  created_at: string;
  submitted_at: string | null;
  status: string;
  is_verified: boolean;
};

type CreatedRow = {
  created_at: string;
};

type ReviewRow = {
  created_at: string;
  rating: number;
};

function startOfDay(
  value: Date,
) {
  const date = new Date(value);

  date.setHours(
    0,
    0,
    0,
    0,
  );

  return date;
}

function addDays(
  value: Date,
  days: number,
) {
  const date = new Date(value);

  date.setDate(
    date.getDate() + days,
  );

  return date;
}

function isWithin(
  value: string,
  start: Date,
  end: Date,
) {
  const date = new Date(value);

  return (
    date >= start &&
    date < end
  );
}

function calculateChange(
  current: number,
  previous: number,
) {
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return null;
  }

  return (
    ((current - previous) /
      previous) *
    100
  );
}

function makeMetric(
  total: number,
  rows: CreatedRow[],
  currentStart: Date,
  previousStart: Date,
  now: Date,
): GrowthMetric {
  const current =
    rows.filter((row) =>
      isWithin(
        row.created_at,
        currentStart,
        now,
      ),
    ).length;

  const previous =
    rows.filter((row) =>
      isWithin(
        row.created_at,
        previousStart,
        currentStart,
      ),
    ).length;

  return {
    total,
    current,
    previous,
    change:
      calculateChange(
        current,
        previous,
      ),
  };
}

function getDateKey(
  value: Date,
) {
  const year =
    value.getFullYear();

  const month = String(
    value.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    value.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildChart(
  period: AnalyticsPeriod,
  now: Date,
  profiles: CreatedRow[],
  businesses: CreatedRow[],
  memories: CreatedRow[],
  reviews: CreatedRow[],
) {
  const today =
    startOfDay(now);

  const points =
    new Map<
      string,
      GrowthPoint
    >();

  for (
    let index =
      period - 1;
    index >= 0;
    index -= 1
  ) {
    const date =
      addDays(
        today,
        -index,
      );

    const key =
      getDateKey(date);

    points.set(key, {
      date: key,

      label:
        date.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        ),

      users: 0,
      businesses: 0,
      memories: 0,
      reviews: 0,
    });
  }

  function increment(
    rows: CreatedRow[],
    key:
      | "users"
      | "businesses"
      | "memories"
      | "reviews",
  ) {
    for (const row of rows) {
      const date =
        new Date(
          row.created_at,
        );

      const point =
        points.get(
          getDateKey(date),
        );

      if (point) {
        point[key] += 1;
      }
    }
  }

  increment(
    profiles,
    "users",
  );

  increment(
    businesses,
    "businesses",
  );

  increment(
    memories,
    "memories",
  );

  increment(
    reviews,
    "reviews",
  );

  return Array.from(
    points.values(),
  );
}

export async function getAdminAnalytics(
  period: AnalyticsPeriod = 30,
): Promise<AdminAnalytics> {
  const supabase =
    await createClient();

  const now =
    new Date();

  const currentStart =
    startOfDay(
      addDays(
        now,
        -(period - 1),
      ),
    );

  const previousStart =
    addDays(
      currentStart,
      -period,
    );

  const [
    profilesResult,
    businessesResult,
    memoriesResult,
    reviewsResult,
    likesResult,
    commentsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(`
        created_at,
        username,
        onboarding_completed,
        cafe_preferences
      `),

    supabase
      .from("businesses")
      .select(`
        created_at,
        submitted_at,
        status,
        is_verified
      `),

    supabase
      .from("memories")
      .select(
        "created_at",
      ),

    supabase
      .from("reviews")
      .select(
        "created_at, rating",
      ),

    supabase
      .from("memory_likes")
      .select(
        "created_at",
      ),

    supabase
      .from("memory_comments")
      .select(
        "created_at",
      ),
  ]);

  const results = [
    {
      name: "profiles",
      error:
        profilesResult.error,
    },
    {
      name: "businesses",
      error:
        businessesResult.error,
    },
    {
      name: "memories",
      error:
        memoriesResult.error,
    },
    {
      name: "reviews",
      error:
        reviewsResult.error,
    },
    {
      name: "memory_likes",
      error:
        likesResult.error,
    },
    {
      name: "memory_comments",
      error:
        commentsResult.error,
    },
  ];

  for (const result of results) {
    if (result.error) {
      console.error(
        `[CAFÉTA Admin] Failed to load ${result.name}:`,
        result.error,
      );
    }
  }

  const profiles =
    (profilesResult.data ??
      []) as ProfileRow[];

  const businesses =
    (businessesResult.data ??
      []) as BusinessRow[];

  const memories =
    (memoriesResult.data ??
      []) as CreatedRow[];

  const reviews =
    (reviewsResult.data ??
      []) as ReviewRow[];

  const likes =
    (likesResult.data ??
      []) as CreatedRow[];

  const comments =
    (commentsResult.data ??
      []) as CreatedRow[];

  const profileRows:
    CreatedRow[] =
    profiles.map(
      (profile) => ({
        created_at:
          profile.created_at,
      }),
    );

  const businessRows:
    CreatedRow[] =
    businesses.map(
      (business) => ({
        created_at:
          business.submitted_at ??
          business.created_at,
      }),
    );

  const users =
    makeMetric(
      profiles.length,
      profileRows,
      currentStart,
      previousStart,
      now,
    );

  const businessMetric =
    makeMetric(
      businesses.length,
      businessRows,
      currentStart,
      previousStart,
      now,
    );

  const memoryMetric =
    makeMetric(
      memories.length,
      memories,
      currentStart,
      previousStart,
      now,
    );

  const reviewMetric =
    makeMetric(
      reviews.length,
      reviews,
      currentStart,
      previousStart,
      now,
    );

  const likeMetric =
    makeMetric(
      likes.length,
      likes,
      currentStart,
      previousStart,
      now,
    );

  const commentMetric =
    makeMetric(
      comments.length,
      comments,
      currentStart,
      previousStart,
      now,
    );

  const pending =
    businesses.filter(
      (business) =>
        business.status ===
        "pending",
    ).length;

  const approved =
    businesses.filter(
      (business) =>
        business.status ===
        "approved",
    ).length;

  const verified =
    businesses.filter(
      (business) =>
        business.status ===
          "approved" &&
        business.is_verified,
    ).length;

  const rejected =
    businesses.filter(
      (business) =>
        business.status ===
        "rejected",
    ).length;

  const suspended =
    businesses.filter(
      (business) =>
        business.status ===
        "suspended",
    ).length;

  const reviewed =
    approved +
    rejected +
    suspended;

  const approvalRate =
    reviewed > 0
      ? (approved /
          reviewed) *
        100
      : 0;

  const totalRating =
    reviews.reduce(
      (sum, review) =>
        sum +
        Number(
          review.rating,
        ),
      0,
    );

  const averageRating =
    reviews.length > 0
      ? totalRating /
        reviews.length
      : 0;

  const completedOnboarding =
    profiles.filter(
      (profile) =>
        profile.onboarding_completed,
    ).length;

  const usersWithUsername =
    profiles.filter(
      (profile) =>
        Boolean(
          profile.username?.trim(),
        ),
    ).length;

  const usersWithPreferences =
    profiles.filter(
      (profile) =>
        Array.isArray(
          profile.cafe_preferences,
        ) &&
        profile
          .cafe_preferences
          .length > 0,
    ).length;

  const onboardingRate =
    profiles.length > 0
      ? (completedOnboarding /
          profiles.length) *
        100
      : 0;

  return {
    period,

    users,

    businesses:
      businessMetric,

    memories:
      memoryMetric,

    reviews:
      reviewMetric,

    engagement: {
      likes: likeMetric,
      comments:
        commentMetric,
    },

    moderation: {
      total:
        businesses.length,

      pending,
      approved,
      verified,
      rejected,
      suspended,
      approvalRate,
    },

    quality: {
      averageRating,
      totalRatings:
        reviews.length,
    },

    community: {
      completedOnboarding,
      onboardingRate,
      usersWithUsername,
      usersWithPreferences,
    },

    activity: {
      newUsers:
        users.current,

      newBusinesses:
        businessMetric.current,

      memories:
        memoryMetric.current,

      reviews:
        reviewMetric.current,

      likes:
        likeMetric.current,

      comments:
        commentMetric.current,
    },

    chart: buildChart(
      period,
      now,
      profileRows,
      businessRows,
      memories,
      reviews,
    ),
  };
}