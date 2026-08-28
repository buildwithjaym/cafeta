"use client";

import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AtSign,
  Check,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  CafetaProfile,
} from "@/lib/profile/types";

import {
  PROFILE_SELECT,
} from "@/lib/profile/types";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  open: boolean;
  profile: CafetaProfile;
  onClose: () => void;
  onUpdated: (
    profile: CafetaProfile,
  ) => void;
};

type AvailabilityState =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "error";

const USERNAME_REGEX =
  /^[a-z0-9._]{3,30}$/;

const USERNAME_CHECK_DELAY =
  500;

const RESERVED_USERNAMES =
  new Set([
    "admin",
    "administrator",
    "cafeta",
    "support",
    "help",
    "explore",
    "map",
    "saved",
    "profile",
    "profiles",
    "auth",
    "login",
    "logout",
    "register",
    "signup",
    "signin",
    "settings",
    "business",
    "businesses",
    "memory",
    "memories",
    "moderator",
    "official",
    "system",
    "api",
    "account",
    "accounts",
    "about",
    "contact",
    "privacy",
    "terms",
    "security",
  ]);

export function ChangeUsernameModal({
  open,
  profile,
  onClose,
  onUpdated,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const requestRef =
    useRef(0);

  const [
    username,
    setUsername,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    availability,
    setAvailability,
  ] =
    useState<AvailabilityState>(
      "idle",
    );

  const normalizedUsername =
    normalizeUsername(
      username,
    );

  const normalizedCurrent =
    normalizeUsername(
      profile.username ?? "",
    );

  const unchanged =
    normalizedUsername ===
    normalizedCurrent;

  const valid =
    USERNAME_REGEX.test(
      normalizedUsername,
    );

  const reserved =
    RESERVED_USERNAMES.has(
      normalizedUsername,
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    requestRef.current += 1;

    setUsername(
      profile.username ?? "",
    );

    setError("");

    setAvailability(
      "idle",
    );

    const timer =
      window.setTimeout(
        () => {
          inputRef.current?.focus();
        },
        120,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    open,
    profile.username,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style
      .overflow =
      "hidden";

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
          "Escape" &&
        !saving
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style
        .overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [
    open,
    saving,
    onClose,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const requestId =
      ++requestRef.current;

    if (
      !normalizedUsername ||
      unchanged ||
      !valid ||
      reserved
    ) {
      setAvailability(
        "idle",
      );

      return;
    }

    setAvailability(
      "checking",
    );

    const timer =
      window.setTimeout(
        async () => {
          try {
            const supabase =
              createClient();

            const {
              data,
              error:
                availabilityError,
            } =
              await supabase.rpc(
                "is_username_available",
                {
                  requested_username:
                    normalizedUsername,
                },
              );

            if (
              requestId !==
              requestRef.current
            ) {
              return;
            }

            if (
              availabilityError
            ) {
              console.error(
                "[CAFÉTA] Username availability check failed:",
                availabilityError,
              );

              setAvailability(
                "error",
              );

              return;
            }

            setAvailability(
              data === true
                ? "available"
                : "taken",
            );
          } catch (
            availabilityError
          ) {
            if (
              requestId !==
              requestRef.current
            ) {
              return;
            }

            console.error(
              "[CAFÉTA] Unexpected username availability error:",
              availabilityError,
            );

            setAvailability(
              "error",
            );
          }
        },
        USERNAME_CHECK_DELAY,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    open,
    normalizedUsername,
    unchanged,
    valid,
    reserved,
  ]);

  if (!open) {
    return null;
  }

  function handleUsernameChange(
    value: string,
  ) {
    const next =
      normalizeUsername(
        value,
      );

    requestRef.current += 1;

    setUsername(
      next,
    );

    setError("");

    setAvailability(
      "idle",
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      saving ||
      unchanged
    ) {
      return;
    }

    setError("");

    if (
      !normalizedUsername
    ) {
      setError(
        "Please enter a username.",
      );

      return;
    }

    if (!valid) {
      setError(
        "Username must be 3–30 characters using only lowercase letters, numbers, periods, or underscores.",
      );

      return;
    }

    if (reserved) {
      setError(
        "That username is reserved by CAFÉTA. Please choose another one.",
      );

      return;
    }

    if (
      availability ===
      "checking"
    ) {
      setError(
        "Please wait while we check this username.",
      );

      return;
    }

    if (
      availability ===
      "taken"
    ) {
      setError(
        "That username is already taken.",
      );

      return;
    }

    if (
      availability !==
      "available"
    ) {
      setError(
        "We couldn't confirm that this username is available. Please try again.",
      );

      return;
    }

    setSaving(
      true,
    );

    try {
      const supabase =
        createClient();

      const {
        data: authData,
        error: authError,
      } =
        await supabase.auth
          .getUser();

      if (
        authError ||
        !authData.user
      ) {
        setError(
          "Your session has expired. Please sign in again.",
        );

        return;
      }

      if (
        authData.user.id !==
        profile.id
      ) {
        console.error(
          "[CAFÉTA] Profile ID does not match the authenticated user.",
        );

        setError(
          "We couldn't verify this profile. Please refresh the page and try again.",
        );

        return;
      }

      /*
       * Check availability again
       * immediately before UPDATE.
       *
       * This improves UX, but the
       * database UNIQUE index remains
       * the final authority.
       */
      const {
        data:
          stillAvailable,
        error:
          recheckError,
      } =
        await supabase.rpc(
          "is_username_available",
          {
            requested_username:
              normalizedUsername,
          },
        );

      if (recheckError) {
        console.error(
          "[CAFÉTA] Final username availability check failed:",
          recheckError,
        );

        setAvailability(
          "error",
        );

        setError(
          "We couldn't verify this username right now. Please try again.",
        );

        return;
      }

      if (
        stillAvailable !==
        true
      ) {
        setAvailability(
          "taken",
        );

        setError(
          "That username was just taken. Please choose another one.",
        );

        return;
      }

      const {
        data,
        error:
          updateError,
      } =
        await supabase
          .from(
            "profiles",
          )
          .update({
            username:
              normalizedUsername,
          })
          .eq(
            "id",
            authData.user.id,
          )
          .select(
            PROFILE_SELECT,
          )
          .single();

      if (
        updateError
      ) {
        console.error(
          "[CAFÉTA] Failed to update username:",
          updateError,
        );

        /*
         * PostgreSQL unique violation.
         *
         * This protects against the
         * race condition where another
         * account takes the username
         * between availability check
         * and UPDATE.
         */
        if (
          updateError.code ===
          "23505"
        ) {
          setAvailability(
            "taken",
          );

          setError(
            "That username was just taken. Please choose another one.",
          );

          return;
        }

        /*
         * PostgreSQL CHECK constraint
         * violation.
         */
        if (
          updateError.code ===
          "23514"
        ) {
          setError(
            "That username isn't valid. Please check the format and try again.",
          );

          return;
        }

        setError(
          "We couldn't update your username. Please try again.",
        );

        return;
      }

      if (!data) {
        setError(
          "We couldn't load your updated profile. Please refresh and try again.",
        );

        return;
      }

      const updatedProfile =
        data as CafetaProfile;

      onUpdated(
        updatedProfile,
      );

      toast.success(
        profile.username
          ? "Username updated"
          : "Username created",
        {
          description:
            `You're now @${updatedProfile.username} on CAFÉTA.`,
        },
      );

      onClose();
    } catch (
      submitError
    ) {
      console.error(
        "[CAFÉTA] Unexpected username update error:",
        submitError,
      );

      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  const canSubmit =
    valid &&
    !reserved &&
    !unchanged &&
    availability ===
      "available" &&
    !saving;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]

        flex
        items-end
        justify-center

        bg-[#101713]/35

        backdrop-blur-[5px]

        animate-in
        fade-in-0
        duration-200

        sm:items-center
        sm:p-5
      "
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
            event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="username-modal-title"
        aria-describedby="username-modal-description"
        className="
          w-full

          animate-in
          slide-in-from-bottom-6
          duration-300

          sm:max-w-[470px]
          sm:slide-in-from-bottom-2
          sm:zoom-in-95
        "
      >
        <div
          className="
            overflow-hidden

            rounded-t-[30px]

            border
            border-black/[0.055]

            bg-white

            shadow-[0_32px_100px_rgba(0,0,0,0.24)]

            sm:rounded-[30px]
          "
        >
          <div
            className="
              mx-auto
              mt-2.5

              h-1
              w-10

              rounded-full

              bg-black/10

              sm:hidden
            "
          />

          <div
            className="
              flex
              items-start
              justify-between
              gap-5

              px-5
              pb-4
              pt-5

              sm:px-6
              sm:pt-6
            "
          >
            <div>
              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center

                  rounded-[15px]

                  border
                  border-[#006241]/[0.05]

                  bg-[#e8f2ed]

                  text-[#006241]

                  shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
                "
              >
                <AtSign
                  className="
                    size-[19px]
                  "
                  strokeWidth={
                    2.2
                  }
                />
              </div>

              <p
                className="
                  mt-4

                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]

                  text-[#006241]
                "
              >
                CAFÉTA identity
              </p>

              <h2
                id="username-modal-title"
                className="
                  mt-1

                  text-xl
                  font-black
                  tracking-[-0.04em]

                  text-[#17211c]
                "
              >
                {profile.username
                  ? "Change username"
                  : "Create username"}
              </h2>

              <p
                id="username-modal-description"
                className="
                  mt-1.5

                  max-w-sm

                  text-sm
                  leading-6

                  text-black/45
                "
              >
                Choose a unique
                username people can
                recognize you by across
                CAFÉTA.
              </p>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              aria-label="Close"
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center

                rounded-full

                bg-[#f4f5f4]

                text-black/40

                transition-all
                duration-200

                hover:rotate-90
                hover:bg-[#eceeec]
                hover:text-black/70

                active:scale-90

                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              <X
                className="
                  size-4
                "
                strokeWidth={
                  2
                }
              />
            </button>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <div
              className="
                px-5

                sm:px-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <label
                  htmlFor="username"
                  className="
                    text-xs
                    font-bold

                    text-[#26322b]
                  "
                >
                  Username
                </label>

                <span
                  className={`
                    text-[10px]
                    font-medium

                    ${
                      normalizedUsername
                        .length >=
                      30
                        ? "text-amber-600"
                        : "text-black/30"
                    }
                  `}
                >
                  {
                    normalizedUsername
                      .length
                  }
                  /30
                </span>
              </div>

              <div
                className={`
                  mt-2

                  flex
                  h-[54px]
                  items-center

                  rounded-[16px]

                  border

                  bg-[#fafbfa]

                  px-4

                  transition-all
                  duration-200

                  focus-within:bg-white
                  focus-within:ring-4

                  ${
                    error ||
                    reserved ||
                    availability ===
                      "taken"
                      ? "border-red-300 focus-within:ring-red-100"
                      : availability ===
                            "available" &&
                          !unchanged
                        ? "border-[#006241]/30 focus-within:border-[#006241]/40 focus-within:ring-[#006241]/[0.06]"
                        : "border-black/[0.08] focus-within:border-[#006241]/35 focus-within:ring-[#006241]/[0.06]"
                  }
                `}
              >
                <span
                  className="
                    mr-1

                    text-sm
                    font-bold

                    text-[#006241]
                  "
                >
                  @
                </span>

                <input
                  ref={
                    inputRef
                  }
                  id="username"
                  value={
                    username
                  }
                  onChange={(
                    event,
                  ) =>
                    handleUsernameChange(
                      event
                        .target
                        .value,
                    )
                  }
                  autoComplete="username"
                  spellCheck={
                    false
                  }
                  autoCapitalize="none"
                  maxLength={
                    30
                  }
                  placeholder="yourusername"
                  aria-invalid={Boolean(
                    error ||
                      reserved ||
                      availability ===
                        "taken",
                  )}
                  className="
                    min-w-0
                    flex-1

                    bg-transparent

                    text-sm
                    font-semibold

                    text-[#17211c]

                    outline-none

                    placeholder:font-normal
                    placeholder:text-black/25
                  "
                />

                <UsernameStatus
                  availability={
                    availability
                  }
                  valid={
                    valid
                  }
                  reserved={
                    reserved
                  }
                  unchanged={
                    unchanged
                  }
                />
              </div>

              <div
                className="
                  mt-2

                  min-h-[42px]
                "
              >
                <UsernameMessage
                  username={
                    normalizedUsername
                  }
                  currentUsername={
                    profile.username
                  }
                  valid={
                    valid
                  }
                  reserved={
                    reserved
                  }
                  unchanged={
                    unchanged
                  }
                  availability={
                    availability
                  }
                  error={
                    error
                  }
                />
              </div>

              <div
                className="
                  mt-2

                  overflow-hidden

                  rounded-[18px]

                  border
                  border-[#006241]/[0.08]

                  bg-[#f5f9f7]

                  px-4
                  py-3.5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.14em]

                      text-black/30
                    "
                  >
                    Your CAFÉTA username
                  </p>

                  {availability ===
                    "available" &&
                    !unchanged && (
                      <span
                        className="
                          flex
                          items-center
                          gap-1

                          text-[9px]
                          font-bold

                          text-[#006241]
                        "
                      >
                        <Check
                          className="
                            size-3
                          "
                        />

                        AVAILABLE
                      </span>
                    )}

                  {availability ===
                    "taken" && (
                    <span
                      className="
                        flex
                        items-center
                        gap-1

                        text-[9px]
                        font-bold

                        text-red-500
                      "
                    >
                      <X
                        className="
                          size-3
                        "
                      />

                      TAKEN
                    </span>
                  )}

                  {availability ===
                    "checking" && (
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5

                        text-[9px]
                        font-bold

                        text-black/35
                      "
                    >
                      <LoaderCircle
                        className="
                          size-3
                          animate-spin
                        "
                      />

                      CHECKING
                    </span>
                  )}
                </div>

                <div
                  className="
                    mt-2.5

                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <div
                    className="
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-[#006241]

                      text-white

                      shadow-[0_4px_12px_rgba(0,98,65,0.16)]
                    "
                  >
                    <AtSign
                      className="
                        size-3.5
                      "
                      strokeWidth={
                        2.3
                      }
                    />
                  </div>

                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        truncate

                        text-sm
                        font-extrabold
                        tracking-[-0.015em]

                        text-[#006241]
                      "
                    >
                      @
                      {normalizedUsername ||
                        "yourusername"}
                    </p>

                    <p
                      className="
                        mt-0.5

                        text-[10px]

                        text-black/35
                      "
                    >
                      Your public CAFÉTA
                      identity
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="
                  mt-3

                  flex
                  items-start
                  gap-2.5

                  rounded-[14px]

                  bg-[#f8f9f8]

                  px-3.5
                  py-3
                "
              >
                <ShieldCheck
                  className="
                    mt-0.5

                    size-3.5
                    shrink-0

                    text-[#006241]/70
                  "
                />

                <p
                  className="
                    text-[10px]
                    leading-[17px]

                    text-black/40
                  "
                >
                  Every CAFÉTA username
                  is unique. Once a
                  username is being used
                  by another account, it
                  cannot be assigned to
                  yours.
                </p>
              </div>
            </div>

            <div
              className="
                mt-5

                flex
                gap-2

                border-t
                border-black/[0.05]

                bg-[#fcfdfc]

                p-4

                sm:justify-end
                sm:px-6
              "
            >
              <button
                type="button"
                onClick={
                  onClose
                }
                disabled={
                  saving
                }
                className="
                  h-11
                  flex-1

                  rounded-[14px]

                  border
                  border-black/[0.07]

                  bg-white

                  px-5

                  text-xs
                  font-bold

                  text-[#36423b]

                  transition-all
                  duration-200

                  hover:bg-[#f5f7f5]

                  active:scale-[0.97]

                  disabled:pointer-events-none
                  disabled:opacity-50

                  sm:flex-none
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  !canSubmit
                }
                className="
                  flex
                  h-11
                  flex-[1.5]
                  items-center
                  justify-center
                  gap-2

                  rounded-[14px]

                  bg-[#006241]

                  px-5

                  text-xs
                  font-bold

                  text-white

                  shadow-[0_6px_18px_rgba(0,98,65,0.16)]

                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#00754a]
                  hover:shadow-[0_8px_22px_rgba(0,98,65,0.20)]

                  active:translate-y-0
                  active:scale-[0.97]

                  disabled:pointer-events-none
                  disabled:opacity-40

                  sm:flex-none
                "
              >
                {saving ? (
                  <>
                    <LoaderCircle
                      className="
                        size-3.5
                        animate-spin
                      "
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    {profile.username
                      ? "Save username"
                      : "Set username"}

                    {availability ===
                      "available" && (
                      <CheckCircle2
                        className="
                          size-3.5
                        "
                      />
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function UsernameStatus({
  availability,
  valid,
  reserved,
  unchanged,
}: {
  availability:
    AvailabilityState;
  valid: boolean;
  reserved: boolean;
  unchanged: boolean;
}) {
  if (
    unchanged ||
    !valid ||
    reserved
  ) {
    return null;
  }

  if (
    availability ===
    "checking"
  ) {
    return (
      <LoaderCircle
        className="
          size-[17px]
          shrink-0
          animate-spin

          text-black/25
        "
      />
    );
  }

  if (
    availability ===
    "available"
  ) {
    return (
      <CheckCircle2
        className="
          size-[18px]
          shrink-0

          animate-in
          zoom-in-75

          text-[#006241]

          duration-200
        "
      />
    );
  }

  if (
    availability ===
    "taken"
  ) {
    return (
      <XCircle
        className="
          size-[18px]
          shrink-0

          animate-in
          zoom-in-75

          text-red-500

          duration-200
        "
      />
    );
  }

  if (
    availability ===
    "error"
  ) {
    return (
      <XCircle
        className="
          size-[18px]
          shrink-0

          text-amber-500
        "
      />
    );
  }

  return null;
}

function UsernameMessage({
  username,
  currentUsername,
  valid,
  reserved,
  unchanged,
  availability,
  error,
}: {
  username: string;

  currentUsername:
    | string
    | null;

  valid: boolean;
  reserved: boolean;
  unchanged: boolean;

  availability:
    AvailabilityState;

  error: string;
}) {
  if (error) {
    return (
      <p
        role="alert"
        className="
          text-xs
          leading-5

          text-red-600
        "
      >
        {error}
      </p>
    );
  }

  if (
    reserved &&
    username
  ) {
    return (
      <p
        className="
          text-xs
          leading-5

          text-red-600
        "
      >
        @{username} is reserved by
        CAFÉTA. Please choose another
        username.
      </p>
    );
  }

  if (
    username &&
    !valid
  ) {
    return (
      <p
        className="
          text-[11px]
          leading-5

          text-black/40
        "
      >
        Use 3–30 lowercase letters,
        numbers, periods, or
        underscores.
      </p>
    );
  }

  if (
    unchanged &&
    currentUsername
  ) {
    return (
      <p
        className="
          text-[11px]
          leading-5

          text-black/35
        "
      >
        @{currentUsername} is your
        current username.
      </p>
    );
  }

  if (
    availability ===
    "checking"
  ) {
    return (
      <p
        className="
          flex
          items-center
          gap-1.5

          text-[11px]
          leading-5

          text-black/35
        "
      >
        <LoaderCircle
          className="
            size-3.5
            animate-spin
          "
        />

        Checking @{username}...
      </p>
    );
  }

  if (
    availability ===
    "taken"
  ) {
    return (
      <p
        className="
          flex
          items-center
          gap-1.5

          text-xs
          leading-5

          text-red-600
        "
      >
        <XCircle
          className="
            size-3.5
            shrink-0
          "
        />

        @{username} is already taken.
        Try another username.
      </p>
    );
  }

  if (
    availability ===
    "available"
  ) {
    return (
      <p
        className="
          flex
          items-center
          gap-1.5

          text-[11px]
          font-semibold
          leading-5

          text-[#006241]
        "
      >
        <CheckCircle2
          className="
            size-3.5
          "
        />

        @{username} is available.
      </p>
    );
  }

  if (
    availability ===
    "error"
  ) {
    return (
      <p
        className="
          text-[11px]
          leading-5

          text-amber-600
        "
      >
        We couldn't check this
        username right now. Edit the
        username or try again.
      </p>
    );
  }

  return (
    <p
      className="
        text-[11px]
        leading-5

        text-black/35
      "
    >
      3–30 characters. Lowercase
      letters, numbers, periods and
      underscores only.
    </p>
  );
}

function normalizeUsername(
  value: string,
) {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /^@/,
      "",
    )
    .replace(
      /\s+/g,
      "",
    )
    .replace(
      /[^a-z0-9._]/g,
      "",
    )
    .slice(
      0,
      30,
    );
}