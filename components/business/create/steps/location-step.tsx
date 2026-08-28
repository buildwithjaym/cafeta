"use client";

import {
  LocateFixed,
  MapPin,
  Navigation,
} from "lucide-react";

import { toast } from "sonner";

import type {
  BusinessFormData,
} from "@/lib/business/types";

type Props = {
  data: BusinessFormData;

  updateData: (
    values: Partial<BusinessFormData>,
  ) => void;
};

export function LocationStep({
  data,
  updateData,
}: Props) {
  function useCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error(
        "Location is not supported on this device.",
      );

      return;
    }

    const toastId = toast.loading(
      "Finding your location...",
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateData({
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,
        });

        toast.success(
          "Location added",
          {
            id: toastId,

            description:
              "You can fine-tune the coordinates before continuing.",
          },
        );
      },

      () => {
        toast.error(
          "We couldn't access your location.",
          {
            id: toastId,

            description:
              "Allow location access or enter the coordinates manually.",
          },
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006241]">
          Location
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#17211c] sm:text-[28px]">
          Where can people find you?
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
          Add an accurate address and
          map position so CAFÉTA can
          show your business in search,
          Explore, and Map.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <Field
          label="Street address"
          required
        >
          <input
            value={data.address}
            onChange={(event) =>
              updateData({
                address:
                  event.target.value,
              })
            }
            placeholder="Street, building, landmark..."
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Barangay">
            <input
              value={data.barangay}
              onChange={(event) =>
                updateData({
                  barangay:
                    event.target.value,
                })
              }
              placeholder="Barangay"
              className={inputClass}
            />
          </Field>

          <Field
            label="City / Municipality"
            required
          >
            <input
              value={data.city}
              onChange={(event) =>
                updateData({
                  city:
                    event.target.value,
                })
              }
              placeholder="Isabela City"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Province">
          <input
            value={data.province}
            onChange={(event) =>
              updateData({
                province:
                  event.target.value,
              })
            }
            className={inputClass}
          />
        </Field>

        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#26322b]">
                Map position
                <span className="ml-1 text-[#006241]">
                  *
                </span>
              </p>

              <p className="mt-1 text-[11px] text-black/35">
                This controls where
                your marker appears.
              </p>
            </div>

            <button
              type="button"
              onClick={
                useCurrentLocation
              }
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#edf5f1] px-3 text-[11px] font-bold text-[#006241] transition hover:bg-[#e1efe8]"
            >
              <LocateFixed className="size-3.5" />
              Use my location
            </button>
          </div>

          <div className="mt-3 overflow-hidden rounded-[22px] border border-black/[0.06] bg-[#edf3ef]">
            <div className="flex min-h-[180px] items-center justify-center px-6 py-8">
              <div className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#006241] text-white shadow-[0_8px_25px_rgba(0,98,65,0.2)]">
                  <MapPin className="size-5" />
                </div>

                <p className="mt-4 text-sm font-bold text-[#17211c]">
                  Business map
                  position
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {data.latitude !==
                    null &&
                  data.longitude !==
                    null
                    ? `${data.latitude.toFixed(
                        6,
                      )}, ${data.longitude.toFixed(
                        6,
                      )}`
                    : "Set your location below"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Latitude">
              <input
                type="number"
                step="any"
                value={
                  data.latitude ?? ""
                }
                onChange={(event) =>
                  updateData({
                    latitude:
                      event.target
                        .value === ""
                        ? null
                        : Number(
                            event
                              .target
                              .value,
                          ),
                  })
                }
                placeholder="6.7041"
                className={inputClass}
              />
            </Field>

            <Field label="Longitude">
              <input
                type="number"
                step="any"
                value={
                  data.longitude ?? ""
                }
                onChange={(event) =>
                  updateData({
                    longitude:
                      event.target
                        .value === ""
                        ? null
                        : Number(
                            event
                              .target
                              .value,
                          ),
                  })
                }
                placeholder="121.9712"
                className={inputClass}
              />
            </Field>
          </div>

          {data.latitude !== null &&
            data.longitude !== null && (
              <div className="mt-3 flex items-center gap-2 rounded-[14px] bg-[#f2f8f5] px-4 py-3 text-xs font-semibold text-[#006241]">
                <Navigation className="size-3.5" />

                Map position ready
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-[#26322b]">
        {label}

        {required && (
          <span className="ml-1 text-[#006241]">
            *
          </span>
        )}
      </label>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-[15px] border border-black/[0.08] bg-[#fafbfa] px-4 text-sm font-medium text-[#17211c] outline-none transition-all placeholder:text-black/25 focus:border-[#006241]/40 focus:bg-white focus:ring-4 focus:ring-[#006241]/[0.06]";