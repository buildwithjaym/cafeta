export const CAFETA_GREEN = "#006241";

export const BASILAN_CENTER: [
  number,
  number,
] = [
  121.9712,
  6.7041,
];

export const DEFAULT_MAP_ZOOM = 13.5;

export const SELECTED_MAP_ZOOM = 16;

export const CAFETA_MAP_STYLE = {
  version: 8 as const,

  sources: {
    osm: {
      type: "raster" as const,

      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],

      tileSize: 256,

      attribution:
        "© OpenStreetMap contributors",
    },
  },

  layers: [
    {
      id: "cafeta-base",
      type: "raster" as const,
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};