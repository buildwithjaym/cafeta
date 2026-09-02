"use client";

import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BusinessDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfcfa] px-5">
      <section className="w-full max-w-md rounded-[28px] border border-black/[0.06] bg-white p-8 text-center">
        
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle className="size-8" />
        </div>


        <h1 className="mt-6 text-2xl font-black tracking-[-0.04em] text-[#17211c]">
          Dashboard unavailable
        </h1>


        <p className="mt-3 text-sm leading-6 text-black/45">
          We couldn't load your business analytics right now.
          Please try again.
        </p>


        {error.digest && (
          <p className="mt-4 rounded-xl bg-black/[0.03] px-4 py-3 text-xs text-black/40">
            Error ID: {error.digest}
          </p>
        )}


        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={reset}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#006241] text-sm font-bold text-white"
          >
            <RefreshCcw className="size-4" />
            Try Again
          </button>


          <Link
            href="/explore"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] text-sm font-bold text-black/60"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Link>

        </div>

      </section>
    </main>
  );
}