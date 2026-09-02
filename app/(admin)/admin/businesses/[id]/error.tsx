"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminBusinessReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin business review error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[600px] w-full max-w-[1500px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg rounded-[28px] border border-black/[0.06] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle className="size-8" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-[-0.04em] text-[#111713]">
          Unable to load business review
        </h1>

        <p className="mt-3 text-sm leading-6 text-black/50">
          Something went wrong while loading this business application.
          Please try again or return to the admin dashboard.
        </p>

        {error.digest ? (
          <p className="mt-4 rounded-xl bg-black/[0.03] px-4 py-3 text-xs text-black/40">
            Error ID: {error.digest}
          </p>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#006241] px-5 text-sm font-semibold text-white transition hover:bg-[#005238]"
          >
            <RefreshCcw className="size-4" />
            Try again
          </button>

          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-5 text-sm font-semibold text-black/60 transition hover:bg-black/[0.03]"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}