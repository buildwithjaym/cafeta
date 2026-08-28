"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  ChevronDown,
  Coffee,
  Compass,
  Heart,
  Map,
  PlusCircle,
  UserRound,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import {
  NavbarSearch,
} from "@/components/app/navbar-search";

import {
  createClient,
} from "@/lib/supabase/client";

type UserRole =
  | "user"
  | "business_owner"
  | "admin";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
};

const navigation = [
  {
    name: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    name: "Map",
    href: "/map",
    icon: Map,
  },
  {
    name: "Memory",
    href: "/memories/create",
    icon: PlusCircle,
  },
  {
    name: "Saved",
    href: "/saved",
    icon: Heart,
  },
];

export function AppNavbar() {
  const pathname =
    usePathname();

  const [
    profile,
    setProfile,
  ] = useState<Profile | null>(
    null,
  );

  const [
    loadingProfile,
    setLoadingProfile,
  ] = useState(true);

  useEffect(() => {
    const supabase =
      createClient();

    let mounted = true;

    async function loadProfile() {
      try {
        const {
          data: { user },
          error: userError,
        } =
          await supabase.auth
            .getUser();

        if (
          userError ||
          !user
        ) {
          if (mounted) {
            setProfile(null);
          }

          return;
        }

        const {
          data,
          error,
        } =
          await supabase
            .from("profiles")
            .select(`
              id,
              full_name,
              avatar_url,
              role
            `)
            .eq(
              "id",
              user.id,
            )
            .maybeSingle();

        if (error) {
          console.error(
            "[CAFÉTA] Unable to load navbar profile:",
            error,
          );

          return;
        }

        if (mounted) {
          setProfile(
            data as Profile | null,
          );
        }
      } catch (error) {
        console.error(
          "[CAFÉTA] Unable to load navbar:",
          error,
        );
      } finally {
        if (mounted) {
          setLoadingProfile(
            false,
          );
        }
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const firstName =
    profile?.full_name
      ?.trim()
      .split(/\s+/)[0] ||
    "Profile";

  const profileActive =
    pathname === "/profile" ||
    pathname.startsWith(
      "/profile/",
    );

  return (
    <header
      className="
        sticky
        top-0
        z-50

        hidden
        h-[76px]

        border-b
        border-black/[0.045]

        bg-white/[0.88]

        shadow-[0_1px_0_rgba(0,0,0,0.015)]

        backdrop-blur-2xl
        backdrop-saturate-150

        md:block
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-[1480px]
          items-center

          px-6

          lg:px-8

          xl:px-10
        "
      >
        {/* Logo */}
        <Link
          href="/explore"
          aria-label="CAFÉTA home"
          className="
            group
            flex
            shrink-0
            items-center
            gap-2.5

            transition-all
            duration-200

            active:scale-[0.98]
          "
        >
          <div
            className="
              flex
              size-[38px]
              shrink-0
              items-center
              justify-center

              rounded-full

              bg-[#006241]

              text-white

              shadow-[0_5px_16px_rgba(0,98,65,0.16)]

              transition-all
              duration-200

              group-hover:bg-[#00754A]

              group-hover:shadow-[0_7px_20px_rgba(0,98,65,0.20)]
            "
          >
            <Coffee
              className="
                size-[18px]
              "
              strokeWidth={2.2}
            />
          </div>

          <span
            className="
              text-[22px]
              font-black
              tracking-[-0.06em]

              text-[#006241]

              transition-colors
              duration-200

              group-hover:text-[#00754A]
            "
          >
            CAFÉTA
          </span>
        </Link>

        {/* Main navigation */}
        <nav
          aria-label="Main navigation"
          className="
            ml-8
            flex
            min-w-0
            items-center
            gap-1

            lg:ml-10

            xl:ml-12
          "
        >
          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                pathname ===
                  item.href ||
                pathname.startsWith(
                  `${item.href}/`,
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={`
                    group
                    relative

                    flex
                    h-[44px]
                    shrink-0
                    items-center
                    gap-2

                    rounded-full

                    px-3.5

                    text-[13px]
                    font-bold

                    transition-all
                    duration-200
                    ease-out

                    active:scale-[0.96]

                    lg:px-4

                    ${
                      active
                        ? `
                          bg-[#006241]/[0.075]
                          text-[#006241]

                          shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]
                        `
                        : `
                          text-[#59635e]

                          hover:bg-black/[0.025]
                          hover:text-[#006241]
                        `
                    }
                  `}
                >
                  <Icon
                    className={`
                      size-[17px]

                      transition-all
                      duration-200

                      ${
                        active
                          ? "scale-[1.04]"
                          : "group-hover:scale-105"
                      }
                    `}
                    strokeWidth={
                      active
                        ? 2.4
                        : 2
                    }
                  />

                  <span>
                    {item.name}
                  </span>

                  {active && (
                    <span
                      className="
                        absolute
                        bottom-[5px]
                        left-1/2

                        size-1

                        -translate-x-1/2

                        rounded-full

                        bg-[#006241]
                      "
                    />
                  )}
                </Link>
              );
            },
          )}
        </nav>

        {/* Right side */}
        <div
          className="
            ml-auto
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          {/* Search */}
          <div
            className="
              hidden
              min-w-0

              md:block
              md:w-[170px]

              lg:w-[220px]

              xl:w-[280px]

              2xl:w-[320px]
            "
          >
            <NavbarSearch />
          </div>

          <div
            aria-hidden="true"
            className="
              hidden
              h-7
              w-px

              bg-black/[0.06]

              lg:block
            "
          />

          {/* Profile */}
          {loadingProfile ? (
            <NavbarProfileSkeleton />
          ) : (
            <Link
              href="/profile"
              aria-label="Open profile"
              aria-current={
                profileActive
                  ? "page"
                  : undefined
              }
              className={`
                group

                flex
                h-[50px]
                shrink-0
                items-center
                gap-2.5

                rounded-full

                border

                py-1
                pl-1
                pr-2

                transition-all
                duration-200

                active:scale-[0.97]

                lg:pr-2.5

                ${
                  profileActive
                    ? `
                      border-[#006241]/10
                      bg-[#edf6f1]

                      shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
                    `
                    : `
                      border-transparent

                      hover:border-black/[0.05]
                      hover:bg-[#f5f7f5]
                    `
                }
              `}
            >
              <div
                className="
                  relative

                  flex
                  size-[42px]
                  shrink-0
                  items-center
                  justify-center

                  overflow-hidden

                  rounded-full

                  bg-[#e7f0eb]

                  text-[#006241]

                  ring-1
                  ring-black/[0.045]

                  shadow-[0_2px_8px_rgba(0,0,0,0.04)]

                  transition-all
                  duration-200

                  group-hover:ring-[#006241]/15
                "
              >
                {profile?.avatar_url ? (
                  <img
                    src={
                      profile.avatar_url
                    }
                    alt={
                      profile.full_name
                        ? `${profile.full_name}'s avatar`
                        : "Profile avatar"
                    }
                    referrerPolicy="no-referrer"
                    className="
                      size-full
                      object-cover

                      transition-transform
                      duration-300

                      group-hover:scale-[1.04]
                    "
                  />
                ) : (
                  <UserRound
                    className="
                      size-[18px]
                    "
                    strokeWidth={2}
                  />
                )}

                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0

                    rounded-full

                    ring-1
                    ring-inset
                    ring-white/45
                  "
                />
              </div>

              <div
                className="
                  hidden
                  min-w-0

                  lg:block
                "
              >
                <p
                  className="
                    max-w-[110px]
                    truncate

                    text-[13px]
                    font-extrabold
                    leading-[16px]
                    tracking-[-0.018em]

                    text-[#1d2822]

                    xl:max-w-[130px]
                  "
                >
                  {firstName}
                </p>

                <p
                  className="
                    mt-[3px]

                    text-[10px]
                    font-semibold
                    leading-none

                    text-black/35
                  "
                >
                  {formatRole(
                    profile?.role,
                  )}
                </p>
              </div>

              <ChevronDown
                className={`
                  hidden
                  size-3.5
                  shrink-0

                  transition-all
                  duration-200

                  lg:block

                  ${
                    profileActive
                      ? "text-[#006241]/60"
                      : "text-black/25 group-hover:text-[#006241]/60"
                  }
                `}
                strokeWidth={2}
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavbarProfileSkeleton() {
  return (
    <div
      className="
        flex
        h-[50px]
        shrink-0
        items-center
        gap-2.5

        rounded-full

        py-1
        pl-1
        pr-2.5
      "
    >
      <div
        className="
          size-[42px]

          animate-pulse

          rounded-full

          bg-black/[0.055]
        "
      />

      <div
        className="
          hidden
          space-y-1.5

          lg:block
        "
      >
        <div
          className="
            h-3
            w-[68px]

            animate-pulse

            rounded-full

            bg-black/[0.055]
          "
        />

        <div
          className="
            h-2
            w-11

            animate-pulse

            rounded-full

            bg-black/[0.04]
          "
        />
      </div>
    </div>
  );
}

function formatRole(
  role?: UserRole,
) {
  switch (role) {
    case "business_owner":
      return "Business Owner";

    case "admin":
      return "Admin";

    default:
      return "Member";
  }
}