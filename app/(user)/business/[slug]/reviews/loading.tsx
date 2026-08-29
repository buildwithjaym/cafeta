export default function BusinessReviewsLoading() {
  return (
    <main className="min-h-screen bg-[#f5f7f5] pb-28 md:pb-14">
      <div className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6 sm:py-8">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />

          <Skeleton className="size-10 rounded-full" />

          <div>
            <Skeleton className="h-3 w-28 rounded-full" />

            <Skeleton className="mt-2 h-2 w-40 rounded-full" />
          </div>
        </div>

        <div className="mt-7">
          <Skeleton className="h-2.5 w-28 rounded-full" />

          <Skeleton className="mt-3 h-9 w-36 rounded-xl" />

          <Skeleton className="mt-3 h-2.5 w-64 max-w-full rounded-full" />
        </div>

        <section className="mt-6 rounded-[24px] border border-black/[0.04] bg-white p-5 sm:p-6">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr] sm:items-center">
            <div>
              <Skeleton className="h-12 w-20 rounded-xl" />

              <div className="mt-3 flex gap-1">
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (
                    item,
                  ) => (
                    <Skeleton
                      key={
                        item
                      }
                      className="size-4 rounded"
                    />
                  ),
                )}
              </div>

              <Skeleton className="mt-3 h-2 w-16 rounded-full" />
            </div>

            <div className="space-y-3">
              {[
                1,
                2,
                3,
                4,
                5,
              ].map(
                (
                  item,
                ) => (
                  <div
                    key={
                      item
                    }
                    className="flex items-center gap-3"
                  >
                    <Skeleton className="h-2 w-5 rounded-full" />

                    <Skeleton className="h-1.5 flex-1 rounded-full" />

                    <Skeleton className="h-2 w-4 rounded-full" />
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[24px] border border-black/[0.04] bg-white">
          <div className="flex items-center justify-between border-b border-black/[0.04] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />

              <div>
                <Skeleton className="h-3 w-20 rounded-full" />

                <Skeleton className="mt-2 h-2 w-12 rounded-full" />
              </div>
            </div>

            <Skeleton className="h-9 w-24 rounded-full" />
          </div>

          <div className="px-5 sm:px-6">
            {[
              1,
              2,
              3,
            ].map(
              (
                review,
              ) => (
                <div
                  key={
                    review
                  }
                  className="flex gap-3 border-b border-black/[0.04] py-5 last:border-0"
                >
                  <Skeleton className="size-10 shrink-0 rounded-full" />

                  <div className="flex-1">
                    <Skeleton className="h-3 w-28 rounded-full" />

                    <div className="mt-2 flex gap-1">
                      {[
                        1,
                        2,
                        3,
                        4,
                        5,
                      ].map(
                        (
                          star,
                        ) => (
                          <Skeleton
                            key={
                              star
                            }
                            className="size-3 rounded"
                          />
                        ),
                      )}
                    </div>

                    <Skeleton className="mt-4 h-2.5 w-full rounded-full" />

                    <Skeleton className="mt-2 h-2.5 w-[82%] rounded-full" />

                    <Skeleton className="mt-2 h-2.5 w-[55%] rounded-full" />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Skeleton({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`
        animate-pulse
        bg-black/[0.065]
        ${className}
      `}
    />
  );
}