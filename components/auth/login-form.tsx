"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
  next?: string;
};

function getSafeNext(next?: string) {
  if (!next) {
    return null;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return null;
  }

  if (next.startsWith("/admin")) {
    return null;
  }

  return next;
}

export function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data,
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user || !data.session) {
        setError(
          "CAFÉTA could not establish your session. Please try again.",
        );
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "[CAFÉTA] Failed to load user role:",
          profileError,
        );

        setError(
          "You signed in successfully, but CAFÉTA could not load your account. Please try again.",
        );

        return;
      }

      if (!profile) {
        console.error(
          "[CAFÉTA] No profile found for authenticated user:",
          data.user.id,
        );

        setError(
          "CAFÉTA could not find your profile. Please try again.",
        );

        return;
      }

      if (profile.role === "super_admin") {
        router.replace("/admin");
        router.refresh();
        return;
      }

      const safeNext = getSafeNext(next);

      router.replace(safeNext ?? "/explore");
      router.refresh();
    } catch (error) {
      console.error(
        "[CAFÉTA] Sign in failed:",
        error,
      );

      setError(
        "Something went wrong while signing in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#006241]">
          Welcome back
        </p>

        <h2 className="mt-3 text-[2rem] font-bold tracking-[-0.045em] text-[#122019] sm:text-[2.2rem]">
          Sign in to CAFÉTA
        </h2>

        <p className="mt-2 text-sm leading-6 text-black/45">
          Pick up where you left off and keep discovering.
        </p>
      </div>

      <div className="mt-6">
        <GoogleAuthButton next={next} />
      </div>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-black/[0.07]" />

        <span className="text-[11px] font-medium text-black/35">
          OR CONTINUE WITH EMAIL
        </span>

        <div className="h-px flex-1 bg-black/[0.07]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold text-[#24312b]"
          >
            Email address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-[17px] -translate-y-1/2 text-black/30" />

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-black/[0.09] bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#006241]/50 focus:ring-4 focus:ring-[#006241]/[0.07]"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-[#24312b]"
            >
              Password
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold text-[#006241] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 size-[17px] -translate-y-1/2 text-black/30" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-black/[0.09] bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#006241]/50 focus:ring-4 focus:ring-[#006241]/[0.07]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 transition hover:text-black/60"
            >
              {showPassword ? (
                <EyeOff className="size-[17px]" />
              ) : (
                <Eye className="size-[17px]" />
              )}
            </button>
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
          >
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#006241] px-5 text-sm font-semibold text-white transition hover:bg-[#004f35] disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-[17px] animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in

              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-black/45">
        New to CAFÉTA?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-[#006241] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}