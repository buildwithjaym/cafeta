export default function BusinessMenuLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f5f7f5] pb-28">
      <div className="mx-auto w-full max-w-[920px]">
        <div className="h-[180px] bg-black/[0.07] sm:h-[230px] sm:rounded-b-[30px]" />

        <div className="px-4 sm:px-6">
          <div className="mt-5 rounded-[24px] border border-black/[0.04] bg-white p-5">
            <div className="h-5 w-36 rounded-full bg-black/[0.07]" />

            <div className="mt-5 h-12 rounded-[16px] bg-black/[0.05]" />

            <div className="mt-4 flex gap-2">
              <div className="h-9 w-16 rounded-full bg-black/[0.06]" />
              <div className="h-9 w-24 rounded-full bg-black/[0.06]" />
              <div className="h-9 w-20 rounded-full bg-black/[0.06]" />
            </div>
          </div>

          <div className="mt-7 h-5 w-28 rounded-full bg-black/[0.07]" />

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map(
              (
                _,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="overflow-hidden rounded-[20px] border border-black/[0.04] bg-white"
                >
                  <div className="aspect-[4/3] bg-black/[0.06]" />

                  <div className="p-4">
                    <div className="h-3 w-2/3 rounded-full bg-black/[0.07]" />
                    <div className="mt-3 h-2 w-full rounded-full bg-black/[0.04]" />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-black/[0.04]" />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}