"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Coffee,
  LoaderCircle,
  LogOut,
  Map,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

type AdminHeaderProps = {
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
};

function getInitials(
  fullName: string | null,
  username: string | null,
) {
  const value =
    fullName?.trim() ||
    username?.trim() ||
    "Admin";

  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getDisplayName(
  fullName: string | null,
  username: string | null,
) {
  return (
    fullName?.trim() ||
    username?.trim() ||
    "Super Admin"
  );
}

export function AdminHeader({
  fullName,
  username,
  avatarUrl,
}: AdminHeaderProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const displayName = getDisplayName(
    fullName,
    username,
  );

  const initials = getInitials(
    fullName,
    username,
  );

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const supabase = createClient();

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success(
        "You have been signed out.",
      );

      router.replace("/auth/login");
      router.refresh();
    } catch (error) {
      console.error(
        "[CAFÉTA Admin] Logout failed:",
        error,
      );

      toast.error(
        "CAFÉTA couldn't sign you out. Please try again.",
      );

      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link
            href="/admin"
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#006241] text-white shadow-[0_6px_18px_rgba(0,98,65,0.16)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_9px_24px_rgba(0,98,65,0.22)]">
              <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />

              <Coffee className="relative size-[18px] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-base font-bold tracking-[-0.04em] text-[#122019]">
                  CAFÉTA
                </span>

                <span className="hidden rounded-full bg-[#006241]/8 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#006241] min-[420px]:inline-flex">
                  Admin
                </span>
              </div>

              <p className="mt-0.5 hidden text-[10px] font-medium text-black/35 sm:block">
                Business moderation
              </p>
            </div>
          </Link>

          <div className="hidden h-8 w-px bg-black/[0.06] lg:block" />

          <div className="hidden items-center gap-2 lg:flex">
            <div className="relative flex size-2 items-center justify-center">
              <span className="absolute size-2 animate-ping rounded-full bg-emerald-500/30" />
              <span className="relative size-1.5 rounded-full bg-emerald-500" />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
              Admin workspace
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/map"
            className="group hidden h-10 items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-4 text-xs font-semibold text-black/50 transition duration-200 hover:border-[#006241]/15 hover:bg-[#006241]/[0.035] hover:text-[#006241] sm:flex"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to CAFÉTA
          </Link>

          <div className="hidden h-7 w-px bg-black/[0.07] sm:block" />

          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (current) => !current,
                )
              }
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className={`group flex items-center gap-2 rounded-2xl p-1.5 transition duration-200 sm:gap-3 sm:pr-3 ${
                menuOpen
                  ? "bg-[#F3F7F4]"
                  : "hover:bg-black/[0.035]"
              }`}
            >
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="size-9 rounded-full border border-black/[0.06] object-cover sm:size-10"
                  />
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#006241]/10 text-[11px] font-bold text-[#006241] sm:size-10">
                    {initials}
                  </div>
                )}

                <span className="absolute bottom-0 right-0 flex size-3 items-center justify-center rounded-full border-2 border-white bg-[#006241]">
                  <CheckCircle2 className="size-[7px] text-white" />
                </span>
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-[140px] truncate text-xs font-bold text-[#122019]">
                  {displayName}
                </p>

                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-[#006241]">
                  <ShieldCheck className="size-3" />
                  Super Admin
                </p>
              </div>

              <ChevronDown
                className={`hidden size-3.5 text-black/30 transition-transform duration-200 sm:block ${
                  menuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-0 top-[calc(100%+10px)] w-[280px] origin-top-right transition-all duration-200 ${
                menuOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-[22px] border border-black/[0.07] bg-white shadow-[0_20px_60px_rgba(18,32,25,0.14)]">
                <div className="relative overflow-hidden border-b border-black/[0.06] bg-[#F7FAF8] p-4">
                  <div className="pointer-events-none absolute -right-10 -top-12 size-28 rounded-full bg-[#006241]/5" />

                  <div className="relative flex items-center gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="size-12 shrink-0 rounded-full border border-black/[0.06] object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#006241]/10 text-sm font-bold text-[#006241]">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#122019]">
                        {displayName}
                      </p>

                      {username ? (
                        <p className="mt-0.5 truncate text-xs text-black/40">
                          @{username}
                        </p>
                      ) : null}

                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#006241]/8 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#006241]">
                        <ShieldCheck className="size-3" />
                        Super Admin
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/map"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition duration-200 hover:bg-[#F5F8F6]"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F6F4] text-black/40 transition duration-200 group-hover:bg-[#006241]/8 group-hover:text-[#006241]">
                      <Map className="size-4 transition-transform duration-200 group-hover:scale-105" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#122019]">
                        Open CAFÉTA
                      </p>

                      <p className="mt-0.5 text-[10px] text-black/35">
                        Return to the CAFÉTA map
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="border-t border-black/[0.06] p-2">
                  <button
                    type="button"
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition duration-200 hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition duration-200 group-hover:bg-red-100">
                      {loggingOut ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <LogOut className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-red-600">
                        {loggingOut
                          ? "Signing out..."
                          : "Sign out"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-red-500/60">
                        End your admin session
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {menuOpen ? (
            <button
              type="button"
              onClick={() =>
                setMenuOpen(false)
              }
              aria-label="Close account menu"
              className="flex size-9 items-center justify-center rounded-xl bg-black/[0.04] text-black/40 sm:hidden"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}