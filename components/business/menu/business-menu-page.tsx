"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  Coffee,
  MapPin,
  Search,
  Store,
  Utensils,
  X,
} from "lucide-react";

type Business = {
  id: string;
  name: string;
  slug: string;
  category: string;

  description:
    | string
    | null;

  logo_url:
    | string
    | null;

  cover_url:
    | string
    | null;

  barangay:
    | string
    | null;

  city:
    | string
    | null;

  province:
    | string
    | null;

  is_verified: boolean;
};

type MenuCategory = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
};

type MenuItem = {
  id: string;
  business_id: string;

  category_id:
    | string
    | null;

  name: string;

  description:
    | string
    | null;

  price:
    | number
    | string;

  image_url:
    | string
    | null;

  is_available: boolean;

  sort_order: number;
};

type Props = {
  business: Business;

  categories:
    MenuCategory[];

  items:
    MenuItem[];
};

const ALL_CATEGORY =
  "all";

export function BusinessMenuPage({
  business,
  categories,
  items,
}: Props) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState(
      ALL_CATEGORY,
    );

  const location =
    [
      business.barangay,
      business.city,
      business.province,
    ]
      .filter(Boolean)
      .join(", ");

  const filteredItems =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return items.filter(
          (item) => {
            const categoryMatches =
              selectedCategory ===
                ALL_CATEGORY ||
              item.category_id ===
                selectedCategory;

            if (
              !categoryMatches
            ) {
              return false;
            }

            if (!query) {
              return true;
            }

            const category =
              categories.find(
                (
                  category,
                ) =>
                  category.id ===
                  item.category_id,
              );

            return [
              item.name,
              item.description,
              category?.name,
            ]
              .filter(Boolean)
              .some(
                (value) =>
                  String(
                    value,
                  )
                    .toLowerCase()
                    .includes(
                      query,
                    ),
              );
          },
        );
      },
      [
        search,
        selectedCategory,
        items,
        categories,
      ],
    );

  const visibleGroups =
    useMemo(
      () => {
        if (
          selectedCategory !==
          ALL_CATEGORY
        ) {
          const category =
            categories.find(
              (category) =>
                category.id ===
                selectedCategory,
            );

          return [
            {
              id:
                selectedCategory,

              name:
                category?.name ??
                "Menu",

              items:
                filteredItems,
            },
          ];
        }

        const groups =
          categories
            .map(
              (
                category,
              ) => ({
                id:
                  category.id,

                name:
                  category.name,

                items:
                  filteredItems.filter(
                    (item) =>
                      item.category_id ===
                      category.id,
                  ),
              }),
            )
            .filter(
              (group) =>
                group.items
                  .length >
                0,
            );

        const uncategorized =
          filteredItems.filter(
            (item) =>
              !item.category_id,
          );

        if (
          uncategorized.length >
          0
        ) {
          groups.push({
            id:
              "other",

            name:
              "Other items",

            items:
              uncategorized,
          });
        }

        return groups;
      },
      [
        categories,
        filteredItems,
        selectedCategory,
      ],
    );

  return (
    <main className="min-h-screen bg-[#f5f7f5] pb-28 md:pb-12">
      <div className="mx-auto w-full max-w-[920px]">
        <section className="relative">
          <div className="relative h-[180px] overflow-hidden bg-[#dfe8e3] sm:h-[230px] sm:rounded-b-[30px]">
            {business.cover_url ? (
              <img
                src={
                  business.cover_url
                }
                alt={`${business.name} cover`}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#dfece5] to-[#edf2ef] text-[#006241]/20">
                <Coffee className="size-12" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-black/10" />

            <Link
              href={`/business/${encodeURIComponent(
                business.slug,
              )}`}
              aria-label={`Back to ${business.name}`}
              className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-sm backdrop-blur-md transition hover:bg-black/45"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
              <BusinessLogo
                business={
                  business
                }
              />

              <div className="min-w-0 pb-1 text-white">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h1 className="truncate text-xl font-black tracking-[-0.04em] drop-shadow-sm sm:text-2xl">
                    {
                      business.name
                    }
                  </h1>

                  {business.is_verified && (
                    <BadgeCheck className="size-4 shrink-0 fill-[#1689e8] text-white" />
                  )}
                </div>

                {location && (
                  <p className="mt-1 flex items-center gap-1 text-[9px] font-medium text-white/80">
                    <MapPin className="size-3 shrink-0" />

                    <span className="truncate">
                      {location}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6">
          <section className="-mt-0 rounded-b-[24px] border-x border-b border-black/[0.05] bg-white px-4 pb-5 pt-5 shadow-[0_8px_28px_rgba(23,33,28,0.035)] sm:mt-5 sm:rounded-[24px] sm:border sm:px-6">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
                <Utensils className="size-3.5" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#006241]">
                  CAFÉTA Menu
                </p>

                <h2 className="text-lg font-black tracking-[-0.04em] text-[#17211c]">
                  What&apos;s being
                  served
                </h2>
              </div>
            </div>

            <div className="relative mt-5">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#006241]" />

              <input
                value={
                  search
                }
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder={`Search ${business.name}'s menu`}
                className="h-12 w-full rounded-[16px] border border-black/[0.07] bg-[#f7f9f7] pl-11 pr-11 text-[11px] font-medium text-[#17211c] outline-none transition placeholder:text-black/30 focus:border-[#006241]/25 focus:bg-white focus:ring-4 focus:ring-[#006241]/[0.04]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch(
                      "",
                    )
                  }
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-black/30 transition hover:bg-black/[0.05] hover:text-black/60"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <CategoryButton
                active={
                  selectedCategory ===
                  ALL_CATEGORY
                }
                label="All"
                count={
                  items.length
                }
                onClick={() =>
                  setSelectedCategory(
                    ALL_CATEGORY,
                  )
                }
              />

              {categories.map(
                (
                  category,
                ) => (
                  <CategoryButton
                    key={
                      category.id
                    }
                    active={
                      selectedCategory ===
                      category.id
                    }
                    label={
                      category.name
                    }
                    count={
                      items.filter(
                        (item) =>
                          item.category_id ===
                          category.id,
                      ).length
                    }
                    onClick={() =>
                      setSelectedCategory(
                        category.id,
                      )
                    }
                  />
                ),
              )}
            </div>
          </section>

          {visibleGroups.length >
          0 ? (
            <div className="mt-5 space-y-7">
              {visibleGroups.map(
                (
                  group,
                ) => (
                  <MenuGroup
                    key={
                      group.id
                    }
                    title={
                      group.name
                    }
                    items={
                      group.items
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyMenu
              searching={
                Boolean(
                  search.trim(),
                ) ||
                selectedCategory !==
                  ALL_CATEGORY
              }
              onReset={() => {
                setSearch(
                  "",
                );

                setSelectedCategory(
                  ALL_CATEGORY,
                );
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function CategoryButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        flex
        h-9
        shrink-0
        items-center
        gap-1.5
        rounded-full
        border
        px-3.5
        text-[10px]
        font-bold
        transition-all
        active:scale-95

        ${
          active
            ? "border-[#006241] bg-[#006241] text-white shadow-[0_5px_16px_rgba(0,98,65,0.15)]"
            : "border-black/[0.07] bg-white text-[#39433e] hover:border-[#006241]/15 hover:text-[#006241]"
        }
      `}
    >
      {label}

      <span
        className={`
          rounded-full
          px-1.5
          py-0.5
          text-[8px]

          ${
            active
              ? "bg-white/15 text-white/80"
              : "bg-black/[0.04] text-black/35"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}

function MenuGroup({
  title,
  items,
}: {
  title: string;
  items: MenuItem[];
}) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-black tracking-[-0.04em] text-[#17211c]">
            {title}
          </h2>

          <p className="mt-0.5 text-[9px] text-black/35">
            {items.length}{" "}
            {items.length ===
            1
              ? "item"
              : "items"}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(
          (item) => (
            <MenuItemCard
              key={
                item.id
              }
              item={
                item
              }
            />
          ),
        )}
      </div>
    </section>
  );
}

function MenuItemCard({
  item,
}: {
  item: MenuItem;
}) {
  return (
    <article
      className={`
        overflow-hidden
        rounded-[20px]
        border
        border-black/[0.055]
        bg-white
        shadow-[0_5px_20px_rgba(23,33,28,0.035)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_10px_28px_rgba(23,33,28,0.06)]

        ${
          item.is_available
            ? ""
            : "opacity-65"
        }
      `}
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#e9efeb]">
        {item.image_url ? (
          <img
            src={
              item.image_url
            }
            alt={
              item.name
            }
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 hover:scale-[1.025]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[#006241]/25">
            <Coffee className="size-7" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 text-[12px] font-black leading-5 text-[#17211c]">
            {
              item.name
            }
          </h3>

          <p className="shrink-0 text-[11px] font-black text-[#006241]">
            {formatPrice(
              item.price,
            )}
          </p>
        </div>

        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-[9px] leading-4 text-black/40">
            {
              item.description
            }
          </p>
        )}

        <div className="mt-3">
          {item.is_available ? (
            <span className="inline-flex rounded-full bg-[#e8f2ed] px-2 py-1 text-[8px] font-bold text-[#006241]">
              Available
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-black/[0.05] px-2 py-1 text-[8px] font-bold text-black/35">
              Currently unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function BusinessLogo({
  business,
}: {
  business: Business;
}) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  return (
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border-2 border-white bg-white text-[#006241] shadow-md sm:size-16">
      {business.logo_url &&
      !failed ? (
        <img
          src={
            business.logo_url
          }
          alt={`${business.name} logo`}
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(
              true,
            )
          }
          className="size-full object-cover"
        />
      ) : (
        <Store className="size-5" />
      )}
    </div>
  );
}

function EmptyMenu({
  searching,
  onReset,
}: {
  searching: boolean;
  onReset: () => void;
}) {
  return (
    <section className="mt-5 flex min-h-[330px] items-center justify-center rounded-[24px] border border-black/[0.055] bg-white px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
          <Coffee className="size-5" />
        </div>

        <h2 className="mt-4 text-[14px] font-black text-[#17211c]">
          {searching
            ? "No matching items"
            : "Menu coming soon"}
        </h2>

        <p className="mt-1.5 text-[10px] leading-5 text-black/35">
          {searching
            ? "Try another search or browse all menu categories."
            : "This business hasn't added menu items yet."}
        </p>

        {searching && (
          <button
            type="button"
            onClick={
              onReset
            }
            className="mt-4 h-9 rounded-full bg-[#006241] px-5 text-[9px] font-bold text-white"
          >
            View all items
          </button>
        )}
      </div>
    </section>
  );
}

function formatPrice(
  price:
    | number
    | string,
) {
  const value =
    Number(
      price,
    );

  if (
    Number.isNaN(
      value,
    )
  ) {
    return "₱0";
  }

  return new Intl.NumberFormat(
    "en-PH",
    {
      style:
        "currency",

      currency:
        "PHP",

      minimumFractionDigits:
        value %
          1 ===
        0
          ? 0
          : 2,

      maximumFractionDigits:
        2,
    },
  ).format(
    value,
  );
}