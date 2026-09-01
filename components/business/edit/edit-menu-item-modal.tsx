"use client";

import type { ReactNode } from "react";

import {
  ChevronDown,
  Coffee,
  FolderOpen,
  LoaderCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { ImageUpload } from "./image-upload";

export type EditableMenuCategory = {
  id: string;
  name: string;
  sort_order: number;
};

export type EditableMenuVariant = {
  id?: string;
  name: string;
  price: string;
  is_available: boolean;
  sort_order: number;
};

export type EditableMenuItem = {
  id?: string;
  category_id: string | null;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  variants: EditableMenuVariant[];
};

type Props = {
  open: boolean;
  item: EditableMenuItem;
  categories: EditableMenuCategory[];
  saving: boolean;
  onChange: (item: EditableMenuItem) => void;
  onImageChange: (file: File | null) => void;
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

  const selectedCategory = categories.find(
    (category) => category.id === item.category_id,
  );

  const hasVariants = item.variants.length > 0;

  const canSave =
    Boolean(item.name.trim()) &&
    (hasVariants
      ? item.variants.every(
          (variant) =>
            variant.name.trim() &&
            variant.price !== "" &&
            Number(variant.price) >= 0,
        )
      : item.price !== "" && Number(item.price) >= 0);

  function updateVariants(variants: EditableMenuVariant[]) {
    onChange({
      ...item,
      variants,
      price: variants[0]?.price ?? item.price,
    });
  }

  function addVariant() {
    const nextSortOrder = item.variants.length;

    updateVariants([
      ...item.variants,
      {
        name: "",
        price: "",
        is_available: true,
        sort_order: nextSortOrder,
      },
    ]);
  }

  function updateVariant(
    index: number,
    values: Partial<EditableMenuVariant>,
  ) {
    updateVariants(
      item.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, ...values }
          : variant,
      ),
    );
  }

  function removeVariant(index: number) {
    updateVariants(
      item.variants
        .filter((_, variantIndex) => variantIndex !== index)
        .map((variant, sort_order) => ({
          ...variant,
          sort_order,
        })),
    );
  }

  function togglePricingMode() {
    if (hasVariants) {
      const first = item.variants[0];

      onChange({
        ...item,
        price: first?.price ?? item.price,
        variants: [],
      });

      return;
    }

    const initialPrice = item.price.trim();

    onChange({
      ...item,
      variants: [
        {
          name: "Regular",
          price: initialPrice,
          is_available: item.is_available,
          sort_order: 0,
        },
      ],
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[3px] animate-in fade-in duration-200 sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[94dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-t-[26px] bg-white shadow-2xl animate-in slide-in-from-bottom-4 zoom-in-95 duration-200 sm:rounded-[26px]">
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-black/[0.06] bg-white/95 px-5 py-4 backdrop-blur-xl">
          <div className="min-w-0 pr-4">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#006241]">
              Business menu
            </p>
            <h2 className="mt-0.5 text-[16px] font-black text-[#17211c]">
              {item.id ? "Edit menu item" : "Add menu item"}
            </h2>
            <p className="mt-0.5 text-[9px] text-black/35">
              One item can have one price or several options.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-black/45 transition hover:bg-black/[0.07] hover:text-[#17211c] active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-5">
            <ImageUpload
              label="Menu photo"
              description="Use one clear photo for the item. Pricing options share this image."
              preset="menu"
              aspect="square"
              currentUrl={item.image_url}
              onChange={onImageChange}
            />

            <Field
              label="Item name"
              description="Use the name customers will see on the menu."
            >
              <input
                value={item.name}
                onChange={(event) =>
                  onChange({
                    ...item,
                    name: event.target.value,
                  })
                }
                placeholder="e.g. Matcha Latte"
                className={inputClass}
              />
            </Field>

            <Field
              label="Menu category"
              description="Choose where this item belongs on your public menu."
            >
              {categories.length > 0 ? (
                <>
                  <div className="relative">
                    <FolderOpen className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#006241]" />
                    <select
                      value={item.category_id ?? ""}
                      onChange={(event) =>
                        onChange({
                          ...item,
                          category_id: event.target.value || null,
                        })
                      }
                      className={`${inputClass} appearance-none pl-11 pr-11`}
                    >
                      <option value="">Other / No category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />
                  </div>

                  {selectedCategory ? (
                    <div className="mt-2 flex items-center gap-2 rounded-[12px] bg-[#edf5f1] px-3 py-2">
                      <Coffee className="size-3 text-[#006241]" />
                      <p className="text-[9px] font-semibold text-[#006241]">
                        Appears under{" "}
                        <span className="font-black">
                          {selectedCategory.name}
                        </span>
                        .
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-[9px] text-black/35">
                      This item will appear under Other items.
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
                        You can save this item without a category.
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
                value={item.description}
                onChange={(event) =>
                  onChange({
                    ...item,
                    description: event.target.value,
                  })
                }
                rows={4}
                placeholder="e.g. Premium matcha blended with fresh milk."
                className={`${inputClass} min-h-[110px] resize-none py-3`}
              />
            </Field>

            <section className="rounded-[18px] border border-black/[0.06] bg-[#fafbfa] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black text-[#17211c]">
                    Pricing
                  </p>
                  <p className="mt-0.5 text-[9px] leading-4 text-black/35">
                    Add sizes or options when the same item has different prices.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={togglePricingMode}
                  className="shrink-0 rounded-full bg-[#e8f2ed] px-3 py-1.5 text-[9px] font-black text-[#006241] transition hover:bg-[#dcece4]"
                >
                  {hasVariants ? "Use one price" : "Add options"}
                </button>
              </div>

              {!hasVariants ? (
                <div className="mt-4">
                  <div className="flex h-12 items-center overflow-hidden rounded-[14px] border border-black/[0.07] bg-white focus-within:border-[#006241]/25 focus-within:ring-4 focus-within:ring-[#006241]/[0.04]">
                    <span className="flex h-full items-center border-r border-black/[0.05] px-4 text-[12px] font-bold text-[#006241]">
                      ₱
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={item.price}
                      onChange={(event) =>
                        onChange({
                          ...item,
                          price: event.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="h-full min-w-0 flex-1 bg-transparent px-4 text-[12px] font-semibold text-[#17211c] outline-none"
                    />
                  </div>
                  <p className="mt-2 text-[9px] text-black/30">
                    Example: Iced Americano — ₱89
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {item.variants.map((variant, index) => (
                    <div
                      key={variant.id ?? `variant-${index}`}
                      className="rounded-[14px] border border-black/[0.06] bg-white p-3 animate-in fade-in slide-in-from-bottom-1 duration-200"
                    >
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px_auto] sm:items-center">
                        <input
                          value={variant.name}
                          onChange={(event) =>
                            updateVariant(index, {
                              name: event.target.value,
                            })
                          }
                          placeholder="Size or option, e.g. Medium"
                          className={smallInputClass}
                        />

                        <div className="flex h-10 items-center overflow-hidden rounded-[11px] border border-black/[0.07] bg-[#fafbfa] focus-within:border-[#006241]/25">
                          <span className="px-3 text-[10px] font-bold text-[#006241]">
                            ₱
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={variant.price}
                            onChange={(event) =>
                              updateVariant(index, {
                                price: event.target.value,
                              })
                            }
                            placeholder="0.00"
                            className="h-full min-w-0 flex-1 bg-transparent px-2 text-[11px] font-semibold text-[#17211c] outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          aria-label={`Remove ${variant.name || "option"}`}
                          className="flex size-10 shrink-0 items-center justify-center rounded-full text-black/30 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-[9px] font-medium text-black/40">
                          <input
                            type="checkbox"
                            checked={variant.is_available}
                            onChange={(event) =>
                              updateVariant(index, {
                                is_available: event.target.checked,
                              })
                            }
                            className="size-3.5 accent-[#006241]"
                          />
                          Available
                        </label>
                        <span className="text-[8px] text-black/25">
                          {index + 1} of {item.variants.length}
                        </span>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#006241]/20 bg-[#f7faf8] text-[9px] font-black text-[#006241] transition hover:border-[#006241]/35 hover:bg-[#edf5f1]"
                  >
                    <Plus className="size-3.5" />
                    Add pricing option
                  </button>

                  <p className="text-[9px] leading-4 text-black/30">
                    Example: 40 ml ₱49 · Medium ₱69 · Large ₱99. All options use the same photo.
                  </p>
                </div>
              )}
            </section>

            <div className="flex items-center justify-between gap-4 rounded-[16px] border border-black/[0.055] bg-[#fafbfa] p-4">
              <div>
                <p className="text-[11px] font-bold text-[#17211c]">
                  Item available
                </p>
                <p className="mt-0.5 text-[9px] leading-4 text-black/35">
                  Turn this off when the entire item is unavailable.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={item.is_available}
                onClick={() =>
                  onChange({
                    ...item,
                    is_available: !item.is_available,
                  })
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                  item.is_available ? "bg-[#006241]" : "bg-black/10"
                }`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    item.is_available ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex shrink-0 justify-end gap-2 border-t border-black/[0.06] bg-white/95 px-5 py-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-10 rounded-full border border-black/[0.07] px-5 text-[10px] font-bold text-[#39433e] transition hover:bg-black/[0.03]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving || !canSave}
            className="inline-flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-full bg-[#006241] px-5 text-[10px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00754a] disabled:pointer-events-none disabled:opacity-45"
          >
            {saving && <LoaderCircle className="size-3.5 animate-spin" />}
            {saving ? "Saving..." : item.id ? "Save changes" : "Add item"}
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
      <span className="text-[10px] font-bold text-[#39433e]">{label}</span>
      {description && (
        <span className="mt-0.5 block text-[9px] leading-4 text-black/35">
          {description}
        </span>
      )}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass = "h-12 w-full rounded-[14px] border border-black/[0.07] bg-[#fafbfa] px-4 text-[12px] font-medium text-[#17211c] outline-none transition-all duration-200 placeholder:text-black/20 focus:border-[#006241]/25 focus:bg-white focus:ring-4 focus:ring-[#006241]/[0.04]";

const smallInputClass = "h-10 w-full rounded-[11px] border border-black/[0.07] bg-[#fafbfa] px-3 text-[11px] font-medium text-[#17211c] outline-none transition-all duration-200 placeholder:text-black/20 focus:border-[#006241]/25 focus:bg-white";
