export type UserRole =
  | "user"
  | "business_owner"
  | "admin";

export type BusinessMemberRole =
  | "owner"
  | "manager"
  | "staff";

export type BusinessStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

/*
 * Must match the business_category
 * enum used by the database.
 */
export type BusinessCategory =
  | "coffee_shop"
  | "cafe"
  | "milk_tea"
  | "bakery_cafe"
  | "restaurant_cafe"
  | "other";

export type CafetaProfile = {
  id: string;

  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;

  role: UserRole;

  created_at: string;
  updated_at: string;
};

export type ProfileBusiness = {
  id: string;

  name: string;
  slug: string;

  category: BusinessCategory;

  description: string | null;

  logo_url: string | null;
  cover_url: string | null;

  address: string;
  barangay: string | null;
  city: string;
  province: string;

  status: BusinessStatus;
  is_verified: boolean;

  created_at: string;
  updated_at: string;

  memberRole: BusinessMemberRole;
  membershipCreatedAt: string;
};

export type ProfileStats = {
  saved: number;
  reviews: number;
  businesses: number;
};

/*
 * Shared profile query used by
 * profile editing components.
 */
export const PROFILE_SELECT = `
  id,
  full_name,
  username,
  bio,
  avatar_url,
  role,
  created_at,
  updated_at
`;