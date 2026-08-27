"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordValid = password.length >= 8;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/explore");
      router.refresh();
      return;
    }

    router.push(
      `/auth/login?registered=true&email=${encodeURIComponent(
        email.trim(),
      )}`,
    );
  }

  return (
    <div className="w-full">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#006241]">
          Join CAFÉTA
        </p>

        <h1 className="mt-2 text-[2rem] font-bold tracking-[-0.045em] text-[#13231b]">
          Create your account
        </h1>

        <p className="mt-1.5 text-sm leading-5 text-black/45">
          Discover local cafés, save your favorites, and find
          your next kape spot.
        </p>
      </div>

      <div className="mt-5">
        <GoogleAuthButton />
      </div>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/[0.07]" />

        <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
          or use email
        </span>

        <div className="h-px flex-1 bg-black/[0.07]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        <Field
          id="fullName"
          label="Full name"
          icon={<UserRound className="size-4" />}
        >
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            placeholder="Your full name"
            className="h-11 w-full bg-transparent pl-10 pr-4 text-sm text-[#13231b] outline-none placeholder:text-black/25"
          />
        </Field>

        <Field
          id="email"
          label="Email address"
          icon={<Mail className="size-4" />}
        >
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
            className="h-11 w-full bg-transparent pl-10 pr-4 text-sm text-[#13231b] outline-none placeholder:text-black/25"
          />
        </Field>

        <Field
          id="password"
          label="Password"
          icon={<LockKeyhole className="size-4" />}
        >
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="At least 8 characters"
            className="h-11 w-full bg-transparent pl-10 pr-11 text-sm text-[#13231b] outline-none placeholder:text-black/25"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/30 transition hover:text-black/60"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </Field>

        <Field
          id="confirmPassword"
          label="Confirm password"
          icon={<LockKeyhole className="size-4" />}
        >
          <input
            id="confirmPassword"
            type={
              showConfirmPassword ? "text" : "password"
            }
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Enter your password again"
            className="h-11 w-full bg-transparent pl-10 pr-11 text-sm text-[#13231b] outline-none placeholder:text-black/25"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (current) => !current,
              )
            }
            aria-label={
              showConfirmPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/30 transition hover:text-black/60"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </Field>

        {password.length > 0 && (
          <div className="flex items-center gap-4 px-1">
            <PasswordCheck
              valid={passwordValid}
              label="8+ characters"
            />

            {confirmPassword.length > 0 && (
              <PasswordCheck
                valid={passwordsMatch}
                label={
                  passwordsMatch
                    ? "Passwords match"
                    : "Passwords don't match"
                }
              />
            )}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs leading-5 text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#006241] px-5 text-sm font-semibold text-white transition hover:bg-[#004f35] disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="text-center text-[10px] leading-4 text-black/35">
          By continuing, you agree to CAFÉTA&apos;s{" "}
          <Link
            href="/terms"
            className="font-medium text-black/55 hover:text-[#006241]"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-black/55 hover:text-[#006241]"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <p className="mt-3 text-center text-xs text-black/45">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-[#006241] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-semibold text-[#24312b]"
      >
        {label}
      </label>

      <div className="relative rounded-xl border border-black/[0.09] bg-white transition focus-within:border-[#006241]/50 focus-within:ring-4 focus-within:ring-[#006241]/[0.06]">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30">
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}

function PasswordCheck({
  valid,
  label,
}: {
  valid: boolean;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[10px] ${
        valid ? "text-[#006241]" : "text-black/35"
      }`}
    >
      <CheckCircle2 className="size-3" />
      {label}
    </div>
  );
}