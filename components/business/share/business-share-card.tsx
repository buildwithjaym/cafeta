"use client";

import {
  forwardRef,
} from "react";

import {
  Globe2,
  MapPin,
  ScanLine,
} from "lucide-react";

import { BusinessQR } from "./business-qr";

type Props = {
  business: {
    name: string;
    slug: string;
    logo_url?: string | null;
    category: string;
    address: string;
    city: string;
    province: string;
  };
};

export const BusinessShareCard = forwardRef<
  HTMLDivElement,
  Props
>(function BusinessShareCard(
  {
    business,
  },
  ref,
) {
  const url =
    `https://www.cafeta.online/business/${business.slug}`;

  const location = [
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
  ref={ref}
  id="cafeta-share-card"
  style={{
    borderRadius: "32px",
    overflow: "hidden",
    isolation: "isolate",
  }}
  className="
    relative
    block
    w-full
    max-w-[390px]
    overflow-hidden
    rounded-[32px]
    border
    border-black/[0.08]
    bg-white
    shadow-[0_18px_55px_rgba(19,45,33,0.12)]
  "
>
      <div
        aria-hidden="true"
        className="
          absolute -right-16 -top-16
          size-48 rounded-full
          bg-[#dfeee7]/80 blur-2xl
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute -bottom-20 -left-20
          size-52 rounded-full
          bg-[#f3e8cc]/50 blur-3xl
        "
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-center gap-3.5">
          <div
            className="
              flex size-14 shrink-0 items-center justify-center
              overflow-hidden rounded-[18px]
              border border-[#006241]/10
              bg-[#f7faf8]
              shadow-sm
              sm:size-16 sm:rounded-[20px]
            "
          >
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={`${business.name} logo`}
                crossOrigin="anonymous"
                className="size-full object-cover"
              />
            ) : (
              <span
                className="
                  flex size-full items-center justify-center
                  bg-[#edf5f1]
                  text-2xl
                "
                aria-hidden="true"
              >
                ☕
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="
                mb-1 text-[9px] font-black uppercase
                tracking-[0.16em] text-[#006241]
              "
            >
              {business.category}
            </p>

            <h3
              className="
                line-clamp-2
                text-[17px] font-black leading-[1.08]
                tracking-[-0.04em] text-[#17211c]
                sm:text-lg
              "
            >
              {business.name}
            </h3>

            {location && (
              <div
                className="
                  mt-1.5 flex min-w-0 items-center gap-1.5
                  text-[10px] text-black/45
                "
              >
                <MapPin className="size-3 shrink-0 text-[#006241]" />

                <span className="truncate">
                  {location}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className="
            relative mt-5 overflow-hidden
            rounded-[22px]
            border border-[#006241]/[0.07]
            bg-[#f1f7f4]
            px-4 py-5
            sm:rounded-[26px] sm:p-6
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute inset-x-0 top-0 h-1
              bg-gradient-to-r
              from-[#006241] via-[#38a176] to-[#d7b66f]
            "
          />

          <div className="flex flex-col items-center text-center">
            <div
              className="
                rounded-[18px]
                border border-black/[0.05]
                bg-white p-3
                shadow-[0_10px_28px_rgba(0,62,40,0.1)]
              "
            >
              <BusinessQR url={url} />
            </div>

            <div
              className="
                mt-4 inline-flex items-center gap-1.5
                rounded-full bg-white/80
                px-3 py-1
                text-[9px] font-black uppercase
                tracking-[0.12em] text-[#006241]
              "
            >
              <ScanLine className="size-3" />
              Scan with your camera
            </div>

            <p
              className="
                mt-3 text-[15px] font-black
                tracking-[-0.025em] text-[#17211c]
              "
            >
              View our CAFÉTA page
            </p>

            <p
              className="
                mt-1 max-w-[250px]
                text-[10px] leading-relaxed text-black/45
              "
            >
              Explore our menu, location, reviews, and
              complete business information.
            </p>
          </div>
        </div>

        <div
          className="
            mt-5 flex items-center justify-between gap-4
            border-t border-black/[0.06] pt-4
          "
        >
          <div>
            <p
              className="
                text-[8px] font-bold uppercase
                tracking-[0.2em] text-black/35
              "
            >
              Discover local with
            </p>

            <p
              className="
                mt-0.5 text-base font-black
                tracking-[-0.045em] text-[#006241]
              "
            >
              CAFÉTA
            </p>
          </div>

          <div
            className="
              flex items-center gap-1.5
              rounded-full bg-[#edf5f1]
              px-3 py-1.5
              text-[9px] font-bold text-[#006241]
            "
          >
            <Globe2 className="size-3" />
            cafeta.online
          </div>
        </div>
      </div>
    </div>
  );
});

BusinessShareCard.displayName = "BusinessShareCard";