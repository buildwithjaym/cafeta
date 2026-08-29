"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useTransition } from "react";

type BusinessPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
};

type PageItem =
  | number
  | "ellipsis-left"
  | "ellipsis-right";

function getPageItems(
  currentPage: number,
  totalPages: number,
): PageItem[] {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis-right",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-left",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ];
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}

export function BusinessPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
}: BusinessPaginationProps) {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const firstItem =
    totalCount === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const lastItem = Math.min(
    currentPage * pageSize,
    totalCount,
  );

  const pageItems = getPageItems(
    currentPage,
    totalPages,
  );

  function goToPage(page: number) {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      isPending
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    if (page === 1) {
      params.delete("page");
    } else {
      params.set(
        "page",
        String(page),
      );
    }

    const query = params.toString();

    startTransition(() => {
      router.push(
        query
          ? `/admin?${query}`
          : "/admin",
        {
          scroll: false,
        },
      );
    });
  }

  if (
    totalCount === 0 ||
    totalPages <= 0
  ) {
    return null;
  }

  return (
    <div
      className={`border-t border-black/[0.06] px-4 py-4 transition-opacity duration-200 sm:px-5 ${
        isPending
          ? "opacity-60"
          : "opacity-100"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium text-black/40">
            Showing{" "}
            <span className="font-semibold text-[#122019]">
              {formatNumber(
                firstItem,
              )}
            </span>
            {" – "}
            <span className="font-semibold text-[#122019]">
              {formatNumber(
                lastItem,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#122019]">
              {formatNumber(
                totalCount,
              )}
            </span>{" "}
            businesses
          </p>

          <p className="mt-1 text-[10px] text-black/25">
            Page{" "}
            {formatNumber(
              currentPage,
            )}{" "}
            of{" "}
            {formatNumber(
              totalPages,
            )}
          </p>
        </div>

        <div className="hidden items-center gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage - 1,
              )
            }
            disabled={
              currentPage <= 1 ||
              isPending
            }
            aria-label="Previous page"
            className="group flex size-9 items-center justify-center rounded-xl border border-black/[0.07] bg-white text-black/40 transition duration-200 hover:border-[#006241]/15 hover:bg-[#006241]/[0.04] hover:text-[#006241] disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>

          {pageItems.map(
            (item) => {
              if (
                item ===
                  "ellipsis-left" ||
                item ===
                  "ellipsis-right"
              ) {
                return (
                  <span
                    key={item}
                    className="flex size-9 items-center justify-center text-xs font-medium text-black/25"
                  >
                    ···
                  </span>
                );
              }

              const active =
                item ===
                currentPage;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    goToPage(item)
                  }
                  disabled={
                    active ||
                    isPending
                  }
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={`flex min-w-9 items-center justify-center rounded-xl px-2.5 py-2 text-xs font-semibold transition duration-200 ${
                    active
                      ? "bg-[#006241] text-white shadow-[0_4px_12px_rgba(0,98,65,0.18)]"
                      : "border border-black/[0.07] bg-white text-black/45 hover:border-[#006241]/15 hover:bg-[#006241]/[0.04] hover:text-[#006241]"
                  }`}
                >
                  {formatNumber(
                    item,
                  )}
                </button>
              );
            },
          )}

          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage + 1,
              )
            }
            disabled={
              currentPage >=
                totalPages ||
              isPending
            }
            aria-label="Next page"
            className="group flex size-9 items-center justify-center rounded-xl border border-black/[0.07] bg-white text-black/40 transition duration-200 hover:border-[#006241]/15 hover:bg-[#006241]/[0.04] hover:text-[#006241] disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage - 1,
              )
            }
            disabled={
              currentPage <= 1 ||
              isPending
            }
            className="group flex h-10 items-center justify-center gap-2 rounded-xl border border-black/[0.07] bg-white px-3 text-xs font-semibold text-black/45 transition hover:bg-black/[0.025] disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </button>

          <span className="whitespace-nowrap text-[11px] font-semibold text-black/35">
            {currentPage} /{" "}
            {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage + 1,
              )
            }
            disabled={
              currentPage >=
                totalPages ||
              isPending
            }
            className="group flex h-10 items-center justify-center gap-2 rounded-xl border border-black/[0.07] bg-white px-3 text-xs font-semibold text-black/45 transition hover:bg-black/[0.025] disabled:pointer-events-none disabled:opacity-30"
          >
            Next
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}