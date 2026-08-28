"use client";

import {
  type ChangeEvent,
  useEffect,
  useState,
} from "react";

import {
  Camera,
  Coffee,
  ImageIcon,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  UtensilsCrossed,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  BusinessFormData,
  MenuItemDraft,
} from "@/lib/business/types";

import {
  formatFileSize,
  optimizeBusinessImage,
} from "@/lib/business/image-optimizer";

type Props = {
  data: BusinessFormData;

  updateData: (
    values: Partial<BusinessFormData>,
  ) => void;
};

export function MenuStep({
  data,
  updateData,
}: Props) {
  function addItem() {
    const item: MenuItemDraft = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
    };

    updateData({
      menuItems: [
        ...data.menuItems,
        item,
      ],
    });
  }

  function updateItem(
    id: string,
    values: Partial<MenuItemDraft>,
  ) {
    updateData({
      menuItems:
        data.menuItems.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  ...values,
                }
              : item,
        ),
    });
  }

  function removeItem(
    id: string,
  ) {
    updateData({
      menuItems:
        data.menuItems.filter(
          (item) =>
            item.id !== id,
        ),
    });
  }

  return (
    <div
      className="
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-300
      "
    >
      <div
        className="
          flex
          flex-col
          justify-between
          gap-5

          sm:flex-row
          sm:items-end
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#006241]
            "
          >
            Menu
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-black
              tracking-[-0.045em]
              text-[#17211c]

              sm:text-[28px]
            "
          >
            Add a few favorites
          </h2>

          <p
            className="
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-black/45
            "
          >
            Give customers an idea of
            what you serve. Add a photo
            to make each item easier to
            discover.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="
            flex
            h-10
            shrink-0
            items-center
            justify-center
            gap-2
            self-start

            rounded-full
            bg-[#006241]
            px-4

            text-xs
            font-bold
            text-white

            shadow-sm

            transition-all
            duration-200

            hover:-translate-y-0.5
            hover:bg-[#00754a]
            hover:shadow-md

            active:translate-y-0
            active:scale-[0.98]

            sm:self-auto
          "
        >
          <Plus className="size-3.5" />

          Add item
        </button>
      </div>

      {data.menuItems.length ===
      0 ? (
        <div
          className="
            mt-8
            flex
            min-h-[280px]
            items-center
            justify-center

            rounded-[22px]

            border
            border-dashed
            border-black/[0.09]

            bg-[#fafbfa]

            px-6
          "
        >
          <div
            className="
              max-w-sm
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                size-12
                items-center
                justify-center

                rounded-full
                bg-[#eaf3ee]
                text-[#006241]
              "
            >
              <UtensilsCrossed className="size-5" />
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-bold
                text-[#17211c]
              "
            >
              Your starter menu is
              empty
            </h3>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-black/40
              "
            >
              Add your best-selling
              coffee, milk tea,
              pastries, meals, or other
              customer favorites.
            </p>

            <button
              type="button"
              onClick={addItem}
              className="
                mt-5
                inline-flex
                h-10
                items-center
                gap-2

                rounded-full
                bg-[#006241]
                px-4

                text-xs
                font-bold
                text-white

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#00754a]

                active:translate-y-0
                active:scale-[0.98]
              "
            >
              <Plus className="size-3.5" />

              Add first item
            </button>
          </div>
        </div>
      ) : (
        <div
          className="
            mt-8
            space-y-4
          "
        >
          {data.menuItems.map(
            (
              item,
              index,
            ) => (
              <MenuItemEditor
                key={item.id}
                item={item}
                index={index}
                onUpdate={(
                  values,
                ) =>
                  updateItem(
                    item.id,
                    values,
                  )
                }
                onRemove={() =>
                  removeItem(
                    item.id,
                  )
                }
              />
            ),
          )}
        </div>
      )}

      <div
        className="
          mt-5
          flex
          items-start
          gap-2.5

          rounded-[14px]
          bg-[#f6f8f6]

          px-3.5
          py-3
        "
      >
        <Coffee
          className="
            mt-0.5
            size-3.5
            shrink-0
            text-[#006241]/70
          "
        />

        <p
          className="
            text-[11px]
            leading-5
            text-black/40
          "
        >
          Menu is optional. Each menu
          item can have one image.
          Images are optimized before
          upload, and completely empty
          items will not be submitted.
        </p>
      </div>
    </div>
  );
}

function MenuItemEditor({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: MenuItemDraft;
  index: number;

  onUpdate: (
    values: Partial<MenuItemDraft>,
  ) => void;

  onRemove: () => void;
}) {
  return (
    <div
      className="
        overflow-hidden

        rounded-[22px]

        border
        border-black/[0.065]

        bg-white

        shadow-[0_1px_2px_rgba(0,0,0,0.02)]

        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-300

        transition-all

        hover:border-[#006241]/15
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3

          border-b
          border-black/[0.05]

          bg-[#fcfdfc]

          px-4
          py-3.5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
          <div
            className="
              flex
              size-8
              shrink-0
              items-center
              justify-center

              rounded-[10px]

              bg-[#edf5f1]
              text-[#006241]
            "
          >
            <Coffee className="size-3.5" />
          </div>

          <div
            className="
              min-w-0
            "
          >
            <p
              className="
                text-xs
                font-bold
                text-[#17211c]
              "
            >
              {item.name.trim()
                ? item.name
                : `Menu item ${index + 1}`}
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                text-black/30
              "
            >
              Item {index + 1}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove menu item ${index + 1}`}
          className="
            flex
            size-8
            items-center
            justify-center

            rounded-full

            text-black/30

            transition-all
            duration-200

            hover:bg-red-50
            hover:text-red-600

            active:scale-90
          "
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div
        className="
          grid
          gap-5
          p-4

          md:grid-cols-[170px_minmax(0,1fr)]
        "
      >
        <MenuImagePicker
          item={item}
          onChange={(
            image,
          ) =>
            onUpdate({
              image,
            })
          }
        />

        <div
          className="
            min-w-0
          "
        >
          <div
            className="
              grid
              gap-3

              sm:grid-cols-[minmax(0,1fr)_120px]
            "
          >
            <Field>
              <FieldLabel>
                Item name
              </FieldLabel>

              <input
                value={
                  item.name
                }
                onChange={(
                  event,
                ) =>
                  onUpdate({
                    name:
                      event
                        .target
                        .value,
                  })
                }
                placeholder="e.g. Spanish Latte"
                maxLength={100}
                className={inputClass}
              />
            </Field>

            <Field>
              <FieldLabel>
                Price
              </FieldLabel>

              <div
                className="
                  flex
                  h-11
                  items-center

                  rounded-[13px]

                  border
                  border-black/[0.07]

                  bg-[#fafbfa]

                  px-3

                  transition

                  focus-within:border-[#006241]/35
                  focus-within:bg-white
                "
              >
                <span
                  className="
                    mr-1.5
                    text-xs
                    font-bold
                    text-black/30
                  "
                >
                  ₱
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={
                    item.price
                  }
                  onChange={(
                    event,
                  ) =>
                    onUpdate({
                      price:
                        event
                          .target
                          .value,
                    })
                  }
                  placeholder="0"
                  className="
                    min-w-0
                    flex-1
                    bg-transparent

                    text-xs
                    font-semibold
                    text-[#17211c]

                    outline-none

                    placeholder:font-normal
                    placeholder:text-black/25
                  "
                />
              </div>
            </Field>
          </div>

          <div
            className="
              mt-3
              grid
              gap-3

              sm:grid-cols-2
            "
          >
            <Field>
              <FieldLabel>
                Category
              </FieldLabel>

              <input
                value={
                  item.category
                }
                onChange={(
                  event,
                ) =>
                  onUpdate({
                    category:
                      event
                        .target
                        .value,
                  })
                }
                placeholder="e.g. Coffee"
                maxLength={80}
                className={inputClass}
              />
            </Field>

            <Field>
              <FieldLabel>
                Description
              </FieldLabel>

              <input
                value={
                  item.description
                }
                onChange={(
                  event,
                ) =>
                  onUpdate({
                    description:
                      event
                        .target
                        .value,
                  })
                }
                placeholder="Short description"
                maxLength={200}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuImagePicker({
  item,
  onChange,
}: {
  item: MenuItemDraft;

  onChange: (
    image: File | null,
  ) => void;
}) {
  const [
    preview,
    setPreview,
  ] =
    useState<string | null>(
      null,
    );

  const [
    processing,
    setProcessing,
  ] =
    useState(false);

  const [
    originalSize,
    setOriginalSize,
  ] =
    useState<number | null>(
      null,
    );

  useEffect(() => {
    if (!item.image) {
      setPreview(
        null,
      );

      setOriginalSize(
        null,
      );

      return;
    }

    const objectUrl =
      URL.createObjectURL(
        item.image,
      );

    setPreview(
      objectUrl,
    );

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [
    item.image,
  ]);

  async function handleFile(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target
        .files?.[0];

    event.target.value =
      "";

    if (!file) {
      return;
    }

    setProcessing(
      true,
    );

    try {
      const optimized =
        await optimizeBusinessImage(
          file,
          "menu",
        );

      setOriginalSize(
        file.size,
      );

      onChange(
        optimized,
      );

      toast.success(
        "Menu image ready",
        {
          description:
            optimized.size <
            file.size
              ? `Optimized from ${formatFileSize(
                  file.size,
                )} to ${formatFileSize(
                  optimized.size,
                )}.`
              : "Your image is ready to upload.",
        },
      );
    } catch (
      error
    ) {
      console.error(
        "[CAFÉTA] Failed to process menu image:",
        error,
      );

      toast.error(
        "Couldn't use this image",
        {
          description:
            error instanceof
            Error
              ? error.message
              : "Please choose another JPG, PNG, or WebP image.",
        },
      );
    } finally {
      setProcessing(
        false,
      );
    }
  }

  function removeImage() {
    onChange(
      null,
    );

    setOriginalSize(
      null,
    );
  }

  return (
    <div>
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <FieldLabel>
          Item photo
        </FieldLabel>

        <span
          className="
            text-[9px]
            font-medium
            text-black/25
          "
        >
          Optional
        </span>
      </div>

      <div
        className="
          group
          relative
          aspect-square
          w-full
          overflow-hidden

          rounded-[18px]

          border
          border-black/[0.07]

          bg-[#f5f8f6]
        "
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={
                item.name
                  ? `${item.name} preview`
                  : "Menu item preview"
              }
              className="
                size-full
                object-cover

                transition-transform
                duration-500

                group-hover:scale-[1.03]
              "
            />

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-t
                from-black/45
                via-transparent
                to-transparent

                opacity-80
              "
            />

            <button
              type="button"
              onClick={
                removeImage
              }
              disabled={
                processing
              }
              aria-label="Remove menu image"
              className="
                absolute
                right-2
                top-2

                flex
                size-8
                items-center
                justify-center

                rounded-full

                border
                border-white/20

                bg-black/45

                text-white

                shadow-sm
                backdrop-blur-md

                transition-all
                duration-200

                hover:scale-105
                hover:bg-red-600

                active:scale-90

                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              <X className="size-3.5" />
            </button>

            <label
              className="
                absolute
                inset-x-2
                bottom-2

                flex
                h-9
                cursor-pointer
                items-center
                justify-center
                gap-1.5

                rounded-[11px]

                border
                border-white/20

                bg-black/45

                px-3

                text-[10px]
                font-bold
                text-white

                backdrop-blur-md

                transition-all
                duration-200

                hover:bg-black/60
              "
            >
              <Camera className="size-3.5" />

              Change photo

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={
                  processing
                }
                onChange={(
                  event,
                ) =>
                  void handleFile(
                    event,
                  )
                }
                className="sr-only"
              />
            </label>
          </>
        ) : (
          <label
            className="
              flex
              size-full
              cursor-pointer
              flex-col
              items-center
              justify-center

              px-4
              text-center

              transition-all
              duration-200

              hover:bg-[#edf5f1]
            "
          >
            {processing ? (
              <>
                <div
                  className="
                    flex
                    size-10
                    items-center
                    justify-center

                    rounded-full

                    bg-white

                    text-[#006241]

                    shadow-sm
                  "
                >
                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />
                </div>

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
              </>
            ) : (
              <>
                <div
                  className="
                    flex
                    size-10
                    items-center
                    justify-center

                    rounded-full

                    bg-[#e5f0ea]

                    text-[#006241]

                    transition-transform
                    duration-200

                    group-hover:scale-105
                  "
                >
                  <ImageIcon className="size-[17px]" />
                </div>

                <p
                  className="
                    mt-3
                    text-[11px]
                    font-bold
                    text-[#17211c]
                  "
                >
                  Add photo
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-black/35
                  "
                >
                  JPG, PNG or WebP
                </p>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-1.5

                    text-[9px]
                    font-bold
                    text-[#006241]
                  "
                >
                  <Upload className="size-3" />

                  Choose image
                </div>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={
                processing
              }
              onChange={(
                event,
              ) =>
                void handleFile(
                  event,
                )
              }
              className="sr-only"
            />
          </label>
        )}
      </div>

      {item.image && (
        <div
          className="
            mt-2
            space-y-0.5
          "
        >
          <p
            className="
              truncate
              text-[9px]
              font-medium
              text-black/40
            "
            title={
              item.image.name
            }
          >
            {item.image.name}
          </p>

          <p
            className="
              text-[9px]
              text-black/25
            "
          >
            {originalSize &&
            originalSize !==
              item.image.size
              ? `${formatFileSize(
                  originalSize,
                )} → ${formatFileSize(
                  item.image.size,
                )}`
              : formatFileSize(
                  item.image
                    .size,
                )}
          </p>
        </div>
      )}
    </div>
  );
}

function Field({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}

function FieldLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span
      className="
        mb-1.5
        block

        text-[10px]
        font-bold
        text-[#39433e]
      "
    >
      {children}
    </span>
  );
}

const inputClass =
  "h-11 w-full rounded-[13px] border border-black/[0.07] bg-[#fafbfa] px-3.5 text-xs font-semibold text-[#17211c] outline-none transition placeholder:font-normal placeholder:text-black/25 focus:border-[#006241]/35 focus:bg-white";