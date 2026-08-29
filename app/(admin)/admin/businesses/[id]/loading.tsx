export default function AdminBusinessReviewLoading() {
  return (
    <div className="mx-auto w-full max-w-[1500px] animate-pulse px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="h-4 w-24 rounded-full bg-black/[0.06]" />

      <div className="mt-7 flex flex-col gap-4">
        <div className="h-6 w-24 rounded-full bg-black/[0.06]" />

        <div className="h-10 w-64 max-w-full rounded-xl bg-black/[0.07]" />

        <div className="h-4 w-96 max-w-full rounded-full bg-black/[0.05]" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[26px] border border-black/[0.05] bg-white">
            <div className="h-44 bg-black/[0.05] sm:h-60" />

            <div className="relative px-5 pb-6 sm:px-7">
              <div className="-mt-12 flex items-end gap-4">
                <div className="size-24 rounded-[24px] border-4 border-white bg-black/[0.08] sm:size-28" />

                <div className="flex-1 pb-2">
                  <div className="h-6 w-48 rounded-lg bg-black/[0.07]" />
                  <div className="mt-3 h-4 w-28 rounded-full bg-black/[0.05]" />
                </div>
              </div>
            </div>
          </section>

          <LoadingCard rows={4} />
          <LoadingCard rows={3} />
          <LoadingCard rows={4} />
          <LoadingCard rows={7} />

          <section className="rounded-[26px] border border-black/[0.05] bg-white p-5 sm:p-7">
            <div className="h-5 w-24 rounded-lg bg-black/[0.07]" />
            <div className="mt-3 h-3 w-44 rounded-full bg-black/[0.05]" />

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-24 gap-3 rounded-2xl border border-black/[0.05] p-3"
                >
                  <div className="size-16 shrink-0 rounded-xl bg-black/[0.06]" />

                  <div className="flex-1">
                    <div className="h-4 w-3/4 rounded-full bg-black/[0.06]" />
                    <div className="mt-3 h-3 w-full rounded-full bg-black/[0.04]" />
                    <div className="mt-2 h-3 w-1/2 rounded-full bg-black/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[26px] border border-black/[0.05] bg-white p-5 sm:p-6">
            <div className="h-3 w-20 rounded-full bg-[#006241]/10" />
            <div className="mt-4 h-6 w-40 rounded-lg bg-black/[0.07]" />
            <div className="mt-3 h-3 w-full rounded-full bg-black/[0.04]" />
            <div className="mt-2 h-3 w-4/5 rounded-full bg-black/[0.04]" />

            <div className="mt-6 flex gap-2">
              <div className="h-11 flex-1 rounded-2xl bg-black/[0.06]" />
              <div className="h-11 flex-1 rounded-2xl bg-[#006241]/10" />
            </div>
          </section>

          <LoadingSidebarCard rows={3} />
          <LoadingSidebarCard rows={2} />
          <LoadingSidebarCard rows={4} />
        </aside>
      </div>
    </div>
  );
}

function LoadingCard({ rows }: { rows: number }) {
  return (
    <section className="rounded-[26px] border border-black/[0.05] bg-white p-5 sm:p-7">
      <div className="h-5 w-40 rounded-lg bg-black/[0.07]" />
      <div className="mt-3 h-3 w-64 max-w-full rounded-full bg-black/[0.04]" />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index}>
            <div className="h-3 w-20 rounded-full bg-black/[0.04]" />
            <div className="mt-3 h-4 w-36 max-w-full rounded-full bg-black/[0.06]" />
          </div>
        ))}
      </div>
    </section>
  );
}

function LoadingSidebarCard({
  rows,
}: {
  rows: number;
}) {
  return (
    <section className="rounded-[26px] border border-black/[0.05] bg-white p-5 sm:p-6">
      <div className="h-5 w-32 rounded-lg bg-black/[0.07]" />

      <div className="mt-6 space-y-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <div className="size-9 shrink-0 rounded-xl bg-black/[0.05]" />

            <div className="flex-1">
              <div className="h-3 w-20 rounded-full bg-black/[0.04]" />
              <div className="mt-2 h-4 w-32 max-w-full rounded-full bg-black/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}