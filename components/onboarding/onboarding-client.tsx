"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Coffee,
  Compass,
  LoaderCircle,
  Map,
  MapPinned,
  Sparkles,
  Star,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  toast,
} from "sonner";

import {
  createClient,
} from "@/lib/supabase/client";

type OnboardingClientProps = {
  userId: string;
  email: string;

  initialProfile: {
    full_name: string;
    username: string;
    avatar_url: string | null;
    bio: string;
  };
};

type UsernameStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid"
  | "current";

type Destination =
  | "/explore"
  | "/map";

type Preference = {
  id: string;
  label: string;
  description: string;
  icon: typeof Coffee;
};

const TOTAL_STEPS = 4;

const USERNAME_PATTERN =
  /^[a-z0-9._]{3,30}$/;

const PREFERENCES: Preference[] = [
  {
    id: "coffee",
    label: "Coffee",
    description:
      "Espresso, iced coffee, lattes and more.",
    icon: Coffee,
  },
  {
    id: "milk_tea",
    label: "Milk Tea",
    description:
      "Classic and specialty milk tea.",
    icon: Star,
  },
  {
    id: "matcha",
    label: "Matcha",
    description:
      "Creamy, earthy and refreshing.",
    icon: Sparkles,
  },
  {
    id: "non_coffee",
    label: "Non-Coffee",
    description:
      "Chocolate, refreshers and more.",
    icon: Compass,
  },
  {
    id: "pastries",
    label: "Pastries",
    description:
      "Something baked for the table.",
    icon: Coffee,
  },
  {
    id: "desserts",
    label: "Desserts",
    description:
      "Sweet reasons to stay longer.",
    icon: Star,
  },
  {
    id: "meals",
    label: "Meals",
    description:
      "Places serving more than drinks.",
    icon: UtensilsCrossed,
  },
  {
    id: "snacks",
    label: "Snacks",
    description:
      "Quick bites worth adding.",
    icon: Coffee,
  },
];

const PREFERENCE_LABELS =
  Object.fromEntries(
    PREFERENCES.map(
      (preference) => [
        preference.id,
        preference.label,
      ],
    ),
  );

export function OnboardingClient({
  userId,
  email,
  initialProfile,
}: OnboardingClientProps) {
  const router =
    useRouter();

  const [
    step,
    setStep,
  ] =
    useState(1);

  const [
    username,
    setUsername,
  ] =
    useState(
      normalizeUsername(
        initialProfile.username,
      ),
    );

  const [
    claimedUsername,
    setClaimedUsername,
  ] =
    useState(
      normalizeUsername(
        initialProfile.username,
      ),
    );

  const [
    usernameStatus,
    setUsernameStatus,
  ] =
    useState<UsernameStatus>(
      initialProfile.username
        ? "current"
        : "idle",
    );

  const [
    preferences,
    setPreferences,
  ] =
    useState<string[]>([]);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    completing,
    setCompleting,
  ] =
    useState(false);

  const [
    avatarFailed,
    setAvatarFailed,
  ] =
    useState(false);

  const normalizedUsername =
    useMemo(
      () =>
        normalizeUsername(
          username,
        ),
      [username],
    );

  const usernameValid =
    USERNAME_PATTERN.test(
      normalizedUsername,
    );

  const canContinueIdentity =
    usernameValid &&
    (
      usernameStatus ===
        "available" ||
      usernameStatus ===
        "current"
    );

  useEffect(() => {
    if (step !== 2) {
      return;
    }

    if (!normalizedUsername) {
      setUsernameStatus(
        "idle",
      );

      return;
    }

    if (!usernameValid) {
      setUsernameStatus(
        "invalid",
      );

      return;
    }

    if (
      claimedUsername &&
      normalizedUsername ===
        claimedUsername
    ) {
      setUsernameStatus(
        "current",
      );

      return;
    }

    setUsernameStatus(
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
                  normalizedUsername,
              },
            );

          if (error) {
            console.error(
              "[CAFÉTA] Username availability check failed:",
              error,
            );

            setUsernameStatus(
              "idle",
            );

            return;
          }

          setUsernameStatus(
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
    step,
    normalizedUsername,
    usernameValid,
    claimedUsername,
  ]);

  function nextFromWelcome() {
    setStep(2);
  }

  function goBack() {
    if (
      saving ||
      completing
    ) {
      return;
    }

    setStep(
      (current) =>
        Math.max(
          1,
          current - 1,
        ),
    );
  }

  function togglePreference(
    preferenceId: string,
  ) {
    setPreferences(
      (current) => {
        if (
          current.includes(
            preferenceId,
          )
        ) {
          return current.filter(
            (id) =>
              id !==
              preferenceId,
          );
        }

        return [
          ...current,
          preferenceId,
        ];
      },
    );
  }

  async function saveIdentity() {
    if (
      !canContinueIdentity ||
      saving
    ) {
      return;
    }

    setSaving(true);

    try {
      const supabase =
        createClient();

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (
        !user ||
        user.id !== userId
      ) {
        throw new Error(
          "Your session has expired. Please sign in again.",
        );
      }

      if (
        normalizedUsername !==
        claimedUsername
      ) {
        const {
          error,
        } =
          await supabase
            .from("profiles")
            .update({
              username:
                normalizedUsername,
            })
            .eq(
              "id",
              userId,
            );

        if (error) {
          if (
            error.code ===
            "23505"
          ) {
            setUsernameStatus(
              "taken",
            );

            toast.error(
              "That username was just taken.",
              {
                description:
                  "Choose another one and try again.",
              },
            );

            return;
          }

          throw error;
        }

        setClaimedUsername(
          normalizedUsername,
        );

        setUsernameStatus(
          "current",
        );
      }

      setStep(3);
    } catch (error) {
      console.error(
        "[CAFÉTA] Failed to save onboarding username:",
        error,
      );

      toast.error(
        "Couldn't save your username",
        {
          description:
            getErrorMessage(
              error,
            ),
        },
      );
    } finally {
      setSaving(false);
    }
  }

  async function savePreferences() {
    if (
      preferences.length ===
        0 ||
      saving
    ) {
      return;
    }

    setSaving(true);

    try {
      const supabase =
        createClient();

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (
        !user ||
        user.id !== userId
      ) {
        throw new Error(
          "Your session has expired. Please sign in again.",
        );
      }

      const {
        error,
      } =
        await supabase
          .from("profiles")
          .update({
            cafe_preferences:
              preferences,
          })
          .eq(
            "id",
            userId,
          );

      if (error) {
        throw error;
      }

      setStep(4);
    } catch (error) {
      console.error(
        "[CAFÉTA] Failed to save onboarding preferences:",
        error,
      );

      toast.error(
        "Couldn't save your favorites",
        {
          description:
            getErrorMessage(
              error,
            ),
        },
      );
    } finally {
      setSaving(false);
    }
  }

  async function completeOnboarding(
    destination: Destination,
  ) {
    if (completing) {
      return;
    }

    setCompleting(true);

    try {
      const supabase =
        createClient();

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (
        !user ||
        user.id !== userId
      ) {
        throw new Error(
          "Your session has expired. Please sign in again.",
        );
      }

      const {
        error,
      } =
        await supabase
          .from("profiles")
          .update({
            username:
              claimedUsername,
            cafe_preferences:
              preferences,
            onboarding_completed:
              true,
          })
          .eq(
            "id",
            userId,
          );

      if (error) {
        throw error;
      }

      toast.success(
        "Your CAFÉTA is ready.",
        {
          description:
            "Time to find somewhere worth visiting.",
        },
      );

      router.replace(
        destination,
      );

      router.refresh();
    } catch (error) {
      console.error(
        "[CAFÉTA] Failed to complete onboarding:",
        error,
      );

      toast.error(
        "Couldn't finish your setup",
        {
          description:
            getErrorMessage(
              error,
            ),
        },
      );

      setCompleting(false);
    }
  }

  return (
    <section
      className="
        flex
        h-full
        max-h-[720px]
        w-full
        max-w-[600px]
        flex-col
        overflow-hidden

        rounded-[26px]

        border
        border-black/[0.055]

        bg-white

        shadow-[0_24px_80px_rgba(23,33,28,0.09)]

        sm:rounded-[32px]
      "
    >
      <header
        className="
          flex
          shrink-0
          items-center
          justify-between
          gap-4

          border-b
          border-black/[0.045]

          px-5
          py-4

          sm:px-7
          sm:py-5
        "
      >
        <Brand />

        <Progress
          step={step}
        />
      </header>

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain

          px-5
          py-4

          [scrollbar-width:none]

          [&::-webkit-scrollbar]:hidden

          sm:px-7
          sm:py-5
        "
      >
        <div
          key={step}
          className="
            flex
            min-h-full
            w-full
            items-center

            animate-in
            fade-in
            slide-in-from-right-2

            duration-300
          "
        >
          {step === 1 && (
            <WelcomeStep
              onContinue={
                nextFromWelcome
              }
            />
          )}

          {step === 2 && (
            <IdentityStep
              fullName={
                initialProfile.full_name
              }
              email={email}
              avatarUrl={
                initialProfile.avatar_url
              }
              avatarFailed={
                avatarFailed
              }
              username={
                username
              }
              normalizedUsername={
                normalizedUsername
              }
              status={
                usernameStatus
              }
              saving={
                saving
              }
              onAvatarError={() =>
                setAvatarFailed(
                  true,
                )
              }
              onUsernameChange={(
                value,
              ) => {
                setUsername(
                  normalizeUsername(
                    value,
                  ),
                );
              }}
              onBack={
                goBack
              }
              onContinue={
                saveIdentity
              }
              canContinue={
                canContinueIdentity
              }
            />
          )}

          {step === 3 && (
            <PreferencesStep
              selected={
                preferences
              }
              saving={
                saving
              }
              onToggle={
                togglePreference
              }
              onBack={
                goBack
              }
              onContinue={
                savePreferences
              }
            />
          )}

          {step === 4 && (
            <CompleteStep
              fullName={
                initialProfile.full_name
              }
              username={
                claimedUsername ||
                normalizedUsername
              }
              avatarUrl={
                initialProfile.avatar_url
              }
              avatarFailed={
                avatarFailed
              }
              preferences={
                preferences
              }
              completing={
                completing
              }
              onAvatarError={() =>
                setAvatarFailed(
                  true,
                )
              }
              onExplore={() =>
                completeOnboarding(
                  "/explore",
                )
              }
              onMap={() =>
                completeOnboarding(
                  "/map",
                )
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="
          flex
          size-8
          items-center
          justify-center

          rounded-full

          bg-[#006241]

          text-white
        "
      >
        <Coffee className="size-3.5" />
      </div>

      <div>
        <p
          className="
            text-[13px]
            font-black
            leading-none
            tracking-[-0.04em]

            text-[#006241]
          "
        >
          CAFÉTA
        </p>

        <p
          className="
            mt-1
            hidden

            text-[7px]
            font-bold
            uppercase
            tracking-[0.15em]

            text-black/25

            sm:block
          "
        >
          Find your next place
        </p>
      </div>
    </div>
  );
}

function Progress({
  step,
}: {
  step: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({
          length:
            TOTAL_STEPS,
        }).map(
          (_, index) => {
            const number =
              index + 1;

            return (
              <span
                key={number}
                className={`
                  h-1.5
                  rounded-full

                  transition-all
                  duration-300

                  ${
                    number ===
                    step
                      ? "w-7 bg-[#006241]"
                      : number <
                          step
                        ? "w-2.5 bg-[#006241]/55"
                        : "w-2.5 bg-black/[0.08]"
                  }
                `}
              />
            );
          },
        )}
      </div>

      <span
        className="
          text-[8px]
          font-black
          tabular-nums
          tracking-[0.06em]

          text-black/25
        "
      >
        {String(
          step,
        ).padStart(
          2,
          "0",
        )}
        /
        {String(
          TOTAL_STEPS,
        ).padStart(
          2,
          "0",
        )}
      </span>
    </div>
  );
}

function WelcomeStep({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[510px]
      "
    >
      <div className="text-center">
        <div
          className="
            mx-auto
            flex
            size-14
            items-center
            justify-center

            rounded-[19px]

            bg-[#e8f3ee]

            text-[#006241]
          "
        >
          <Sparkles className="size-5" />
        </div>

        <p
          className="
            mt-5

            text-[9px]
            font-black
            uppercase
            tracking-[0.19em]

            text-[#006241]
          "
        >
          Welcome to CAFÉTA
        </p>

        <h1
          className="
            mx-auto
            mt-2.5
            max-w-[440px]

            text-[27px]
            font-black
            leading-[1.05]
            tracking-[-0.055em]

            text-[#17211c]

            sm:text-[34px]
          "
        >
          Find places worth
          going to.
        </h1>

        <p
          className="
            mx-auto
            mt-3
            max-w-[430px]

            text-[11px]
            leading-[1.65]

            text-black/40

            sm:text-[12px]
          "
        >
          Discover local cafés,
          explore the menu before
          you visit, and see real
          moments from the people
          who were there.
        </p>
      </div>

      <div
        className="
          mt-5
          grid
          grid-cols-3
          gap-2
        "
      >
        <Feature
          icon={
            <MapPinned className="size-4" />
          }
          title="Discover"
          description="Find local spots around you."
        />

        <Feature
          icon={
            <UtensilsCrossed className="size-4" />
          }
          title="Explore"
          description="Know what's on the menu."
        />

        <Feature
          icon={
            <Sparkles className="size-4" />
          }
          title="Remember"
          description="See and share Memories."
        />
      </div>

      <button
        type="button"
        onClick={
          onContinue
        }
        className="
          group
          mt-5

          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2

          rounded-[14px]

          bg-[#006241]

          px-5

          text-[11px]
          font-black

          text-white

          shadow-[0_8px_22px_rgba(0,98,65,0.16)]

          transition-all

          hover:-translate-y-0.5
          hover:bg-[#00754a]

          active:translate-y-0
          active:scale-[0.99]
        "
      >
        Show me around

        <ArrowRight
          className="
            size-3.5

            transition-transform

            group-hover:translate-x-0.5
          "
        />
      </button>
    </div>
  );
}

function IdentityStep({
  fullName,
  email,
  avatarUrl,
  avatarFailed,
  username,
  normalizedUsername,
  status,
  saving,
  onAvatarError,
  onUsernameChange,
  onBack,
  onContinue,
  canContinue,
}: {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  avatarFailed: boolean;
  username: string;
  normalizedUsername: string;
  status: UsernameStatus;
  saving: boolean;
  onAvatarError: () => void;
  onUsernameChange: (
    value: string,
  ) => void;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
}) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[450px]
      "
    >
      <div className="text-center">
        <Avatar
          src={avatarUrl}
          failed={
            avatarFailed
          }
          onError={
            onAvatarError
          }
        />

        <p
          className="
            mt-4

            text-[9px]
            font-black
            uppercase
            tracking-[0.18em]

            text-[#006241]
          "
        >
          Make it yours
        </p>

        <h1
          className="
            mt-2

            text-[25px]
            font-black
            leading-[1.08]
            tracking-[-0.05em]

            text-[#17211c]

            sm:text-[31px]
          "
        >
          Claim your name on
          CAFÉTA.
        </h1>

        <p
          className="
            mx-auto
            mt-2.5
            max-w-[390px]

            text-[10px]
            leading-[1.6]

            text-black/38

            sm:text-[11px]
          "
        >
          This is how people will
          recognize you when you
          share Memories and leave
          reviews.
        </p>
      </div>

      {(fullName ||
        email) && (
        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-2

            text-[9px]
            text-black/30
          "
        >
          {fullName && (
            <span className="font-bold text-black/45">
              {fullName}
            </span>
          )}

          {fullName &&
            email && (
              <span>
                •
              </span>
            )}

          {email && (
            <span className="truncate">
              {email}
            </span>
          )}
        </div>
      )}

      <div className="mt-5">
        <label
          htmlFor="username"
          className="
            mb-1.5
            block

            text-[9px]
            font-black

            text-[#25332c]
          "
        >
          Username
        </label>

        <div
          className={`
            flex
            h-12
            items-center

            rounded-[14px]

            border

            px-3.5

            transition-all

            ${
              status ===
                "available" ||
              status ===
                "current"
                ? "border-[#006241]/30 bg-[#f4f9f6]"
                : status ===
                      "taken" ||
                    status ===
                      "invalid"
                  ? "border-red-200 bg-red-50/50"
                  : "border-black/[0.08] bg-[#fafbfa] focus-within:border-[#006241]/30 focus-within:bg-white"
            }
          `}
        >
          <span
            className="
              text-[13px]
              font-black

              text-[#006241]
            "
          >
            @
          </span>

          <input
            id="username"
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="username"
            value={username}
            disabled={saving}
            maxLength={30}
            onChange={(
              event,
            ) =>
              onUsernameChange(
                event.target
                  .value,
              )
            }
            placeholder="yourusername"
            className="
              h-full
              min-w-0
              flex-1

              bg-transparent

              px-1.5

              text-[12px]
              font-bold

              text-[#17211c]

              outline-none

              placeholder:font-medium
              placeholder:text-black/20
            "
          />

          <UsernameStatusIcon
            status={status}
          />
        </div>

        <UsernameMessage
          username={
            normalizedUsername
          }
          status={status}
        />
      </div>

      <Navigation
        onBack={onBack}
        onContinue={
          onContinue
        }
        continueLabel={
          normalizedUsername
            ? `Claim @${normalizedUsername}`
            : "Claim username"
        }
        disabled={
          !canContinue
        }
        loading={saving}
      />
    </div>
  );
}

function PreferencesStep({
  selected,
  saving,
  onToggle,
  onBack,
  onContinue,
}: {
  selected: string[];
  saving: boolean;
  onToggle: (
    id: string,
  ) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[500px]
      "
    >
      <div className="text-center">
        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.18em]

            text-[#006241]
          "
        >
          Your CAFÉTA
        </p>

        <h1
          className="
            mt-2

            text-[25px]
            font-black
            leading-[1.08]
            tracking-[-0.05em]

            text-[#17211c]

            sm:text-[31px]
          "
        >
          What looks good to
          you?
        </h1>

        <p
          className="
            mx-auto
            mt-2.5
            max-w-[390px]

            text-[10px]
            leading-[1.6]

            text-black/38

            sm:text-[11px]
          "
        >
          Pick a few favorites.
          We'll use them to make
          discovery feel more like
          your kind of place.
        </p>
      </div>

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-2

          sm:grid-cols-4
        "
      >
        {PREFERENCES.map(
          (
            preference,
          ) => {
            const Icon =
              preference.icon;

            const active =
              selected.includes(
                preference.id,
              );

            return (
              <button
                key={
                  preference.id
                }
                type="button"
                aria-pressed={
                  active
                }
                disabled={saving}
                onClick={() =>
                  onToggle(
                    preference.id,
                  )
                }
                className={`
                  relative

                  min-h-[82px]

                  rounded-[16px]

                  border

                  p-3

                  text-left

                  transition-all
                  duration-200

                  active:scale-[0.98]

                  ${
                    active
                      ? "border-[#006241]/25 bg-[#edf6f1]"
                      : "border-black/[0.055] bg-[#fafbfa] hover:border-[#006241]/15 hover:bg-white"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    size-7
                    items-center
                    justify-center

                    rounded-full

                    ${
                      active
                        ? "bg-[#006241] text-white"
                        : "bg-[#eaf2ee] text-[#006241]"
                    }
                  `}
                >
                  <Icon className="size-3.5" />
                </div>

                {active && (
                  <div
                    className="
                      absolute
                      right-2.5
                      top-2.5

                      flex
                      size-4
                      items-center
                      justify-center

                      rounded-full

                      bg-[#006241]

                      text-white
                    "
                  >
                    <Check className="size-2.5" />
                  </div>
                )}

                <p
                  className="
                    mt-2

                    text-[9px]
                    font-black

                    text-[#17211c]
                  "
                >
                  {
                    preference.label
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    hidden

                    text-[7px]
                    leading-3

                    text-black/30

                    lg:block
                  "
                >
                  {
                    preference.description
                  }
                </p>
              </button>
            );
          },
        )}
      </div>

      <div
        className="
          mt-3

          flex
          min-h-8
          items-center
          justify-between

          rounded-[12px]

          bg-[#f6f8f7]

          px-3
        "
      >
        <p
          className="
            text-[8px]
            font-medium

            text-black/35
          "
        >
          {selected.length ===
          0
            ? "Pick at least one favorite."
            : `${selected.length} ${
                selected.length ===
                1
                  ? "favorite"
                  : "favorites"
              } selected`}
        </p>

        {selected.length >
          0 && (
          <span
            className="
              text-[8px]
              font-black

              text-[#006241]
            "
          >
            Looking good.
          </span>
        )}
      </div>

      <Navigation
        onBack={onBack}
        onContinue={
          onContinue
        }
        continueLabel="Build my CAFÉTA"
        disabled={
          selected.length ===
          0
        }
        loading={saving}
      />
    </div>
  );
}

function CompleteStep({
  fullName,
  username,
  avatarUrl,
  avatarFailed,
  preferences,
  completing,
  onAvatarError,
  onExplore,
  onMap,
}: {
  fullName: string;
  username: string;
  avatarUrl: string | null;
  avatarFailed: boolean;
  preferences: string[];
  completing: boolean;
  onAvatarError: () => void;
  onExplore: () => void;
  onMap: () => void;
}) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[490px]

        text-center
      "
    >
      <div className="relative mx-auto w-fit">
        <Avatar
          src={avatarUrl}
          failed={
            avatarFailed
          }
          onError={
            onAvatarError
          }
        />

        <div
          className="
            absolute
            -bottom-1
            -right-1

            flex
            size-6
            items-center
            justify-center

            rounded-full

            border-[3px]
            border-white

            bg-[#006241]

            text-white
          "
        >
          <CheckCircle2 className="size-3" />
        </div>
      </div>

      <p
        className="
          mt-4

          text-[9px]
          font-black
          uppercase
          tracking-[0.18em]

          text-[#006241]
        "
      >
        You're all set
      </p>

      <h1
        className="
          mx-auto
          mt-2
          max-w-[420px]

          text-[25px]
          font-black
          leading-[1.06]
          tracking-[-0.055em]

          text-[#17211c]

          sm:text-[31px]
        "
      >
        Your next favorite
        café is out there.
      </h1>

      <p
        className="
          mx-auto
          mt-2.5
          max-w-[390px]

          text-[10px]
          leading-[1.6]

          text-black/38

          sm:text-[11px]
        "
      >
        Your CAFÉTA is ready.
        Discover somewhere new,
        see what's on the menu,
        and remember the places
        worth coming back to.
      </p>

      <div
        className="
          mx-auto
          mt-4
          max-w-[380px]

          rounded-[18px]

          border
          border-[#006241]/10

          bg-[#f3f8f5]

          px-4
          py-3
        "
      >
        <p
          className="
            text-[12px]
            font-black

            text-[#17211c]
          "
        >
          @{username}
        </p>

        {fullName && (
          <p
            className="
              mt-0.5

              text-[8px]
              font-medium

              text-black/35
            "
          >
            {fullName}
          </p>
        )}

        <div
          className="
            mt-2.5

            flex
            flex-wrap
            justify-center
            gap-1
          "
        >
          {preferences.map(
            (
              preference,
            ) => (
              <span
                key={
                  preference
                }
                className="
                  rounded-full

                  border
                  border-[#006241]/10

                  bg-white

                  px-2
                  py-1

                  text-[7px]
                  font-bold

                  text-[#006241]
                "
              >
                {PREFERENCE_LABELS[
                  preference
                ] ??
                  preference}
              </span>
            ),
          )}
        </div>
      </div>

      <div
        className="
          mt-4
          grid
          grid-cols-3
          gap-2
        "
      >
        <FinalFeature
          icon={
            <MapPinned className="size-3.5" />
          }
          title="Discover"
          description="Find local places."
        />

        <FinalFeature
          icon={
            <Sparkles className="size-3.5" />
          }
          title="Memories"
          description="See what's happening."
        />

        <FinalFeature
          icon={
            <UtensilsCrossed className="size-3.5" />
          }
          title="Menus"
          description="Know what to order."
        />
      </div>

      <button
        type="button"
        disabled={
          completing
        }
        onClick={
          onExplore
        }
        className="
          group
          mt-4

          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2

          rounded-[14px]

          bg-[#006241]

          px-5

          text-[10px]
          font-black

          text-white

          shadow-[0_8px_22px_rgba(0,98,65,0.16)]

          transition-all

          hover:-translate-y-0.5
          hover:bg-[#00754a]

          disabled:pointer-events-none
          disabled:opacity-60
        "
      >
        {completing ? (
          <>
            <LoaderCircle className="size-3.5 animate-spin" />

            Getting CAFÉTA
            ready...
          </>
        ) : (
          <>
            <Compass className="size-3.5" />

            Start exploring

            <ArrowRight
              className="
                size-3.5

                transition-transform

                group-hover:translate-x-0.5
              "
            />
          </>
        )}
      </button>

      <button
        type="button"
        disabled={
          completing
        }
        onClick={onMap}
        className="
          mt-1

          inline-flex
          h-8
          items-center
          justify-center
          gap-1.5

          rounded-full

          px-4

          text-[8px]
          font-black

          text-[#006241]

          transition

          hover:bg-[#f3f8f5]

          disabled:pointer-events-none
          disabled:opacity-50
        "
      >
        <Map className="size-3" />

        Open the map
      </button>
    </div>
  );
}

function Navigation({
  onBack,
  onContinue,
  continueLabel,
  disabled,
  loading,
}: {
  onBack: () => void;
  onContinue: () => void;
  continueLabel: string;
  disabled: boolean;
  loading: boolean;
}) {
  return (
    <div
      className="
        mt-5
        flex
        gap-2
      "
    >
      <button
        type="button"
        disabled={loading}
        onClick={onBack}
        aria-label="Go back"
        className="
          flex
          size-11
          shrink-0
          items-center
          justify-center

          rounded-[14px]

          border
          border-black/[0.07]

          bg-white

          text-black/35

          transition

          hover:bg-black/[0.025]
          hover:text-black/60

          disabled:pointer-events-none
          disabled:opacity-50
        "
      >
        <ArrowLeft className="size-3.5" />
      </button>

      <button
        type="button"
        disabled={
          disabled ||
          loading
        }
        onClick={
          onContinue
        }
        className="
          group

          flex
          h-11
          min-w-0
          flex-1
          items-center
          justify-center
          gap-2

          rounded-[14px]

          bg-[#006241]

          px-4

          text-[10px]
          font-black

          text-white

          shadow-[0_7px_20px_rgba(0,98,65,0.14)]

          transition-all

          hover:bg-[#00754a]

          disabled:pointer-events-none
          disabled:bg-black/[0.08]
          disabled:text-black/25
          disabled:shadow-none
        "
      >
        {loading ? (
          <>
            <LoaderCircle className="size-3.5 animate-spin" />

            Saving...
          </>
        ) : (
          <>
            <span className="truncate">
              {continueLabel}
            </span>

            <ArrowRight
              className="
                size-3.5
                shrink-0

                transition-transform

                group-hover:translate-x-0.5
              "
            />
          </>
        )}
      </button>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-[15px]

        border
        border-black/[0.05]

        bg-[#f8faf9]

        p-3

        text-left
      "
    >
      <div
        className="
          flex
          size-7
          items-center
          justify-center

          rounded-full

          bg-[#e8f3ee]

          text-[#006241]
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-2

          text-[9px]
          font-black

          text-[#17211c]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-0.5
          hidden

          text-[7px]
          leading-3

          text-black/30

          sm:block
        "
      >
        {description}
      </p>
    </div>
  );
}

function FinalFeature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-[14px]

        border
        border-black/[0.05]

        bg-[#fafbfa]

        px-2
        py-3
      "
    >
      <div
        className="
          mx-auto

          flex
          size-7
          items-center
          justify-center

          rounded-full

          bg-[#e8f3ee]

          text-[#006241]
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-1.5

          text-[8px]
          font-black

          text-[#17211c]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-0.5
          hidden

          text-[7px]

          text-black/30

          sm:block
        "
      >
        {description}
      </p>
    </div>
  );
}

function Avatar({
  src,
  failed,
  onError,
}: {
  src: string | null;
  failed: boolean;
  onError: () => void;
}) {
  return (
    <div
      className="
        mx-auto

        flex
        size-14
        items-center
        justify-center
        overflow-hidden

        rounded-full

        border-[3px]
        border-white

        bg-[#e7f1ec]

        text-[#006241]

        shadow-[0_8px_24px_rgba(23,33,28,0.11)]
      "
    >
      {src &&
      !failed ? (
        <img
          src={src}
          alt="Profile"
          referrerPolicy="no-referrer"
          onError={onError}
          className="
            size-full
            object-cover
          "
        />
      ) : (
        <UserRound className="size-5" />
      )}
    </div>
  );
}

function UsernameStatusIcon({
  status,
}: {
  status: UsernameStatus;
}) {
  if (
    status === "checking"
  ) {
    return (
      <LoaderCircle
        className="
          size-3.5
          animate-spin

          text-black/25
        "
      />
    );
  }

  if (
    status ===
      "available" ||
    status === "current"
  ) {
    return (
      <div
        className="
          flex
          size-5
          items-center
          justify-center

          rounded-full

          bg-[#006241]

          text-white
        "
      >
        <Check className="size-3" />
      </div>
    );
  }

  if (
    status === "taken" ||
    status === "invalid"
  ) {
    return (
      <span
        className="
          text-[9px]
          font-black

          text-red-500
        "
      >
        ×
      </span>
    );
  }

  return null;
}

function UsernameMessage({
  username,
  status,
}: {
  username: string;
  status: UsernameStatus;
}) {
  if (
    status === "checking"
  ) {
    return (
      <p
        className="
          mt-1.5
          px-1

          text-[8px]

          text-black/30
        "
      >
        Checking
        {username
          ? ` @${username}`
          : ""}
        ...
      </p>
    );
  }

  if (
    status === "available"
  ) {
    return (
      <p
        className="
          mt-1.5
          px-1

          text-[8px]
          font-bold

          text-[#006241]
        "
      >
        @{username} is
        available. It's yours
        if you want it.
      </p>
    );
  }

  if (
    status === "current"
  ) {
    return (
      <p
        className="
          mt-1.5
          px-1

          text-[8px]
          font-bold

          text-[#006241]
        "
      >
        @{username} is your
        CAFÉTA username.
      </p>
    );
  }

  if (
    status === "taken"
  ) {
    return (
      <p
        className="
          mt-1.5
          px-1

          text-[8px]
          font-semibold

          text-red-500
        "
      >
        @{username} is already
        taken. Try another one.
      </p>
    );
  }

  if (
    status === "invalid"
  ) {
    return (
      <p
        className="
          mt-1.5
          px-1

          text-[8px]
          font-medium

          text-red-500
        "
      >
        Use 3–30 lowercase
        letters, numbers, periods,
        or underscores.
      </p>
    );
  }

  return (
    <p
      className="
        mt-1.5
        px-1

        text-[8px]
        leading-3

        text-black/28
      "
    >
      3–30 characters. Letters,
      numbers, "." and "_" only.
    </p>
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

function getErrorMessage(
  error: unknown,
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Please try again.";
}