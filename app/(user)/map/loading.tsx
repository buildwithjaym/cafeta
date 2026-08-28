import {
  Coffee,
  LoaderCircle,
} from "lucide-react";

export default function MapLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f3f6f4] md:top-[72px]">
      <div className="flex -translate-y-8 flex-col items-center text-center md:translate-y-0">
        <div className="relative flex size-[72px] items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#006241]/[0.06] blur-xl" />

          <div className="relative flex size-[58px] items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-[0_10px_35px_rgba(23,33,28,0.10)] backdrop-blur-xl">
            <Coffee
              className="size-[21px] text-[#006241]"
              strokeWidth={2.1}
            />

            <LoaderCircle
              className="absolute size-[68px] animate-spin text-[#006241]/20"
              strokeWidth={1.4}
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[15px] font-extrabold tracking-[-0.025em] text-[#17211c]">
            Finding places around you
          </p>

          <p className="mt-1.5 text-xs font-medium text-black/35">
            Getting CAFÉTA ready...
          </p>
        </div>

        <div className="mt-5 flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-[#006241]" />

          <span className="size-1.5 animate-pulse rounded-full bg-[#006241]/50 [animation-delay:150ms]" />

          <span className="size-1.5 animate-pulse rounded-full bg-[#006241]/25 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}