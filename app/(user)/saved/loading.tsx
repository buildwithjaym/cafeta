export default function SavedLoading() {
  return (
    <main className="min-h-[calc(100dvh-72px)] bg-[#f7f8f6] pb-28 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-9 lg:px-8">
        <div className="animate-pulse">
          <div className="h-3 w-24 rounded-full bg-black/[0.06]" />

          <div className="mt-4 h-10 w-52 rounded-xl bg-black/[0.07]" />

          <div className="mt-3 h-4 w-72 max-w-full rounded-full bg-black/[0.05]" />

          <div className="mt-8 flex gap-3">
            <div className="h-12 max-w-md flex-1 rounded-full bg-white" />

            <div className="hidden h-10 w-20 rounded-full bg-white sm:block" />

            <div className="hidden h-10 w-24 rounded-full bg-white sm:block" />
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[26px] border border-black/[0.04] bg-white"
              >
                <div className="aspect-[4/3] bg-black/[0.05]" />

                <div className="p-4">
                  <div className="h-5 w-2/3 rounded bg-black/[0.07]" />

                  <div className="mt-3 h-3 w-4/5 rounded bg-black/[0.05]" />

                  <div className="mt-5 h-10 rounded-[14px] bg-black/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}