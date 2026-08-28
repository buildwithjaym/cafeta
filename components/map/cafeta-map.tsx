"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AttributionControl,
  Map as MapLibreMap,
  Marker,
} from "maplibre-gl";

import {
  Coffee,
  LoaderCircle,
  MapPinOff,
  RefreshCw,
  X
} from "lucide-react";

import { toast } from "sonner";

import {
  BASILAN_CENTER,
  BASILAN_ZOOM,
  CAFETA_MAP_STYLE,
} from "@/lib/map/config";

import type {
  MapBusiness,
  MapFilter,
  MapStatus,
} from "@/lib/map/types";

import { MapControls } from "@/components/map/map-controls";
import { MapFilters } from "@/components/map/map-filters";
import { createBusinessMarker } from "@/components/map/map-marker";
import { MapPlaceSheet } from "@/components/map/map-place-sheet";
import { MapSearch } from "@/components/map/map-search";

type Props = {
  businesses: MapBusiness[];
  databaseError?: boolean;
};

export function CafetaMap({
  businesses,
  databaseError = false,
}: Props) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const mapRef =
    useRef<MapLibreMap | null>(null);

  const markersRef =
    useRef<Marker[]>([]);

  const [status, setStatus] =
    useState<MapStatus>("loading");

  const [
    selectedBusiness,
    setSelectedBusiness,
  ] = useState<MapBusiness | null>(
    null,
  );

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<MapFilter>("all");

  const visibleBusinesses =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      return businesses.filter(
        (business) => {
          const matchesSearch =
            !query ||
            business.name
              .toLowerCase()
              .includes(query) ||
            business.address
              .toLowerCase()
              .includes(query) ||
            business.city
              .toLowerCase()
              .includes(query) ||
            business.province
              .toLowerCase()
              .includes(query) ||
            Boolean(
              business.barangay
                ?.toLowerCase()
                .includes(query),
            );

          if (!matchesSearch) {
            return false;
          }

          if (filter === "coffee") {
            return [
              "coffee_shop",
              "cafe",
              "bakery_cafe",
              "restaurant_cafe",
            ].includes(
              business.category,
            );
          }

          if (
            filter === "milk-tea"
          ) {
            return (
              business.category ===
              "milk_tea"
            );
          }

          return true;
        },
      );
    }, [
      businesses,
      filter,
      search,
    ]);

  useEffect(() => {
    const container =
      containerRef.current;

    if (
      !container ||
      mapRef.current
    ) {
      return;
    }

    setStatus("loading");

    const map =
      new MapLibreMap({
        container,

        style: CAFETA_MAP_STYLE,

        center: BASILAN_CENTER,

        zoom: BASILAN_ZOOM,

        attributionControl: false,
      });

    mapRef.current = map;

    map.addControl(
      new AttributionControl({
        compact: true,
      }),
      "bottom-right",
    );

    const handleLoad = () => {
      map.resize();
      setStatus("ready");
    };

    const handleError = (
      event: unknown,
    ) => {
      console.error(
        "CAFÉTA map error:",
        event,
      );

      setStatus("error");
    };

    map.once(
      "load",
      handleLoad,
    );

    map.on(
      "error",
      handleError,
    );

    const resizeObserver =
      new ResizeObserver(() => {
        map.resize();
      });

    resizeObserver.observe(
      container,
    );

    return () => {
      resizeObserver.disconnect();

      map.off(
        "error",
        handleError,
      );

      markersRef.current.forEach(
        (marker) => {
          marker.remove();
        },
      );

      markersRef.current = [];

      map.remove();

      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      status !== "ready"
    ) {
      return;
    }

    markersRef.current.forEach(
      (marker) => {
        marker.remove();
      },
    );

    markersRef.current = [];

    for (const business of visibleBusinesses) {
      const markerElement =
        createBusinessMarker(
          business,
          selectedBusiness?.id ===
            business.id,
        );

      const handleMarkerClick =
        () => {
          setSelectedBusiness(
            business,
          );

          map.flyTo({
            center: [
              business.longitude,
              business.latitude,
            ],

            zoom: Math.max(
              map.getZoom(),
              15.5,
            ),

            duration: 700,

            essential: true,
          });
        };

      markerElement.addEventListener(
        "click",
        handleMarkerClick,
      );

      const marker =
        new Marker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat([
            business.longitude,
            business.latitude,
          ])
          .addTo(map);

      markersRef.current.push(
        marker,
      );
    }

    return () => {
      markersRef.current.forEach(
        (marker) => {
          marker.remove();
        },
      );

      markersRef.current = [];
    };
  }, [
    visibleBusinesses,
    selectedBusiness,
    status,
  ]);

  function handleSearch(
    value: string,
  ) {
    setSearch(value);

    setSelectedBusiness(null);
  }

  function handleFilterChange(
    value: MapFilter,
  ) {
    setFilter(value);

    setSelectedBusiness(null);
  }

  function locateUser() {
    if (
      !navigator.geolocation
    ) {
      toast.error(
        "Location isn't supported on this device.",
      );

      return;
    }

    const toastId =
      toast.loading(
        "Finding your location...",
      );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const longitude =
          position.coords.longitude;

        const latitude =
          position.coords.latitude;

        mapRef.current?.flyTo({
          center: [
            longitude,
            latitude,
          ],

          zoom: 15,

          duration: 800,

          essential: true,
        });

        toast.success(
          "Location found",
          {
            id: toastId,

            description:
              "Showing the area around you.",
          },
        );
      },

      () => {
        toast.error(
          "Location unavailable",
          {
            id: toastId,

            description:
              "Allow location access and try again.",
          },
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }

  function resetMap() {
    setSelectedBusiness(null);

    mapRef.current?.flyTo({
      center: BASILAN_CENTER,

      zoom: BASILAN_ZOOM,

      duration: 700,

      essential: true,
    });
  }

  function openDirections(
    business: MapBusiness,
  ) {
    const destination =
      `${business.latitude},${business.longitude}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destination,
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (databaseError) {
    return (
      <MapDatabaseError />
    );
  }

  return (
    <section className="relative h-full min-h-0 w-full overflow-hidden bg-[#e8eeea]">
      <div
        ref={containerRef}
        className="absolute inset-0"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-white/85 via-white/25 to-transparent pb-12 pt-4">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto max-w-[560px]">
            <MapSearch
              value={search}
              onChange={
                handleSearch
              }
              onFilterClick={() =>
                toast(
                  "More filters are coming soon.",
                )
              }
            />
          </div>

          <div className="pointer-events-auto mt-3">
            <MapFilters
              active={filter}
              onChange={
                handleFilterChange
              }
            />
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-[132px] z-20 md:right-6 md:top-[145px]">
        <MapControls
          onLocate={locateUser}
          onZoomIn={() =>
            mapRef.current?.zoomIn({
              duration: 200,
            })
          }
          onZoomOut={() =>
            mapRef.current?.zoomOut({
              duration: 200,
            })
          }
          onReset={resetMap}
        />
      </div>

      {status ===
        "loading" && (
        <MapLoadingState />
      )}

      {status === "error" && (
        <MapBasemapError />
      )}

      {status === "ready" &&
        businesses.length ===
          0 && (
          <MapEmptyState />
        )}

      {status === "ready" &&
        businesses.length > 0 &&
        visibleBusinesses.length ===
          0 && (
          <MapSearchEmptyState
            search={search}
          />
        )}

      {status === "ready" &&
        visibleBusinesses.length >
          0 &&
        !selectedBusiness && (
          <MapResultCount
            count={
              visibleBusinesses.length
            }
          />
        )}

      {status === "ready" &&
        selectedBusiness && (
          <MapPlaceSheet
            business={
              selectedBusiness
            }
            onClose={() =>
              setSelectedBusiness(
                null,
              )
            }
            onDirections={() =>
              openDirections(
                selectedBusiness,
              )
            }
          />
        )}
    </section>
  );
}

function MapLoadingState() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xl">
        <LoaderCircle className="size-5 animate-spin text-[#006241]" />

        <div>
          <p className="text-xs font-bold text-[#17211c]">
            Loading map
          </p>

          <p className="mt-0.5 whitespace-nowrap text-[10px] text-black/40">
            Getting Basilan
            ready...
          </p>
        </div>
      </div>
    </div>
  );
}

function MapBasemapError() {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#edf2ee]/95 px-5">
      <div className="max-w-sm rounded-[28px] bg-white p-6 text-center shadow-xl">
        <MapPinOff className="mx-auto size-6 text-[#006241]" />

        <h2 className="mt-4 font-bold text-[#17211c]">
          Map couldn&apos;t
          load
        </h2>

        <p className="mt-2 text-xs leading-5 text-black/45">
          We couldn&apos;t load
          the Basilan map. Check
          your connection and try
          again.
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="mx-auto mt-5 flex items-center gap-2 rounded-full bg-[#006241] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#00754a]"
        >
          <RefreshCw className="size-3.5" />

          Try again
        </button>
      </div>
    </div>
  );
}

function MapDatabaseError() {
  return (
    <div className="flex h-full items-center justify-center bg-[#edf2ee] px-5">
      <div className="max-w-sm rounded-[28px] bg-white p-6 text-center shadow-sm">
        <Coffee className="mx-auto size-6 text-[#006241]" />

        <h2 className="mt-4 font-bold text-[#17211c]">
          Places unavailable
        </h2>

        <p className="mt-2 text-xs leading-5 text-black/45">
          We couldn&apos;t load
          CAFÉTA businesses right
          now.
        </p>
      </div>
    </div>
  );
}

function MapEmptyState() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);

    // Wait for exit animation before removing
    window.setTimeout(() => {
      setIsVisible(false);
    }, 220);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        absolute inset-x-4 bottom-[105px] z-20
        transition-all duration-200 ease-out
        md:bottom-6 md:left-6 md:right-auto md:w-[380px]

        ${
          isClosing
            ? "translate-y-2 scale-[0.98] opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }
      `}
    >
      <div
        className="
          relative overflow-hidden
          rounded-[24px]
          border border-black/[0.06]
          bg-white/95
          p-5
          shadow-[0_12px_40px_rgba(23,33,28,0.12)]
          backdrop-blur-xl
        "
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss message"
          className="
            group absolute right-3 top-3
            flex size-8
            items-center justify-center
            rounded-full
            text-black/30
            transition-all duration-200
            hover:bg-black/[0.045]
            hover:text-[#17211c]
            active:scale-90
          "
        >
          <X
            className="
              size-[15px]
              transition-transform
              duration-200
              ease-out
              group-hover:rotate-90
            "
            strokeWidth={2}
          />
        </button>

        {/* Icon */}
        <div
          className="
            flex size-9
            items-center justify-center
            rounded-full
            bg-[#e8f1ec]
            text-[#006241]
          "
        >
          <Coffee
            className="size-[17px]"
            strokeWidth={2}
          />
        </div>

        {/* Content */}
        <div className="mt-3 pr-7">
          <h3 className="text-sm font-bold text-[#17211c]">
            No places listed yet
          </h3>

          <p className="mt-1 max-w-[290px] text-xs leading-5 text-black/45">
            There aren&apos;t any approved CAFÉTA businesses
            to show on the map yet.
          </p>
        </div>
      </div>
    </div>
  );
}

function MapSearchEmptyState({
  search,
}: {
  search: string;
}) {
  return (
    <div className="absolute inset-x-4 bottom-[105px] z-20 md:bottom-6 md:left-6 md:right-auto md:w-[380px]">
      <div className="rounded-[24px] border border-black/[0.06] bg-white/95 p-5 shadow-xl backdrop-blur-xl">
        <p className="text-sm font-bold text-[#17211c]">
          No matching places
        </p>

        <p className="mt-1 text-xs leading-5 text-black/45">
          {search
            ? `No businesses match "${search}".`
            : "Try another category."}
        </p>
      </div>
    </div>
  );
}

function MapResultCount({
  count,
}: {
  count: number;
}) {
  return (
    <div className="absolute inset-x-4 bottom-[105px] z-20 md:bottom-6 md:left-6 md:right-auto md:w-auto">
      <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/95 px-4 py-2.5 text-xs font-bold text-[#17211c] shadow-lg backdrop-blur-xl">
        <span className="size-2 rounded-full bg-[#006241]" />

        {count}{" "}
        {count === 1
          ? "place"
          : "places"}
      </div>
    </div>
  );
}