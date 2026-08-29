export type ReviewAuthor = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export type ReviewBusiness = {
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

export type Review = {
  id: string;

  user_id: string;
  business_id: string;

  rating: number;
  content: string | null;

  created_at: string;
  updated_at: string;

  author: ReviewAuthor | null;
};

export type ReviewDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type ReviewSummaryData = {
  averageRating: number;
  reviewCount: number;
  distribution: ReviewDistribution;
};

export type ReviewSort =
  | "recent"
  | "highest"
  | "lowest";

export function calculateReviewSummary(
  reviews: Review[],
): ReviewSummaryData {
  const distribution: ReviewDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      reviewCount: 0,
      distribution,
    };
  }

  let total = 0;

  for (const review of reviews) {
    const rating = Math.max(
      1,
      Math.min(5, Math.round(review.rating)),
    ) as keyof ReviewDistribution;

    distribution[rating] += 1;
    total += rating;
  }

  return {
    averageRating:
      Math.round((total / reviews.length) * 10) / 10,

    reviewCount: reviews.length,

    distribution,
  };
}

export function getReviewRatingLabel(
  rating: number,
) {
  switch (rating) {
    case 1:
      return "Poor";

    case 2:
      return "Fair";

    case 3:
      return "Good";

    case 4:
      return "Very good";

    case 5:
      return "Excellent";

    default:
      return "Select a rating";
  }
}