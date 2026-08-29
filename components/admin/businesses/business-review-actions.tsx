"use client";

import {
  CheckCircle2,
  Loader2,
  RotateCcw,
  ShieldCheck,
  ShieldOff,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { RejectBusinessModal } from "@/components/admin/businesses/reject-business-modal";
import type { BusinessStatus } from "@/components/admin/businesses/business-status-badge";
import { createClient } from "@/lib/supabase/client";

type BusinessReviewActionsProps = {
  businessId: string;
  businessName: string;
  status: BusinessStatus;
  isVerified: boolean;
};

type Action =
  | "approve"
  | "reject"
  | "verify"
  | "unverify"
  | "suspend"
  | "restore";

export function BusinessReviewActions({
  businessId,
  businessName,
  status,
  isVerified,
}: BusinessReviewActionsProps) {
  const router = useRouter();

  const [working, setWorking] = useState<Action | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  async function callRpc(
    action: Action,
    rpcName:
      | "approve_business"
      | "reject_business"
      | "verify_business"
      | "unverify_business"
      | "suspend_business"
      | "restore_business",
    args: Record<string, string>,
    successMessage: string,
  ) {
    setWorking(action);

    try {
      const supabase = createClient();

      const { error } = await supabase.rpc(rpcName, args);

      if (error) {
        throw error;
      }

      toast.success(successMessage);

      setShowRejectModal(false);

      router.refresh();
    } catch (error) {
      console.error(`Admin ${action} error:`, error);

      toast.error(
        error instanceof Error
          ? error.message
          : "The moderation action could not be completed.",
      );
    } finally {
      setWorking(null);
    }
  }

  async function approve() {
    await callRpc(
      "approve",
      "approve_business",
      {
        target_business_id: businessId,
      },
      `${businessName} has been approved.`,
    );
  }

  async function reject(reason: string) {
    await callRpc(
      "reject",
      "reject_business",
      {
        target_business_id: businessId,
        rejection_message: reason,
      },
      `${businessName} has been rejected.`,
    );
  }

  async function verify() {
    await callRpc(
      "verify",
      "verify_business",
      {
        target_business_id: businessId,
      },
      `${businessName} is now verified.`,
    );
  }

  async function unverify() {
    await callRpc(
      "unverify",
      "unverify_business",
      {
        target_business_id: businessId,
      },
      `Verification has been removed from ${businessName}.`,
    );
  }

  async function suspend() {
    const reason = window.prompt(
      `Why are you suspending ${businessName}?`,
    );

    if (!reason?.trim()) {
      return;
    }

    if (reason.trim().length < 5) {
      toast.error("Please provide a more detailed suspension reason.");
      return;
    }

    await callRpc(
      "suspend",
      "suspend_business",
      {
        target_business_id: businessId,
        suspension_reason: reason.trim(),
      },
      `${businessName} has been suspended.`,
    );
  }

  async function restore() {
    await callRpc(
      "restore",
      "restore_business",
      {
        target_business_id: businessId,
      },
      `${businessName} has been restored.`,
    );
  }

  const busy = working !== null;

  if (status === "pending") {
    return (
      <>
        <ReviewPanel
          title="Application review"
          description="Review the submitted information carefully before deciding whether this business should appear on CAFÉTA."
        >
          <button
            type="button"
            disabled={busy}
            onClick={() => setShowRejectModal(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle className="size-4" />
            Reject
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={approve}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#006241] px-5 text-sm font-semibold text-white transition hover:bg-[#005437] disabled:opacity-50"
          >
            {working === "approve" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}

            {working === "approve" ? "Approving..." : "Approve business"}
          </button>
        </ReviewPanel>

        {showRejectModal ? (
          <RejectBusinessModal
            businessName={businessName}
            pending={working === "reject"}
            onClose={() => setShowRejectModal(false)}
            onConfirm={reject}
          />
        ) : null}
      </>
    );
  }

  if (status === "approved") {
    return (
      <ReviewPanel
        title={isVerified ? "Verified business" : "Approved business"}
        description={
          isVerified
            ? "This business is approved and currently carries the CAFÉTA verification badge."
            : "This listing is approved. Verification remains a separate trust decision."
        }
      >
        {isVerified ? (
          <button
            type="button"
            disabled={busy}
            onClick={unverify}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] px-5 text-sm font-semibold text-black/55 hover:bg-black/[0.03] disabled:opacity-50"
          >
            {working === "unverify" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShieldOff className="size-4" />
            )}

            Remove verification
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={verify}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#006241]/15 bg-[#006241]/5 px-5 text-sm font-semibold text-[#006241] hover:bg-[#006241]/10 disabled:opacity-50"
          >
            {working === "verify" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShieldCheck className="size-4" />
            )}

            Verify business
          </button>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={suspend}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-orange-200 px-5 text-sm font-semibold text-orange-700 hover:bg-orange-50 disabled:opacity-50"
        >
          {working === "suspend" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <TriangleAlert className="size-4" />
          )}

          Suspend
        </button>
      </ReviewPanel>
    );
  }

  if (status === "suspended") {
    return (
      <ReviewPanel
        title="Business suspended"
        description="This business is currently removed from normal discovery. Restore it when the issue has been resolved."
      >
        <button
          type="button"
          disabled={busy}
          onClick={restore}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#006241] px-5 text-sm font-semibold text-white hover:bg-[#005437] disabled:opacity-50"
        >
          {working === "restore" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RotateCcw className="size-4" />
          )}

          Restore business
        </button>
      </ReviewPanel>
    );
  }

  if (status === "rejected") {
    return (
      <ReviewPanel
        title="Application rejected"
        description="The owner needs to correct the business information and resubmit the application before another review can take place."
      />
    );
  }

  return (
    <ReviewPanel
      title="Draft business"
      description="This business has not been submitted for review yet. No moderation action is required."
    />
  );
}

function ReviewPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-[#006241]/10 bg-white p-5 shadow-[0_12px_40px_rgba(0,98,65,0.06)] sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006241]">
        Admin Review
      </p>

      <h2 className="mt-2 text-lg font-bold tracking-[-0.025em] text-[#111713]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-black/45">
        {description}
      </p>

      {children ? (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {children}
        </div>
      ) : null}
    </section>
  );
}