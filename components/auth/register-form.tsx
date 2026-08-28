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
        max-w-[460px]
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

            sm:text-xs
          "
        >
          Join CAFÉTA
        </p>

        <h1
          className="
            mt-2
            text-[1.75rem]
            font-bold
            leading-[1.08]
            tracking-[-0.045em]
            text-[#13231b]

            sm:mt-3
            sm:text-[2rem]

            lg:text-[2.15rem]
          "
        >
          Create your account
        </h1>

        <p
          className="
            mt-2
            max-w-md
            text-[13px]
            leading-5
            text-black/45

            sm:text-sm
            sm:leading-6
          "
        >
          Discover local cafés,
          save your favorites, and
          find your next kape spot.
        </p>
      </div>

      {/* Google auth */}
      <div
        className="
          mt-5

          sm:mt-6
        "
      >
        <GoogleAuthButton />
      </div>

      {/* Divider */}
      <div
        className="
          my-4
          flex
          items-center
          gap-3

          sm:my-5
          sm:gap-4
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
            shrink-0
            whitespace-nowrap
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.13em]
            text-black/30

            sm:text-[10px]
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

      {/* Registration form */}
      <form
        onSubmit={handleSubmit}
        className="
          space-y-3.5

          sm:space-y-4
        "
      >
        <Field
          id="fullName"
          label="Full name"
          icon={
            <UserRound
              className="
                size-[17px]
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
              h-12
              w-full
              bg-transparent
              pl-11
              pr-4
              text-[13px]
              text-[#13231b]
              outline-none
              placeholder:text-black/25

              sm:text-sm
            "
          />
        </Field>

        <Field
          id="email"
          label="Email address"
          icon={
            <Mail
              className="
                size-[17px]
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
              h-12
              w-full
              bg-transparent
              pl-11
              pr-4
              text-[13px]
              text-[#13231b]
              outline-none
              placeholder:text-black/25

              sm:text-sm
            "
          />
        </Field>

        <Field
          id="password"
          label="Password"
          icon={
            <LockKeyhole
              className="
                size-[17px]
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
            placeholder="At least 8 characters"
            className="
              h-12
              w-full
              bg-transparent
              pl-11
              pr-12
              text-[13px]
              text-[#13231b]
              outline-none
              placeholder:text-black/25

              sm:text-sm
            "
          />

          <PasswordToggle
            visible={showPassword}
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
                size-[17px]
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
            placeholder="Enter your password again"
            className="
              h-12
              w-full
              bg-transparent
              pl-11
              pr-12
              text-[13px]
              text-[#13231b]
              outline-none
              placeholder:text-black/25

              sm:text-sm
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

        {/* Password validation */}
        {password.length > 0 && (
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
              px-1
              pt-0.5
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
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-3.5
              py-3
              text-[11px]
              leading-5
              text-red-700

              sm:px-4
              sm:text-xs
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
            min-h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#006241]
            px-5
            py-3
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

            sm:text-sm
          "
        >
          {loading ? (
            <>
              <LoaderCircle
                className="
                  size-[17px]
                  animate-spin
                "
              />

              <span>
                Creating account...
              </span>
            </>
          ) : (
            <>
              <span>
                Create account
              </span>

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
            px-1
            text-center
            text-[9px]
            leading-[1.6]
            text-black/35

            sm:px-4
            sm:text-[10px]
          "
        >
          By continuing, you agree
          to CAFÉTA&apos;s{" "}

          <Link
            href="/terms"
            className="
              font-medium
              text-black/55
              transition
              hover:text-[#006241]
              hover:underline
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
              transition
              hover:text-[#006241]
              hover:underline
            "
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      {/* Sign in */}
      <div
        className="
          mt-5
          border-t
          border-black/[0.06]
          pt-4

          sm:mt-6
          sm:pt-5
        "
      >
        <p
          className="
            text-center
            text-xs
            text-black/45

            sm:text-sm
          "
        >
          Already have an account?{" "}

          <Link
            href="/auth/login"
            className="
              font-semibold
              text-[#006241]
              transition
              hover:text-[#004f35]
              hover:underline
            "
          >
            Sign in
          </Link>
        </p>
      </div>
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
          mb-1.5
          block
          text-[10px]
          font-semibold
          text-[#24312b]

          sm:text-[11px]
        "
      >
        {label}
      </label>

      <div
        className="
          relative
          w-full
          rounded-xl
          border
          border-black/[0.09]
          bg-white
          transition

          focus-within:border-[#006241]/50
          focus-within:ring-4
          focus-within:ring-[#006241]/[0.06]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-3.5
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
        right-1.5
        top-1/2
        flex
        size-9
        -translate-y-1/2
        items-center
        justify-center
        rounded-lg
        text-black/30
        transition

        hover:bg-black/[0.04]
        hover:text-black/60

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#006241]/20
      "
    >
      {visible ? (
        <EyeOff
          className="
            size-[17px]
          "
        />
      ) : (
        <Eye
          className="
            size-[17px]
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
        min-w-0
        items-center
        gap-1.5
        text-[9px]
        font-medium

        sm:text-[10px]

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