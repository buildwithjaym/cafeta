"use client";

import {
  useRef,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  CheckCircle2,
  Globe2,
  ImageIcon,
  LoaderCircle,
  Phone,
  Upload,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  formatFileSize,
  optimizeBusinessImage,
} from "@/lib/business/image-optimizer";

import type {
  BusinessImageKind,
} from "@/lib/business/image-optimizer";

import type {
  BusinessFormData,
} from "@/lib/business/types";

type Props = {
  data: BusinessFormData;

  updateData: (
    values: Partial<BusinessFormData>,
  ) => void;
};

export function MediaStep({
  data,
  updateData,
}: Props) {
  const [
    optimizing,
    setOptimizing,
  ] = useState<
    BusinessImageKind | null
  >(null);

  async function handleImageSelect(
    file: File,
    kind: BusinessImageKind,
  ) {
    try {
      setOptimizing(kind);

      const optimized =
        await optimizeBusinessImage(
          file,
          kind,
        );

      const previewUrl =
        URL.createObjectURL(
          optimized,
        );

      if (kind === "logo") {
        if (
          data.logoPreviewUrl
        ) {
          URL.revokeObjectURL(
            data.logoPreviewUrl,
          );
        }

        updateData({
          logoFile:
            optimized,

          logoPreviewUrl:
            previewUrl,
        });
      } else {
        if (
          data.coverPreviewUrl
        ) {
          URL.revokeObjectURL(
            data.coverPreviewUrl,
          );
        }

        updateData({
          coverFile:
            optimized,

          coverPreviewUrl:
            previewUrl,
        });
      }

      toast.success(
        "Image ready",
        {
          description:
            `Optimized to ${formatFileSize(
              optimized.size,
            )}.`,
        },
      );
    } catch (error) {
      toast.error(
        "Unable to use image",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please choose another image.",
        },
      );
    } finally {
      setOptimizing(null);
    }
  }

  function removeImage(
    kind: BusinessImageKind,
  ) {
    if (kind === "logo") {
      if (
        data.logoPreviewUrl
      ) {
        URL.revokeObjectURL(
          data.logoPreviewUrl,
        );
      }

      updateData({
        logoFile: null,
        logoPreviewUrl: "",
      });

      return;
    }

    if (
      data.coverPreviewUrl
    ) {
      URL.revokeObjectURL(
        data.coverPreviewUrl,
      );
    }

    updateData({
      coverFile: null,
      coverPreviewUrl: "",
    });
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006241]">
          Media & contact
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#17211c] sm:text-[28px]">
          Make your listing feel
          complete
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
          Add your branding and ways
          customers can contact or
          follow your business.
        </p>
      </div>

      <div className="mt-8">
        <SectionTitle
          icon={ImageIcon}
          title="Business images"
          description="Upload your logo and cover photo. CAFÉTA automatically optimizes them before upload."
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ImageUpload
            label="Business logo"
            description="Square image recommended"
            preview={
              data.logoPreviewUrl
            }
            file={
              data.logoFile
            }
            loading={
              optimizing ===
              "logo"
            }
            onSelect={(
              file,
            ) =>
              handleImageSelect(
                file,
                "logo",
              )
            }
            onRemove={() =>
              removeImage(
                "logo",
              )
            }
          />

          <ImageUpload
            label="Cover photo"
            description="Landscape image recommended"
            preview={
              data.coverPreviewUrl
            }
            file={
              data.coverFile
            }
            loading={
              optimizing ===
              "cover"
            }
            onSelect={(
              file,
            ) =>
              handleImageSelect(
                file,
                "cover",
              )
            }
            onRemove={() =>
              removeImage(
                "cover",
              )
            }
          />
        </div>

        {(data.logoPreviewUrl ||
          data.coverPreviewUrl) && (
          <ListingPreview
            data={data}
          />
        )}
      </div>

      <Divider />

      <div>
        <SectionTitle
          icon={Phone}
          title="Contact"
          description="Help customers reach your business."
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <input
              type="tel"
              value={
                data.phone
              }
              onChange={(
                event,
              ) =>
                updateData({
                  phone:
                    event
                      .target
                      .value,
                })
              }
              placeholder="+63..."
              className={
                inputClass
              }
            />
          </Field>

          <Field label="Business email">
            <input
              type="email"
              value={
                data.email
              }
              onChange={(
                event,
              ) =>
                updateData({
                  email:
                    event
                      .target
                      .value,
                })
              }
              placeholder="hello@example.com"
              className={
                inputClass
              }
            />
          </Field>
        </div>
      </div>

      <Divider />

      <div>
        <SectionTitle
          icon={Globe2}
          title="Online presence"
          description="Optional links customers can use to learn more."
        />

        <div className="mt-4 space-y-3">
          <SocialField
            icon={
              <WebsiteIcon />
            }
            label="Website"
            value={
              data.websiteUrl
            }
            placeholder="https://yourbusiness.com"
            onChange={(
              value,
            ) =>
              updateData({
                websiteUrl:
                  value,
              })
            }
          />

          <SocialField
            icon={
              <FacebookIcon />
            }
            label="Facebook"
            value={
              data.facebookUrl
            }
            placeholder="https://facebook.com/yourbusiness"
            onChange={(
              value,
            ) =>
              updateData({
                facebookUrl:
                  value,
              })
            }
          />

          <SocialField
            icon={
              <InstagramIcon />
            }
            label="Instagram"
            value={
              data.instagramUrl
            }
            placeholder="https://instagram.com/yourbusiness"
            onChange={(
              value,
            ) =>
              updateData({
                instagramUrl:
                  value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function ImageUpload({
  label,
  description,
  preview,
  file,
  loading,
  onSelect,
  onRemove,
}: {
  label: string;
  description: string;
  preview: string;
  file: File | null;
  loading: boolean;
  onSelect: (
    file: File,
  ) => void;
  onRemove: () => void;
}) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  function openPicker() {
    if (!loading) {
      inputRef.current?.click();
    }
  }

  return (
    <div>
      <div className="mb-2">
        <p className="text-xs font-bold text-[#26322b]">
          {label}
        </p>

        <p className="mt-0.5 text-[10px] text-black/35">
          {description}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(
          event,
        ) => {
          const selected =
            event.target
              .files?.[0];

          if (selected) {
            onSelect(
              selected,
            );
          }

          event.currentTarget.value =
            "";
        }}
      />

      {preview ? (
        <div className="group overflow-hidden rounded-[20px] border border-black/[0.07] bg-white transition-all duration-200 hover:border-[#006241]/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#eef2ef]">
            <img
              src={preview}
              alt={`${label} preview`}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/[0.03]" />

            <button
              type="button"
              onClick={
                onRemove
              }
              aria-label={`Remove ${label}`}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/95 text-black/50 shadow-sm backdrop-blur transition hover:scale-105 hover:text-red-600"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#006241]">
                <CheckCircle2 className="size-3.5" />

                Ready
              </p>

              {file && (
                <p className="mt-1 text-[10px] text-black/35">
                  WebP ·{" "}
                  {formatFileSize(
                    file.size,
                  )}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={
                openPicker
              }
              className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold text-[#006241] transition hover:bg-[#edf5f1]"
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={
            loading
          }
          onClick={
            openPicker
          }
          className="group flex aspect-[16/10] w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-[#006241]/20 bg-[#f8fbf9] px-5 text-center transition-all duration-200 hover:border-[#006241]/40 hover:bg-[#f2f8f5] active:scale-[0.99] disabled:pointer-events-none"
        >
          <div className="flex size-11 items-center justify-center rounded-[15px] bg-[#e7f2ec] text-[#006241] transition-transform duration-200 group-hover:scale-105">
            {loading ? (
              <LoaderCircle className="size-[18px] animate-spin" />
            ) : (
              <Upload className="size-[18px]" />
            )}
          </div>

          <p className="mt-3 text-xs font-bold text-[#17211c]">
            {loading
              ? "Optimizing..."
              : "Upload image"}
          </p>

          <p className="mt-1 text-[10px] leading-4 text-black/35">
            JPG, PNG or WebP
            <br />
            Maximum 5 MB
          </p>
        </button>
      )}
    </div>
  );
}

function ListingPreview({
  data,
}: {
  data: BusinessFormData;
}) {
  return (
    <div className="mt-5 overflow-hidden rounded-[22px] border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
      <div className="relative h-[170px] bg-[#edf1ee]">
        {data.coverPreviewUrl ? (
          <img
            src={
              data.coverPreviewUrl
            }
            alt="Business cover preview"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-black/15">
            <ImageIcon className="size-7" />
          </div>
        )}

        <div className="absolute -bottom-8 left-5 flex size-[72px] items-center justify-center overflow-hidden rounded-[20px] border-4 border-white bg-white shadow-md">
          {data.logoPreviewUrl ? (
            <img
              src={
                data.logoPreviewUrl
              }
              alt="Business logo preview"
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="size-5 text-[#006241]" />
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-12">
        <p className="font-bold tracking-[-0.02em] text-[#17211c]">
          {data.name ||
            "Your business"}
        </p>

        <p className="mt-1 text-[11px] text-black/40">
          CAFÉTA listing preview
        </p>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Phone;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-[#edf5f1] text-[#006241]">
        <Icon
          className="size-4"
          strokeWidth={2}
        />
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#17211c]">
          {title}
        </h3>

        <p className="mt-0.5 text-[11px] leading-5 text-black/35">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-[#26322b]">
        {label}
      </label>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

function SocialField({
  icon,
  label,
  value,
  placeholder,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  placeholder: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div className="flex min-h-12 items-center rounded-[15px] border border-black/[0.07] bg-[#fafbfa] px-4 transition-all focus-within:border-[#006241]/35 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006241]/[0.05]">
      <div className="flex size-5 shrink-0 items-center justify-center text-black/35">
        {icon}
      </div>

      <div className="ml-3 min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-black/30">
          {label}
        </p>

        <input
          type="url"
          value={value}
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          placeholder={
            placeholder
          }
          className="mt-0.5 w-full bg-transparent text-xs font-medium text-[#17211c] outline-none placeholder:font-normal placeholder:text-black/20"
        />
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-8 h-px bg-black/[0.055]" />
  );
}

function WebsiteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="size-[18px]"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M3 12H21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M12 3C14.3 5.35 15.5 8.35 15.5 12C15.5 15.65 14.3 18.65 12 21C9.7 18.65 8.5 15.65 8.5 12C8.5 8.35 9.7 5.35 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-[18px]"
      aria-hidden="true"
    >
      <path d="M13.5 21V13.2H16.1L16.5 10.15H13.5V8.2C13.5 7.32 13.74 6.72 15.02 6.72H16.62V4C16.34 3.96 15.39 3.88 14.28 3.88C11.96 3.88 10.37 5.3 10.37 7.92V10.15H7.83V13.2H10.37V21H13.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="size-[18px]"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="17.35"
        cy="6.7"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

const inputClass =
  "h-12 w-full rounded-[15px] border border-black/[0.08] bg-[#fafbfa] px-4 text-sm font-medium text-[#17211c] outline-none transition-all placeholder:text-black/25 focus:border-[#006241]/40 focus:bg-white focus:ring-4 focus:ring-[#006241]/[0.06]";