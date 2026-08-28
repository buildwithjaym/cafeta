"use client";

import {
  Coffee,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  EditableMenuCategory,
  EditableMenuItem,
} from "./edit-menu-item-modal";

type Props = {
  categories: EditableMenuCategory[];

  items: EditableMenuItem[];

  onAddCategory: () => void;

  onEditCategory: (
    category: EditableMenuCategory,
  ) => void;

  onDeleteCategory: (
    category: EditableMenuCategory,
  ) => void;

  onAddItem: () => void;

  onEditItem: (
    item: EditableMenuItem,
  ) => void;

  onDeleteItem: (
    item: EditableMenuItem,
  ) => void;
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
  const groups =
    categories.map(
      (category) => ({
        category,

        items:
          items.filter(
            (item) =>
              item.category_id ===
              category.id,
          ),
      }),
    );

  const uncategorized =
    items.filter(
      (item) =>
        !item.category_id,
    );

  return (
    <div
      className="
        space-y-4
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-300
      "
    >
      <section
        className="
          rounded-[22px]
          border
          border-black/[0.055]
          bg-white
          p-5
          shadow-[0_2px_12px_rgba(23,33,28,0.035)]
          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2
              className="
                text-[17px]
                font-black
                text-[#17211c]
              "
            >
              Menu
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                text-black/35
              "
            >
              Manage categories,
              items, prices,
              photos and
              availability.
            </p>
          </div>

          <div
            className="
              flex
              gap-2
            "
          >
            <button
              type="button"
              onClick={
                onAddCategory
              }
              className="
                inline-flex
                h-9
                items-center
                gap-1.5
                rounded-full
                border
                border-black/[0.07]
                bg-[#fafbfa]
                px-4
                text-[9px]
                font-bold
                text-[#39433e]
                transition-all
                hover:-translate-y-0.5
                hover:border-[#006241]/15
                hover:text-[#006241]
              "
            >
              <Plus className="size-3.5" />

              Category
            </button>

            <button
              type="button"
              onClick={
                onAddItem
              }
              className="
                inline-flex
                h-9
                items-center
                gap-1.5
                rounded-full
                bg-[#006241]
                px-4
                text-[9px]
                font-bold
                text-white
                transition-all
                hover:-translate-y-0.5
                hover:bg-[#00754a]
              "
            >
              <Plus className="size-3.5" />

              Menu item
            </button>
          </div>
        </div>
      </section>

      {groups.map(
        ({
          category,
          items:
            categoryItems,
        }) => (
          <MenuGroup
            key={
              category.id
            }
            title={
              category.name
            }
            items={
              categoryItems
            }
            onEditTitle={() =>
              onEditCategory(
                category,
              )
            }
            onDeleteTitle={() =>
              onDeleteCategory(
                category,
              )
            }
            onEditItem={
              onEditItem
            }
            onDeleteItem={
              onDeleteItem
            }
          />
        ),
      )}

      {uncategorized.length >
        0 && (
        <MenuGroup
          title="Other items"
          items={
            uncategorized
          }
          onEditItem={
            onEditItem
          }
          onDeleteItem={
            onDeleteItem
          }
        />
      )}

      {items.length ===
        0 && (
        <section
          className="
            rounded-[22px]
            border
            border-black/[0.055]
            bg-white
            px-5
            py-14
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
              bg-[#e8f2ed]
              text-[#006241]
            "
          >
            <Coffee className="size-5" />
          </div>

          <h3
            className="
              mt-3
              text-[13px]
              font-black
              text-[#17211c]
            "
          >
            Your menu is empty
          </h3>

          <p
            className="
              mx-auto
              mt-1
              max-w-sm
              text-[10px]
              leading-4
              text-black/35
            "
          >
            Add your first menu
            item to start showing
            customers what your
            business serves.
          </p>

          <button
            type="button"
            onClick={
              onAddItem
            }
            className="
              mt-4
              inline-flex
              h-9
              items-center
              gap-1.5
              rounded-full
              bg-[#006241]
              px-4
              text-[9px]
              font-bold
              text-white
            "
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
  onEditTitle,
  onDeleteTitle,
  onEditItem,
  onDeleteItem,
}: {
  title: string;

  items: EditableMenuItem[];

  onEditTitle?: () => void;

  onDeleteTitle?: () => void;

  onEditItem: (
    item: EditableMenuItem,
  ) => void;

  onDeleteItem: (
    item: EditableMenuItem,
  ) => void;
}) {
  return (
    <section
      className="
        rounded-[22px]
        border
        border-black/[0.055]
        bg-white
        p-5
        shadow-[0_2px_12px_rgba(23,33,28,0.035)]
        sm:p-6
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <h3
            className="
              text-[14px]
              font-black
              text-[#17211c]
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-0.5
              text-[9px]
              text-black/30
            "
          >
            {items.length}{" "}
            {items.length ===
            1
              ? "item"
              : "items"}
          </p>
        </div>

        {onEditTitle && (
          <div
            className="
              flex
              gap-1
            "
          >
            <button
              type="button"
              onClick={
                onEditTitle
              }
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-full
                text-black/35
                transition
                hover:bg-[#e8f2ed]
                hover:text-[#006241]
              "
            >
              <Pencil className="size-3.5" />
            </button>

            <button
              type="button"
              onClick={
                onDeleteTitle
              }
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-full
                text-black/35
                transition
                hover:bg-red-50
                hover:text-red-600
              "
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      <div
        className="
          mt-4
          grid
          gap-2
          sm:grid-cols-2
        "
      >
        {items.map(
          (item) => (
            <MenuRow
              key={
                item.id ??
                `${item.name}-${item.sort_order}`
              }
              item={
                item
              }
              onEdit={() =>
                onEditItem(
                  item,
                )
              }
              onDelete={() =>
                onDeleteItem(
                  item,
                )
              }
            />
          ),
        )}

        {items.length ===
          0 && (
          <div
            className="
              col-span-full
              rounded-[14px]
              bg-[#fafbfa]
              px-4
              py-6
              text-center
              text-[10px]
              text-black/30
            "
          >
            No items in this
            category.
          </div>
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
  return (
    <article
      className={`
        group
        flex
        items-center
        gap-3
        rounded-[15px]
        border
        border-black/[0.055]
        bg-[#fafbfa]
        p-3
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-white
        hover:shadow-md

        ${
          item.is_available
            ? ""
            : "opacity-60"
        }
      `}
    >
      <div
        className="
          flex
          size-14
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-[11px]
          bg-[#e8f2ed]
          text-[#006241]/30
        "
      >
        {item.image_url ? (
          <img
            src={
              item.image_url
            }
            alt={
              item.name
            }
            className="
              size-full
              object-cover
            "
          />
        ) : (
          <Coffee className="size-4" />
        )}
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            truncate
            text-[11px]
            font-bold
            text-[#17211c]
          "
        >
          {item.name}
        </p>

        <p
          className="
            mt-0.5
            text-[10px]
            font-black
            text-[#006241]
          "
        >
          ₱
          {Number(
            item.price || 0,
          ).toLocaleString(
            "en-PH",
            {
              minimumFractionDigits:
                0,

              maximumFractionDigits:
                2,
            },
          )}
        </p>

        <p
          className="
            mt-0.5
            text-[8px]
            text-black/30
          "
        >
          {item.is_available
            ? "Available"
            : "Unavailable"}
        </p>
      </div>

      <div
        className="
          flex
          shrink-0
          gap-1
        "
      >
        <button
          type="button"
          onClick={
            onEdit
          }
          className="
            flex
            size-8
            items-center
            justify-center
            rounded-full
            text-black/35
            transition
            hover:bg-[#e8f2ed]
            hover:text-[#006241]
          "
        >
          <Pencil className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={
            onDelete
          }
          className="
            flex
            size-8
            items-center
            justify-center
            rounded-full
            text-black/35
            transition
            hover:bg-red-50
            hover:text-red-600
          "
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </article>
  );
}