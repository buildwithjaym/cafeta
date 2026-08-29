"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  LoaderCircle,
  UserRound,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;

  fullName: string | null;
  avatarUrl: string | null;
  initialUsername: string | null;

  onComplete: (
    username: string,
  ) => void;

  onBack: () => void;
};

type Availability =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

const USERNAME_PATTERN =
  /^[a-z0-9._]{3,30}$/;

export function OnboardingIdentity({
  userId,
  fullName,
  avatarUrl,
  initialUsername,
  onComplete,
  onBack,
}: Props) {
  const [username, setUsername] =
    useState(
      initialUsername ?? "",
    );

  const [
    availability,
    setAvailability,
  ] =
    useState<Availability>(
      initialUsername
        ? "available"
        : "idle",
    );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const normalized =
    useMemo(
      () =>
        normalizeUsername(
          username,
        ),
      [username],
    );

  useEffect(() => {
    if (!normalized) {
      setAvailability(
        "idle",
      );

      return;
    }

    if (
      !USERNAME_PATTERN.test(
        normalized,
      )
    ) {
      setAvailability(
        "invalid",
      );

      return;
    }

    if (
      initialUsername &&
      normalized ===
        initialUsername.toLowerCase()
    ) {
      setAvailability(
        "available",
      );

      return;
    }

    setAvailability(
      "checking",
    );

    const timeout =
      window.setTimeout(
        async () => {
          const supabase =
            createClient();

          const {
            data,
            error,
          } =
            await supabase.rpc(
              "is_username_available",
              {
                requested_username:
                  normalized,
              },
            );

          if (error) {
            console.error(
              "[CAFÉTA] Username availability:",
              error,
            );

            setAvailability(
              "idle",
            );

            return;
          }

          setAvailability(
            data
              ? "available"
              : "taken",
          );
        },
        450,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    normalized,
    initialUsername,
  ]);

  async function claimUsername() {
    if (
      availability !==
      "available"
    ) {
      return;
    }

    setSubmitting(true);

    try {
      const supabase =
        createClient();

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (
        !user ||
        user.id !== userId
      ) {
        throw new Error(
          "Your session has expired.",
        );
      }

      const {
        error,
      } =
        await supabase
          .from("profiles")
          .update({
            username:
              normalized,
          })
          .eq("id", userId);

      if (error) {
        if (
          error.code ===
          "23505"
        ) {
          setAvailability(
            "taken",
          );

          toast.error(
            "That username was just taken.",
          );

          return;
        }

        throw error;
      }

      onComplete(
        normalized,
      );
    } catch (error) {
      toast.error(
        "Couldn't save your username",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center">
        <ProfileAvatar
          avatarUrl={
            avatarUrl
          }
          name={
            fullName ??
            normalized
          }
        />

        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#006241]">
          Make it yours
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-[-0.055em] text-[#17211c] sm:text-[38px]">
          What should we call you?
        </h1>

        <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-black/40">
          Your username is how
          people will recognize you
          in Memories, reviews, and
          conversations around
          CAFÉTA.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <label
          htmlFor="cafeta-username"
          className="text-[10px] font-black text-[#17211c]"
        >
          Your username
        </label>

        <div
          className={`mt-2 flex h-13 items-center rounded-[17px] border bg-[#f7f9f8] px-4 transition ${
            availability ===
            "available"
              ? "border-[#006241]/35 bg-[#f4f9f6]"
              : availability ===
                  "taken"
                ? "border-red-300"
                : "border-black/[0.07] focus-within:border-[#006241]/30 focus-within:bg-white"
          }`}
        >
          <span className="text-sm font-black text-[#006241]">
            @
          </span>

          <input
            id="cafeta-username"
            value={username}
            disabled={
              submitting
            }
            autoComplete="username"
            spellCheck={false}
            maxLength={30}
            onChange={(
              event,
            ) => {
              setUsername(
                normalizeUsername(
                  event.target
                    .value,
                ),
              );
            }}
            placeholder="yourusername"
            className="h-full min-w-0 flex-1 bg-transparent px-1.5 text-sm font-bold text-[#17211c] outline-none placeholder:font-medium placeholder:text-black/25"
          />

          <AvailabilityIcon
            state={
              availability
            }
          />
        </div>

        <UsernameMessage
          username={
            normalized
          }
          state={
            availability
          }
        />

        <div className="mt-8 flex gap-2">
          <button
            type="button"
            disabled={
              submitting
            }
            onClick={onBack}
            className="h-12 rounded-full border border-black/[0.07] px-5 text-xs font-bold text-black/45 transition hover:bg-black/[0.025]"
          >
            Back
          </button>

          <button
            type="button"
            disabled={
              submitting ||
              availability !==
                "available"
            }
            onClick={
              claimUsername
            }
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#006241] px-5 text-xs font-black text-white shadow-[0_8px_24px_rgba(0,98,65,0.16)] transition hover:bg-[#00754a] disabled:pointer-events-none disabled:bg-black/10 disabled:text-black/25"
          >
            {submitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <>
                Claim
                {normalized
                  ? ` @${normalized}`
                  : " username"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AvailabilityIcon({
  state,
}: {
  state: Availability;
}) {
  if (
    state === "checking"
  ) {
    return (
      <LoaderCircle className="size-4 animate-spin text-black/30" />
    );
  }

  if (
    state === "available"
  ) {
    return (
      <div className="flex size-5 items-center justify-center rounded-full bg-[#006241] text-white">
        <Check className="size-3" />
      </div>
    );
  }

  if (
    state === "taken" ||
    state === "invalid"
  ) {
    return (
      <div className="flex size-5 items-center justify-center rounded-full bg-red-100 text-red-500">
        <X className="size-3" />
      </div>
    );
  }

  return null;
}

function UsernameMessage({
  username,
  state,
}: {
  username: string;
  state: Availability;
}) {
  if (
    state === "checking"
  ) {
    return (
      <p className="mt-2 px-1 text-[10px] text-black/35">
        Checking
        {username
          ? ` @${username}`
          : ""}
        ...
      </p>
    );
  }

  if (
    state === "available"
  ) {
    return (
      <p className="mt-2 px-1 text-[10px] font-bold text-[#006241]">
        @{username} is
        available.
      </p>
    );
  }

  if (
    state === "taken"
  ) {
    return (
      <p className="mt-2 px-1 text-[10px] font-semibold text-red-500">
        @{username} is
        already taken. Try
        another one.
      </p>
    );
  }

  if (
    state === "invalid"
  ) {
    return (
      <p className="mt-2 px-1 text-[10px] text-red-500">
        Use 3–30 lowercase
        letters, numbers,
        periods, or underscores.
      </p>
    );
  }

  return (
    <p className="mt-2 px-1 text-[10px] leading-4 text-black/30">
      3–30 characters. Letters,
      numbers, "." and "_" only.
    </p>
  );
}

function ProfileAvatar({
  avatarUrl,
  name,
}: {
  avatarUrl: string | null;
  name: string;
}) {
  const [failed, setFailed] =
    useState(false);

  return (
    <div className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e7f1ec] shadow-[0_10px_30px_rgba(23,33,28,0.12)]">
      {avatarUrl &&
      !failed ? (
        <img
          src={avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(true)
          }
          className="size-full object-cover"
        />
      ) : (
        <UserRound className="size-7 text-[#006241]" />
      )}
    </div>
  );
}

function normalizeUsername(
  value: string,
) {
  return value
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/\s+/g, "")
    .replace(
      /[^a-z0-9._]/g,
      "",
    )
    .slice(0, 30);
}