import {
  Coffee,
  SearchX,
} from "lucide-react";

type Props = {
  searching?: boolean;
};

export function MapEmptyState({
  searching = false,
}: Props) {
  return (
    <div className="absolute bottom-[108px] left-1/2 z-30 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 md:bottom-6 md:left-6 md:translate-x-0">
      <div className="rounded-[24px] border border-black/[0.06] bg-white/95 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
          {searching ? (
            <SearchX className="size-[18px]" />
          ) : (
            <Coffee className="size-[18px]" />
          )}
        </div>

        <h3 className="mt-4 text-sm font-bold text-[#17211c]">
          {searching
            ? "No matching places"
            : "Nothing here yet"}
        </h3>

        <p className="mt-1 text-xs leading-5 text-black/45">
          {searching
            ? "Try another name, category, or move around the map."
            : "CAFÉTA doesn't have any listed places in this area yet."}
        </p>
      </div>
    </div>
  );
}