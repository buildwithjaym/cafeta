"use client";

import {
  LoaderCircle,
  X,
} from "lucide-react";

import {
  ImageUpload,
} from "./image-upload";

export type EditableMenuCategory = {
  id: string;
  name: string;
  sort_order: number;
};

export type EditableMenuItem = {
  id?: string;

  category_id:
    | string
    | null;

  name: string;

  description: string;

  price: string;

  image_url:
    | string
    | null;

  is_available: boolean;

  sort_order: number;
};

type Props = {
  open: boolean;

  item: EditableMenuItem;

  categories: EditableMenuCategory[];

  saving: boolean;

  onChange: (
    item: EditableMenuItem,
  ) => void;

  onImageChange: (
    file: File | null,
  ) => void;

  onClose: () => void;

  onSave: () => void;
};

export function EditMenuItemModal({
  open,
  item,
  categories,
  saving,
  onChange,
  onImageChange,
  onClose,
  onSave,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/45
        p-0
        backdrop-blur-[3px]
        animate-in
        fade-in
        duration-200
        sm:items-center
        sm:p-5
      "
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          max-h-[92vh]
          w-full
          max-w-[600px]
          overflow-y-auto
          rounded-t-[26px]
          bg-white
          shadow-2xl
          animate-in
          slide-in-from-bottom-4
          zoom-in-95
          duration-200
          sm:rounded-[26px]
        "
      >
        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-black/[0.06]
            bg-white/95
            px-5
            py-4
            backdrop-blur-xl
          "
        >
          <div>
            <h2
              className="
                text-[16px]
                font-black
                text-[#17211c]
              "
            >
              {item.id
                ? "Edit menu item"
                : "Add menu item"}
            </h2>

            <p
              className="
                mt-0.5
                text-[9px]
                text-black/35
              "
            >
              Update the item
              customers see on
              your menu.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-full
              bg-black/[0.04]
              text-black/45
              transition
              hover:bg-black/[0.07]
              hover:text-[#17211c]
            "
          >
            <X className="size-4" />
          </button>
        </div>

        <div
          className="
            space-y-5
            p-5
          "
        >
          <ImageUpload
            label="Menu photo"
            description="Optimized automatically before upload."
            preset="menu"
            aspect="square"
            currentUrl={
              item.image_url
            }
            onChange={
              onImageChange
            }
          />

          <Field label="Item name">
            <input
              value={
                item.name
              }
              onChange={(
                event,
              ) =>
                onChange({
                  ...item,
                  name:
                    event
                      .target
                      .value,
                })
              }
              placeholder="Iced Spanish Latte"
              className={
                inputClass
              }
            />
          </Field>

          <Field label="Category">
            <select
              value={
                item.category_id ??
                ""
              }
              onChange={(
                event,
              ) =>
                onChange({
                  ...item,

                  category_id:
                    event
                      .target
                      .value ||
                    null,
                })
              }
              className={
                inputClass
              }
            >
              <option value="">
                No category
              </option>

              {categories.map(
                (
                  category,
                ) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field label="Description">
            <textarea
              value={
                item.description
              }
              onChange={(
                event,
              ) =>
                onChange({
                  ...item,

                  description:
                    event
                      .target
                      .value,
                })
              }
              rows={4}
              placeholder="Describe this item..."
              className={`
                ${inputClass}
                min-h-[110px]
                resize-none
                py-3
              `}
            />
          </Field>

          <Field label="Price">
            <div
              className="
                flex
                h-12
                items-center
                overflow-hidden
                rounded-[14px]
                border
                border-black/[0.07]
                bg-[#fafbfa]
                focus-within:border-[#006241]/25
                focus-within:bg-white
                focus-within:ring-4
                focus-within:ring-[#006241]/[0.04]
              "
            >
              <span
                className="
                  flex
                  h-full
                  items-center
                  border-r
                  border-black/[0.05]
                  px-4
                  text-[12px]
                  font-bold
                  text-[#006241]
                "
              >
                ₱
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  item.price
                }
                onChange={(
                  event,
                ) =>
                  onChange({
                    ...item,

                    price:
                      event
                        .target
                        .value,
                  })
                }
                placeholder="0.00"
                className="
                  h-full
                  min-w-0
                  flex-1
                  bg-transparent
                  px-4
                  text-[12px]
                  font-semibold
                  text-[#17211c]
                  outline-none
                "
              />
            </div>
          </Field>

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              rounded-[16px]
              border
              border-black/[0.055]
              bg-[#fafbfa]
              p-4
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-bold
                  text-[#17211c]
                "
              >
                Available
              </p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  text-black/35
                "
              >
                Customers can
                currently order
                this item.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...item,

                  is_available:
                    !item.is_available,
                })
              }
              className={`
                relative
                h-7
                w-12
                rounded-full
                transition-colors
                duration-200

                ${
                  item.is_available
                    ? "bg-[#006241]"
                    : "bg-black/10"
                }
              `}
            >
              <span
                className={`
                  absolute
                  top-1
                  size-5
                  rounded-full
                  bg-white
                  shadow-sm
                  transition-all
                  duration-200

                  ${
                    item.is_available
                      ? "left-7"
                      : "left-1"
                  }
                `}
              />
            </button>
          </div>
        </div>

        <div
          className="
            sticky
            bottom-0
            flex
            justify-end
            gap-2
            border-t
            border-black/[0.06]
            bg-white/95
            px-5
            py-4
            backdrop-blur-xl
          "
        >
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="
              h-10
              rounded-full
              border
              border-black/[0.07]
              px-5
              text-[10px]
              font-bold
              text-[#39433e]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              onSave
            }
            disabled={
              saving
            }
            className="
              inline-flex
              h-10
              min-w-[120px]
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#006241]
              px-5
              text-[10px]
              font-bold
              text-white
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#00754a]
              disabled:pointer-events-none
              disabled:opacity-60
            "
          >
            {saving && (
              <LoaderCircle className="size-3.5 animate-spin" />
            )}

            {saving
              ? "Saving..."
              : "Save item"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="
          text-[10px]
          font-bold
          text-[#39433e]
        "
      >
        {label}
      </span>

      <div className="mt-2">
        {children}
      </div>
    </label>
  );
}

const inputClass = `
  h-12
  w-full
  rounded-[14px]
  border
  border-black/[0.07]
  bg-[#fafbfa]
  px-4
  text-[12px]
  font-medium
  text-[#17211c]
  outline-none
  transition-all
  duration-200
  placeholder:text-black/20
  focus:border-[#006241]/25
  focus:bg-white
  focus:ring-4
  focus:ring-[#006241]/[0.04]
`;