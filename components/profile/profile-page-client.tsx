"use client";

import {
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  BadgeCheck,
  Building2,
  ChevronRight,
  CircleUserRound,
  Heart,
  LogOut,
  MessageSquareText,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

import { toast } from "sonner";

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
  profile: initialProfile,
  businesses,
  stats,
}: Props) {
  const router =
    useRouter();

  const [
    profile,
    setProfile,
  ] = useState<CafetaProfile>(
    initialProfile,
  );

  const [
    editProfileOpen,
    setEditProfileOpen,
  ] = useState(false);

  const [
    usernameOpen,
    setUsernameOpen,
  ] = useState(false);

  const [
    signingOut,
    setSigningOut,
  ] = useState(false);

  function handleProfileUpdated(
    updatedProfile: CafetaProfile,
  ) {
    setProfile(
      updatedProfile,
    );
  }

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    try {
      const supabase =
        createClient();

      const { error } =
        await supabase.auth.signOut();

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

      router.replace("/");
      router.refresh();
    } finally {
      setSigningOut(false);
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
            px-4 py-6
            sm:px-6
            md:py-9
            lg:px-8
          "
        >
          <header
            className="
              mb-6
              flex items-end
              justify-between
              gap-4
              md:mb-8
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold uppercase
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
                flex size-10
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
                className="size-[17px]"
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
              user={user}
              profile={profile}
              stats={stats}
              onEdit={() =>
                setEditProfileOpen(true)
              }
              onUsername={() =>
                setUsernameOpen(true)
              }
            />

            <div
              className="
                min-w-0
                space-y-5
              "
            >
              <section
                className="
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
                        font-bold uppercase
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
                      Your CAFÉTA identity
                    </h2>
                  </div>

                  <div
                    className="
                      flex size-10
                      items-center
                      justify-center
                      rounded-[14px]
                      bg-[#e8f2ed]
                      text-[#006241]
                    "
                  >
                    <UserRound
                      className="size-[18px]"
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
                    onClick={() =>
                      setUsernameOpen(true)
                    }
                  />

                  <ProfileRow
                    icon={Heart}
                    label="Saved places"
                    value={`${stats.saved} ${
                      stats.saved === 1
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
                      stats.reviews === 1
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
              />

              <section
                className="
                  rounded-[28px]
                  border
                  border-black/[0.05]
                  bg-white
                  p-3
                  shadow-[0_10px_35px_rgba(23,33,28,0.04)]
                "
              >
                <ProfileRow
                  icon={Settings}
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
                    group flex
                    w-full
                    items-center
                    gap-3
                    rounded-[18px]
                    px-3 py-3.5
                    text-left
                    transition-all
                    duration-200
                    hover:bg-red-50
                    disabled:pointer-events-none
                    disabled:opacity-50
                  "
                >
                  <div
                    className="
                      flex size-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-[12px]
                      bg-red-50
                      text-red-600
                      transition-transform
                      group-active:scale-95
                    "
                  >
                    <LogOut
                      className="size-4"
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
        open={editProfileOpen}
        onOpenChange={
          setEditProfileOpen
        }
        profile={profile}
        email={user.email}
        onUpdated={
          handleProfileUpdated
        }
      />

      <ChangeUsernameModal
        open={usernameOpen}
        profile={profile}
        onClose={() =>
          setUsernameOpen(false)
        }
        onUpdated={
          handleProfileUpdated
        }
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
  user: Props["user"];
  profile: CafetaProfile;
  stats: ProfileStats;
  onEdit: () => void;
  onUsername: () => void;
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[30px]
        border
        border-black/[0.05]
        bg-white
        shadow-[0_12px_40px_rgba(23,33,28,0.05)]
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
          px-5 pb-6
        "
      >
        <div
          className="
            -mt-11
            flex items-end
            justify-between
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
              shadow-sm
            "
          >
            {profile.avatar_url ? (
              <Image
                src={
                  profile.avatar_url
                }
                alt={
                  profile.full_name ??
                  "CAFÉTA profile"
                }
                fill
                priority
                sizes="88px"
                className="object-cover"
              />
            ) : (
              <div
                className="
                  flex h-full
                  w-full
                  items-center
                  justify-center
                  text-xl
                  font-black
                  text-[#006241]
                "
              >
                {getInitials(
                  profile.full_name,
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit profile"
            className="
              mb-1
              flex size-9
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.07]
              bg-white
              text-black/55
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-[#006241]/20
              hover:bg-[#f4f8f6]
              hover:text-[#006241]
              hover:shadow-md
              active:translate-y-0
              active:scale-90
            "
          >
            <Pencil
              className="size-3.5"
            />
          </button>
        </div>

        <div className="mt-4">
          <div
            className="
              flex items-center
              gap-1.5
            "
          >
            <h2
              className="
                truncate
                text-xl
                font-bold
                tracking-[-0.03em]
                text-[#17211c]
              "
            >
              {profile.full_name ||
                "CAFÉTA User"}
            </h2>

            {profile.role ===
              "admin" && (
              <ShieldCheck
                className="
                  size-4
                  shrink-0
                  text-[#006241]
                "
              />
            )}
          </div>

          <button
            type="button"
            onClick={onUsername}
            className="
              mt-1
              text-left
              text-sm
              font-medium
              text-[#006241]
              transition
              hover:underline
            "
          >
            {profile.username
              ? `@${profile.username}`
              : "Set your username"}
          </button>

          <p
            className="
              mt-1 truncate
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
              onClick={onEdit}
              className="
                mt-4
                text-left
                text-sm
                leading-6
                text-black/35
                transition
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
            grid grid-cols-3
            divide-x
            divide-black/[0.06]
            rounded-[20px]
            bg-[#f7f8f6]
            px-2 py-4
          "
        >
          <ProfileStat
            value={stats.saved}
            label="Saved"
          />

          <ProfileStat
            value={stats.reviews}
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
}: {
  businesses: ProfileBusiness[];
}) {
  return (
    <section
      className="
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
          flex items-start
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-bold uppercase
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
            Create and manage places
            connected to your CAFÉTA
            account.
          </p>
        </div>

        <Link
          href="/business/create"
          aria-label="Create business"
          className="
            flex size-10
            shrink-0
            items-center
            justify-center
            rounded-[14px]
            bg-[#006241]
            text-white
            transition-all
            hover:bg-[#004f35]
            active:scale-95
          "
        >
          <Plus
            className="size-[18px]"
          />
        </Link>
      </div>

      {businesses.length > 0 ? (
        <div
          className="
            mt-5
            space-y-2.5
          "
        >
          {businesses.map(
            (business) => (
              <Link
                key={business.id}
                href={`/business/${business.slug}`}
                className="
                  group flex
                  items-center
                  gap-3
                  rounded-[20px]
                  border
                  border-black/[0.05]
                  p-3
                  transition-all
                  duration-200
                  hover:border-[#006241]/15
                  hover:bg-[#fafcfb]
                "
              >
                <div
                  className="
                    relative
                    size-12
                    shrink-0
                    overflow-hidden
                    rounded-[15px]
                    bg-[#e8f2ed]
                  "
                >
                  {business.logo_url ? (
                    <Image
                      src={
                        business.logo_url
                      }
                      alt={
                        business.name
                      }
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="
                        flex h-full
                        items-center
                        justify-center
                        text-[#006241]
                      "
                    >
                      <Store
                        className="size-5"
                      />
                    </div>
                  )}
                </div>

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <h3
                      className="
                        truncate
                        text-sm
                        font-bold
                        text-[#17211c]
                      "
                    >
                      {business.name}
                    </h3>

                    {business.is_verified && (
                      <BadgeCheck
                        className="
                          size-3.5
                          shrink-0
                          text-[#006241]
                        "
                      />
                    )}
                  </div>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[10px]
                      text-black/40
                    "
                  >
                    {formatCategory(
                      business.category,
                    )}
                    {" • "}
                    {formatMemberRole(
                      business.memberRole,
                    )}
                    {" • "}
                    {business.status}
                  </p>
                </div>

                <ChevronRight
                  className="
                    size-4
                    shrink-0
                    text-black/20
                    transition
                    group-hover:text-[#006241]
                  "
                />
              </Link>
            ),
          )}
        </div>
      ) : (
        <div
          className="
            mt-5
            rounded-[22px]
            border
            border-dashed
            border-[#006241]/15
            bg-[#f8fbf9]
            px-5 py-7
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex size-11
              items-center
              justify-center
              rounded-[16px]
              bg-[#e8f2ed]
              text-[#006241]
            "
          >
            <Building2
              className="size-5"
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
            Create your business page
            and make it discoverable
            across CAFÉTA.
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
              transition-all
              hover:bg-[#004f35]
              active:scale-[0.97]
            "
          >
            <Plus
              className="size-3.5"
            />

            Create your business
          </Link>
        </div>
      )}
    </section>
  );
}

function ProfileStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="text-center">
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
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="
        group flex
        items-center
        gap-3
        py-3.5
        first:pt-0
        last:pb-0
      "
    >
      <div
        className="
          flex size-9
          shrink-0
          items-center
          justify-center
          rounded-[12px]
          bg-[#f2f6f4]
          text-[#006241]
          transition-all
          group-hover:bg-[#e8f2ed]
        "
      >
        <Icon className="size-4" />
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
          shrink-0
          text-black/20
          transition
          group-hover:text-[#006241]
        "
      />
    </Link>
  );
}

function ProfileActionRow({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex
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
          flex size-9
          shrink-0
          items-center
          justify-center
          rounded-[12px]
          bg-[#f2f6f4]
          text-[#006241]
          transition-all
          group-hover:bg-[#e8f2ed]
        "
      >
        <Icon className="size-4" />
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
          shrink-0
          text-black/20
          transition
          group-hover:text-[#006241]
        "
      />
    </button>
  );
}

function getInitials(
  name: string | null,
) {
  if (!name?.trim()) {
    return "C";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0),
    )
    .join("")
    .toUpperCase();
}

function formatCategory(
  category: string,
) {
  return category
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatMemberRole(
  role: string,
) {
  return (
    role.charAt(0).toUpperCase() +
    role.slice(1)
  );
}