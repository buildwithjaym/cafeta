import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CAFÉTA",
    short_name: "CAFÉTA",
    description: "Discover cafés, milk tea shops, and local businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcfa",
    theme_color: "#006241",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}