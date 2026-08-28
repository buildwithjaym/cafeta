import Link from "next/link";

import {
  ArrowRight,
  Coffee,
  Map,
  SearchX,
  Sparkles,
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
        relative
        mt-7
        flex
        min-h-[360px]
        items-center
        justify-center
        overflow-hidden

        rounded-[28px]

        border
        border-dashed
        border-black/[0.08]

        bg-white/70

        px-6
        py-12

        text-center

        shadow-[0_8px_35px_rgba(23,33,28,0.025)]

        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-500
      "
    >
      <div
        className="
          pointer-events-none

          absolute
          -left-16
          -top-20

          size-52

          rounded-full

          bg-[#006241]/[0.035]

          blur-3xl

          animate-pulse
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          -bottom-20
          -right-16

          size-56

          rounded-full

          bg-[#006241]/[0.025]

          blur-3xl

          animate-pulse
        "
      />

      <Sparkles
        className="
          pointer-events-none

          absolute
          left-[15%]
          top-[22%]

          size-3.5

          text-[#006241]/20

          animate-pulse
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          right-[17%]
          top-[28%]

          size-1.5

          rounded-full

          bg-[#006241]/20

          animate-pulse
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          bottom-[23%]
          left-[20%]

          size-1

          rounded-full

          bg-[#006241]/20

          animate-pulse
        "
      />

      <div
        className="
          relative
          z-10

          max-w-[390px]
        "
      >
        <div
          className="
            relative

            mx-auto

            flex
            size-[68px]
            items-center
            justify-center

            animate-in
            zoom-in-75
            fade-in
            duration-500
          "
        >
          <div
            className="
              absolute
              inset-0

              rounded-full

              bg-[#006241]/[0.06]

              animate-ping

              [animation-duration:3s]
            "
          />

          <div
            className="
              absolute
              inset-[7px]

              rounded-full

              bg-[#006241]/[0.05]
            "
          />

          <div
            className="
              relative

              flex
              size-12
              items-center
              justify-center

              rounded-full

              border
              border-[#006241]/10

              bg-[#e8f2ed]

              text-[#006241]

              shadow-[0_5px_18px_rgba(0,98,65,0.08)]

              transition-transform
              duration-300

              hover:scale-105
            "
          >
            {filtered ? (
              <SearchX
                className="size-5"
                strokeWidth={1.8}
              />
            ) : (
              <Coffee
                className="size-5"
                strokeWidth={1.8}
              />
            )}
          </div>
        </div>

        <div
          className="
            mt-5

            animate-in
            fade-in
            slide-in-from-bottom-2
            duration-500

            [animation-delay:80ms]
            [animation-fill-mode:both]
          "
        >
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.17em]
              text-[#006241]
            "
          >
            {filtered
              ? "Nothing matched"
              : "Discover Basilan"}
          </p>

          <h3
            className="
              mt-2

              text-xl
              font-black
              tracking-[-0.04em]
              text-[#17211c]

              sm:text-[22px]
            "
          >
            {filtered
              ? "No places found"
              : "CAFÉTA is just getting started"}
          </h3>

          <p
            className="
              mx-auto
              mt-2

              max-w-[340px]

              text-[13px]
              leading-6
              text-black/40
            "
          >
            {search ? (
              <>
                We couldn&apos;t find
                a place matching{" "}
                <span
                  className="
                    font-semibold
                    text-[#39443e]
                  "
                >
                  “{search}”
                </span>
                . Try another search
                or explore a different
                category.
              </>
            ) : filtered ? (
              "There aren't any approved places in this category yet. Try exploring another category."
            ) : (
              "There aren't any approved businesses to show yet. New local spots will appear here as CAFÉTA grows."
            )}
          </p>
        </div>

        <div
          className="
            mt-6

            flex
            flex-wrap
            items-center
            justify-center
            gap-2

            animate-in
            fade-in
            slide-in-from-bottom-2
            duration-500

            [animation-delay:160ms]
            [animation-fill-mode:both]
          "
        >
          {filtered && (
            <Link
              href="/explore"
              className="
                group

                inline-flex
                h-10
                items-center
                justify-center
                gap-1.5

                rounded-full

                bg-[#006241]

                px-4

                text-[11px]
                font-bold
                text-white

                shadow-[0_5px_15px_rgba(0,98,65,0.14)]

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#00754a]
                hover:shadow-[0_8px_20px_rgba(0,98,65,0.18)]

                active:translate-y-0
                active:scale-[0.97]
              "
            >
              Clear filters

              <ArrowRight
                className="
                  size-3.5

                  transition-transform
                  duration-200

                  group-hover:translate-x-0.5
                "
              />
            </Link>
          )}

          <Link
            href="/map"
            className="
              group

              inline-flex
              h-10
              items-center
              justify-center
              gap-1.5

              rounded-full

              border
              border-black/[0.07]

              bg-white

              px-4

              text-[11px]
              font-bold
              text-[#39443e]

              shadow-sm

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:border-[#006241]/20
              hover:bg-[#f8fbf9]
              hover:text-[#006241]
              hover:shadow-md

              active:translate-y-0
              active:scale-[0.97]
            "
          >
            <Map
              className="
                size-3.5

                transition-transform
                duration-200

                group-hover:scale-105
              "
            />

            Open map
          </Link>
        </div>

        {!filtered && (
          <div
            className="
              mt-7

              flex
              items-center
              justify-center
              gap-2

              animate-in
              fade-in
              duration-700

              [animation-delay:240ms]
              [animation-fill-mode:both]
            "
          >
            <span
              className="
                h-px
                w-6

                bg-black/[0.06]
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                text-black/25
              "
            >
              More local places
              coming soon
            </span>

            <span
              className="
                h-px
                w-6

                bg-black/[0.06]
              "
            />
          </div>
        )}
      </div>
    </div>
  );
}