"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Coffee,
  LoaderCircle,
  MapPin,
  Search,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  category: string;
  barangay: string | null;
  city: string | null;
  logo_url: string | null;
};

export function NavbarSearch() {
  const router = useRouter();

  const containerRef =
    useRef<HTMLDivElement>(null);

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<SearchResult[]>([]);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setOpen(false);
      }

      if (
        event.key === "/" &&
        document.activeElement?.tagName !==
          "INPUT" &&
        document.activeElement?.tagName !==
          "TEXTAREA"
      ) {
        event.preventDefault();

        const input =
          containerRef.current?.querySelector(
            "input",
          );

        input?.focus();
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  useEffect(() => {
    const searchTerm =
      query.trim();

    if (searchTerm.length < 2) {
      setResults([]);
      setLoading(false);
      setError(false);
      return;
    }

    const timeout = window.setTimeout(
      async () => {
        setLoading(true);
        setError(false);

        const supabase =
          createClient();

        const safeSearch =
          searchTerm.replace(
            /[%_,]/g,
            "",
          );

        const {
          data,
          error: searchError,
        } = await supabase
          .from("businesses")
          .select(`
            id,
            name,
            slug,
            category,
            barangay,
            city,
            logo_url
          `)
          .eq(
            "status",
            "approved",
          )
          .or(
            [
              `name.ilike.%${safeSearch}%`,
              `barangay.ilike.%${safeSearch}%`,
              `city.ilike.%${safeSearch}%`,
              `address.ilike.%${safeSearch}%`,
            ].join(","),
          )
          .order("is_verified", {
            ascending: false,
          })
          .order("name", {
            ascending: true,
          })
          .limit(5);

        if (searchError) {
          console.error(
            "CAFÉTA navbar search:",
            searchError,
          );

          setResults([]);
          setError(true);
        } else {
          setResults(
            (data ??
              []) as SearchResult[],
          );
        }

        setLoading(false);
      },
      300,
    );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [query]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const searchTerm =
      query.trim();

    if (!searchTerm) {
      router.push("/explore");
      setOpen(false);
      return;
    }

    router.push(
      `/explore?q=${encodeURIComponent(
        searchTerm,
      )}`,
    );

    setOpen(false);
  }

  function clearSearch() {
    setQuery("");
    setResults([]);
    setError(false);
  }

  const hasQuery =
    query.trim().length > 0;

  const canSearch =
    query.trim().length >= 2;

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <form
        onSubmit={handleSubmit}
        className={`
          flex h-10 w-[240px]
          items-center gap-2.5
          rounded-full border
          px-3.5
          transition-all
          duration-200
          ${
            open
              ? "border-[#006241]/20 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-4 ring-[#006241]/[0.04]"
              : "border-black/[0.06] bg-[#f6f7f5] hover:border-[#006241]/15 hover:bg-white"
          }
        `}
      >
        {loading ? (
          <LoaderCircle className="size-4 shrink-0 animate-spin text-[#006241]" />
        ) : (
          <Search className="size-4 shrink-0 text-black/35" />
        )}

        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(
              event.target.value,
            );

            setOpen(true);
          }}
          onFocus={() =>
            setOpen(true)
          }
          placeholder="Search CAFÉTA"
          aria-label="Search CAFÉTA"
          autoComplete="off"
          className="
            min-w-0 flex-1
            bg-transparent
            text-[13px]
            text-[#17211c]
            outline-none
            placeholder:text-black/35
          "
        />

        {hasQuery ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="
              flex size-6 shrink-0
              items-center justify-center
              rounded-full
              text-black/30
              transition
              hover:bg-black/[0.05]
              hover:text-black/60
            "
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <span
            className="
              flex h-5 min-w-5
              items-center justify-center
              rounded-md border
              border-black/[0.06]
              bg-white px-1
              text-[10px]
              font-semibold
              text-black/25
            "
          >
            /
          </span>
        )}
      </form>

      {open && (
        <div
          className="
            absolute right-0 top-[48px]
            z-[70] w-[340px]
            overflow-hidden
            rounded-[22px]
            border border-black/[0.07]
            bg-white/98
            shadow-[0_22px_70px_rgba(0,0,0,0.14)]
            backdrop-blur-2xl
            animate-in
            fade-in-0
            zoom-in-95
            slide-in-from-top-1
            duration-150
          "
        >
          {!hasQuery && (
            <div className="px-5 py-6 text-center">
              <div
                className="
                  mx-auto flex size-10
                  items-center justify-center
                  rounded-full
                  bg-[#e8f2ed]
                  text-[#006241]
                "
              >
                <Search className="size-[17px]" />
              </div>

              <p className="mt-3 text-sm font-bold text-[#17211c]">
                Find your next spot
              </p>

              <p className="mx-auto mt-1 max-w-[230px] text-xs leading-5 text-black/40">
                Search cafés and
                milk-tea shops on
                CAFÉTA.
              </p>
            </div>
          )}

          {hasQuery &&
            !canSearch && (
              <div className="px-5 py-6 text-center">
                <p className="text-xs text-black/40">
                  Type at least 2
                  characters to search.
                </p>
              </div>
            )}

          {canSearch &&
            loading && (
              <div className="flex items-center justify-center gap-2 px-5 py-7">
                <LoaderCircle className="size-4 animate-spin text-[#006241]" />

                <span className="text-xs font-medium text-black/40">
                  Searching CAFÉTA...
                </span>
              </div>
            )}

          {canSearch &&
            !loading &&
            error && (
              <div className="px-5 py-6 text-center">
                <p className="text-sm font-semibold text-[#17211c]">
                  Search unavailable
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Please try again.
                </p>
              </div>
            )}

          {canSearch &&
            !loading &&
            !error &&
            results.length === 0 && (
              <div className="px-5 py-7 text-center">
                <div
                  className="
                    mx-auto flex size-10
                    items-center justify-center
                    rounded-full
                    bg-[#f2f5f3]
                    text-black/35
                  "
                >
                  <Coffee className="size-[17px]" />
                </div>

                <p className="mt-3 text-sm font-bold text-[#17211c]">
                  No places found
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Try another café,
                  barangay, or city.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            results.length > 0 && (
              <>
                <div className="px-4 pb-1 pt-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#006241]">
                    Places
                  </p>
                </div>

                <div className="p-2">
                  {results.map(
                    (business) => (
                      <Link
                        key={
                          business.id
                        }
                        href={`/place/${business.slug}`}
                        onClick={() =>
                          setOpen(
                            false,
                          )
                        }
                        className="
                          group flex
                          items-center
                          gap-3
                          rounded-[15px]
                          px-2.5 py-2.5
                          transition
                          hover:bg-[#f4f8f6]
                        "
                      >
                        <div
                          className="
                            flex size-10
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-[12px]
                            bg-[#e8f2ed]
                            text-[#006241]
                          "
                        >
                          {business.logo_url ? (
                            <img
                              src={
                                business.logo_url
                              }
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <Coffee className="size-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-bold text-[#17211c]">
                            {
                              business.name
                            }
                          </p>

                          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[10px] text-black/40">
                            <MapPin className="size-2.5 shrink-0" />

                            <span className="truncate">
                              {[
                                business.barangay,
                                business.city,
                              ]
                                .filter(
                                  Boolean,
                                )
                                .join(
                                  ", ",
                                ) ||
                                "Basilan"}
                            </span>
                          </div>
                        </div>

                        <ArrowRight
                          className="
                            size-3.5
                            shrink-0
                            text-black/20
                            transition
                            group-hover:translate-x-0.5
                            group-hover:text-[#006241]
                          "
                        />
                      </Link>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    router.push(
                      `/explore?q=${encodeURIComponent(
                        query.trim(),
                      )}`,
                    );

                    setOpen(false);
                  }}
                  className="
                    flex w-full
                    items-center
                    justify-between
                    border-t
                    border-black/[0.05]
                    px-4 py-3.5
                    text-xs font-bold
                    text-[#006241]
                    transition
                    hover:bg-[#f7faf8]
                  "
                >
                  <span>
                    See all results
                  </span>

                  <ArrowRight className="size-3.5" />
                </button>
              </>
            )}
        </div>
      )}
    </div>
  );
}