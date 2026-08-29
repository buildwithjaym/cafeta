export default function AdminLoading() {
  return (
    <div className="mx-auto w-full max-w-[1500px] animate-pulse px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
      <div className="h-3 w-24 rounded-full bg-[#006241]/10" />

      <div className="mt-4 h-10 w-72 max-w-full rounded-xl bg-black/[0.07]" />

      <div className="mt-3 h-4 w-[520px] max-w-full rounded-full bg-black/[0.05]" />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-[126px] rounded-[24px] border border-black/[0.05] bg-white p-5"
          >
            <div className="h-3 w-28 rounded-full bg-black/[0.05]" />
            <div className="mt-4 h-8 w-14 rounded-lg bg-black/[0.07]" />
            <div className="mt-3 h-3 w-32 rounded-full bg-black/[0.04]" />
          </div>
        ))}
      </div>

      <div className="mt-7 overflow-hidden rounded-[28px] border border-black/[0.05] bg-white">
        <div className="flex gap-2 overflow-hidden border-b border-black/[0.05] p-5">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 shrink-0 rounded-full bg-black/[0.05]"
            />
          ))}
        </div>

        <div className="flex gap-3 border-b border-black/[0.05] p-5">
          <div className="h-11 flex-1 rounded-2xl bg-black/[0.05]" />
          <div className="h-11 w-36 rounded-2xl bg-black/[0.05]" />
          <div className="h-11 w-20 rounded-2xl bg-black/[0.05]" />
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[24px] border border-black/[0.05]"
            >
              <div className="h-36 bg-black/[0.05]" />

              <div className="px-4 pb-4 pt-10">
                <div className="h-5 w-36 rounded-full bg-black/[0.07]" />

                <div className="mt-3 h-3 w-24 rounded-full bg-black/[0.04]" />

                <div className="mt-5 h-3 w-full rounded-full bg-black/[0.04]" />

                <div className="mt-2 h-3 w-2/3 rounded-full bg-black/[0.04]" />

                <div className="mt-5 flex items-center justify-between border-t border-black/[0.04] pt-4">
                  <div>
                    <div className="h-3 w-24 rounded-full bg-black/[0.05]" />
                    <div className="mt-2 h-2.5 w-20 rounded-full bg-black/[0.04]" />
                  </div>

                  <div className="h-10 w-20 rounded-xl bg-[#006241]/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}