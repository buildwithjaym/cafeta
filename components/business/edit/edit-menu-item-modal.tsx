"use client";

import type {
  ReactNode,
} from "react";

import {
  ChevronDown,
  Coffee,
  FolderOpen,
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

  categories:
    EditableMenuCategory[];

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

  const selectedCategory =
    categories.find(
      (
        category,
      ) =>
        category.id ===
        item.category_id,
    );

  const canSave =
    Boolean(
      item.name.trim(),
    ) &&
    item.price !==
      "" &&
    Number(
      item.price,
    ) >=
      0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[3px] animate-in fade-in duration-200 sm:items-center sm:p-5"
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
      <div className="max-h-[92dvh] w-full max-w-[600px] overflow-y-auto rounded-t-[26px] bg-white shadow-2xl animate-in slide-in-from-bottom-4 zoom-in-95 duration-200 sm:rounded-[26px]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.06] bg-white/95 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#006241]">
              Business menu
            </p>

            <h2 className="mt-0.5 text-[16px] font-black text-[#17211c]">
              {item.id
                ? "Edit menu item"
                : "Add menu item"}
            </h2>

            <p className="mt-0.5 text-[9px] text-black/35">
              This information appears
              on your public menu.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-full bg-black/[0.04] text-black/45 transition hover:bg-black/[0.07] hover:text-[#17211c]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <ImageUpload
            label="Menu photo"
            description="Add a clear photo so customers can recognize the item."
            preset="menu"
            aspect="square"
            currentUrl={
              item.image_url
            }
            onChange={
              onImageChange
            }
          />

          <Field
            label="Item name"
            description="Use the name customers will see on the menu."
          >
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
                    event.target
                      .value,
                })
              }
              placeholder="e.g. Matcha Latte"
              className={
                inputClass
              }
            />
          </Field>

          <Field
            label="Menu category"
            description="Choose where this item belongs on your public menu."
          >
            {categories.length >
            0 ? (
              <>
                <div className="relative">
                  <FolderOpen className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#006241]" />

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
                          event.target
                            .value ||
                          null,
                      })
                    }
                    className={`${inputClass} appearance-none pl-11 pr-11`}
                  >
                    <option value="">
                      Other / No category
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

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />
                </div>

                {selectedCategory ? (
                  <div className="mt-2 flex items-center gap-2 rounded-[12px] bg-[#edf5f1] px-3 py-2">
                    <Coffee className="size-3 text-[#006241]" />

                    <p className="text-[9px] font-semibold text-[#006241]">
                      This item will appear
                      under{" "}
                      <span className="font-black">
                        {
                          selectedCategory.name
                        }
                      </span>
                      .
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-[9px] text-black/35">
                    This item will appear
                    under Other items.
                  </p>
                )}
              </>
            ) : (
              <div className="rounded-[15px] border border-dashed border-[#006241]/20 bg-[#f6faf8] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
                    <FolderOpen className="size-3.5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#17211c]">
                      No categories yet
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-black/40">
                      You can save this
                      item without a
                      category, or close
                      this window and add
                      categories such as
                      Coffee, Food,
                      Pastries, or
                      Desserts.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Field>

          <Field
            label="Description"
            description="Briefly describe the item, flavor, ingredients, or serving."
          >
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
                    event.target
                      .value,
                })
              }
              rows={4}
              placeholder="e.g. Premium matcha blended with fresh milk."
              className={`${inputClass} min-h-[110px] resize-none py-3`}
            />
          </Field>

          <Field
            label="Price"
            description="Enter the current menu price."
          >
            <div className="flex h-12 items-center overflow-hidden rounded-[14px] border border-black/[0.07] bg-[#fafbfa] focus-within:border-[#006241]/25 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006241]/[0.04]">
              <span className="flex h-full items-center border-r border-black/[0.05] px-4 text-[12px] font-bold text-[#006241]">
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
                  onChange({
                    ...item,

                    price:
                      event.target
                        .value,
                  })
                }
                placeholder="0.00"
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-[12px] font-semibold text-[#17211c] outline-none"
              />
            </div>
          </Field>

          <div className="flex items-center justify-between gap-4 rounded-[16px] border border-black/[0.055] bg-[#fafbfa] p-4">
            <div>
              <p className="text-[11px] font-bold text-[#17211c]">
                Currently available
              </p>

              <p className="mt-0.5 text-[9px] leading-4 text-black/35">
                Turn this off when the
                item is temporarily
                unavailable.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={
                item.is_available
              }
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
                shrink-0
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

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-black/[0.06] bg-white/95 px-5 py-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="h-10 rounded-full border border-black/[0.07] px-5 text-[10px] font-bold text-[#39433e] transition hover:bg-black/[0.03]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              onSave
            }
            disabled={
              saving ||
              !canSave
            }
            className="inline-flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-full bg-[#006241] px-5 text-[10px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00754a] disabled:pointer-events-none disabled:opacity-45"
          >
            {saving && (
              <LoaderCircle className="size-3.5 animate-spin" />
            )}

            {saving
              ? "Saving..."
              : item.id
                ? "Save changes"
                : "Add item"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-[#39433e]">
        {label}
      </span>

      {description && (
        <span className="mt-0.5 block text-[9px] leading-4 text-black/35">
          {description}
        </span>
      )}

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