"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

type BusinessCategory =
  | "coffee_shop"
  | "milk_tea"
  | "cafe"
  | "bakery";

type Props = {
  search: string;

  category:
    | BusinessCategory
    | null;
};

const categories: {
  label: string;
  value:
    | BusinessCategory
    | null;
}[] = [
  {
    label: "All",
    value: null,
  },
  {
    label: "Coffee",
    value: "coffee_shop",
  },
  {
    label: "Milk Tea",
    value: "milk_tea",
  },
  {
    label: "Café",
    value: "cafe",
  },
  {
    label: "Bakery",
    value: "bakery",
  },
];

export function ExploreControls({
  search,
  category,
}: Props) {
  const router =
    useRouter();

  const [value, setValue] =
    useState(search);

  function navigate(
    nextSearch: string,
    nextCategory:
      | BusinessCategory
      | null,
  ) {
    const params =
      new URLSearchParams();

    const normalizedSearch =
      nextSearch.trim();

    if (normalizedSearch) {
      params.set(
        "q",
        normalizedSearch,
      );
    }

    if (nextCategory) {
      params.set(
        "category",
        nextCategory,
      );
    }

    const query =
      params.toString();

    router.push(
      query
        ? `/explore?${query}`
        : "/explore",
    );
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    navigate(
      value,
      category,
    );
  }

  function clearSearch() {
    setValue("");

    navigate(
      "",
      category,
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="
          flex max-w-3xl
          items-center
          rounded-2xl
          border
          border-black/[0.08]
          bg-[#fafaf7]
          p-1.5
          shadow-[0_10px_35px_rgba(0,0,0,0.04)]
          transition-all
          duration-200
          focus-within:border-[#006241]/20
          focus-within:bg-white
          focus-within:shadow-[0_14px_40px_rgba(0,0,0,0.07)]
          focus-within:ring-4
          focus-within:ring-[#006241]/[0.035]
          sm:rounded-full
        "
      >
        <div
          className="
            flex min-w-0
            flex-1
            items-center
          "
        >
          <Search
            className="
              ml-4
              size-[18px]
              shrink-0
              text-[#006241]
            "
          />

          <input
            type="search"
            value={value}
            onChange={(
              event,
            ) =>
              setValue(
                event.target
                  .value,
              )
            }
            placeholder="Search coffee, milk tea, or a place..."
            className="
              h-11
              min-w-0
              flex-1
              bg-transparent
              px-3
              text-sm
              text-[#17211c]
              outline-none
              placeholder:text-black/30
            "
          />

          {value && (
            <button
              type="button"
              onClick={
                clearSearch
              }
              aria-label="Clear search"
              className="
                mr-1 flex
                size-8
                shrink-0
                items-center
                justify-center
                rounded-full
                text-black/30
                transition
                hover:bg-black/[0.05]
                hover:text-black/60
              "
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          aria-label="More filters"
          className="
            flex size-11
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-black/[0.07]
            bg-white
            text-[#17211c]
            transition-all
            duration-200
            hover:border-[#006241]/25
            hover:text-[#006241]
            active:scale-95
          "
        >
          <SlidersHorizontal className="size-4" />
        </button>

        <button
          type="submit"
          className="
            ml-1 hidden
            h-11
            items-center
            justify-center
            rounded-full
            bg-[#006241]
            px-6
            text-sm
            font-bold
            text-white
            transition-all
            duration-200
            hover:bg-[#00754a]
            active:scale-[0.97]
            sm:flex
          "
        >
          Search
        </button>
      </form>

      <div
        className="
          mt-5 flex
          gap-2
          overflow-x-auto
          pb-1
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {categories.map(
          (item) => {
            const active =
              category ===
              item.value;

            return (
              <button
                key={
                  item.label
                }
                type="button"
                aria-pressed={
                  active
                }
                onClick={() =>
                  navigate(
                    value,
                    item.value,
                  )
                }
                className={`
                  shrink-0
                  rounded-full
                  border
                  px-4 py-2
                  text-xs
                  font-bold
                  transition-all
                  duration-200
                  active:scale-95

                  ${
                    active
                      ? "border-[#006241] bg-[#006241] text-white shadow-[0_5px_16px_rgba(0,98,65,0.14)]"
                      : "border-black/[0.07] bg-white text-black/55 hover:border-[#006241]/25 hover:text-[#006241]"
                  }
                `}
              >
                {item.label}
              </button>
            );
          },
        )}
      </div>
    </>
  );
}