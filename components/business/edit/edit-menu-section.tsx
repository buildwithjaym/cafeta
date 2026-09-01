"use client";

import {
  Coffee,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  EditableMenuCategory,
  EditableMenuItem,
} from "./edit-menu-item-modal";

type Props = {
  categories: EditableMenuCategory[];
  items: EditableMenuItem[];
  onAddCategory: () => void;
  onEditCategory: (category: EditableMenuCategory) => void;
  onDeleteCategory: (category: EditableMenuCategory) => void;
  onAddItem: () => void;
  onEditItem: (item: EditableMenuItem) => void;
  onDeleteItem: (item: EditableMenuItem) => void;
};

export function EditMenuSection({
  categories,
  items,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: Props) {
  const groups = categories.map((category) => ({
    category,
    items: items.filter((item) => item.category_id === category.id),
  }));

  const uncategorized = items.filter((item) => !item.category_id);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section className="rounded-[22px] border border-black/[0.055] bg-white p-5 shadow-[0_2px_12px_rgba(23,33,28,0.035)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
                <Coffee className="size-3.5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#006241]">
                  Public menu
                </p>
                <h2 className="text-[17px] font-black text-[#17211c]">
                  Menu
                </h2>
              </div>
            </div>
            <p className="mt-3 max-w-lg text-[10px] leading-5 text-black/40">
              Manage categories, menu items, photos, availability, and pricing options. One item can have multiple sizes without duplicating its photo.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onAddCategory}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/[0.07] bg-[#fafbfa] px-4 text-[9px] font-bold text-[#39433e] transition-all hover:-translate-y-0.5 hover:border-[#006241]/15 hover:text-[#006241] active:scale-95"
            >
              <Plus className="size-3.5" />
              Category
            </button>
            <button
              type="button"
              onClick={onAddItem}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#006241] px-4 text-[9px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#00754a] active:scale-95"
            >
              <Plus className="size-3.5" />
              Menu item
            </button>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="mt-5 border-t border-black/[0.05] pt-4">
            <p className="text-[9px] font-bold text-black/35">
              Your menu categories
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((category) => {
                const count = items.filter(
                  (item) => item.category_id === category.id,
                ).length;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onEditCategory(category)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#006241]/10 bg-[#f2f7f4] px-3 text-[9px] font-bold text-[#006241] transition hover:border-[#006241]/25 hover:bg-[#e8f2ed]"
                  >
                    {category.name}
                    <span className="rounded-full bg-white px-1.5 py-0.5 text-[7px] text-black/35">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-[16px] border border-dashed border-[#006241]/15 bg-[#f7faf8] p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
                <Coffee className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#17211c]">
                  Start with categories
                </p>
                <p className="mt-1 text-[9px] leading-4 text-black/40">
                  Create categories such as Coffee, Milk Tea, Food, Pastries, or Desserts.
                </p>
                <button
                  type="button"
                  onClick={onAddCategory}
                  className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-[#006241] px-3.5 text-[8px] font-bold text-white"
                >
                  <Plus className="size-3" />
                  Create first category
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {groups.map(({ category, items: categoryItems }) => (
        <MenuGroup
          key={category.id}
          title={category.name}
          items={categoryItems}
          onAddItem={onAddItem}
          onEditTitle={() => onEditCategory(category)}
          onDeleteTitle={() => onDeleteCategory(category)}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      ))}

      {uncategorized.length > 0 && (
        <MenuGroup
          title="Other items"
          items={uncategorized}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      )}

      {items.length === 0 && (
        <section className="rounded-[22px] border border-black/[0.055] bg-white px-5 py-14 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
            <Coffee className="size-5" />
          </div>
          <h3 className="mt-3 text-[13px] font-black text-[#17211c]">
            Your menu is empty
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-[10px] leading-4 text-black/35">
            Add your first menu item to start showing customers what your business serves.
          </p>
          <button
            type="button"
            onClick={onAddItem}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-[#006241] px-4 text-[9px] font-bold text-white"
          >
            <Plus className="size-3.5" />
            Add first item
          </button>
        </section>
      )}
    </div>
  );
}

function MenuGroup({
  title,
  items,
  onAddItem,
  onEditTitle,
  onDeleteTitle,
  onEditItem,
  onDeleteItem,
}: {
  title: string;
  items: EditableMenuItem[];
  onAddItem: () => void;
  onEditTitle?: () => void;
  onDeleteTitle?: () => void;
  onEditItem: (item: EditableMenuItem) => void;
  onDeleteItem: (item: EditableMenuItem) => void;
}) {
  return (
    <section className="rounded-[22px] border border-black/[0.055] bg-white p-5 shadow-[0_2px_12px_rgba(23,33,28,0.035)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-black text-[#17211c]">{title}</h3>
          <p className="mt-0.5 text-[9px] text-black/30">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={onAddItem}
            aria-label={`Add item to ${title}`}
            className="flex size-8 items-center justify-center rounded-full text-[#006241] transition hover:bg-[#e8f2ed]"
          >
            <Plus className="size-3.5" />
          </button>

          {onEditTitle && (
            <>
              <button
                type="button"
                onClick={onEditTitle}
                aria-label={`Edit ${title}`}
                className="flex size-8 items-center justify-center rounded-full text-black/35 transition hover:bg-[#e8f2ed] hover:text-[#006241]"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={onDeleteTitle}
                aria-label={`Delete ${title}`}
                className="flex size-8 items-center justify-center rounded-full text-black/35 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <MenuRow
            key={item.id ?? `${item.name}-${item.sort_order}`}
            item={item}
            onEdit={() => onEditItem(item)}
            onDelete={() => onDeleteItem(item)}
          />
        ))}

        {items.length === 0 && (
          <button
            type="button"
            onClick={onAddItem}
            className="col-span-full rounded-[14px] border border-dashed border-black/[0.07] bg-[#fafbfa] px-4 py-6 text-center transition hover:border-[#006241]/15 hover:bg-[#f7faf8]"
          >
            <Plus className="mx-auto size-4 text-[#006241]" />
            <span className="mt-1.5 block text-[9px] font-bold text-black/35">
              Add an item to this category
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

function MenuRow({
  item,
  onEdit,
  onDelete,
}: {
  item: EditableMenuItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const hasVariants = item.variants.length > 0;

  const variantPrices = item.variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));

  const minVariantPrice = Math.min(...variantPrices);
  const maxVariantPrice = Math.max(...variantPrices);

  const priceLabel = hasVariants
    ? variantPrices.length === 0
      ? "Add prices"
      : minVariantPrice === maxVariantPrice
        ? formatPrice(minVariantPrice)
        : `${formatPrice(minVariantPrice)} – ${formatPrice(maxVariantPrice)}`
    : formatPrice(item.price);

  return (
    <article
      className={`group flex items-center gap-3 rounded-[15px] border border-black/[0.055] bg-[#fafbfa] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md ${
        item.is_available ? "" : "opacity-60"
      }`}
    >
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-[#e8f2ed] text-[#006241]/30">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="size-full object-cover" />
        ) : (
          <Coffee className="size-4" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-bold text-[#17211c]">
          {item.name}
        </p>

        <p className="mt-0.5 text-[10px] font-black text-[#006241]">
          {hasVariants ? "From " : ""}
          {priceLabel}
        </p>

        <p className="mt-0.5 text-[8px] text-black/30">
          {hasVariants
            ? `${item.variants.length} pricing ${item.variants.length === 1 ? "option" : "options"}`
            : item.is_available
              ? "Available"
              : "Unavailable"}
        </p>
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${item.name}`}
          className="flex size-8 items-center justify-center rounded-full text-black/35 transition hover:bg-[#e8f2ed] hover:text-[#006241]"
        >
          <Pencil className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${item.name}`}
          className="flex size-8 items-center justify-center rounded-full text-black/35 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </article>
  );
}

function formatPrice(value: string | number) {
  const price = Number(value || 0);

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}
