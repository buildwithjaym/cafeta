"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  Coffee,
  Compass,
  Heart,
  Map,
  Plus,
  UserRound,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";

const leftNavigation = [
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
];

const rightNavigation = [
  {
    name: "Saved",
    href: "/saved",
    icon: Heart,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserRound,
  },
];

export function MobileNavigation() {
  const pathname =
    usePathname();

  const [
    avatarUrl,
    setAvatarUrl,
  ] = useState<
    string | null
  >(null);

  const [
    avatarFailed,
    setAvatarFailed,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAvatar() {
      try {
        const supabase =
          createClient();

        const {
          data: { user },
          error: authError,
        } =
          await supabase.auth.getUser();

        if (
          authError ||
          !user ||
          !mounted
        ) {
          return;
        }

        const {
          data: profile,
          error: profileError,
        } =
          await supabase
            .from("profiles")
            .select("avatar_url")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "[CAFÉTA] Failed to load navigation avatar:",
            profileError,
          );
        }

        const googleAvatar =
          getGoogleAvatar(
            user.user_metadata,
          );

        const resolvedAvatar =
          profile?.avatar_url ??
          googleAvatar ??
          null;

        if (mounted) {
          setAvatarUrl(
            resolvedAvatar,
          );

          setAvatarFailed(
            false,
          );
        }
      } catch (error) {
        console.error(
          "[CAFÉTA] Failed to load mobile navigation profile:",
          error,
        );
      }
    }

    void loadAvatar();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  const showAvatar =
    Boolean(avatarUrl) &&
    !avatarFailed;

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-40

          flex
          h-[62px]
          items-center
          justify-between

          border-b
          border-black/[0.035]

          bg-white/75

          px-5

          backdrop-blur-2xl
          backdrop-saturate-150

          md:hidden
        "
      >
        <Link
          href="/explore"
          className="
            flex
            items-center
            gap-2.5

            transition-all
            duration-200

            active:scale-[0.97]
          "
        >
          <div
            className="
              flex
              size-[34px]
              items-center
              justify-center

              rounded-full

              bg-[#006241]

              shadow-[0_5px_16px_rgba(0,98,65,0.16)]
            "
          >
            <Coffee
              className="
                size-[16px]
                text-white
              "
              strokeWidth={2.2}
            />
          </div>

          <span
            className="
              text-[19px]
              font-black
              tracking-[-0.055em]
              text-[#006241]
            "
          >
            CAFÉTA
          </span>
        </Link>

        <Link
          href="/profile"
          aria-label="Open profile"
          className="
            group

            relative

            flex
            size-[38px]
            items-center
            justify-center

            overflow-hidden

            rounded-full

            border
            border-[#006241]/10

            bg-[#eaf3ee]

            text-[#006241]

            shadow-[0_3px_12px_rgba(0,98,65,0.08)]

            transition-all
            duration-200

            hover:scale-105

            active:scale-90
          "
        >
          {showAvatar ? (
            <img
              key={avatarUrl}
              src={avatarUrl!}
              alt="Profile"
              loading="eager"
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

                transition-transform
                duration-300

                group-hover:scale-[1.04]
              "
            />
          ) : (
            <UserRound
              className="size-[17px]"
              strokeWidth={2}
            />
          )}
        </Link>
      </header>

      <div
        className="
          pointer-events-none

          fixed
          inset-x-0
          bottom-0
          z-50

          flex
          justify-center

          px-3
          pb-[calc(10px+env(safe-area-inset-bottom))]

          md:hidden
        "
      >
        <nav
          aria-label="Mobile navigation"
          className="
            pointer-events-auto
            relative

            grid
            h-[74px]
            w-full
            max-w-[430px]

            grid-cols-[1fr_1fr_82px_1fr_1fr]

            items-center

            rounded-[27px]

            border
            border-white/80

            bg-white/[0.78]

            px-1.5

            shadow-[0_18px_55px_rgba(18,38,28,0.13),0_5px_15px_rgba(18,38,28,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]

            backdrop-blur-[24px]
            backdrop-saturate-[1.4]
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none

              absolute
              inset-0

              overflow-hidden

              rounded-[27px]
            "
          >
            <div
              className="
                absolute
                inset-x-8
                top-0

                h-px

                bg-gradient-to-r
                from-transparent
                via-white
                to-transparent
              "
            />

            <div
              className="
                absolute
                -bottom-14
                left-1/2

                h-20
                w-44

                -translate-x-1/2

                rounded-full

                bg-[#006241]/[0.035]

                blur-2xl
              "
            />
          </div>

          {leftNavigation.map(
            (item) => (
              <NavItem
                key={item.href}
                item={item}
                pathname={
                  pathname
                }
              />
            ),
          )}

          <div
            className="
              relative

              flex
              h-full
              items-center
              justify-center
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                -top-[22px]

                size-[74px]

                rounded-full

                bg-[#f7f8f6]

                shadow-[0_5px_15px_rgba(18,38,28,0.04)]
              "
            />

            <Link
              href="/memories"
              aria-label="Create memory"
              className="
                group

                absolute
                -top-[17px]

                flex
                size-[64px]
                items-center
                justify-center

                rounded-full

                border
                border-white/20

                bg-[#006241]

                text-white

                shadow-[0_12px_28px_rgba(0,98,65,0.28),0_4px_10px_rgba(0,98,65,0.15),inset_0_1px_0_rgba(255,255,255,0.18)]

                transition-all
                duration-300
                ease-out

                hover:-translate-y-0.5
                hover:bg-[#00754A]
                hover:shadow-[0_15px_34px_rgba(0,98,65,0.32),0_5px_12px_rgba(0,98,65,0.17)]

                active:translate-y-0
                active:scale-[0.88]
              "
            >
              <span
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute
                  inset-[3px]

                  rounded-full

                  bg-gradient-to-b
                  from-white/[0.13]
                  via-transparent
                  to-black/[0.025]
                "
              />

              <span
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute
                  left-[15px]
                  top-[9px]

                  h-[10px]
                  w-[25px]

                  rotate-[-10deg]

                  rounded-full

                  bg-white/[0.10]

                  blur-[3px]
                "
              />

              <Plus
                className="
                  relative
                  z-10

                  size-[27px]

                  transition-transform
                  duration-300

                  group-hover:rotate-90
                  group-active:scale-90
                "
                strokeWidth={2.25}
              />
            </Link>

            <span
              className="
                pointer-events-none

                absolute
                bottom-[7px]

                text-[9px]
                font-bold
                leading-none
                tracking-[-0.01em]
                text-[#006241]
              "
            >
              Memory
            </span>
          </div>

          {rightNavigation.map(
            (item) => (
              <NavItem
                key={item.href}
                item={item}
                pathname={
                  pathname
                }
              />
            ),
          )}
        </nav>
      </div>
    </>
  );
}

type NavigationItem = {
  name: string;
  href: string;
  icon: typeof Compass;
};

function NavItem({
  item,
  pathname,
}: {
  item: NavigationItem;
  pathname: string;
}) {
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
      href={item.href}
      aria-label={
        item.name
      }
      aria-current={
        active
          ? "page"
          : undefined
      }
      className="
        relative
        z-10

        flex
        h-full
        min-w-0
        items-center
        justify-center
      "
    >
      <div
        className={`
          group
          relative

          flex
          h-[59px]
          w-full
          flex-col
          items-center
          justify-center

          gap-[5px]

          rounded-[19px]

          transition-all
          duration-200
          ease-out

          active:scale-[0.91]

          ${
            active
              ? "text-[#006241]"
              : "text-[#68736d]"
          }
        `}
      >
        {active && (
          <span
            aria-hidden="true"
            className="
              absolute
              inset-x-[3px]
              inset-y-[3px]

              rounded-[17px]

              border
              border-[#006241]/[0.035]

              bg-[#006241]/[0.065]

              shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]

              animate-in
              fade-in
              zoom-in-95
              duration-200
            "
          />
        )}

        <div
          className="
            relative
            z-10

            flex
            h-[27px]
            items-center
            justify-center
          "
        >
          <Icon
            className={`
              size-[19px]

              transition-all
              duration-200

              ${
                active
                  ? "scale-[1.06]"
                  : "group-hover:scale-105"
              }
            `}
            strokeWidth={
              active
                ? 2.45
                : 1.9
            }
          />

          {active && (
            <span
              className="
                absolute
                -right-[7px]
                top-[1px]

                size-[4px]

                rounded-full

                bg-[#006241]
              "
            />
          )}
        </div>

        <span
          className={`
            relative
            z-10

            max-w-full
            truncate

            text-[9.5px]
            leading-none
            tracking-[-0.012em]

            transition-colors
            duration-200

            ${
              active
                ? "font-extrabold text-[#006241]"
                : "font-semibold text-[#68736d]"
            }
          `}
        >
          {item.name}
        </span>
      </div>
    </Link>
  );
}

function getGoogleAvatar(
  metadata:
    | Record<
        string,
        unknown
      >
    | undefined,
) {
  if (!metadata) {
    return null;
  }

  if (
    typeof metadata.avatar_url ===
      "string" &&
    metadata.avatar_url
  ) {
    return metadata.avatar_url;
  }

  if (
    typeof metadata.picture ===
      "string" &&
    metadata.picture
  ) {
    return metadata.picture;
  }

  return null;
}