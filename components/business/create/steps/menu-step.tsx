"use client";

import {
  Coffee,
  Plus,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

import type {
  BusinessFormData,
  MenuItemDraft,
} from "@/lib/business/types";

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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006241]">
            Menu
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#17211c] sm:text-[28px]">
            Add a few favorites
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
            Give customers an idea of
            what you serve. You can
            build a more complete menu
            after your business is
            created.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#006241] px-4 text-xs font-bold text-white transition hover:bg-[#00754a] active:scale-[0.98] sm:self-auto"
        >
          <Plus className="size-3.5" />
          Add item
        </button>
      </div>

      {data.menuItems.length ===
      0 ? (
        <div className="mt-8 flex min-h-[260px] items-center justify-center rounded-[22px] border border-dashed border-black/[0.09] bg-[#fafbfa] px-6">
          <div className="max-w-sm text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#eaf3ee] text-[#006241]">
              <UtensilsCrossed className="size-5" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#17211c]">
              Your starter menu is
              empty
            </h3>

            <p className="mt-2 text-xs leading-5 text-black/40">
              Add your best-selling
              coffee, milk tea,
              pastries, or other
              customer favorites.
            </p>

            <button
              type="button"
              onClick={addItem}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[#006241] px-4 text-xs font-bold text-white"
            >
              <Plus className="size-3.5" />
              Add first item
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {data.menuItems.map(
            (item, index) => (
              <div
                key={item.id}
                className="rounded-[20px] border border-black/[0.065] bg-white p-4 transition hover:border-[#006241]/15"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#edf5f1] text-[#006241]">
                      <Coffee className="size-3.5" />
                    </div>

                    <p className="text-xs font-bold text-[#17211c]">
                      Item{" "}
                      {index + 1}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        item.id,
                      )
                    }
                    aria-label="Remove menu item"
                    className="flex size-8 items-center justify-center rounded-full text-black/30 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
                  <input
                    value={
                      item.name
                    }
                    onChange={(
                      event,
                    ) =>
                      updateItem(
                        item.id,
                        {
                          name: event
                            .target
                            .value,
                        },
                      )
                    }
                    placeholder="Item name"
                    maxLength={100}
                    className={inputClass}
                  />

                  <div className="flex h-11 items-center rounded-[13px] border border-black/[0.07] bg-[#fafbfa] px-3 focus-within:border-[#006241]/35">
                    <span className="mr-1.5 text-xs font-bold text-black/30">
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
                        updateItem(
                          item.id,
                          {
                            price:
                              event
                                .target
                                .value,
                          },
                        )
                      }
                      placeholder="0"
                      className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    value={
                      item.category
                    }
                    onChange={(
                      event,
                    ) =>
                      updateItem(
                        item.id,
                        {
                          category:
                            event
                              .target
                              .value,
                        },
                      )
                    }
                    placeholder="Category, e.g. Coffee"
                    className={inputClass}
                  />

                  <input
                    value={
                      item.description
                    }
                    onChange={(
                      event,
                    ) =>
                      updateItem(
                        item.id,
                        {
                          description:
                            event
                              .target
                              .value,
                        },
                      )
                    }
                    placeholder="Short description"
                    className={inputClass}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] leading-5 text-black/35">
        Menu is optional. Empty items
        will not be submitted.
      </p>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-[13px] border border-black/[0.07] bg-[#fafbfa] px-3.5 text-xs font-semibold text-[#17211c] outline-none transition placeholder:font-normal placeholder:text-black/25 focus:border-[#006241]/35 focus:bg-white";