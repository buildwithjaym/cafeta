export type BusinessCategory =
  | "coffee_shop"
  | "cafe"
  | "milk_tea"
  | "bakery_cafe"
  | "restaurant_cafe"
  | "other";

export type MapBusiness = {
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

  latitude: number;
  longitude: number;

  is_verified: boolean;
};

export type MapFilter =
  | "all"
  | "coffee"
  | "milk-tea"
  | "nearby";

export type MapStatus =
  | "loading"
  | "ready"
  | "error";