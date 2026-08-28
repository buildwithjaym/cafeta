import {
  Coffee,
  CupSoda,
  Flame,
} from "lucide-react";

import {
  createElement,
} from "react";

import {
  renderToStaticMarkup,
} from "react-dom/server";

import type {
  MapBusiness,
} from "@/lib/map/types";

export function createBusinessMarker(
  business: MapBusiness,
  active = false,
) {
  const button =
    document.createElement(
      "button",
    );

  button.type =
    "button";

  button.setAttribute(
    "aria-label",
    `View ${business.name}`,
  );

  button.setAttribute(
    "data-business-id",
    business.id,
  );

  const isTrending =
    business.memoryActivityLabel ===
    "trending";

  const isActiveToday =
    business.memoryActivityLabel ===
    "active";

  const Icon =
    isTrending
      ? Flame
      : business.category ===
          "milk_tea"
        ? CupSoda
        : Coffee;

  button.innerHTML =
    renderToStaticMarkup(
      createElement(
        Icon,
        {
          size:
            active
              ? 20
              : 17,

          strokeWidth:
            2.3,
        },
      ),
    );

  button.className = [
    "cafeta-map-marker",

    active
      ? "cafeta-map-marker-active"
      : "",

    isTrending
      ? "cafeta-map-marker-trending"
      : "",

    isActiveToday
      ? "cafeta-map-marker-memory-active"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (
    isTrending ||
    isActiveToday
  ) {
    const pulse =
      document.createElement(
        "span",
      );

    pulse.className =
      isTrending
        ? "cafeta-marker-pulse cafeta-marker-pulse-trending"
        : "cafeta-marker-pulse";

    button.appendChild(
      pulse,
    );
  }

  return button;
}