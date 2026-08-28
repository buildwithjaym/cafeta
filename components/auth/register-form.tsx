"use client";

import Link from "next/link";

import {
  FormEvent,
  ReactNode,
  useState,
} from "react";

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

import {
  useRouter,
} from "next/navigation";

import {
  GoogleAuthButton,
} from "@/components/auth/google-auth-button";

import {
  createClient,
} from "@/lib/supabase/client";

export function RegisterForm() {
  const router =
    useRouter();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const passwordValid =
    password.length >= 8;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const normalizedFullName =
      fullName.trim();

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (!normalizedFullName) {
      setError(
        "Please enter your full name.",
      );

      return;
    }

    if (!normalizedEmail) {
      setError(
        "Please enter your email address.",
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );

      return;
    }

    setLoading(true);

    try {
      const supabase =
        createClient();

      const {
        data,
        error: signUpError,
      } =
        await supabase.auth
          .signUp({
            email:
              normalizedEmail,

            password,

            options: {
              data: {
                full_name:
                  normalizedFullName,
              },

              emailRedirectTo:
                `${window.location.origin}/auth/callback`,
            },
          });

      if (signUpError) {
        setError(
          signUpError.message,
        );

        return;
      }

      if (data.session) {
        router.replace(
          "/explore",
        );

        router.refresh();

        return;
      }

      router.replace(
        `/auth/login?registered=true&email=${encodeURIComponent(
          normalizedEmail,
        )}`,
      );
    } catch (error) {
      console.error(
        "[CAFÉTA] Registration failed:",
        error,
      );

      setError(
        "Something went wrong while creating your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[520px]
      "
    >
      {/* Header */}
      <div>
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#006241]

            sm:text-[11px]
          "
        >
          Join CAFÉTA
        </p>

        <h1
          className="
            mt-1.5
            text-[1.6rem]
            font-bold
            leading-tight
            tracking-[-0.04em]
            text-[#13231b]

            sm:text-[1.8rem]

            lg:text-[1.95rem]
          "
        >
          Create your account
        </h1>

        <p
          className="
            mt-1.5
            max-w-md
            text-[12px]
            leading-5
            text-black/45

            sm:text-[13px]
          "
        >
          Discover cafés,
          save favorites,
          and find your next kape spot.
        </p>
      </div>

      {/* Google */}
      <div
        className="
          mt-4
        "
      >
        <GoogleAuthButton />
      </div>

      {/* Divider */}
      <div
        className="
          my-3.5
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            h-px
            flex-1
            bg-black/[0.07]
          "
        />

        <span
          className="
            whitespace-nowrap
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-black/30
          "
        >
          or use email
        </span>

        <div
          className="
            h-px
            flex-1
            bg-black/[0.07]
          "
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="
          space-y-3
        "
      >
        <Field
          id="fullName"
          label="Full name"
          icon={
            <UserRound
              className="
                size-4
              "
            />
          }
        >
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) =>
              setFullName(
                event.target.value,
              )
            }
            placeholder="Your full name"
            className="
              h-10
              w-full
              bg-transparent
              pl-10
              pr-3
              text-[13px]
              text-[#13231b]
              outline-none
              placeholder:text-black/25
            "
          />
        </Field>

        <Field
          id="email"
          label="Email address"
          icon={
            <Mail
              className="
                size-4
              "
            />
          }
        >
          <input
            id="email"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            placeholder="you@example.com"
            className="
              h-10
              w-full
              bg-transparent
              pl-10
              pr-3
              text-[13px]
              text-[#13231b]
              outline-none
              placeholder:text-black/25
            "
          />
        </Field>

        {/* Password row */}
        <div
          className="
            grid
            grid-cols-1
            gap-3

            md:grid-cols-2
          "
        >
          <Field
            id="password"
            label="Password"
            icon={
              <LockKeyhole
                className="
                  size-4
                "
              />
            }
          >
            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              placeholder="8+ characters"
              className="
                h-10
                w-full
                bg-transparent
                pl-10
                pr-10
                text-[13px]
                text-[#13231b]
                outline-none
                placeholder:text-black/25
              "
            />

            <PasswordToggle
              visible={
                showPassword
              }
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current,
                )
              }
            />
          </Field>

          <Field
            id="confirmPassword"
            label="Confirm password"
            icon={
              <LockKeyhole
                className="
                  size-4
                "
              />
            }
          >
            <input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="Repeat password"
              className="
                h-10
                w-full
                bg-transparent
                pl-10
                pr-10
                text-[13px]
                text-[#13231b]
                outline-none
                placeholder:text-black/25
              "
            />

            <PasswordToggle
              visible={
                showConfirmPassword
              }
              onClick={() =>
                setShowConfirmPassword(
                  (current) =>
                    !current,
                )
              }
            />
          </Field>
        </div>

        {/* Password status */}
        {password.length > 0 && (
          <div
            className="
              flex
              flex-wrap
              gap-x-4
              gap-y-1.5
              px-0.5
            "
          >
            <PasswordCheck
              valid={
                passwordValid
              }
              label="8+ characters"
            />

            {confirmPassword.length >
              0 && (
              <PasswordCheck
                valid={
                  passwordsMatch
                }
                label={
                  passwordsMatch
                    ? "Passwords match"
                    : "Passwords don't match"
                }
              />
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-3
              py-2
              text-[11px]
              leading-4
              text-red-700
            "
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            group
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#006241]
            px-4
            text-[13px]
            font-semibold
            text-white
            transition

            hover:bg-[#004f35]

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-[#006241]/20

            disabled:pointer-events-none
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <LoaderCircle
                className="
                  size-4
                  animate-spin
                "
              />

              Creating account...
            </>
          ) : (
            <>
              Create account

              <ArrowRight
                className="
                  size-4
                  transition-transform
                  group-hover:translate-x-0.5
                "
              />
            </>
          )}
        </button>

        {/* Terms */}
        <p
          className="
            px-2
            text-center
            text-[9px]
            leading-4
            text-black/35
          "
        >
          By continuing, you agree to
          CAFÉTA&apos;s{" "}

          <Link
            href="/terms"
            className="
              font-medium
              text-black/55
              hover:text-[#006241]
            "
          >
            Terms
          </Link>{" "}

          and{" "}

          <Link
            href="/privacy"
            className="
              font-medium
              text-black/55
              hover:text-[#006241]
            "
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      {/* Sign in */}
      <p
        className="
          mt-3
          text-center
          text-[11px]
          text-black/45

          sm:text-xs
        "
      >
        Already have an account?{" "}

        <Link
          href="/auth/login"
          className="
            font-semibold
            text-[#006241]
            hover:underline
          "
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
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className="
        w-full
      "
    >
      <label
        htmlFor={id}
        className="
          mb-1
          block
          text-[10px]
          font-semibold
          text-[#24312b]
        "
      >
        {label}
      </label>

      <div
        className="
          relative
          w-full
          rounded-lg
          border
          border-black/[0.09]
          bg-white
          transition

          focus-within:border-[#006241]/50
          focus-within:ring-3
          focus-within:ring-[#006241]/[0.06]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            z-10
            -translate-y-1/2
            text-black/30
          "
        >
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}

function PasswordToggle({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        visible
          ? "Hide password"
          : "Show password"
      }
      className="
        absolute
        right-1
        top-1/2
        flex
        size-8
        -translate-y-1/2
        items-center
        justify-center
        rounded-md
        text-black/30
        transition

        hover:bg-black/[0.04]
        hover:text-black/60
      "
    >
      {visible ? (
        <EyeOff
          className="
            size-4
          "
        />
      ) : (
        <Eye
          className="
            size-4
          "
        />
      )}
    </button>
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
      className={`
        flex
        items-center
        gap-1.5
        text-[9px]
        font-medium

        ${
          valid
            ? "text-[#006241]"
            : "text-black/35"
        }
      `}
    >
      <CheckCircle2
        className="
          size-3
          shrink-0
        "
      />

      <span>
        {label}
      </span>
    </div>
  );
}