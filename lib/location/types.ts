export type LocationValue = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};


export type LocationSearchResult = {
  name: string;

  displayName: string;

  latitude: number;

  longitude: number;
};


export type ReverseLocationResult = {
  displayName: string;

  address?: string;

  barangay?: string | null;

  city?: string | null;

  province?: string | null;

  latitude: number;

  longitude: number;
};