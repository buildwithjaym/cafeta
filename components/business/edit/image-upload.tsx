"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  Camera,
  Check,
  ImagePlus,
  LoaderCircle,
  RefreshCcw,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import {
  formatFileSize,
  optimizeBusinessImage,
  type BusinessImageKind,
} from "@/lib/business/image-optimizer";

type ImageInfo = {
  originalSize: number;
  optimizedSize: number;
  savingsPercentage: number;
};

type Props = {
  label: string;

  description?: string;

  preset: BusinessImageKind;

  currentUrl?: string | null;

  aspect?: "cover" | "square";

  onChange: (
    file: File | null,
  ) => void;
};

export function ImageUpload({
  label,
  description,
  preset,
  currentUrl,
  aspect = "square",
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const objectUrlRef =
    useRef<string | null>(
      null,
    );

  const [
    preview,
    setPreview,
  ] = useState<
    string | null
  >(currentUrl ?? null);

  const [
    imageInfo,
    setImageInfo,
  ] = useState<
    ImageInfo | null
  >(null);

  const [
    processing,
    setProcessing,
  ] = useState(false);

  useEffect(() => {
    setPreview(
      currentUrl ?? null,
    );
  }, [currentUrl]);

  useEffect(() => {
    return () => {
      if (
        objectUrlRef.current
      ) {
        URL.revokeObjectURL(
          objectUrlRef.current,
        );
      }
    };
  }, []);

  function openPicker() {
    if (processing) {
      return;
    }

    inputRef.current?.click();
  }

  async function handleFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target
        .files?.[0];

    event.target.value =
      "";

    if (!file) {
      return;
    }

    setProcessing(true);

    try {
      const optimizedFile =
        await optimizeBusinessImage(
          file,
          preset,
        );

      if (
        objectUrlRef.current
      ) {
        URL.revokeObjectURL(
          objectUrlRef.current,
        );
      }

      const objectUrl =
        URL.createObjectURL(
          optimizedFile,
        );

      objectUrlRef.current =
        objectUrl;

      const savingsPercentage =
        file.size > 0
          ? Math.max(
              0,
              Math.round(
                (1 -
                  optimizedFile.size /
                    file.size) *
                  100,
              ),
            )
          : 0;

      setPreview(
        objectUrl,
      );

      setImageInfo({
        originalSize:
          file.size,

        optimizedSize:
          optimizedFile.size,

        savingsPercentage,
      });

      onChange(
        optimizedFile,
      );

      toast.success(
        savingsPercentage >
          0
          ? `Image optimized ${savingsPercentage}% smaller.`
          : "Image ready to upload.",
      );
    } catch (error) {
      console.error(
        "[CAFÉTA] Image optimization failed:",
        error,
      );

      toast.error(
        error instanceof
          Error
          ? error.message
          : "Could not process the image.",
      );
    } finally {
      setProcessing(false);
    }
  }

  function removeImage() {
    if (
      objectUrlRef.current
    ) {
      URL.revokeObjectURL(
        objectUrlRef.current,
      );

      objectUrlRef.current =
        null;
    }

    setPreview(null);

    setImageInfo(null);

    onChange(null);
  }

  return (
    <div>
      <div
        className="
          mb-2
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-[12px]
              font-bold
              text-[#17211c]
            "
          >
            {label}
          </p>

          {description && (
            <p
              className="
                mt-0.5
                text-[10px]
                leading-4
                text-black/35
              "
            >
              {description}
            </p>
          )}
        </div>

        {imageInfo && (
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
              text-[9px]
              font-bold
              text-[#006241]

              animate-in
              fade-in
              slide-in-from-right-1
              duration-300
            "
          >
            <Check className="size-3" />

            Optimized
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="
          image/jpeg,
          image/png,
          image/webp
        "
        onChange={
          handleFile
        }
        className="hidden"
      />

      {preview ? (
        <div
          className={`
            group
            relative
            overflow-hidden
            border
            border-black/[0.06]
            bg-[#e8eeeb]

            animate-in
            fade-in
            zoom-in-95
            duration-300

            ${
              aspect ===
              "cover"
                ? `
                  aspect-[16/7]
                  w-full
                  rounded-[20px]
                `
                : `
                  aspect-square
                  w-full
                  max-w-[220px]
                  rounded-[22px]
                `
            }
          `}
        >
          <img
            src={preview}
            alt={label}
            className="
              size-full
              object-cover

              transition-transform
              duration-500
              ease-out

              group-hover:scale-[1.02]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/50
              via-black/5
              to-transparent
            "
          />

          {processing && (
            <div
              className="
                absolute
                inset-0
                z-20
                flex
                items-center
                justify-center
                bg-black/35
                backdrop-blur-[2px]

                animate-in
                fade-in
                duration-200
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-4
                  py-2.5
                  text-[10px]
                  font-bold
                  text-[#17211c]
                  shadow-xl
                "
              >
                <LoaderCircle
                  className="
                    size-3.5
                    animate-spin
                    text-[#006241]
                  "
                />

                Optimizing...
              </div>
            </div>
          )}

          {!processing && (
            <div
              className="
                absolute
                bottom-3
                left-3
                right-3
                z-10

                flex
                items-center
                justify-between
                gap-2
              "
            >
              <button
                type="button"
                onClick={
                  openPicker
                }
                className="
                  inline-flex
                  h-9
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-4
                  text-[10px]
                  font-bold
                  text-[#17211c]
                  shadow-lg

                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#f8faf9]

                  active:translate-y-0
                  active:scale-[0.98]
                "
              >
                <RefreshCcw className="size-3.5" />

                Change
              </button>

              <button
                type="button"
                onClick={
                  removeImage
                }
                className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  bg-black/55
                  text-white
                  shadow-lg
                  backdrop-blur-md

                  transition-all
                  duration-200

                  hover:scale-105
                  hover:bg-red-600

                  active:scale-95
                "
                aria-label={`Remove ${label}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={
            openPicker
          }
          disabled={
            processing
          }
          className={`
            group
            flex
            flex-col
            items-center
            justify-center
            border
            border-dashed
            border-black/10
            bg-[#fafbfa]
            text-center

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-[#006241]/25
            hover:bg-[#f5faf7]
            hover:shadow-sm

            disabled:pointer-events-none
            disabled:opacity-60

            ${
              aspect ===
              "cover"
                ? `
                  aspect-[16/7]
                  w-full
                  rounded-[20px]
                `
                : `
                  aspect-square
                  w-full
                  max-w-[220px]
                  rounded-[22px]
                `
            }
          `}
        >
          {processing ? (
            <>
              <LoaderCircle
                className="
                  size-6
                  animate-spin
                  text-[#006241]
                "
              />

              <p
                className="
                  mt-3
                  text-[11px]
                  font-bold
                  text-[#17211c]
                "
              >
                Optimizing...
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-black/30
                "
              >
                Preparing your
                image
              </p>
            </>
          ) : (
            <>
              <div
                className="
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-full
                  bg-[#e8f2ed]
                  text-[#006241]

                  transition-all
                  duration-300

                  group-hover:scale-105
                  group-hover:bg-[#deeee6]
                "
              >
                {aspect ===
                "cover" ? (
                  <ImagePlus className="size-5" />
                ) : (
                  <Camera className="size-5" />
                )}
              </div>

              <p
                className="
                  mt-3
                  text-[11px]
                  font-bold
                  text-[#17211c]
                "
              >
                Choose image
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-black/30
                "
              >
                JPG, PNG or WebP
                · Max 5 MB
              </p>
            </>
          )}
        </button>
      )}

      {imageInfo && (
        <div
          className="
            mt-3
            grid
            max-w-[420px]
            grid-cols-2
            gap-2

            animate-in
            fade-in
            slide-in-from-top-1
            duration-300
          "
        >
          <div
            className="
              rounded-[12px]
              bg-black/[0.025]
              px-3
              py-2.5
            "
          >
            <p
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-black/25
              "
            >
              Original
            </p>

            <p
              className="
                mt-1
                text-[10px]
                font-bold
                text-[#39433e]
              "
            >
              {formatFileSize(
                imageInfo.originalSize,
              )}
            </p>
          </div>

          <div
            className="
              rounded-[12px]
              bg-[#edf5f1]
              px-3
              py-2.5
            "
          >
            <p
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-[#006241]/60
              "
            >
              Optimized
            </p>

            <p
              className="
                mt-1
                text-[10px]
                font-bold
                text-[#006241]
              "
            >
              {formatFileSize(
                imageInfo.optimizedSize,
              )}
            </p>

            {imageInfo.savingsPercentage >
              0 && (
              <p
                className="
                  mt-0.5
                  text-[8px]
                  font-medium
                  text-[#006241]/55
                "
              >
                {
                  imageInfo.savingsPercentage
                }
                % smaller
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}