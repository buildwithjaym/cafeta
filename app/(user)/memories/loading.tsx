export default function MemoryDetailLoading() {
  return (
    <main className="min-h-screen bg-[#f6f7f5] pb-28">
      <div className="mx-auto w-full max-w-[680px] px-4 py-5 sm:px-6 sm:py-8">
        <div className="flex animate-pulse items-center gap-3">
          <div className="size-10 rounded-full bg-black/[0.07]" />

          <div>
            <div className="h-2.5 w-24 rounded-full bg-black/[0.06]" />

            <div className="mt-2 h-4 w-16 rounded-full bg-black/[0.07]" />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[25px] bg-white">
          <div className="flex animate-pulse items-center gap-3 p-4">
            <div className="size-10 rounded-full bg-black/[0.07]" />

            <div>
              <div className="h-3 w-28 rounded-full bg-black/[0.07]" />

              <div className="mt-2 h-2.5 w-20 rounded-full bg-black/[0.05]" />
            </div>
          </div>

          <div className="aspect-[4/5] animate-pulse bg-black/[0.06]" />

          <div className="animate-pulse p-4">
            <div className="h-3 w-4/5 rounded-full bg-black/[0.06]" />

            <div className="mt-2 h-3 w-1/2 rounded-full bg-black/[0.05]" />
          </div>
        </div>

        <div className="mt-5 h-56 animate-pulse rounded-[24px] bg-white" />
      </div>
    </main>
  );
}