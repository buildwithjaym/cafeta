import {
  Coffee,
  LoaderCircle,
} from "lucide-react";

export default function ProfileLoading() {
  return (
    <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#f7f8f6] px-5 pb-24 md:min-h-[calc(100dvh-72px)] md:pb-0">
      <div className="flex -translate-y-8 flex-col items-center text-center md:translate-y-0">
        <div className="relative">
          <div className="absolute inset-0 scale-150 rounded-full bg-[#006241]/[0.06] blur-xl" />

          <div className="relative flex size-[72px] items-center justify-center rounded-[24px] border border-[#006241]/10 bg-white shadow-[0_12px_40px_rgba(0,98,65,0.10)]">
            <Coffee
              className="size-7 text-[#006241]"
              strokeWidth={2}
            />

            <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-[3px] border-[#f7f8f6] bg-[#006241] text-white">
              <LoaderCircle
                className="size-3.5 animate-spin"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#006241]">
            CAFÉTA
          </p>

          <h1 className="mt-2 text-[17px] font-bold tracking-[-0.025em] text-[#17211c]">
            Loading your profile
          </h1>

          <p className="mt-1.5 text-xs text-black/40">
            Getting everything ready for you.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-[#006241]" />

          <span className="size-1.5 animate-pulse rounded-full bg-[#006241]/50 [animation-delay:150ms]" />

          <span className="size-1.5 animate-pulse rounded-full bg-[#006241]/25 [animation-delay:300ms]" />
        </div>
      </div>
    </main>
  );
}