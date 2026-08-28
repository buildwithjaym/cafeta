import {
  Coffee,
} from "lucide-react";

export default function CreateBusinessLoading() {
  return (
    <main className="min-h-[calc(100dvh-72px)] bg-[#f7f8f6] pb-28 md:pb-14">
      <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <div className="animate-pulse">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="h-3 w-24 rounded-full bg-black/[0.06]" />

            <div className="mt-6 flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full bg-[#e8f2ed]">
                <Coffee className="size-3 text-[#006241]/40" />
              </div>

              <div className="h-2.5 w-20 rounded-full bg-[#006241]/10" />
            </div>

            <div className="mt-3 h-9 w-48 rounded-xl bg-black/[0.07] sm:w-56" />

            <div className="mt-4 h-3.5 w-full max-w-[420px] rounded-full bg-black/[0.045]" />

            <div className="mt-2 h-3.5 w-[70%] max-w-[300px] rounded-full bg-black/[0.04]" />
          </div>

          {/* Stepper */}
          <section className="rounded-[24px] border border-black/[0.05] bg-white px-5 py-5 shadow-[0_10px_35px_rgba(0,0,0,0.025)] sm:px-7 lg:px-9 lg:py-6">
            {/* Desktop Stepper */}
            <div className="relative hidden lg:block">
              <div className="absolute left-5 right-5 top-5 h-px bg-black/[0.06]" />

              <div className="relative grid grid-cols-6">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`size-10 rounded-full border ${
                        index === 0
                          ? "border-[#006241]/15 bg-[#e8f2ed]"
                          : "border-black/[0.05] bg-[#f5f6f5]"
                      }`}
                    />

                    <div
                      className={`mt-2 h-2 rounded-full ${
                        index === 0
                          ? "w-10 bg-[#006241]/10"
                          : "w-12 bg-black/[0.05]"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Stepper */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-2 w-16 rounded-full bg-[#006241]/10" />

                  <div className="mt-2 h-3.5 w-20 rounded-full bg-black/[0.07]" />
                </div>

                <div className="h-3 w-8 rounded-full bg-black/[0.05]" />
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
                <div className="h-full w-1/6 rounded-full bg-[#006241]/15" />
              </div>
            </div>
          </section>

          {/* Main */}
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            {/* Form skeleton */}
            <section className="overflow-hidden rounded-[28px] border border-black/[0.05] bg-white shadow-[0_14px_45px_rgba(0,0,0,0.025)]">
              <div className="p-5 sm:p-7 lg:p-8">
                {/* Section heading */}
                <div className="h-2.5 w-24 rounded-full bg-[#006241]/10" />

                <div className="mt-3 h-7 w-56 rounded-lg bg-black/[0.07]" />

                <div className="mt-4 h-3.5 w-full max-w-[470px] rounded-full bg-black/[0.04]" />

                <div className="mt-2 h-3.5 w-[72%] max-w-[330px] rounded-full bg-black/[0.04]" />

                {/* Business name */}
                <div className="mt-9">
                  <div className="h-3 w-24 rounded-full bg-black/[0.065]" />

                  <div className="mt-3 h-12 rounded-[15px] bg-[#f4f6f4]" />

                  <div className="mt-2 h-2.5 w-48 rounded-full bg-black/[0.035]" />
                </div>

                {/* Category */}
                <div className="mt-8">
                  <div className="h-3 w-40 rounded-full bg-black/[0.065]" />

                  <div className="mt-2 h-2.5 w-56 rounded-full bg-black/[0.035]" />

                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {Array.from({
                      length: 4,
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="flex h-[82px] items-center gap-3 rounded-[18px] border border-black/[0.045] p-4"
                      >
                        <div className="size-10 shrink-0 rounded-[13px] bg-[#f0f3f1]" />

                        <div className="flex-1">
                          <div className="h-3 w-20 rounded-full bg-black/[0.06]" />

                          <div className="mt-2 h-2.5 w-[80%] rounded-full bg-black/[0.035]" />

                          <div className="mt-1.5 h-2.5 w-[55%] rounded-full bg-black/[0.03]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 rounded-full bg-black/[0.065]" />

                    <div className="h-2.5 w-10 rounded-full bg-black/[0.035]" />
                  </div>

                  <div className="mt-3 h-[125px] rounded-[16px] bg-[#f4f6f4]" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-black/[0.05] bg-[#fcfcfb] px-5 py-4 sm:px-7 lg:px-8">
                <div className="h-11 w-[88px] rounded-full bg-black/[0.05]" />

                <div className="h-11 w-[110px] rounded-full bg-[#006241]/10" />
              </div>
            </section>

            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="rounded-[24px] border border-black/[0.05] bg-white p-5">
                <div className="size-10 rounded-[13px] bg-[#e8f2ed]" />

                <div className="mt-4 h-3.5 w-32 rounded-full bg-black/[0.065]" />

                <div className="mt-4 space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-black/[0.035]" />
                  <div className="h-2.5 w-full rounded-full bg-black/[0.035]" />
                  <div className="h-2.5 w-[70%] rounded-full bg-black/[0.03]" />
                </div>

                <div className="my-5 h-px bg-black/[0.05]" />

                <div className="space-y-4">
                  {Array.from({
                    length: 3,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="space-y-2"
                    >
                      <div className="h-2.5 w-full rounded-full bg-black/[0.035]" />
                      <div className="h-2.5 w-[75%] rounded-full bg-black/[0.03]" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}