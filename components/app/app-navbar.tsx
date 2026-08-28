"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import {
  ChevronDown,
  Compass,
  Heart,
  Map,
  UserRound,
} from "lucide-react";

import { NavbarSearch } from "@/components/app/navbar-search";
import { createClient } from "@/lib/supabase/client";

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
    name: "Saved",
    href: "/saved",
    icon: Heart,
  },
];

export function AppNavbar() {
  const pathname = usePathname();

  const [profile, setProfile] =
    useState<Profile | null>(null);

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
          await supabase.auth.getUser();

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
        } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            avatar_url,
            role
          `)
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error(
            "Unable to load navbar profile:",
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
          "Unable to load navbar:",
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

    loadProfile();

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
        sticky top-0 z-50
        hidden h-[72px]
        border-b
        border-black/[0.055]
        bg-white/95
        backdrop-blur-2xl
        md:block
      "
    >
      <div
        className="
          mx-auto flex h-full
          max-w-[1440px]
          items-center
          px-6
          lg:px-8
        "
      >
        {/* CAFÉTA */}

        <Link
          href="/explore"
          aria-label="CAFÉTA home"
          className="
            group flex shrink-0
            items-center
          "
        >
          <span
            className="
              text-[22px]
              font-black
              tracking-[-0.055em]
              text-[#006241]
              transition-colors
              duration-200
              group-hover:text-[#00754A]
            "
          >
            CAFÉTA
          </span>
        </Link>

        {/* Navigation */}

        <nav
          aria-label="Main navigation"
          className="
            ml-9 flex
            h-full
            items-center
            gap-1
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
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={`
                    group relative
                    flex h-full
                    items-center
                    gap-2
                    px-4
                    text-[13px]
                    font-semibold
                    transition-colors
                    duration-200

                    ${
                      active
                        ? "text-[#006241]"
                        : "text-[#59635e] hover:text-[#006241]"
                    }
                  `}
                >
                  <Icon
                    className="
                      size-[17px]
                      transition-transform
                      duration-200
                      group-hover:scale-[1.04]
                    "
                    strokeWidth={
                      active
                        ? 2.35
                        : 2
                    }
                  />

                  <span>
                    {
                      item.name
                    }
                  </span>

                  {active && (
                    <span
                      className="
                        absolute
                        inset-x-4
                        bottom-0
                        h-[3px]
                        rounded-t-full
                        bg-[#006241]
                      "
                    />
                  )}
                </Link>
              );
            },
          )}
        </nav>

        {/* Right */}

        <div
          className="
            ml-auto flex
            min-w-0
            items-center
            gap-3
          "
        >
          <NavbarSearch />

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
                group flex
                shrink-0
                items-center
                gap-2.5
                rounded-full
                border
                py-1.5
                pl-1.5
                pr-2.5
                transition-all
                duration-200

                ${
                  profileActive
                    ? "border-[#006241]/10 bg-[#f0f7f3]"
                    : "border-transparent hover:border-black/[0.05] hover:bg-[#f5f7f5]"
                }
              `}
            >
              {/* Avatar */}

              <div
                className="
                  relative flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-[#e7f0eb]
                  text-[#006241]
                  ring-1
                  ring-black/[0.04]
                  transition-transform
                  duration-200
                  group-hover:scale-[1.025]
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
                    "
                  />
                ) : (
                  <UserRound
                    className="size-[18px]"
                    strokeWidth={
                      2
                    }
                  />
                )}
              </div>

              {/* User */}

              <div
                className="
                  hidden min-w-0
                  lg:block
                "
              >
                <p
                  className="
                    max-w-[115px]
                    truncate
                    text-[13px]
                    font-bold
                    leading-[16px]
                    tracking-[-0.015em]
                    text-[#1d2822]
                  "
                >
                  {firstName}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-medium
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
                  hidden size-3.5
                  shrink-0
                  transition-all
                  duration-200
                  lg:block

                  ${
                    profileActive
                      ? "text-[#006241]/55"
                      : "text-black/25 group-hover:text-[#006241]"
                  }
                `}
                strokeWidth={
                  2
                }
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
        flex shrink-0
        items-center
        gap-2.5
        py-1.5
        pl-1.5
        pr-2.5
      "
    >
      <div
        className="
          size-10
          animate-pulse
          rounded-full
          bg-black/[0.06]
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
            h-3 w-16
            animate-pulse
            rounded-full
            bg-black/[0.06]
          "
        />

        <div
          className="
            h-2.5 w-10
            animate-pulse
            rounded-full
            bg-black/[0.045]
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