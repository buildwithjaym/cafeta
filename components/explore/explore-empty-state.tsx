import Link from "next/link";

import {
  Coffee,
  Map,
  SearchX,
} from "lucide-react";

type Props = {
  search: string;
  filtered: boolean;
};

export function ExploreEmptyState({
  search,
  filtered,
}: Props) {
  return (
    <div
      className="
        mt-7
        flex min-h-[340px]
        items-center
        justify-center
        rounded-[28px]
        border
        border-dashed
        border-black/[0.08]
        bg-white/60
        px-6
        text-center
        animate-in
        fade-in
        duration-300
      "
    >
      <div className="max-w-sm">
        <div
          className="
            mx-auto flex
            size-14
            items-center
            justify-center
            rounded-full
            bg-[#e8f2ed]
            text-[#006241]
          "
        >
          {filtered ? (
            <SearchX className="size-5" />
          ) : (
            <Coffee className="size-5" />
          )}
        </div>

        <h3
          className="
            mt-5
            text-xl
            font-black
            tracking-[-0.035em]
            text-[#17211c]
          "
        >
          {filtered
            ? "No places found"
            : "CAFÉTA is just getting started"}
        </h3>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-black/40
          "
        >
          {search
            ? `We couldn't find a place matching “${search}”. Try another search or category.`
            : filtered
              ? "There aren't any approved places in this category yet."
              : "There aren't any approved businesses to show yet."}
        </p>

        <div
          className="
            mt-5 flex
            flex-wrap
            justify-center
            gap-2
          "
        >
          {filtered && (
            <Link
              href="/explore"
              className="
                flex h-10
                items-center
                justify-center
                rounded-full
                bg-[#006241]
                px-5
                text-xs
                font-bold
                text-white
                transition
                hover:bg-[#00754a]
              "
            >
              Clear search
            </Link>
          )}

          <Link
            href="/map"
            className="
              flex h-10
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-black/[0.07]
              bg-white
              px-5
              text-xs
              font-bold
              text-[#17211c]
              transition
              hover:border-[#006241]/20
              hover:text-[#006241]
            "
          >
            <Map className="size-3.5" />

            Open map
          </Link>
        </div>
      </div>
    </div>
  );
}