export type BusinessCategory =
  | "coffee_shop"
  | "milk_tea"
  | "cafe"
  | "bakery";

export type BusinessWizardStep =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6;

export type BusinessHour = {
  dayOfWeek: number;
  label: string;
  isClosed: boolean;
  opensAt: string;
  closesAt: string;
};

export type MenuItemDraft = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
};

export type BusinessFormData = {
  name: string;
  slug: string;
  category: BusinessCategory;
  description: string;

  address: string;
  barangay: string;
  city: string;
  province: string;

  latitude: number | null;
  longitude: number | null;

  phone: string;
  email: string;

  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;

  logoFile: File | null;
  coverFile: File | null;

  logoPreviewUrl: string;
  coverPreviewUrl: string;

  hours: BusinessHour[];
  menuItems: MenuItemDraft[];
};

export const BUSINESS_CATEGORY_LABELS: Record<
  BusinessCategory,
  string
> = {
  coffee_shop: "Coffee Shop",
  milk_tea: "Milk Tea",
  cafe: "Café",
  bakery: "Bakery",
};

export const BUSINESS_CATEGORY_OPTIONS: Array<{
  value: BusinessCategory;
  label: string;
}> = [
  {
    value: "coffee_shop",
    label: "Coffee Shop",
  },
  {
    value: "milk_tea",
    label: "Milk Tea",
  },
  {
    value: "cafe",
    label: "Café",
  },
  {
    value: "bakery",
    label: "Bakery",
  },
];

export const defaultBusinessHours: BusinessHour[] = [
  {
    dayOfWeek: 0,
    label: "Sunday",
    isClosed: false,
    opensAt: "08:00",
    closesAt: "20:00",
  },
  {
    dayOfWeek: 1,
    label: "Monday",
    isClosed: false,
    opensAt: "08:00",
    closesAt: "20:00",
  },
  {
    dayOfWeek: 2,
    label: "Tuesday",
    isClosed: false,
    opensAt: "08:00",
    closesAt: "20:00",
  },
  {
    dayOfWeek: 3,
    label: "Wednesday",
    isClosed: false,
    opensAt: "08:00",
    closesAt: "20:00",
  },
  {
    dayOfWeek: 4,
    label: "Thursday",
    isClosed: false,
    opensAt: "08:00",
    closesAt: "20:00",
  },
  {
    dayOfWeek: 5,
    label: "Friday",
    isClosed: false,
    opensAt: "08:00",
    closesAt: "20:00",
  },
  {
    dayOfWeek: 6,
    label: "Saturday",
    isClosed: false,
    opensAt: "08:00",
    closesAt: "20:00",
  },
];

export function createInitialBusinessFormData(): BusinessFormData {
  return {
    name: "",
    slug: "",
    category: "coffee_shop",
    description: "",

    address: "",
    barangay: "",
    city: "Isabela City",
    province: "Basilan",

    latitude: null,
    longitude: null,

    phone: "",
    email: "",

    websiteUrl: "",
    facebookUrl: "",
    instagramUrl: "",

    logoFile: null,
    coverFile: null,

    logoPreviewUrl: "",
    coverPreviewUrl: "",

    hours: defaultBusinessHours.map(
      (hour) => ({
        ...hour,
      }),
    ),

    menuItems: [],
  };
}

/**
 * Kept for components that already import
 * initialBusinessFormData.
 *
 * Prefer createInitialBusinessFormData()
 * when initializing or resetting React state.
 */
export const initialBusinessFormData =
  createInitialBusinessFormData();

export function createBusinessSlug(
  value: string,
) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
    .slice(0, 140);
}

export function formatBusinessCategory(
  category: BusinessCategory,
) {
  return BUSINESS_CATEGORY_LABELS[
    category
  ];
}