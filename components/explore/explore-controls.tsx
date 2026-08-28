"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Coffee,
  Search,
  Store,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

type BusinessCategory =
  | "coffee_shop"
  | "cafe"
  | "milk_tea"
  | "bakery_cafe"
  | "restaurant_cafe"
  | "other";

type Props = {
  search: string;

  category:
    | BusinessCategory
    | null;
};

const categories: {
  value:
    | BusinessCategory
    | null;
  label: string;
}[] = [
  {
    value: null,
    label: "All",
  },
  {
    value: "coffee_shop",
    label: "Coffee",
  },
  {
    value: "cafe",
    label: "Cafés",
  },
  {
    value: "milk_tea",
    label: "Milk Tea",
  },
  {
    value: "bakery_cafe",
    label: "Bakery",
  },
  {
    value: "restaurant_cafe",
    label: "Restaurant Café",
  },
];

export function ExploreControls({
  search,
  category,
}: Props) {
  const router =
    useRouter();

  const [
    query,
    setQuery,
  ] = useState(search);

  function buildUrl(
    nextSearch: string,
    nextCategory:
      | BusinessCategory
      | null,
  ) {
    const params =
      new URLSearchParams();

    const cleanedSearch =
      nextSearch.trim();

    if (cleanedSearch) {
      params.set(
        "q",
        cleanedSearch,
      );
    }

    if (nextCategory) {
      params.set(
        "category",
        nextCategory,
      );
    }

    const queryString =
      params.toString();

    return queryString
      ? `/explore?${queryString}`
      : "/explore";
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    router.push(
      buildUrl(
        query,
        category,
      ),
    );
  }

  function handleCategory(
    nextCategory:
      | BusinessCategory
      | null,
  ) {
    router.push(
      buildUrl(
        query,
        nextCategory,
      ),
    );
  }

  function clearSearch() {
    setQuery("");

    router.push(
      buildUrl(
        "",
        category,
      ),
    );
  }

  return (
    <div
      className="
        w-full
        max-w-[900px]
      "
    >
      <form
        onSubmit={
          handleSubmit
        }
        className="
          group

          flex
          h-14
          items-center
          gap-3

          rounded-[18px]

          border
          border-black/[0.07]

          bg-white

          px-4

          shadow-[0_8px_30px_rgba(0,0,0,0.05)]

          transition-all
          duration-200

          focus-within:border-[#006241]/20
          focus-within:shadow-[0_10px_35px_rgba(0,98,65,0.08)]

          sm:h-16
          sm:rounded-[22px]
          sm:px-5
        "
      >
        <Search
          className="
            size-[19px]
            shrink-0

            text-[#17211c]/50

            transition-colors

            group-focus-within:text-[#006241]
          "
        />

        <input
          type="search"
          value={query}
          onChange={(
            event,
          ) => {
            setQuery(
              event.target
                .value,
            );
          }}
          placeholder="Search cafés, milk tea, or places..."
          className="
            min-w-0
            flex-1

            bg-transparent

            text-sm
            font-medium
            text-[#17211c]

            outline-none

            placeholder:font-normal
            placeholder:text-black/30

            sm:text-[15px]
          "
        />

        {query && (
          <button
            type="button"
            onClick={
              clearSearch
            }
            aria-label="Clear search"
            className="
              flex
              size-8
              shrink-0
              items-center
              justify-center

              rounded-full

              text-black/30

              transition-all
              duration-200

              hover:bg-black/[0.04]
              hover:text-[#17211c]
            "
          >
            <X className="size-4" />
          </button>
        )}

        <button
          type="submit"
          className="
            flex
            h-9
            shrink-0
            items-center
            justify-center

            rounded-full

            bg-[#006241]

            px-4

            text-[11px]
            font-bold
            text-white

            transition-all
            duration-200

            hover:bg-[#00754a]

            active:scale-[0.97]

            sm:h-10
            sm:px-5
            sm:text-xs
          "
        >
          Search
        </button>
      </form>

      <div
        className="
          mt-4

          flex
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
                  item.value ??
                  "all"
                }
                type="button"
                onClick={() => {
                  handleCategory(
                    item.value,
                  );
                }}
                className={`
                  flex
                  h-10
                  shrink-0
                  items-center
                  gap-2

                  rounded-full

                  border

                  px-4

                  text-[11px]
                  font-bold

                  transition-all
                  duration-200

                  active:scale-[0.97]

                  ${
                    active
                      ? `
                        border-[#006241]
                        bg-[#006241]
                        text-white
                        shadow-[0_5px_16px_rgba(0,98,65,0.15)]
                      `
                      : `
                        border-black/[0.06]
                        bg-white
                        text-[#39433e]

                        hover:border-[#006241]/20
                        hover:bg-[#edf5f1]
                        hover:text-[#006241]
                      `
                  }
                `}
              >
                <CategoryIcon
                  category={
                    item.value
                  }
                />

                {item.label}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

function CategoryIcon({
  category,
}: {
  category:
    | BusinessCategory
    | null;
}) {
  switch (category) {
    case "coffee_shop":
    case "cafe":
      return (
        <Coffee className="size-3.5" />
      );

    case "milk_tea":
      return (
        <span
          className="
            text-[13px]
            leading-none
          "
        >
          ◇
        </span>
      );

    case "bakery_cafe":
      return (
        <span
          className="
            text-[12px]
            leading-none
          "
        >
          ♨
        </span>
      );

    case "restaurant_cafe":
      return (
        <Store className="size-3.5" />
      );

    default:
      return (
        <Coffee className="size-3.5" />
      );
  }
}