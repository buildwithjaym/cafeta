"use client";

import {
  LocateFixed,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

type MapControlsProps = {
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export function MapControls({
  onLocate,
  onZoomIn,
  onZoomOut,
  onReset,
}: MapControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onLocate}
        aria-label="Use my location"
        className="flex size-11 items-center justify-center rounded-full border border-black/[0.07] bg-white text-[#006241] shadow-[0_5px_20px_rgba(0,0,0,0.12)] transition hover:bg-[#f4f8f6]"
      >
        <LocateFixed className="size-[18px]" />
      </button>

      <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom in"
          className="flex size-11 items-center justify-center transition hover:bg-black/[0.04]"
        >
          <Plus className="size-[17px]" />
        </button>

        <div className="mx-2 h-px bg-black/[0.06]" />

        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom out"
          className="flex size-11 items-center justify-center transition hover:bg-black/[0.04]"
        >
          <Minus className="size-[17px]" />
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        aria-label="Reset map"
        className="flex size-11 items-center justify-center rounded-full border border-black/[0.07] bg-white text-black/55 shadow-[0_5px_20px_rgba(0,0,0,0.12)] transition hover:text-[#006241]"
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}