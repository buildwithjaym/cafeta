export default function AdminBusinessesLoading() {
  return (
    <div className="mx-auto w-full max-w-[1500px] animate-pulse px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="h-3 w-36 rounded-full bg-[#006241]/10" />
      <div className="mt-4 h-10 w-52 rounded-xl bg-black/[0.07]" />
      <div className="mt-3 h-4 w-[420px] max-w-full rounded-full bg-black/[0.05]" />

      <div className="mt-8 overflow-hidden rounded-[26px] border border-black/[0.05] bg-white">
        <div className="flex gap-2 border-b border-black/[0.05] p-4 sm:p-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-20 rounded-xl bg-black/[0.05]"
            />
          ))}
        </div>

        <div className="divide-y divide-black/[0.05]">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="size-11 shrink-0 rounded-xl bg-black/[0.06]" />

              <div className="min-w-0 flex-1">
                <div className="h-4 w-40 rounded-full bg-black/[0.07]" />
                <div className="mt-2 h-3 w-24 rounded-full bg-black/[0.04]" />
              </div>

              <div className="hidden h-4 w-28 rounded-full bg-black/[0.05] md:block" />
              <div className="hidden h-7 w-20 rounded-full bg-black/[0.05] lg:block" />
              <div className="size-9 rounded-xl bg-black/[0.04]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}