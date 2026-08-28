import type {
  BusinessMemoryActivity,
  MemoryActivityLabel,
} from "@/lib/memories/types";

export type MapBusinessCategory =
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

  category: MapBusinessCategory;

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

  memoryActivity:
    | BusinessMemoryActivity
    | null;

  memoryActivityLabel:
    MemoryActivityLabel;
};

export type MapFilter =
  | "all"
  | "coffee"
  | "milk-tea"
  | "memories"
  | "trending"
  | "nearby";

export type MapStatus =
  | "loading"
  | "ready"
  | "error";