"use client";

import type {
  ReactNode,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Coffee,
  Globe2,
  ImageIcon,
  MapPin,
  Phone,
  Store,
  UtensilsCrossed,
} from "lucide-react";

import type {
  BusinessFormData,
} from "@/lib/business/types";

import {
  formatFileSize,
} from "@/lib/business/image-optimizer";

type Props = {
  data: BusinessFormData;
};

export function ReviewStep({
  data,
}: Props) {
  const openDays =
    data.hours.filter(
      (hour) =>
        !hour.isClosed,
    );

  const validMenuItems =
    data.menuItems.filter(
      (item) =>
        item.name.trim(),
    );

  const hasLogo =
    Boolean(
      data.logoFile &&
        data.logoPreviewUrl,
    );

  const hasCover =
    Boolean(
      data.coverFile &&
        data.coverPreviewUrl,
    );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006241]">
          Final review
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#17211c] sm:text-[28px]">
          Ready to join CAFÉTA?
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
          Review your listing before
          submitting it. Your optimized
          images will be uploaded when
          the business is created.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        <div className="relative h-[190px] overflow-hidden bg-[#e8efeb] sm:h-[220px]">
          {data.coverPreviewUrl ? (
            <img
              src={
                data.coverPreviewUrl
              }
              alt={
                data.name
                  ? `${data.name} cover`
                  : "Business cover"
              }
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2">
              <ImageIcon className="size-7 text-[#006241]/25" />

              <span className="text-[10px] font-medium text-black/25">
                No cover photo
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/[0.06] to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3 sm:bottom-5 sm:left-5">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border-[3px] border-white bg-white shadow-lg sm:size-[72px]">
              {data.logoPreviewUrl ? (
                <img
                  src={
                    data.logoPreviewUrl
                  }
                  alt={
                    data.name
                      ? `${data.name} logo`
                      : "Business logo"
                  }
                  className="size-full object-cover"
                />
              ) : (
                <Coffee className="size-5 text-[#006241]" />
              )}
            </div>

            <div className="min-w-0 pb-1 text-white">
              <h3 className="truncate text-xl font-black tracking-[-0.035em] sm:text-2xl">
                {data.name ||
                  "Your business"}
              </h3>

              <p className="mt-0.5 text-xs text-white/75">
                {formatCategory(
                  data.category,
                )}
              </p>
            </div>
          </div>
        </div>

        {(hasLogo ||
          hasCover) && (
          <div className="flex flex-wrap gap-2 border-t border-black/[0.05] px-4 py-3 sm:px-5">
            {hasLogo &&
              data.logoFile && (
                <ImageReadyBadge
                  label="Logo"
                  size={
                    data.logoFile
                      .size
                  }
                />
              )}

            {hasCover &&
              data.coverFile && (
                <ImageReadyBadge
                  label="Cover"
                  size={
                    data.coverFile
                      .size
                  }
                />
              )}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ReviewCard
          icon={Store}
          title="Business"
        >
          <ReviewLine
            label="Name"
            value={
              data.name || "—"
            }
          />

          <ReviewLine
            label="Category"
            value={formatCategory(
              data.category,
            )}
          />

          <ReviewLine
            label="Slug"
            value={
              data.slug || "—"
            }
          />
        </ReviewCard>

        <ReviewCard
          icon={MapPin}
          title="Location"
        >
          <p className="text-xs leading-5 text-black/50">
            {[
              data.address,
              data.barangay,
              data.city,
              data.province,
            ]
              .filter(Boolean)
              .join(", ") ||
              "No location provided"}
          </p>

          {data.latitude !==
            null &&
            data.longitude !==
              null && (
              <p className="mt-2 text-[10px] font-medium text-black/30">
                {data.latitude.toFixed(
                  6,
                )}
                {", "}
                {data.longitude.toFixed(
                  6,
                )}
              </p>
            )}
        </ReviewCard>

        <ReviewCard
          icon={Clock3}
          title="Hours"
        >
          <p className="text-xs font-semibold text-[#17211c]">
            {openDays.length}{" "}
            {openDays.length === 1
              ? "day"
              : "days"}{" "}
            open per week
          </p>

          <p className="mt-1 text-[11px] text-black/35">
            {
              data.hours.filter(
                (hour) =>
                  hour.isClosed,
              ).length
            }{" "}
            closed
          </p>
        </ReviewCard>

        <ReviewCard
          icon={
            UtensilsCrossed
          }
          title="Starter menu"
        >
          <p className="text-xs font-semibold text-[#17211c]">
            {validMenuItems.length}{" "}
            {validMenuItems.length ===
            1
              ? "item"
              : "items"}
          </p>

          <p className="mt-1 text-[11px] text-black/35">
            {validMenuItems.length
              ? "Ready to add to your listing."
              : "No menu items added yet."}
          </p>
        </ReviewCard>

        <ReviewCard
          icon={ImageIcon}
          title="Business media"
        >
          <ReviewLine
            label="Logo"
            value={
              hasLogo
                ? "Ready"
                : "Not added"
            }
          />

          <ReviewLine
            label="Cover"
            value={
              hasCover
                ? "Ready"
                : "Not added"
            }
          />
        </ReviewCard>

        <ReviewCard
          icon={Phone}
          title="Contact"
        >
          <ReviewLine
            label="Phone"
            value={
              data.phone || "—"
            }
          />

          <ReviewLine
            label="Email"
            value={
              data.email || "—"
            }
          />
        </ReviewCard>

        <ReviewCard
          icon={Globe2}
          title="Online"
        >
          <ReviewLine
            label="Website"
            value={
              data.websiteUrl
                ? "Added"
                : "—"
            }
          />

          <ReviewLine
            label="Facebook"
            value={
              data.facebookUrl
                ? "Added"
                : "—"
            }
          />

          <ReviewLine
            label="Instagram"
            value={
              data.instagramUrl
                ? "Added"
                : "—"
            }
          />
        </ReviewCard>
      </div>

      {data.description && (
        <div className="mt-3 rounded-[20px] border border-black/[0.06] bg-white p-5">
          <p className="text-xs font-bold text-[#17211c]">
            About
          </p>

          <p className="mt-2 whitespace-pre-line text-xs leading-6 text-black/45">
            {data.description}
          </p>
        </div>
      )}

      <div className="mt-5 rounded-[18px] border border-[#006241]/10 bg-[#f1f7f4] px-5 py-4">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#006241]/10 text-[#006241]">
            <CheckCircle2 className="size-4" />
          </div>

          <div>
            <p className="text-xs font-bold text-[#006241]">
              What happens next?
            </p>

            <p className="mt-1.5 text-[11px] leading-5 text-black/45">
              CAFÉTA will create your
              business, upload the
              optimized images, save
              your hours and menu, and
              submit the listing for
              review. It will not become
              publicly available until
              it meets the approval
              rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageReadyBadge({
  label,
  size,
}: {
  label: string;
  size: number;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-[#edf5f1] px-3 py-1.5">
      <CheckCircle2 className="size-3 text-[#006241]" />

      <span className="text-[10px] font-bold text-[#006241]">
        {label}
      </span>

      <span className="text-[9px] text-black/30">
        {formatFileSize(size)}
      </span>
    </div>
  );
}

function ReviewCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Store;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-black/[0.06] bg-white p-4 transition-all duration-200 hover:border-[#006241]/15 hover:shadow-[0_8px_25px_rgba(0,0,0,0.025)]">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#edf5f1] text-[#006241]">
          <Icon className="size-3.5" />
        </div>

        <p className="text-xs font-bold text-[#17211c]">
          {title}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {children}
      </div>
    </div>
  );
}

function ReviewLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-[11px]">
      <span className="shrink-0 text-black/35">
        {label}
      </span>

      <span className="max-w-[65%] break-words text-right font-semibold text-[#17211c]">
        {value}
      </span>
    </div>
  );
}

function formatCategory(
  category: string,
) {
  switch (category) {
    case "coffee_shop":
      return "Coffee Shop";

    case "milk_tea":
      return "Milk Tea";

    case "cafe":
      return "Café";

    case "bakery":
      return "Bakery";

    default:
      return category;
  }
}