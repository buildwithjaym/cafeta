"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Coffee,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPinned,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  toast,
} from "sonner";

import {
  GoogleAuthButton,
} from "@/components/auth/google-auth-button";

import {
  createClient,
} from "@/lib/supabase/client";

export function RegisterForm() {
  const router =
    useRouter();

  const [
    fullName,
    setFullName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState(false);

  const normalizedEmail =
    useMemo(
      () =>
        email
          .trim()
          .toLowerCase(),
      [email],
    );

  const passwordChecks =
    useMemo(
      () => ({
        length:
          password.length >=
          8,

        letter:
          /[a-zA-Z]/.test(
            password,
          ),

        number:
          /\d/.test(
            password,
          ),

        matches:
          confirmPassword.length >
            0 &&
          password ===
            confirmPassword,
      }),
      [
        password,
        confirmPassword,
      ],
    );

  const passwordValid =
    passwordChecks.length &&
    passwordChecks.letter &&
    passwordChecks.number;

  const formValid =
    fullName.trim().length >
      0 &&
    normalizedEmail.length >
      0 &&
    passwordValid &&
    passwordChecks.matches;

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      loading ||
      success
    ) {
      return;
    }

    setError("");

    const cleanName =
      fullName.trim();

    if (!cleanName) {
      setError(
        "Tell us your name so we know what to call you.",
      );

      return;
    }

    if (
      !normalizedEmail
    ) {
      setError(
        "Enter your email address to continue.",
      );

      return;
    }

    if (
      !passwordChecks.length
    ) {
      setError(
        "Your password needs at least 8 characters.",
      );

      return;
    }

    if (
      !passwordChecks.letter ||
      !passwordChecks.number
    ) {
      setError(
        "Use at least one letter and one number in your password.",
      );

      return;
    }

    if (
      !passwordChecks.matches
    ) {
      setError(
        "Your passwords don't match yet.",
      );

      return;
    }

    setLoading(true);

    try {
      const supabase =
        createClient();

      const {
        data,
        error:
          signUpError,
      } =
        await supabase.auth.signUp(
          {
            email:
              normalizedEmail,

            password,

            options: {
              data: {
                full_name:
                  cleanName,
              },

              emailRedirectTo:
                `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                  "/onboarding",
                )}`,
            },
          },
        );

      if (
        signUpError
      ) {
        throw signUpError;
      }

      if (
        data.session
      ) {
        setSuccess(true);

        toast.success(
          "Welcome to CAFÉTA",
          {
            description:
              "Your account is ready. Let's make CAFÉTA yours.",
          },
        );

        window.setTimeout(
          () => {
            router.replace(
              "/onboarding",
            );

            router.refresh();
          },
          850,
        );

        return;
      }

      setSuccess(true);

      toast.success(
        "You're almost in",
        {
          description:
            "Check your inbox and verify your email to continue.",
        },
      );

      window.setTimeout(
        () => {
          router.replace(
            `/auth/login?registered=true&next=${encodeURIComponent(
              "/onboarding",
            )}&email=${encodeURIComponent(
              normalizedEmail,
            )}`,
          );

          router.refresh();
        },
        1200,
      );
    } catch (error) {
      console.error(
        "[CAFÉTA] Registration failed:",
        error,
      );

      setError(
        getFriendlyAuthError(
          error,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <RegistrationIntro />

      <div className="mt-6">
        <GoogleAuthButton />
      </div>

      <Divider />

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-3.5"
      >
        <Field
          id="fullName"
          label="Full name"
          icon={
            <UserRound className="size-4" />
          }
        >
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            disabled={
              loading ||
              success
            }
            value={
              fullName
            }
            onChange={(
              event,
            ) => {
              setFullName(
                event.target
                  .value,
              );

              if (error) {
                setError("");
              }
            }}
            placeholder="Your full name"
            className={inputClassName}
          />
        </Field>

        <Field
          id="email"
          label="Email address"
          icon={
            <Mail className="size-4" />
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
            disabled={
              loading ||
              success
            }
            value={email}
            onChange={(
              event,
            ) => {
              setEmail(
                event.target
                  .value,
              );

              if (error) {
                setError("");
              }
            }}
            placeholder="you@example.com"
            className={inputClassName}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field
            id="password"
            label="Password"
            icon={
              <LockKeyhole className="size-4" />
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
              disabled={
                loading ||
                success
              }
              value={
                password
              }
              onChange={(
                event,
              ) => {
                setPassword(
                  event.target
                    .value,
                );

                if (
                  error
                ) {
                  setError(
                    "",
                  );
                }
              }}
              placeholder="Create password"
              className={`${inputClassName} pr-11`}
            />

            <PasswordToggle
              visible={
                showPassword
              }
              disabled={
                loading ||
                success
              }
              onClick={() =>
                setShowPassword(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
            />
          </Field>

          <Field
            id="confirmPassword"
            label="Confirm password"
            icon={
              <LockKeyhole className="size-4" />
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
              disabled={
                loading ||
                success
              }
              value={
                confirmPassword
              }
              onChange={(
                event,
              ) => {
                setConfirmPassword(
                  event.target
                    .value,
                );

                if (
                  error
                ) {
                  setError(
                    "",
                  );
                }
              }}
              placeholder="Repeat password"
              className={`${inputClassName} pr-11`}
            />

            <PasswordToggle
              visible={
                showConfirmPassword
              }
              disabled={
                loading ||
                success
              }
              onClick={() =>
                setShowConfirmPassword(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
            />
          </Field>
        </div>

        {password.length >
          0 && (
          <PasswordRequirements
            length={
              passwordChecks.length
            }
            letter={
              passwordChecks.letter
            }
            number={
              passwordChecks.number
            }
            matches={
              passwordChecks.matches
            }
            showMatch={
              confirmPassword.length >
              0
            }
          />
        )}

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="animate-in fade-in slide-in-from-top-1 rounded-[14px] border border-red-200/80 bg-red-50 px-3.5 py-3 duration-200"
          >
            <p className="text-[11px] font-semibold leading-4 text-red-700">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            success ||
            !formValid
          }
          className="
            group
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-[15px]
            bg-[#006241]
            px-5
            text-[12px]
            font-black
            text-white
            shadow-[0_9px_24px_rgba(0,98,65,0.16)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#00754a]
            hover:shadow-[0_12px_30px_rgba(0,98,65,0.2)]
            active:translate-y-0
            active:scale-[0.99]
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-[#006241]/15
            disabled:pointer-events-none
            disabled:translate-y-0
            disabled:bg-black/10
            disabled:text-black/25
            disabled:shadow-none
          "
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />

              Creating your
              account...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="size-4" />

              Account created
            </>
          ) : (
            <>
              Create my CAFÉTA
              account

              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="px-3 text-center text-[9px] leading-4 text-black/30">
          By creating an
          account, you agree to
          CAFÉTA&apos;s{" "}

          <Link
            href="/terms"
            className="font-semibold text-black/50 transition hover:text-[#006241]"
          >
            Terms
          </Link>

          {" "}and{" "}

          <Link
            href="/privacy"
            className="font-semibold text-black/50 transition hover:text-[#006241]"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <div className="mt-5 border-t border-black/[0.055] pt-5 text-center">
        <p className="text-[11px] text-black/40">
          Already part of
          CAFÉTA?{" "}

          <Link
            href="/auth/login"
            className="font-black text-[#006241] transition hover:text-[#00754a]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function RegistrationIntro() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-full bg-[#e7f2ed] text-[#006241]">
          <Coffee className="size-3.5" />
        </div>

        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#006241]">
          Join CAFÉTA
        </p>
      </div>

      <h1 className="mt-4 max-w-[430px] text-[1.8rem] font-black leading-[1.08] tracking-[-0.055em] text-[#17211c] sm:text-[2.1rem]">
        Your next favorite
        café starts here.
      </h1>

      <p className="mt-3 max-w-[440px] text-[12px] leading-5 text-black/43 sm:text-[13px]">
        Discover local cafés,
        check menus before you
        visit, and see the moments
        people are sharing around
        Basilan.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <MiniBenefit
          icon={
            <MapPinned className="size-3" />
          }
        >
          Discover nearby
        </MiniBenefit>

        <MiniBenefit
          icon={
            <Coffee className="size-3" />
          }
        >
          Browse menus
        </MiniBenefit>

        <MiniBenefit
          icon={
            <Sparkles className="size-3" />
          }
        >
          Share Memories
        </MiniBenefit>
      </div>
    </div>
  );
}

function MiniBenefit({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[#006241]/[0.08] bg-[#f4f8f6] px-2.5 py-1.5 text-[9px] font-bold text-[#006241]">
      {icon}

      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-black/[0.06]" />

      <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-black/25">
        or continue with
        email
      </span>

      <div className="h-px flex-1 bg-black/[0.06]" />
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
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[10px] font-bold text-[#24312b]"
      >
        {label}
      </label>

      <div
        className="
          relative
          w-full
          overflow-hidden
          rounded-[14px]
          border
          border-black/[0.08]
          bg-[#fafbfa]
          transition-all
          duration-200
          focus-within:border-[#006241]/30
          focus-within:bg-white
          focus-within:shadow-[0_0_0_4px_rgba(0,98,65,0.045)]
        "
      >
        <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-black/25 transition-colors">
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}

const inputClassName = `
  h-11
  w-full
  bg-transparent
  pl-10
  pr-3.5
  text-[12px]
  font-medium
  text-[#17211c]
  outline-none
  placeholder:font-normal
  placeholder:text-black/25
  disabled:cursor-not-allowed
  disabled:opacity-50
`;

function PasswordToggle({
  visible,
  disabled,
  onClick,
}: {
  visible: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
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
        size-8
        -translate-y-1/2
        items-center
        justify-center
        rounded-[9px]
        text-black/25
        transition
        hover:bg-black/[0.035]
        hover:text-black/55
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#006241]/15
        disabled:pointer-events-none
      "
    >
      {visible ? (
        <EyeOff className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
    </button>
  );
}

function PasswordRequirements({
  length,
  letter,
  number,
  matches,
  showMatch,
}: {
  length: boolean;
  letter: boolean;
  number: boolean;
  matches: boolean;
  showMatch: boolean;
}) {
  return (
    <div className="animate-in fade-in duration-200 rounded-[14px] bg-[#f7f9f8] px-3.5 py-3">
      <p className="mb-2 text-[9px] font-bold text-black/35">
        Your password needs:
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Requirement
          valid={length}
        >
          8+ characters
        </Requirement>

        <Requirement
          valid={letter}
        >
          A letter
        </Requirement>

        <Requirement
          valid={number}
        >
          A number
        </Requirement>

        {showMatch && (
          <Requirement
            valid={
              matches
            }
          >
            Passwords match
          </Requirement>
        )}
      </div>
    </div>
  );
}

function Requirement({
  valid,
  children,
}: {
  valid: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[9px] font-semibold transition-colors ${
        valid
          ? "text-[#006241]"
          : "text-black/30"
      }`}
    >
      <span
        className={`flex size-3.5 items-center justify-center rounded-full transition-all ${
          valid
            ? "bg-[#006241] text-white"
            : "border border-black/[0.1] bg-white"
        }`}
      >
        {valid && (
          <Check className="size-2.5" />
        )}
      </span>

      {children}
    </div>
  );
}

function getFriendlyAuthError(
  error: unknown,
) {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong while creating your account.";

  const normalized =
    message.toLowerCase();

  if (
    normalized.includes(
      "already registered",
    ) ||
    normalized.includes(
      "already been registered",
    ) ||
    normalized.includes(
      "user already registered",
    )
  ) {
    return "This email already has a CAFÉTA account. Try signing in instead.";
  }

  if (
    normalized.includes(
      "invalid email",
    )
  ) {
    return "That email address doesn't look right. Check it and try again.";
  }

  if (
    normalized.includes(
      "password",
    )
  ) {
    return message;
  }

  if (
    normalized.includes(
      "rate limit",
    ) ||
    normalized.includes(
      "too many",
    )
  ) {
    return "Too many attempts were made. Give it a moment and try again.";
  }

  return message;
}