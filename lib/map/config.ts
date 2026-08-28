import type {
  StyleSpecification,
} from "maplibre-gl";

export const BASILAN_CENTER: [
  number,
  number,
] = [
  121.9712,
  6.7041,
];

export const BASILAN_ZOOM = 13;

export const CAFETA_MAP_STYLE: StyleSpecification =
  {
    version: 8,

    sources: {
      openstreetmap: {
        type: "raster",

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
        id: "cafeta-basemap",

        type: "raster",

        source: "openstreetmap",

        minzoom: 0,

        maxzoom: 19,
      },
    ],
  };