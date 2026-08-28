"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Heart,
  Hourglass,
  LogOut,
  MapPin,
  MessageSquareText,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Store,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  ChangeUsernameModal,
} from "@/components/profile/change-username-modal";

import {
  EditProfileModal,
} from "@/components/profile/edit-profile-modal";

import type {
  CafetaProfile,
  ProfileBusiness,
  ProfileStats,
} from "@/lib/profile/types";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  user: {
    id: string;
    email: string;
  };

  profile: CafetaProfile;

  businesses: ProfileBusiness[];

  stats: ProfileStats;
};

export function ProfilePageClient({
  user,
  profile:
    initialProfile,
  businesses,
  stats,
}: Props) {
  const router =
    useRouter();

  const [
    profile,
    setProfile,
  ] =
    useState<CafetaProfile>(
      initialProfile,
    );

  const [
    editProfileOpen,
    setEditProfileOpen,
  ] =
    useState(false);

  const [
    usernameOpen,
    setUsernameOpen,
  ] =
    useState(false);

  const [
    pendingBusiness,
    setPendingBusiness,
  ] =
    useState<ProfileBusiness | null>(
      null,
    );

  const [
    signingOut,
    setSigningOut,
  ] =
    useState(false);

  useEffect(() => {
    setProfile(
      initialProfile,
    );
  }, [
    initialProfile,
  ]);

  function handleProfileUpdated(
    updatedProfile:
      CafetaProfile,
  ) {
    setProfile(
      updatedProfile,
    );

    router.refresh();
  }

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(
      true,
    );

    try {
      const supabase =
        createClient();

      const {
        error,
      } =
        await supabase.auth
          .signOut();

      if (error) {
        toast.error(
          "Couldn't sign you out",
          {
            description:
              error.message,
          },
        );

        return;
      }

      router.replace(
        "/",
      );

      router.refresh();
    } catch (
      error
    ) {
      console.error(
        "[CAFÉTA] Sign out failed:",
        error,
      );

      toast.error(
        "Couldn't sign you out",
      );
    } finally {
      setSigningOut(
        false,
      );
    }
  }

  return (
    <>
      <main
        className="
          min-h-[calc(100dvh-64px)]
          bg-[#f7f8f6]
          pb-28

          md:min-h-[calc(100dvh-72px)]
          md:pb-12
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]

            px-4
            py-6

            sm:px-6

            md:py-9

            lg:px-8
          "
        >
          <header
            className="
              mb-6

              flex
              items-end
              justify-between
              gap-4

              animate-in
              fade-in
              slide-in-from-bottom-2
              duration-500

              md:mb-8
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]

                  text-[#006241]
                "
              >
                Your account
              </p>

              <h1
                className="
                  mt-2

                  text-3xl
                  font-black
                  tracking-[-0.045em]

                  text-[#17211c]

                  md:text-[36px]
                "
              >
                Profile
              </h1>
            </div>

            <Link
              href="/profile/settings"
              aria-label="Profile settings"
              className="
                flex
                size-10
                items-center
                justify-center

                rounded-full

                border
                border-black/[0.06]

                bg-white

                text-[#4f5b54]

                shadow-sm

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:border-[#006241]/20
                hover:text-[#006241]
                hover:shadow-md

                active:translate-y-0
                active:scale-95
              "
            >
              <Settings
                className="
                  size-[17px]
                "
              />
            </Link>
          </header>

          <div
            className="
              grid
              items-start
              gap-5

              lg:grid-cols-[360px_minmax(0,1fr)]
            "
          >
            <ProfileCard
              user={
                user
              }
              profile={
                profile
              }
              stats={
                stats
              }
              onEdit={() => {
                setEditProfileOpen(
                  true,
                );
              }}
              onUsername={() => {
                setUsernameOpen(
                  true,
                );
              }}
            />

            <div
              className="
                min-w-0
                space-y-5
              "
            >
              <section
                className="
                  animate-in
                  fade-in
                  slide-in-from-bottom-2
                  duration-500

                  rounded-[28px]

                  border
                  border-black/[0.05]

                  bg-white

                  p-5

                  shadow-[0_10px_35px_rgba(23,33,28,0.04)]

                  md:p-6
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]

                        text-[#006241]
                      "
                    >
                      Account
                    </p>

                    <h2
                      className="
                        mt-1.5

                        text-lg
                        font-bold
                        tracking-[-0.025em]

                        text-[#17211c]
                      "
                    >
                      Your CAFÉTA
                      identity
                    </h2>
                  </div>

                  <div
                    className="
                      flex
                      size-10
                      items-center
                      justify-center

                      rounded-[14px]

                      bg-[#e8f2ed]
                      text-[#006241]
                    "
                  >
                    <UserRound
                      className="
                        size-[18px]
                      "
                    />
                  </div>
                </div>

                <div
                  className="
                    mt-5

                    divide-y
                    divide-black/[0.05]
                  "
                >
                  <ProfileActionRow
                    icon={
                      CircleUserRound
                    }
                    label="Username"
                    value={
                      profile.username
                        ? `@${profile.username}`
                        : "Set your username"
                    }
                    onClick={() => {
                      setUsernameOpen(
                        true,
                      );
                    }}
                  />

                  <ProfileRow
                    icon={
                      Heart
                    }
                    label="Saved places"
                    value={`${stats.saved} ${
                      stats.saved ===
                      1
                        ? "place"
                        : "places"
                    }`}
                    href="/saved"
                  />

                  <ProfileRow
                    icon={
                      MessageSquareText
                    }
                    label="Your reviews"
                    value={`${stats.reviews} ${
                      stats.reviews ===
                      1
                        ? "review"
                        : "reviews"
                    }`}
                    href="/profile/reviews"
                  />
                </div>
              </section>

              <BusinessSection
                businesses={
                  businesses
                }
                onPendingBusiness={(
                  business,
                ) => {
                  setPendingBusiness(
                    business,
                  );
                }}
              />

              <section
                className="
                  animate-in
                  fade-in
                  slide-in-from-bottom-2
                  duration-500

                  rounded-[28px]

                  border
                  border-black/[0.05]

                  bg-white

                  p-3

                  shadow-[0_10px_35px_rgba(23,33,28,0.04)]
                "
              >
                <ProfileRow
                  icon={
                    Settings
                  }
                  label="Settings"
                  value="Account & preferences"
                  href="/profile/settings"
                />

                <button
                  type="button"
                  onClick={
                    handleSignOut
                  }
                  disabled={
                    signingOut
                  }
                  className="
                    group

                    flex
                    w-full
                    items-center
                    gap-3

                    rounded-[18px]

                    px-3
                    py-3.5

                    text-left

                    transition-all
                    duration-200

                    hover:bg-red-50

                    active:scale-[0.995]

                    disabled:pointer-events-none
                    disabled:opacity-50
                  "
                >
                  <div
                    className="
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center

                      rounded-[12px]

                      bg-red-50
                      text-red-600
                    "
                  >
                    <LogOut
                      className="
                        size-4
                      "
                    />
                  </div>

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-red-600
                      "
                    >
                      {signingOut
                        ? "Signing out..."
                        : "Sign out"}
                    </p>

                    <p
                      className="
                        mt-0.5

                        text-[11px]
                        text-black/35
                      "
                    >
                      Sign out of your
                      CAFÉTA account
                    </p>
                  </div>
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>

      <EditProfileModal
        open={
          editProfileOpen
        }
        onOpenChange={
          setEditProfileOpen
        }
        profile={
          profile
        }
        email={
          user.email
        }
        onUpdated={
          handleProfileUpdated
        }
      />

      <ChangeUsernameModal
        open={
          usernameOpen
        }
        profile={
          profile
        }
        onClose={() => {
          setUsernameOpen(
            false,
          );
        }}
        onUpdated={
          handleProfileUpdated
        }
      />

      <PendingBusinessModal
        business={
          pendingBusiness
        }
        onClose={() => {
          setPendingBusiness(
            null,
          );
        }}
      />
    </>
  );
}

function ProfileCard({
  user,
  profile,
  stats,
  onEdit,
  onUsername,
}: {
  user:
    Props["user"];

  profile:
    CafetaProfile;

  stats:
    ProfileStats;

  onEdit:
    () => void;

  onUsername:
    () => void;
}) {
  const [
    avatarFailed,
    setAvatarFailed,
  ] =
    useState(false);

  useEffect(() => {
    setAvatarFailed(
      false,
    );
  }, [
    profile.avatar_url,
  ]);

  const displayName =
    profile.full_name?.trim() ||
    profile.username?.trim() ||
    user.email.split(
      "@",
    )[0] ||
    "CAFÉTA User";

  const showAvatar =
    Boolean(
      profile.avatar_url,
    ) &&
    !avatarFailed;

  return (
    <section
      className="
        group

        overflow-hidden

        rounded-[30px]

        border
        border-black/[0.05]

        bg-white

        shadow-[0_12px_40px_rgba(23,33,28,0.05)]

        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-500
      "
    >
      <div
        className="
          relative

          h-[105px]

          overflow-hidden

          bg-[#006241]
        "
      >
        <div
          className="
            absolute
            -right-12
            -top-20

            size-52

            rounded-full

            border-[32px]
            border-white/[0.06]
          "
        />
      </div>

      <div
        className="
          relative

          px-5
          pb-6
        "
      >
        <div
          className="
            -mt-11

            flex
            items-end
            justify-between
          "
        >
          <div
            className="
              relative
            "
          >
            <div
              className="
                relative

                size-[88px]

                overflow-hidden

                rounded-full

                border-[5px]
                border-white

                bg-[#e8f2ed]

                shadow-[0_6px_20px_rgba(0,0,0,0.10)]
              "
            >
              {showAvatar ? (
                <img
                  key={
                    profile.avatar_url
                  }
                  src={
                    profile.avatar_url!
                  }
                  alt={`${displayName} profile`}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    setAvatarFailed(
                      true,
                    );
                  }}
                  className="
                    block
                    size-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    size-full
                    items-center
                    justify-center

                    bg-gradient-to-br
                    from-[#edf5f1]
                    to-[#dcebe3]

                    text-xl
                    font-black
                    text-[#006241]
                  "
                >
                  {getInitials(
                    displayName,
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={
                onEdit
              }
              aria-label="Change profile photo"
              className="
                absolute
                bottom-0
                right-0

                flex
                size-8
                items-center
                justify-center

                rounded-full

                border-[3px]
                border-white

                bg-[#006241]
                text-white

                shadow-sm

                transition-all

                hover:scale-110
                hover:bg-[#00754a]
              "
            >
              <Pencil
                className="
                  size-3
                "
              />
            </button>
          </div>

          <button
            type="button"
            onClick={
              onEdit
            }
            className="
              mb-1

              flex
              h-9
              items-center
              gap-1.5

              rounded-full

              border
              border-black/[0.07]

              bg-white

              px-3.5

              text-[11px]
              font-bold
              text-[#39443e]

              shadow-sm

              transition-all

              hover:bg-[#f4f8f6]
              hover:text-[#006241]
            "
          >
            <Pencil
              className="
                size-3
              "
            />

            Edit
          </button>
        </div>

        <div
          className="
            mt-4
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
            "
          >
            <h2
              className="
                truncate

                text-xl
                font-black
                tracking-[-0.035em]

                text-[#17211c]
              "
            >
              {displayName}
            </h2>

            {profile.role ===
              "admin" && (
              <ShieldCheck
                className="
                  size-[17px]

                  fill-[#1689e8]
                  text-white
                "
              />
            )}
          </div>

          <button
            type="button"
            onClick={
              onUsername
            }
            className="
              mt-1

              text-sm
              font-medium
              text-[#006241]

              hover:underline
            "
          >
            {profile.username
              ? `@${profile.username}`
              : "Set your username"}
          </button>

          <p
            className="
              mt-1

              truncate

              text-xs
              text-black/35
            "
          >
            {user.email}
          </p>

          {profile.bio ? (
            <p
              className="
                mt-4

                whitespace-pre-line

                text-sm
                leading-6
                text-[#59635e]
              "
            >
              {profile.bio}
            </p>
          ) : (
            <button
              type="button"
              onClick={
                onEdit
              }
              className="
                mt-4

                text-left
                text-sm
                leading-6
                text-black/35

                hover:text-[#006241]
              "
            >
              Add a short bio to tell
              the CAFÉTA community a
              little about yourself.
            </button>
          )}
        </div>

        <div
          className="
            mt-6

            grid
            grid-cols-3
            divide-x
            divide-black/[0.06]

            rounded-[20px]

            bg-[#f7f8f6]

            px-2
            py-4
          "
        >
          <ProfileStat
            value={
              stats.saved
            }
            label="Saved"
          />

          <ProfileStat
            value={
              stats.reviews
            }
            label="Reviews"
          />

          <ProfileStat
            value={
              stats.businesses
            }
            label="Businesses"
          />
        </div>
      </div>
    </section>
  );
}

function BusinessSection({
  businesses,
  onPendingBusiness,
}: {
  businesses:
    ProfileBusiness[];

  onPendingBusiness: (
    business:
      ProfileBusiness,
  ) => void;
}) {
  return (
    <section
      className="
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-500

        rounded-[28px]

        border
        border-black/[0.05]

        bg-white

        p-5

        shadow-[0_10px_35px_rgba(23,33,28,0.04)]

        md:p-6
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]

              text-[#006241]
            "
          >
            For business
          </p>

          <h2
            className="
              mt-1.5

              text-lg
              font-bold
              tracking-[-0.025em]

              text-[#17211c]
            "
          >
            Your businesses
          </h2>

          <p
            className="
              mt-1

              text-xs
              leading-5
              text-black/40
            "
          >
            Create and manage
            businesses connected to
            your CAFÉTA account.
          </p>
        </div>

        <Link
          href="/business/create"
          aria-label="Create business"
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center

            rounded-[14px]

            bg-[#006241]
            text-white

            shadow-sm

            transition-all

            hover:-translate-y-0.5
            hover:bg-[#004f35]
          "
        >
          <Plus
            className="
              size-[18px]
            "
          />
        </Link>
      </div>

      {businesses.length >
      0 ? (
        <div
          className="
            mt-5
            space-y-2.5
          "
        >
          {businesses.map(
            (
              business,
              index,
            ) => (
              <BusinessListItem
                key={
                  business.id
                }
                business={
                  business
                }
                index={
                  index
                }
                onPending={() => {
                  onPendingBusiness(
                    business,
                  );
                }}
              />
            ),
          )}
        </div>
      ) : (
        <EmptyBusinessState />
      )}
    </section>
  );
}

function BusinessListItem({
  business,
  index,
  onPending,
}: {
  business:
    ProfileBusiness;

  index:
    number;

  onPending:
    () => void;
}) {
  const approved =
    business.status ===
    "approved";

  const pending =
    business.status ===
    "pending";

  const content = (
    <>
      <BusinessLogo
        business={
          business
        }
      />

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-1.5
          "
        >
          <h3
            className="
              truncate

              text-sm
              font-bold
              tracking-[-0.015em]

              text-[#17211c]
            "
          >
            {business.name}
          </h3>

          {business.is_verified &&
            approved && (
              <BadgeCheck
                aria-label="Verified business"
                className="
                  size-[15px]
                  shrink-0

                  fill-[#1689e8]
                  text-white
                "
                strokeWidth={
                  2.4
                }
              />
            )}
        </div>

        <div
          className="
            mt-1.5

            flex
            flex-wrap
            items-center
            gap-1.5
          "
        >
          <span
            className="
              text-[10px]
              text-black/40
            "
          >
            {formatCategory(
              business.category,
            )}
          </span>

          <span
            className="
              text-black/15
            "
          >
            •
          </span>

          <span
            className="
              text-[10px]
              text-black/40
            "
          >
            {formatMemberRole(
              business.memberRole,
            )}
          </span>

          <BusinessStatusBadge
            status={
              business.status
            }
          />
        </div>
      </div>

      {pending ? (
        <Hourglass
          className="
            size-4
            shrink-0

            text-amber-500
          "
        />
      ) : (
        <ChevronRight
          className="
            size-4
            shrink-0

            text-black/20

            transition-all

            group-hover:translate-x-0.5
            group-hover:text-[#006241]
          "
        />
      )}
    </>
  );

  const className = `
    group

    flex
    w-full
    items-center
    gap-3

    animate-in
    fade-in
    slide-in-from-bottom-2

    rounded-[20px]

    border
    border-black/[0.05]

    p-3

    text-left

    duration-500

    transition-all

    hover:-translate-y-0.5
    hover:border-[#006241]/15
    hover:bg-[#fafcfb]
    hover:shadow-[0_8px_24px_rgba(23,33,28,0.05)]

    active:translate-y-0
    active:scale-[0.995]
  `;

  const style = {
    animationDelay:
      `${Math.min(
        index * 60,
        300,
      )}ms`,

    animationFillMode:
      "both" as const,
  };

  if (approved) {
    return (
      <Link
        href={`/business/${encodeURIComponent(
          business.slug,
        )}`}
        style={
          style
        }
        className={
          className
        }
      >
        {content}
      </Link>
    );
  }

  if (pending) {
    return (
      <button
        type="button"
        onClick={
          onPending
        }
        style={
          style
        }
        className={`
          ${className}

          border-amber-200/70

          bg-gradient-to-r
          from-white
          to-amber-50/30

          hover:border-amber-300
          hover:bg-amber-50/40
        `}
      >
        {content}
      </button>
    );
  }

  /*
   * Draft/rejected businesses are
   * intentionally not sent to the
   * public approved-business route.
   */
  return (
    <div
      style={
        style
      }
      className={`
        ${className}

        cursor-default

        hover:translate-y-0
        hover:shadow-none
      `}
    >
      {content}
    </div>
  );
}

function BusinessStatusBadge({
  status,
}: {
  status:
    string;
}) {
  if (
    status ===
    "approved"
  ) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1

          rounded-full

          bg-emerald-50

          px-2
          py-0.5

          text-[9px]
          font-bold

          text-emerald-700
        "
      >
        <CheckCircle2
          className="
            size-2.5
          "
        />

        Active
      </span>
    );
  }

  if (
    status ===
    "pending"
  ) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1

          rounded-full

          border
          border-amber-200

          bg-amber-50

          px-2
          py-0.5

          text-[9px]
          font-bold

          text-amber-700
        "
      >
        <Clock3
          className="
            size-2.5
          "
        />

        Pending
      </span>
    );
  }

  if (
    status ===
    "rejected"
  ) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1

          rounded-full

          bg-red-50

          px-2
          py-0.5

          text-[9px]
          font-bold

          text-red-600
        "
      >
        <XCircle
          className="
            size-2.5
          "
        />

        Rejected
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1

        rounded-full

        bg-black/[0.045]

        px-2
        py-0.5

        text-[9px]
        font-bold

        text-black/45
      "
    >
      <Pencil
        className="
          size-2.5
        "
      />

      {formatStatus(
        status,
      )}
    </span>
  );
}
function PendingBusinessModal({
  business,
  onClose,
}: {
  business:
    ProfileBusiness | null;

  onClose:
    () => void;
}) {
  useEffect(() => {
    if (!business) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    business,
    onClose,
  ]);

  if (!business) {
    return null;
  }

  const location = [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="
        fixed
        inset-0
        z-[120]

        flex
        items-center
        justify-center

        overflow-y-auto

        bg-[#111814]/50

        p-4

        backdrop-blur-[4px]

        animate-in
        fade-in-0
        duration-200

        sm:p-6
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="pending-business-title"
        aria-describedby="pending-business-description"
        className="
          relative

          my-auto

          w-full
          max-w-[390px]

          overflow-hidden

          rounded-[24px]

          border
          border-black/[0.06]

          bg-white

          shadow-[0_28px_80px_rgba(0,0,0,0.22)]

          animate-in
          fade-in-0
          zoom-in-95
          slide-in-from-bottom-3
          duration-300
        "
      >
        <div
          className="
            relative

            h-[112px]

            overflow-hidden

            bg-[#e7efe9]
          "
        >
          {business.cover_url ? (
            <img
              src={
                business.cover_url
              }
              alt=""
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="
                size-full
                object-cover
              "
            />
          ) : (
            <BusinessCoverFallback />
          )}

          <div
            className="
              absolute
              inset-0

              bg-gradient-to-b
              from-black/15
              via-transparent
              to-black/35
            "
          />

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Close pending business dialog"
            className="
              absolute
              right-3
              top-3

              flex
              size-8
              items-center
              justify-center

              rounded-full

              border
              border-white/20

              bg-black/30

              text-white

              shadow-sm

              backdrop-blur-md

              transition-all
              duration-200

              hover:bg-black/45

              active:scale-90
            "
          >
            <X
              className="
                size-3.5
              "
            />
          </button>
        </div>

        <div
          className="
            relative

            px-5
            pb-5
          "
        >
          <div
            className="
              -mt-[30px]

              flex
              items-end
              justify-between
              gap-3
            "
          >
            <BusinessModalLogo
              business={
                business
              }
            />

            <div
              className="
                mb-1

                inline-flex
                shrink-0
                items-center
                gap-1.5

                rounded-full

                border
                border-amber-200

                bg-amber-50

                px-2.5
                py-1.5

                text-[9px]
                font-bold

                text-amber-700
              "
            >
              <Clock3
                className="
                  size-3
                "
              />

              Pending review
            </div>
          </div>

          <div
            className="
              mt-3.5
            "
          >
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.17em]

                text-[#006241]
              "
            >
              Business submission
            </p>

            <div
              className="
                mt-1

                flex
                min-w-0
                items-center
                gap-1.5
              "
            >
              <h2
                id="pending-business-title"
                className="
                  truncate

                  text-[21px]
                  font-black
                  tracking-[-0.04em]

                  text-[#17211c]
                "
              >
                {business.name}
              </h2>

              {business.is_verified && (
                <BadgeCheck
                  className="
                    size-4
                    shrink-0

                    fill-[#1689e8]
                    text-white
                  "
                />
              )}
            </div>

            <p
              className="
                mt-0.5

                text-[11px]
                font-medium

                text-black/40
              "
            >
              {formatCategory(
                business.category,
              )}
            </p>

            {location && (
              <div
                className="
                  mt-2

                  flex
                  min-w-0
                  items-center
                  gap-1.5

                  text-[10px]
                  text-black/40
                "
              >
                <MapPin
                  className="
                    size-3
                    shrink-0

                    text-[#006241]
                  "
                />

                <span
                  className="
                    truncate
                  "
                >
                  {location}
                </span>
              </div>
            )}
          </div>

          <div
            className="
              my-4

              h-px

              bg-black/[0.055]
            "
          />

          <div
            className="
              flex
              items-start
              gap-3
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

                bg-amber-50

                text-amber-600
              "
            >
              <Hourglass
                className="
                  size-4
                "
              />
            </div>

            <div
              className="
                min-w-0
                pt-0.5
              "
            >
              <h3
                className="
                  text-[13px]
                  font-bold
                  tracking-[-0.015em]

                  text-[#17211c]
                "
              >
                We&apos;re reviewing
                your business
              </h3>

              <p
                id="pending-business-description"
                className="
                  mt-1

                  text-[10px]
                  leading-[17px]

                  text-black/45
                "
              >
                Your submission is
                waiting for approval.
                Once approved, your
                business will become
                discoverable across
                CAFÉTA.
              </p>
            </div>
          </div>

          <div
            className="
              mt-4

              flex
              items-start
              gap-2

              rounded-[14px]

              bg-[#f5f7f5]

              px-3
              py-2.5
            "
          >
            <ShieldCheck
              className="
                mt-[1px]

                size-3.5
                shrink-0

                text-[#006241]
              "
            />

            <p
              className="
                text-[9px]
                leading-[15px]

                text-black/40
              "
            >
              No action is needed
              while your submission
              is being reviewed.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              mt-4

              flex
              h-10
              w-full
              items-center
              justify-center

              rounded-[13px]

              bg-[#006241]

              text-[11px]
              font-bold
              text-white

              shadow-[0_5px_16px_rgba(0,98,65,0.14)]

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:bg-[#00754a]
              hover:shadow-[0_7px_20px_rgba(0,98,65,0.18)]

              active:translate-y-0
              active:scale-[0.985]
            "
          >
            Got it
          </button>
        </div>
      </section>
    </div>
  );
}

function BusinessModalLogo({
  business,
}: {
  business:
    ProfileBusiness;
}) {
  const [
    failed,
    setFailed,
  ] =
    useState(false);

  useEffect(() => {
    setFailed(
      false,
    );
  }, [
    business.id,
    business.logo_url,
  ]);

  const showLogo =
    Boolean(
      business.logo_url,
    ) &&
    !failed;

  return (
    <div
      className="
        size-[62px]
        shrink-0

        overflow-hidden

        rounded-[18px]

        border-[4px]
        border-white

        bg-[#e8f2ed]

        shadow-[0_6px_18px_rgba(0,0,0,0.13)]
      "
    >
      {showLogo ? (
        <img
          src={
            business.logo_url!
          }
          alt={`${business.name} logo`}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            setFailed(
              true,
            );
          }}
          className="
            block
            size-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            size-full
            items-center
            justify-center

            bg-gradient-to-br
            from-[#edf5f1]
            to-[#dcebe3]

            text-[#006241]
          "
        >
          <Store
            className="
              size-5
            "
          />
        </div>
      )}
    </div>
  );
}

function BusinessLogo({
  business,
}: {
  business:
    ProfileBusiness;
}) {
  const [
    logoFailed,
    setLogoFailed,
  ] =
    useState(false);

  useEffect(() => {
    setLogoFailed(
      false,
    );
  }, [
    business.id,
    business.logo_url,
  ]);

  const showLogo =
    Boolean(
      business.logo_url,
    ) &&
    !logoFailed;

  return (
    <div
      className="
        relative

        size-12
        shrink-0
        overflow-hidden

        rounded-[15px]

        border
        border-black/[0.05]

        bg-[#e8f2ed]

        shadow-sm
      "
    >
      {showLogo ? (
        <img
          src={
            business.logo_url!
          }
          alt={`${business.name} logo`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            setLogoFailed(
              true,
            );
          }}
          className="
            block
            size-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            size-full
            items-center
            justify-center

            bg-gradient-to-br
            from-[#edf5f1]
            to-[#e3ede8]

            text-[#006241]
          "
        >
          <Store
            className="
              size-5
            "
          />
        </div>
      )}
    </div>
  );
}
function BusinessCoverFallback() {
  return (
    <div
      className="
        relative

        size-full
        overflow-hidden

        bg-gradient-to-br
        from-[#006241]
        via-[#006b47]
        to-[#00452e]
      "
    >
      <div
        className="
          absolute
          -right-8
          -top-14

          size-40

          rounded-full

          border-[24px]
          border-white/[0.06]
        "
      />

      <div
        className="
          absolute
          -bottom-14
          -left-8

          size-32

          rounded-full

          border-[20px]
          border-white/[0.045]
        "
      />

      <div
        className="
          absolute
          bottom-4
          right-5

          flex
          items-center
          gap-1.5

          text-[9px]
          font-bold
          tracking-[0.08em]

          text-white/45
        "
      >
        <Store
          className="
            size-3
          "
        />

        CAFÉTA
      </div>
    </div>
  );
}

function EmptyBusinessState() {
  return (
    <div
      className="
        mt-5

        rounded-[22px]

        border
        border-dashed
        border-[#006241]/15

        bg-[#f8fbf9]

        px-5
        py-7

        text-center
      "
    >
      <div
        className="
          mx-auto

          flex
          size-11
          items-center
          justify-center

          rounded-[16px]

          bg-[#e8f2ed]
          text-[#006241]
        "
      >
        <Building2
          className="
            size-5
          "
        />
      </div>

      <h3
        className="
          mt-3

          text-sm
          font-bold
          text-[#17211c]
        "
      >
        Have a café or milk tea
        shop?
      </h3>

      <p
        className="
          mx-auto
          mt-1.5
          max-w-sm

          text-xs
          leading-5
          text-black/40
        "
      >
        Create your business page and
        make it discoverable across
        CAFÉTA.
      </p>

      <Link
        href="/business/create"
        className="
          mt-4

          inline-flex
          h-9
          items-center
          gap-1.5

          rounded-full

          bg-[#006241]

          px-4

          text-xs
          font-bold
          text-white
        "
      >
        <Plus
          className="
            size-3.5
          "
        />

        Create your business
      </Link>
    </div>
  );
}

function CoffeePattern() {
  return (
    <>
      <div
        className="
          absolute
          bottom-5
          left-6

          flex
          size-12
          items-center
          justify-center

          rounded-full

          bg-white/[0.08]

          text-white/50
        "
      >
        <Store
          className="
            size-5
          "
        />
      </div>
    </>
  );
}

function ProfileStat({
  value,
  label,
}: {
  value:
    number;

  label:
    string;
}) {
  return (
    <div
      className="
        text-center
      "
    >
      <p
        className="
          text-lg
          font-black
          tracking-[-0.04em]

          text-[#17211c]
        "
      >
        {value}
      </p>

      <p
        className="
          mt-0.5

          text-[10px]
          font-medium
          text-black/40
        "
      >
        {label}
      </p>
    </div>
  );
}

function ProfileRow({
  icon:
    Icon,
  label,
  value,
  href,
}: {
  icon:
    typeof UserRound;

  label:
    string;

  value:
    string;

  href:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="
        group

        flex
        items-center
        gap-3

        py-3.5

        first:pt-0
        last:pb-0
      "
    >
      <div
        className="
          flex
          size-9
          shrink-0
          items-center
          justify-center

          rounded-[12px]

          bg-[#f2f6f4]
          text-[#006241]
        "
      >
        <Icon
          className="
            size-4
          "
        />
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-sm
            font-semibold
            text-[#25312b]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate

            text-[11px]
            text-black/35
          "
        >
          {value}
        </p>
      </div>

      <ChevronRight
        className="
          size-4

          text-black/20
        "
      />
    </Link>
  );
}

function ProfileActionRow({
  icon:
    Icon,
  label,
  value,
  onClick,
}: {
  icon:
    typeof UserRound;

  label:
    string;

  value:
    string;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="
        group

        flex
        w-full
        items-center
        gap-3

        py-3.5

        text-left

        first:pt-0
        last:pb-0
      "
    >
      <div
        className="
          flex
          size-9
          shrink-0
          items-center
          justify-center

          rounded-[12px]

          bg-[#f2f6f4]
          text-[#006241]
        "
      >
        <Icon
          className="
            size-4
          "
        />
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-sm
            font-semibold
            text-[#25312b]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate

            text-[11px]
            text-black/35
          "
        >
          {value}
        </p>
      </div>

      <ChevronRight
        className="
          size-4

          text-black/20
        "
      />
    </button>
  );
}

function getInitials(
  name:
    string | null,
) {
  if (
    !name?.trim()
  ) {
    return "C";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(
      0,
      2,
    )
    .map(
      (part) =>
        part.charAt(
          0,
        ),
    )
    .join("")
    .toUpperCase();
}

function formatCategory(
  category:
    string,
) {
  return category
    .replaceAll(
      "_",
      " ",
    )
    .replace(
      /\b\w/g,
      (
        letter,
      ) =>
        letter.toUpperCase(),
    );
}

function formatMemberRole(
  role:
    string,
) {
  if (!role) {
    return "Member";
  }

  return (
    role
      .charAt(0)
      .toUpperCase() +
    role.slice(1)
  );
}

function formatStatus(
  status:
    string,
) {
  if (!status) {
    return "";
  }

  return (
    status
      .charAt(0)
      .toUpperCase() +
    status.slice(1)
  );
}