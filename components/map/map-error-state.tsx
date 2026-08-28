import {
  MapPinOff,
  RefreshCw,
} from "lucide-react";

type Props = {
  title?: string;
  description?: string;
};

export function MapErrorState({
  title = "Something went wrong",
  description = "We couldn't load places right now. Please try again.",
}: Props) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#eef2ef]/95 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[28px] border border-black/[0.06] bg-white p-6 text-center shadow-xl">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f2ed] text-[#006241]">
          <MapPinOff className="size-5" />
        </div>

        <h2 className="mt-4 text-base font-bold text-[#17211c]">
          {title}
        </h2>

        <p className="mx-auto mt-2 max-w-[270px] text-xs leading-5 text-black/45">
          {description}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="mx-auto mt-5 flex h-10 items-center justify-center gap-2 rounded-full bg-[#006241] px-5 text-xs font-semibold text-white transition hover:bg-[#00754a]"
        >
          <RefreshCw className="size-3.5" />

          Try again
        </button>
      </div>
    </div>
  );
}