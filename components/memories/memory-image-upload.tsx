"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  formatFileSize,
  optimizeBusinessImage,
} from "@/lib/business/image-optimizer";

type Props = {
  value: File | null;

  onChange: (
    file: File | null,
  ) => void;

  disabled?: boolean;
};

export function MemoryImageUpload({
  value,
  onChange,
  disabled = false,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState<string | null>(
      null,
    );

  const [
    originalSize,
    setOriginalSize,
  ] =
    useState<number | null>(
      null,
    );

  const [
    optimizing,
    setOptimizing,
  ] =
    useState(false);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(
        null,
      );

      return;
    }

    const url =
      URL.createObjectURL(
        value,
      );

    setPreviewUrl(
      url,
    );

    return () => {
      URL.revokeObjectURL(
        url,
      );
    };
  }, [
    value,
  ]);

  async function handleFile(
    file: File,
  ) {
    setOptimizing(
      true,
    );

    try {
      const optimized =
        await optimizeBusinessImage(
          file,
          "memory",
        );

      setOriginalSize(
        file.size,
      );

      onChange(
        optimized,
      );

      toast.success(
        "Photo optimized",
      );
    } catch (
      error
    ) {
      toast.error(
        "Couldn't use photo",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please choose another image.",
        },
      );
    } finally {
      setOptimizing(
        false,
      );

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    }
  }

  function remove() {
    onChange(
      null,
    );

    setOriginalSize(
      null,
    );
  }

  const savings =
    value &&
    originalSize &&
    originalSize >
      value.size
      ? Math.round(
          (1 -
            value.size /
              originalSize) *
            100,
        )
      : 0;

  return (
    <div>
      <input
        ref={
          inputRef
        }
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={
          disabled ||
          optimizing
        }
        className="hidden"
        onChange={(
          event,
        ) => {
          const file =
            event.target
              .files?.[0];

          if (file) {
            void handleFile(
              file,
            );
          }
        }}
      />

      {previewUrl ? (
        <div
          className="
            overflow-hidden

            rounded-[24px]

            border
            border-black/[0.06]

            bg-white
          "
        >
          <div
            className="
              relative

              aspect-[4/5]

              max-h-[540px]

              overflow-hidden

              bg-[#edf1ee]
            "
          >
            <img
              src={
                previewUrl
              }
              alt="Memory preview"
              className="
                size-full
                object-cover
              "
            />

            <div
              className="
                absolute
                right-3
                top-3

                flex
                gap-2
              "
            >
              <button
                type="button"
                disabled={
                  disabled
                }
                onClick={() =>
                  inputRef.current?.click()
                }
                aria-label="Change photo"
                className="
                  flex
                  size-9
                  items-center
                  justify-center

                  rounded-full

                  bg-black/40

                  text-white

                  backdrop-blur-md

                  transition

                  hover:bg-black/55
                "
              >
                <RefreshCw
                  className="
                    size-3.5
                  "
                />
              </button>

              <button
                type="button"
                disabled={
                  disabled
                }
                onClick={
                  remove
                }
                aria-label="Remove photo"
                className="
                  flex
                  size-9
                  items-center
                  justify-center

                  rounded-full

                  bg-black/40

                  text-white

                  backdrop-blur-md

                  transition

                  hover:bg-red-600
                "
              >
                <Trash2
                  className="
                    size-3.5
                  "
                />
              </button>
            </div>
          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-2

              px-4
              py-3
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5

                text-[10px]
                font-bold

                text-[#006241]
              "
            >
              <Sparkles
                className="
                  size-3
                "
              />

              Optimized WebP
            </span>

            {value && (
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-[9px]

                  text-black/35
                "
              >
                <span>
                  {formatFileSize(
                    value.size,
                  )}
                </span>

                {savings >
                  0 && (
                  <span
                    className="
                      rounded-full

                      bg-[#e8f2ed]

                      px-2
                      py-1

                      font-bold

                      text-[#006241]
                    "
                  >
                    {savings}% smaller
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={
            disabled ||
            optimizing
          }
          onClick={() =>
            inputRef.current?.click()
          }
          className="
            flex
            aspect-[4/3]
            w-full
            flex-col
            items-center
            justify-center

            rounded-[24px]

            border
            border-dashed
            border-[#006241]/20

            bg-[#f7faf8]

            px-6

            text-center

            transition-all

            hover:border-[#006241]/40
            hover:bg-[#f1f7f4]

            disabled:pointer-events-none
            disabled:opacity-60
          "
        >
          <div
            className="
              flex
              size-14
              items-center
              justify-center

              rounded-full

              bg-[#e7f1ec]

              text-[#006241]
            "
          >
            {optimizing ? (
              <LoaderCircle
                className="
                  size-5
                  animate-spin
                "
              />
            ) : (
              <ImagePlus
                className="
                  size-5
                "
              />
            )}
          </div>

          <p
            className="
              mt-4

              text-sm
              font-bold

              text-[#17211c]
            "
          >
            {optimizing
              ? "Optimizing photo..."
              : "Add one photo"}
          </p>

          <p
            className="
              mt-1.5

              max-w-xs

              text-[10px]
              leading-5

              text-black/40
            "
          >
            JPG, PNG or WebP up to
            5 MB. CAFÉTA will optimize
            your photo before upload.
          </p>
        </button>
      )}
    </div>
  );
}