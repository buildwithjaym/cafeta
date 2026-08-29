"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

type RejectBusinessModalProps = {
  businessName: string;
  pending: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
};

export function RejectBusinessModal({
  businessName,
  pending,
  onClose,
  onConfirm,
}: RejectBusinessModalProps) {
  const [reason, setReason] = useState("");

  const valid = reason.trim().length >= 5;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0"
        onClick={() => {
          if (!pending) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 w-full max-w-lg rounded-[28px] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle className="size-5" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-xl text-black/35 hover:bg-black/[0.05] disabled:pointer-events-none disabled:opacity-40"
          >
            <X className="size-4" />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-[-0.03em] text-[#111713]">
          Reject application?
        </h2>

        <p className="mt-2 text-sm leading-6 text-black/50">
          Explain what <strong>{businessName}</strong> needs to correct before
          submitting the business again.
        </p>

        <label className="mt-6 block">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-black/40">
            Reason
          </span>

          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={pending}
            rows={5}
            maxLength={1000}
            placeholder="Example: The submitted address could not be confirmed. Please provide the complete business address..."
            className="mt-2 w-full resize-none rounded-2xl border border-black/[0.08] bg-[#FAFBFA] px-4 py-3 text-sm leading-6 text-[#111713] outline-none transition focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
          />
        </label>

        <div className="mt-2 flex justify-between text-[10px] text-black/30">
          <span>Minimum 5 characters</span>
          <span>{reason.length}/1000</span>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="h-11 rounded-2xl border border-black/[0.08] px-5 text-sm font-semibold text-black/55 hover:bg-black/[0.03] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!valid || pending}
            onClick={() => onConfirm(reason.trim())}
            className="h-11 rounded-2xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Rejecting..." : "Reject application"}
          </button>
        </div>
      </div>
    </div>
  );
}