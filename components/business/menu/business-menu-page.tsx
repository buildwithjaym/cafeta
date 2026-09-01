"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
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
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  barangay: string | null;
  city: string | null;
  province: string | null;
  is_verified: boolean;
};

type MenuCategory = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
};

type MenuItemVariant = {
  id: string;
  menu_item_id: string;
  name: string;
  price: number | string;
  is_available: boolean;
  sort_order: number;
};

type MenuItem = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  variants: MenuItemVariant[];
};

type Props = {
  business: Business;
  categories: MenuCategory[];
  items: MenuItem[];
};

const ALL_CATEGORY = "all";
const ITEMS_PER_PAGE = 9;

export function BusinessMenuPage({
  business,
  categories,
  items,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const location = [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");

  const categoryMap = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          category.id,
          category.name,
        ]),
      ),
    [categories],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const categoryMatches =
        selectedCategory === ALL_CATEGORY ||
        item.category_id === selectedCategory;

      if (!categoryMatches) {
        return false;
      }

      if (!query) {
        return true;
      }

      const categoryName = categoryMap.get(
        item.category_id ?? "",
      );

      return [
        item.name,
        item.description,
        categoryName,
        ...item.variants.map(
          (variant) => variant.name,
        ),
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query),
        );
    });
  }, [
    items,
    search,
    selectedCategory,
    categoryMap,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredItems.length / ITEMS_PER_PAGE,
    ),
  );

  const paginatedItems = useMemo(() => {
    const start =
      (page - 1) * ITEMS_PER_PAGE;

    return filteredItems.slice(
      start,
      start + ITEMS_PER_PAGE,
    );
  }, [
    filteredItems,
    page,
  ]);

  const visibleCategories = useMemo(() => {
    if (selectedCategory !== ALL_CATEGORY) {
      const category = categories.find(
        (item) =>
          item.id === selectedCategory,
      );

      return category
        ? [category]
        : [];
    }

    return categories.filter(
      (category) =>
        filteredItems.some(
          (item) =>
            item.category_id === category.id,
        ),
    );
  }, [
    categories,
    filteredItems,
    selectedCategory,
  ]);

  function changeCategory(
    category: string,
  ) {
    setSelectedCategory(category);
    setPage(1);
  }

  function changeSearch(
    value: string,
  ) {
    setSearch(value);
    setPage(1);
  }

  function openItem(
    item: MenuItem,
  ) {
    setSelectedItem(item);
  }

  function closeItem() {
    setSelectedItem(null);
  }

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        closeItem();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [selectedItem]);

  return (
    <>
      <main className="min-h-screen bg-[#f5f7f5] pb-24">
        <div className="mx-auto w-full max-w-[1080px]">
          <MenuHero
            business={business}
            location={location}
          />

          <div className="px-4 sm:px-6">
            <section className="mt-5 rounded-[24px] border border-black/[0.055] bg-white p-4 shadow-[0_8px_28px_rgba(23,33,28,0.035)] sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
                  <Utensils className="size-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#006241]">
                    Digital Menu
                  </p>

                  <h2 className="mt-0.5 text-lg font-black tracking-[-0.04em] text-[#17211c]">
                    Browse the menu
                  </h2>
                </div>

                <span className="ml-auto hidden rounded-full bg-[#f2f5f3] px-3 py-1.5 text-[9px] font-bold text-black/40 sm:inline-flex">
                  {items.length}{" "}
                  {items.length === 1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <div className="relative mt-5">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#006241]" />

                <input
                  value={search}
                  onChange={(event) =>
                    changeSearch(
                      event.target.value,
                    )
                  }
                  placeholder={`Search ${business.name}'s menu`}
                  className="h-12 w-full rounded-[16px] border border-black/[0.07] bg-[#f7f9f7] pl-11 pr-11 text-[11px] font-medium text-[#17211c] outline-none transition placeholder:text-black/30 focus:border-[#006241]/25 focus:bg-white focus:ring-4 focus:ring-[#006241]/[0.04]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      changeSearch("")
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
                  count={items.length}
                  onClick={() =>
                    changeCategory(
                      ALL_CATEGORY,
                    )
                  }
                />

                {categories.map(
                  (category) => (
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
                        changeCategory(
                          category.id,
                        )
                      }
                    />
                  ),
                )}
              </div>
            </section>

            {filteredItems.length > 0 ? (
              <section className="mt-7">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#006241]">
                      {selectedCategory ===
                      ALL_CATEGORY
                        ? "Menu"
                        : categoryMap.get(
                            selectedCategory,
                          ) ?? "Menu"}
                    </p>

                    <h2 className="mt-1 text-xl font-black tracking-[-0.045em] text-[#17211c]">
                      {search
                        ? "Search results"
                        : "Choose something you like"}
                    </h2>
                  </div>

                  {filteredItems.length >
                    ITEMS_PER_PAGE && (
                    <p className="shrink-0 text-[9px] font-medium text-black/35">
                      Page {page} of{" "}
                      {totalPages}
                    </p>
                  )}
                </div>

                {visibleCategories.length >
                  0 &&
                  selectedCategory ===
                    ALL_CATEGORY && (
                    <div className="mb-4 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {visibleCategories.map(
                        (category) => (
                          <span
                            key={
                              category.id
                            }
                            className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[8px] font-bold text-black/40 ring-1 ring-black/[0.05]"
                          >
                            {
                              category.name
                            }
                          </span>
                        ),
                      )}
                    </div>
                  )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedItems.map(
                    (item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        categoryName={
                          categoryMap.get(
                            item.category_id ??
                              "",
                          )
                        }
                        onClick={() =>
                          openItem(
                            item,
                          )
                        }
                      />
                    ),
                  )}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    page={page}
                    totalPages={
                      totalPages
                    }
                    onPrevious={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current -
                              1,
                          ),
                      )
                    }
                    onNext={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current +
                              1,
                          ),
                      )
                    }
                  />
                )}
              </section>
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
                  changeSearch("");
                  changeCategory(
                    ALL_CATEGORY,
                  );
                }}
              />
            )}
          </div>
        </div>
      </main>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          categoryName={categoryMap.get(
            selectedItem.category_id ??
              "",
          )}
          onClose={closeItem}
        />
      )}
    </>
  );
}

function MenuHero({
  business,
  location,
}: {
  business: Business;
  location: string;
}) {
  return (
    <section className="relative">
      <div className="relative h-[200px] overflow-hidden bg-[#dfe8e3] sm:h-[260px] sm:rounded-b-[32px]">
        {business.cover_url ? (
          <img
            src={business.cover_url}
            alt={`${business.name} cover`}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#dfece5] to-[#edf2ef] text-[#006241]/20">
            <Coffee className="size-14" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/10" />

        <Link
          href={`/business/${encodeURIComponent(
            business.slug,
          )}`}
          aria-label={`Back to ${business.name}`}
          className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-sm backdrop-blur-md transition hover:bg-black/45"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div className="absolute bottom-5 left-4 right-4 flex items-end gap-3 sm:left-6 sm:right-6">
          <BusinessLogo business={business} />

          <div className="min-w-0 pb-1 text-white">
            <div className="flex min-w-0 items-center gap-1.5">
              <h1 className="truncate text-xl font-black tracking-[-0.04em] drop-shadow-sm sm:text-2xl">
                {business.name}
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
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[10px] font-bold transition-all active:scale-95 ${active ? "border-[#006241] bg-[#006241] text-white shadow-[0_5px_16px_rgba(0,98,65,0.15)]" : "border-black/[0.07] bg-white text-[#39433e] hover:border-[#006241]/15 hover:text-[#006241]"}`}
    >
      {label}

      <span className={`rounded-full px-1.5 py-0.5 text-[8px] ${active ? "bg-white/15 text-white/80" : "bg-black/[0.04] text-black/35"}`}>
        {count}
      </span>
    </button>
  );
}

function MenuItemCard({
  item,
  categoryName,
  onClick,
}: {
  item: MenuItem;
  categoryName?: string;
  onClick: () => void;
}) {
  const availableVariants =
    item.variants.filter(
      (variant) =>
        variant.is_available,
    );

  const hasVariants =
    item.variants.length > 0;

  const displayPrice =
    hasVariants
      ? getPriceRange(
          item.variants,
        )
      : formatPrice(item.price);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group overflow-hidden rounded-[22px] border border-black/[0.055] bg-white text-left shadow-[0_5px_20px_rgba(23,33,28,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(23,33,28,0.09)] focus:outline-none focus:ring-4 focus:ring-[#006241]/[0.08] ${item.is_available ? "" : "opacity-70"}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e9efeb]">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#edf5f1] to-[#dcebe3] text-[#006241]/25">
            <Coffee className="size-8" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent opacity-70" />

        {!item.is_available && (
          <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1.5 text-[8px] font-bold text-white backdrop-blur-sm">
            Currently unavailable
          </span>
        )}

        <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black text-[#006241] shadow-sm backdrop-blur-sm">
          {hasVariants
            ? displayPrice
            : formatPrice(
                item.price,
              )}
        </span>
      </div>

      <div className="p-4">
        {categoryName && (
          <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#006241]">
            {categoryName}
          </p>
        )}

        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-black tracking-[-0.025em] text-[#17211c]">
            {item.name}
          </h3>

          {hasVariants && (
            <span className="shrink-0 rounded-full bg-[#edf5f1] px-2 py-1 text-[7px] font-bold text-[#006241]">
              {availableVariants.length}{" "}
              {availableVariants.length ===
              1
                ? "option"
                : "sizes"}
            </span>
          )}
        </div>

        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-[9px] leading-4 text-black/40">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[8px] font-bold text-black/30">
            {hasVariants
              ? "Choose your size"
              : "Tap to view"}
          </span>

          <span className="text-[8px] font-bold text-[#006241]">
            View details
          </span>
        </div>
      </div>
    </button>
  );
}

function MenuItemModal({
  item,
  categoryName,
  onClose,
}: {
  item: MenuItem;
  categoryName?: string;
  onClose: () => void;
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const availableVariants =
    useMemo(
      () =>
        item.variants
          .filter(
            (variant) =>
              variant.is_available,
          )
          .sort(
            (a, b) =>
              a.sort_order -
              b.sort_order,
          ),
      [item.variants],
    );

  const [selectedVariantId, setSelectedVariantId] =
    useState<string | null>(
      availableVariants[0]?.id ??
        null,
    );

  useEffect(() => {
    setSelectedVariantId(
      availableVariants[0]?.id ??
        null,
    );
  }, [item.id, availableVariants]);

  const selectedVariant =
    availableVariants.find(
      (variant) =>
        variant.id ===
        selectedVariantId,
    );

  const hasVariants =
    item.variants.length > 0;

  const displayPrice =
    selectedVariant
      ? formatPrice(
          selectedVariant.price,
        )
      : formatPrice(item.price);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-0 backdrop-blur-md animate-in fade-in duration-200 sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="relative max-h-[94dvh] w-full max-w-[680px] overflow-y-auto rounded-t-[30px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] animate-in slide-in-from-bottom-5 duration-300 sm:rounded-[30px] sm:slide-in-from-bottom-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu item"
          className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-black/55 active:scale-95"
        >
          <X className="size-4" />
        </button>

        <div className="relative h-[310px] w-full overflow-hidden bg-[#dfe8e3] sm:h-[390px]">
          {item.image_url &&
          !imageFailed ? (
            <>
              <img
                src={item.image_url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 size-full scale-110 object-cover opacity-35 blur-2xl"
              />

              <div className="absolute inset-0 bg-black/10" />

              <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-7">
                <img
                  src={item.image_url}
                  alt={item.name}
                  onError={() =>
                    setImageFailed(
                      true,
                    )
                  }
                  decoding="async"
                  className="size-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.22)] transition-transform duration-500"
                />
              </div>
            </>
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#edf5f1] to-[#dcebe3] text-[#006241]/25">
              <Coffee className="size-14" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

          <div className="absolute bottom-5 left-5 right-14 sm:bottom-6 sm:left-7 sm:right-16">
            {categoryName && (
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/75">
                {categoryName}
              </p>
            )}

            <h2 className="mt-1 text-2xl font-black tracking-[-0.045em] text-white drop-shadow-sm sm:text-3xl">
              {item.name}
            </h2>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#006241]">
                Menu item
              </p>

              <p className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#006241] sm:text-[28px]">
                {displayPrice}
              </p>
            </div>

            {item.is_available ? (
              <span className="shrink-0 rounded-full bg-[#e8f2ed] px-3 py-1.5 text-[8px] font-bold text-[#006241]">
                Available
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-black/[0.05] px-3 py-1.5 text-[8px] font-bold text-black/35">
                Currently unavailable
              </span>
            )}
          </div>

          {hasVariants && (
            <div className="mt-6 border-t border-black/[0.06] pt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.13em] text-black/30">
                    Choose your size
                  </p>

                  <p className="mt-1 text-[10px] text-black/35">
                    Select an available option.
                  </p>
                </div>

                <span className="rounded-full bg-[#edf5f1] px-2.5 py-1 text-[8px] font-bold text-[#006241]">
                  {availableVariants.length}{" "}
                  options
                </span>
              </div>

              <div className="mt-4 grid gap-2">
                {item.variants
                  .slice()
                  .sort(
                    (a, b) =>
                      a.sort_order -
                      b.sort_order,
                  )
                  .map(
                    (variant) => {
                      const isSelected =
                        variant.id ===
                        selectedVariantId;

                      return (
                        <button
                          key={
                            variant.id
                          }
                          type="button"
                          disabled={
                            !variant.is_available
                          }
                          onClick={() =>
                            setSelectedVariantId(
                              variant.id,
                            )
                          }
                          className={`flex min-h-[52px] items-center justify-between gap-4 rounded-[15px] border px-4 text-left transition-all ${!variant.is_available ? "cursor-not-allowed border-black/[0.05] bg-black/[0.025] opacity-45" : isSelected ? "border-[#006241] bg-[#edf5f1] shadow-[0_5px_18px_rgba(0,98,65,0.08)]" : "border-black/[0.07] bg-white hover:border-[#006241]/25 hover:bg-[#f8fbf9]"}`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${isSelected ? "bg-[#006241] text-white" : "bg-[#f1f4f2] text-black/25"}`}>
                              {isSelected ? (
                                <Check className="size-3.5" />
                              ) : (
                                <span className="size-2 rounded-full bg-current" />
                              )}
                            </span>

                            <div className="min-w-0">
                              <p className={`truncate text-[11px] font-black ${isSelected ? "text-[#006241]" : "text-[#17211c]"}`}>
                                {
                                  variant.name
                                }
                              </p>

                              {!variant.is_available && (
                                <p className="mt-0.5 text-[8px] font-medium text-black/35">
                                  Currently unavailable
                                </p>
                              )}
                            </div>
                          </div>

                          <span className={`shrink-0 text-[11px] font-black ${isSelected ? "text-[#006241]" : "text-[#17211c]"}`}>
                            {formatPrice(
                              variant.price,
                            )}
                          </span>
                        </button>
                      );
                    },
                  )}
              </div>
            </div>
          )}

          {item.description && (
            <div className={`${hasVariants ? "mt-5" : "mt-5"} border-t border-black/[0.06] pt-5`}>
              <p className="text-[10px] font-black uppercase tracking-[0.13em] text-black/30">
                About this item
              </p>

              <p className="mt-2 text-[12px] leading-6 text-black/55 sm:text-[13px] sm:leading-6">
                {item.description}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#006241] text-[10px] font-bold text-white transition-all hover:bg-[#00754a] active:scale-[0.99]"
          >
            <ArrowLeft className="size-3.5" />
            Back to menu
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-7 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={page === 1}
        className="flex size-10 items-center justify-center rounded-full border border-black/[0.07] bg-white text-black/45 transition hover:border-[#006241]/20 hover:text-[#006241] disabled:pointer-events-none disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div className="flex h-10 items-center rounded-full border border-black/[0.06] bg-white px-4 text-[9px] font-bold text-black/45">
        {page} / {totalPages}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={
          page === totalPages
        }
        className="flex size-10 items-center justify-center rounded-full border border-black/[0.07] bg-white text-black/45 transition hover:border-[#006241]/20 hover:text-[#006241] disabled:pointer-events-none disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

function BusinessLogo({
  business,
}: {
  business: Business;
}) {
  const [failed, setFailed] =
    useState(false);

  return (
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border-2 border-white bg-white text-[#006241] shadow-md sm:size-16">
      {business.logo_url &&
      !failed ? (
        <img
          src={business.logo_url}
          alt={`${business.name} logo`}
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(true)
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
    <section className="mt-6 flex min-h-[330px] items-center justify-center rounded-[24px] border border-black/[0.055] bg-white px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
          <Coffee className="size-5" />
        </div>

        <h2 className="mt-4 text-[15px] font-black text-[#17211c]">
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
            onClick={onReset}
            className="mt-4 h-9 rounded-full bg-[#006241] px-5 text-[9px] font-bold text-white transition hover:bg-[#00754a]"
          >
            View all items
          </button>
        )}
      </div>
    </section>
  );
}

function getPriceRange(
  variants: MenuItemVariant[],
) {
  const prices = variants
    .map((variant) =>
      Number(variant.price),
    )
    .filter(
      (price) =>
        !Number.isNaN(price),
    );

  if (!prices.length) {
    return "View price";
  }

  const minimum = Math.min(
    ...prices,
  );

  const maximum = Math.max(
    ...prices,
  );

  if (minimum === maximum) {
    return formatPrice(
      minimum,
    );
  }

  return `${formatPrice(minimum)} – ${formatPrice(maximum)}`;
}

function formatPrice(
  price: number | string,
) {
  const value = Number(price);

  if (Number.isNaN(value)) {
    return "₱0";
  }

  return new Intl.NumberFormat(
    "en-PH",
    {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits:
        value % 1 === 0
          ? 0
          : 2,
      maximumFractionDigits: 2,
    },
  ).format(value);
}