"use client";

import Link from "next/link";

import {
  useState,
  type ReactNode,
} from "react";

import {
  ArrowRight,
  Bookmark,
  Building2,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Coffee,
  Compass,
  Heart,
  Laptop,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Search,
  Sparkles,
  Star,
  Store,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";

const GREEN = "#006241";

const navLinks = [
  {
    label: "Discover",
    href: "#discover",
  },
  {
    label: "Menus",
    href: "#menus",
  },
  {
    label: "Memories",
    href: "#memories",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  {
    label: "For Business",
    href: "#business",
  },
];

const discoverOptions = [
  {
    icon: Coffee,
    title: "Coffee",
    text: "Find cafés serving the cup you're craving.",
    href: "/map?category=coffee",
  },
  {
    icon: Sparkles,
    title: "Milk Tea",
    text: "Discover milk-tea spots around Basilan.",
    href: "/map?category=milk-tea",
  },
  {
    icon: Clock3,
    title: "Open Now",
    text: "Spend less time checking who's still open.",
    href: "/map?open=true",
  },
  {
    icon: LocateFixed,
    title: "Near Me",
    text: "Start with the places closest to you.",
    href: "/map?nearby=true",
  },
];

const vibes = [
  {
    icon: Laptop,
    title: "Study & Work",
    text: "Find somewhere for a focused afternoon and a good cup.",
    href: "/map?vibe=study",
  },
  {
    icon: Users,
    title: "Catch Up",
    text: "Places made for conversations that last longer than one drink.",
    href: "/map?vibe=hangout",
  },
  {
    icon: Heart,
    title: "Coffee Date",
    text: "Find somewhere a little more special for the two of you.",
    href: "/map?vibe=date",
  },
  {
    icon: UtensilsCrossed,
    title: "Coffee & Food",
    text: "For the days when a drink alone isn't going to be enough.",
    href: "/map?vibe=food",
  },
];

const menuItems = [
  {
    name: "Spanish Latte",
    description: "Espresso, milk and a smooth sweet finish.",
    price: "₱—",
    category: "Coffee",
  },
  {
    name: "Matcha Latte",
    description: "Creamy matcha served hot or over ice.",
    price: "₱—",
    category: "Matcha",
  },
  {
    name: "House Milk Tea",
    description: "A café favorite with a rich tea base.",
    price: "₱—",
    category: "Milk Tea",
  },
];

export default function Home() {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  return (
    <main className="overflow-x-hidden bg-white text-[#17211c]">
      {/* HEADER */}
      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50

          border-b
          border-black/[0.045]

          bg-white/90

          backdrop-blur-xl
        "
      >
        <div
          className="
            page-container

            flex
            h-[68px]
            items-center
            justify-between

            sm:h-[74px]
          "
        >
          <Link
            href="/"
            className="
              text-[1.4rem]
              font-black
              tracking-[-0.055em]

              text-[#006241]

              sm:text-[1.65rem]
            "
          >
            CAFÉTA
          </Link>

          <nav
            className="
              hidden
              items-center
              gap-7

              lg:flex
            "
          >
            {navLinks.map(
              (link) => (
                <Link
                  key={
                    link.label
                  }
                  href={
                    link.href
                  }
                  className="
                    text-[13px]
                    font-semibold

                    text-black/50

                    transition-colors

                    hover:text-[#006241]
                  "
                >
                  {
                    link.label
                  }
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="
                hidden
                h-10
                items-center
                justify-center

                px-3

                text-[13px]
                font-semibold

                text-black/55

                transition

                hover:text-[#006241]

                sm:inline-flex
              "
            >
              Sign in
            </Link>

            <Link
              href="/auth/register"
              className="
                group

                hidden
                h-10
                items-center
                justify-center
                gap-2

                rounded-full

                bg-[#006241]

                px-5

                text-[12px]
                font-bold

                text-white

                transition-all

                hover:-translate-y-0.5
                hover:bg-[#00754a]

                sm:inline-flex
              "
            >
              Join CAFÉTA

              <ArrowRight
                className="
                  size-3.5

                  transition-transform

                  group-hover:translate-x-0.5
                "
              />
            </Link>

            <button
              type="button"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={
                menuOpen
              }
              onClick={() =>
                setMenuOpen(
                  (current) =>
                    !current,
                )
              }
              className="
                flex
                size-10
                items-center
                justify-center

                rounded-full

                border
                border-black/[0.07]

                text-black/60

                transition

                hover:bg-black/[0.025]

                lg:hidden
              "
            >
              {menuOpen ? (
                <X className="size-4.5" />
              ) : (
                <Menu className="size-4.5" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="
              animate-in
              fade-in
              slide-in-from-top-2

              border-t
              border-black/[0.05]

              bg-white

              px-4
              py-4

              duration-200

              lg:hidden
            "
          >
            <nav className="flex flex-col">
              {navLinks.map(
                (link) => (
                  <Link
                    key={
                      link.label
                    }
                    href={
                      link.href
                    }
                    onClick={() =>
                      setMenuOpen(
                        false,
                      )
                    }
                    className="
                      rounded-[12px]

                      px-3
                      py-3

                      text-[13px]
                      font-semibold

                      text-black/55

                      transition

                      hover:bg-[#f3f7f5]
                      hover:text-[#006241]
                    "
                  >
                    {
                      link.label
                    }
                  </Link>
                ),
              )}
            </nav>

            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-2

                border-t
                border-black/[0.05]

                pt-4
              "
            >
              <Link
                href="/auth/login"
                onClick={() =>
                  setMenuOpen(
                    false,
                  )
                }
                className="
                  flex
                  h-11
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-black/[0.08]

                  text-[12px]
                  font-bold
                "
              >
                Sign in
              </Link>

              <Link
                href="/auth/register"
                onClick={() =>
                  setMenuOpen(
                    false,
                  )
                }
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  bg-[#006241]

                  text-[12px]
                  font-bold

                  text-white
                "
              >
                Join CAFÉTA

                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        className="
          relative
          overflow-hidden

          pt-[68px]

          sm:pt-[74px]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-[240px]
            top-[30px]

            size-[520px]

            rounded-full

            bg-[#edf5f1]

            sm:-right-[260px]
            sm:size-[700px]

            lg:-right-[300px]
            lg:size-[900px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-[250px]
            bottom-[-300px]

            size-[600px]

            rounded-full

            bg-[#f5f0e7]/70
          "
        />

        <div
          className="
            page-container
            relative

            grid
            min-h-[calc(100svh-68px)]
            items-center
            gap-12

            py-12

            sm:min-h-[calc(100svh-74px)]
            sm:py-16

            lg:grid-cols-[0.92fr_1.08fr]
            lg:gap-14

            xl:gap-20
          "
        >
          <div
            className="
              relative
              z-10

              max-w-[650px]
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-[#006241]/10

                bg-[#f2f8f5]

                px-3.5
                py-2

                text-[10px]
                font-bold

                text-[#006241]

                sm:text-[11px]
              "
            >
              <MapPin className="size-3.5" />

              Discover Basilan
              with CAFÉTA
            </div>

            <h1
              className="
                mt-6

                max-w-[640px]

                text-[2.8rem]
                font-black
                leading-[0.98]
                tracking-[-0.065em]

                text-[#17211c]

                sm:text-[4rem]

                lg:text-[4.4rem]

                xl:text-[5.2rem]
              "
            >
              Find somewhere
              worth going to.
            </h1>

            <p
              className="
                mt-6

                max-w-[560px]

                text-[15px]
                leading-7

                text-black/48

                sm:text-[17px]
                sm:leading-8
              "
            >
              Discover cafés and
              milk-tea shops around
              Basilan. Explore the
              menu, see real
              Memories from the
              community, and know
              what to expect before
              you go.
            </p>

            <div
              className="
                mt-8

                flex
                flex-col
                gap-2.5

                sm:flex-row
              "
            >
              <Link
                href="/map"
                className="
                  group

                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2.5

                  rounded-full

                  bg-[#006241]

                  px-6

                  text-[13px]
                  font-bold

                  text-white

                  shadow-[0_14px_32px_-14px_rgba(0,98,65,0.65)]

                  transition-all

                  hover:-translate-y-0.5
                  hover:bg-[#00754a]

                  sm:h-13
                "
              >
                <Compass className="size-4" />

                Explore CAFÉTA

                <ArrowRight
                  className="
                    size-4

                    transition-transform

                    group-hover:translate-x-0.5
                  "
                />
              </Link>

              <Link
                href="/auth/register"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  border
                  border-black/[0.09]

                  bg-white

                  px-6

                  text-[13px]
                  font-bold

                  text-[#17211c]

                  transition-all

                  hover:border-[#006241]/20
                  hover:text-[#006241]

                  sm:h-13
                "
              >
                Join the community
              </Link>
            </div>

            <div
              className="
                mt-8

                flex
                flex-wrap
                gap-x-5
                gap-y-2.5

                border-t
                border-black/[0.055]

                pt-5
              "
            >
              <HeroBenefit>
                Nearby places
              </HeroBenefit>

              <HeroBenefit>
                Menus
              </HeroBenefit>

              <HeroBenefit>
                Memories
              </HeroBenefit>

              <HeroBenefit>
                Reviews
              </HeroBenefit>
            </div>
          </div>

          <HeroProduct />
        </div>
      </section>

      {/* QUICK DISCOVERY */}
      <section
        id="discover"
        className="
          border-y
          border-black/[0.05]

          bg-white
        "
      >
        <div
          className="
            page-container

            grid
            grid-cols-2

            lg:grid-cols-4
          "
        >
          {discoverOptions.map(
            (
              option,
              index,
            ) => {
              const Icon =
                option.icon;

              return (
                <Link
                  key={
                    option.title
                  }
                  href={
                    option.href
                  }
                  className={`
                    group

                    flex
                    min-h-[125px]
                    items-center
                    gap-3

                    p-4

                    transition

                    hover:bg-[#f7faf8]

                    sm:min-h-[140px]
                    sm:p-5

                    lg:p-6

                    ${
                      index %
                        2 ===
                      0
                        ? "border-r border-black/[0.05]"
                        : ""
                    }

                    ${
                      index <
                      2
                        ? "border-b border-black/[0.05] lg:border-b-0"
                        : ""
                    }

                    ${
                      index !==
                      3
                        ? "lg:border-r lg:border-black/[0.05]"
                        : ""
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      size-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-[#eaf3ee]

                      text-[#006241]

                      transition-all

                      group-hover:bg-[#006241]
                      group-hover:text-white
                    "
                  >
                    <Icon className="size-4" />
                  </div>

                  <div>
                    <div
                      className="
                        flex
                        items-center
                        gap-1
                      "
                    >
                      <h2
                        className="
                          text-[12px]
                          font-black

                          sm:text-[13px]
                        "
                      >
                        {
                          option.title
                        }
                      </h2>

                      <ChevronRight
                        className="
                          size-3

                          text-black/30

                          transition-transform

                          group-hover:translate-x-0.5
                        "
                      />
                    </div>

                    <p
                      className="
                        mt-1

                        max-w-[190px]

                        text-[9px]
                        leading-4

                        text-black/35

                        sm:text-[10px]
                      "
                    >
                      {
                        option.text
                      }
                    </p>
                  </div>
                </Link>
              );
            },
          )}
        </div>
      </section>

      {/* ONE PLACE, EVERYTHING */}
      <section
        id="menus"
        className="
          section-spacing

          bg-[#f6f8f6]
        "
      >
        <div
          className="
            page-container

            grid
            items-center
            gap-12

            lg:grid-cols-[0.78fr_1.22fr]
            lg:gap-16
          "
        >
          <div className="max-w-[510px]">
            <Eyebrow>
              Know before you go
            </Eyebrow>

            <h2
              className="
                mt-4

                text-[2rem]
                font-black
                leading-[1.06]
                tracking-[-0.05em]

                sm:text-[2.7rem]

                lg:text-[3.4rem]
              "
            >
              One place.
              <br />

              <span className="text-[#006241]">
                Everything you
                need.
              </span>
            </h2>

            <p
              className="
                mt-5

                max-w-[480px]

                text-[14px]
                leading-7

                text-black/45

                sm:text-[16px]
              "
            >
              Open a café profile
              and get the useful
              stuff first: where it
              is, when it's open,
              what's on the menu,
              what people think,
              and what the place
              actually looks like.
            </p>

            <div className="mt-7 space-y-3">
              <ValuePoint>
                Browse menu
                categories before
                you visit
              </ValuePoint>

              <ValuePoint>
                Check hours,
                location and
                directions
              </ValuePoint>

              <ValuePoint>
                Read reviews and
                community Memories
              </ValuePoint>

              <ValuePoint>
                Save places you
                want to try later
              </ValuePoint>
            </div>

            <Link
              href="/map"
              className="
                group
                mt-8

                inline-flex
                items-center
                gap-2

                text-[12px]
                font-black

                text-[#006241]
              "
            >
              Find a café

              <ArrowRight
                className="
                  size-3.5

                  transition-transform

                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>

          <BusinessProduct />
        </div>
      </section>

      {/* FIND YOUR VIBE */}
      <section
        className="
          section-spacing

          bg-[#24251f]

          text-white
        "
      >
        <div
          className="
            page-container

            grid
            gap-10

            lg:grid-cols-[0.65fr_1.35fr]
            lg:gap-14
          "
        >
          <div className="max-w-[460px]">
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]

                text-white/35
              "
            >
              Find your vibe
            </p>

            <h2
              className="
                mt-4

                text-[2rem]
                font-black
                leading-[1.08]
                tracking-[-0.05em]

                sm:text-[2.7rem]

                lg:text-[3.2rem]
              "
            >
              Sometimes you know
              the mood before the
              place.
            </h2>

            <p
              className="
                mt-5

                max-w-sm

                text-[13px]
                leading-6

                text-white/45

                sm:text-[14px]
              "
            >
              Whether you're
              studying, catching up,
              going on a date, or
              looking for something
              to eat, start with what
              you need the next hour
              to feel like.
            </p>
          </div>

          <div
            className="
              grid
              gap-px
              overflow-hidden

              rounded-[24px]

              bg-white/10

              sm:grid-cols-2
            "
          >
            {vibes.map(
              (vibe) => {
                const Icon =
                  vibe.icon;

                return (
                  <Link
                    key={
                      vibe.title
                    }
                    href={
                      vibe.href
                    }
                    className="
                      group

                      bg-[#24251f]

                      p-6

                      transition-colors

                      hover:bg-white/[0.045]

                      sm:p-7
                      lg:p-8
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                      "
                    >
                      <div
                        className="
                          flex
                          size-10
                          items-center
                          justify-center

                          rounded-full

                          bg-white/[0.08]

                          text-[#a8d8bf]
                        "
                      >
                        <Icon className="size-4.5" />
                      </div>

                      <ArrowRight
                        className="
                          size-4

                          -rotate-45

                          text-white/25

                          transition-all

                          group-hover:rotate-0
                          group-hover:text-white
                        "
                      />
                    </div>

                    <h3
                      className="
                        mt-10

                        text-[15px]
                        font-bold

                        sm:mt-12
                        sm:text-[17px]
                      "
                    >
                      {
                        vibe.title
                      }
                    </h3>

                    <p
                      className="
                        mt-2

                        max-w-[280px]

                        text-[11px]
                        leading-5

                        text-white/40
                      "
                    >
                      {
                        vibe.text
                      }
                    </p>
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* MEMORIES */}
      <section
        id="memories"
        className="
          section-spacing

          bg-white
        "
      >
        <div
          className="
            page-container

            grid
            items-center
            gap-12

            lg:grid-cols-[1.05fr_0.95fr]
            lg:gap-20
          "
        >
          <MemoryProduct />

          <div className="max-w-[520px]">
            <Eyebrow>
              CAFÉTA Memories
            </Eyebrow>

            <h2
              className="
                mt-4

                text-[2rem]
                font-black
                leading-[1.07]
                tracking-[-0.05em]

                sm:text-[2.7rem]

                lg:text-[3.3rem]
              "
            >
              A map shows you
              where.

              <span className="text-[#006241]">
                {" "}
                A Memory shows you
                what it felt like.
              </span>
            </h2>

            <p
              className="
                mt-5

                max-w-[490px]

                text-[14px]
                leading-7

                text-black/45

                sm:text-[16px]
              "
            >
              See photos and short
              stories shared by
              CAFÉTA members. Get a
              better feel for the
              place before you
              decide to go — then
              leave your own Memory
              when you find
              somewhere worth
              remembering.
            </p>

            <div
              className="
                mt-7

                grid
                grid-cols-3
                gap-2
              "
            >
              <SmallFeature
                icon={
                  <Camera className="size-4" />
                }
                title="Real photos"
              />

              <SmallFeature
                icon={
                  <MessageCircle className="size-4" />
                }
                title="Conversations"
              />

              <SmallFeature
                icon={
                  <Heart className="size-4" />
                }
                title="Community"
              />
            </div>

            <Link
              href="/memories"
              className="
                group
                mt-8

                inline-flex
                items-center
                gap-2

                text-[12px]
                font-black

                text-[#006241]
              "
            >
              Explore Memories

              <ArrowRight
                className="
                  size-3.5

                  transition-transform

                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="
          section-spacing

          bg-[#f6f8f6]
        "
      >
        <div className="page-container">
          <div
            className="
              mx-auto

              max-w-[660px]

              text-center
            "
          >
            <Eyebrow>
              Simple by design
            </Eyebrow>

            <h2
              className="
                mt-4

                text-[2rem]
                font-black
                tracking-[-0.05em]

                sm:text-[2.7rem]

                lg:text-[3.2rem]
              "
            >
              Find it. Go there.
              Remember it.
            </h2>

            <p
              className="
                mx-auto
                mt-4

                max-w-[520px]

                text-[13px]
                leading-6

                text-black/40

                sm:text-[15px]
              "
            >
              CAFÉTA helps with the
              whole decision — from
              finding somewhere new
              to sharing it with the
              next person.
            </p>
          </div>

          <div
            className="
              mt-10

              grid
              gap-3

              md:grid-cols-3

              sm:mt-12
            "
          >
            <HowCard
              number="01"
              icon={
                <Compass className="size-5" />
              }
              title="Discover"
              description="Search the map and find places based on what you're craving and where you are."
            />

            <HowCard
              number="02"
              icon={
                <Navigation className="size-5" />
              }
              title="Decide"
              description="Check the menu, hours, reviews and Memories before choosing where to go."
            />

            <HowCard
              number="03"
              icon={
                <Camera className="size-5" />
              }
              title="Remember"
              description="Share a Memory and help someone else discover a place worth visiting."
            />
          </div>
        </div>
      </section>

      {/* BASILAN */}
      <section
        className="
          section-spacing

          bg-[#006241]

          text-white
        "
      >
        <div
          className="
            page-container

            grid
            items-center
            gap-10

            lg:grid-cols-[1fr_0.78fr]
            lg:gap-16
          "
        >
          <div className="max-w-[680px]">
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]

                text-white/40
              "
            >
              Made for Basilan
            </p>

            <h2
              className="
                mt-4

                text-[2.2rem]
                font-black
                leading-[1.05]
                tracking-[-0.055em]

                sm:text-[3rem]

                lg:text-[4rem]
              "
            >
              Great local places
              deserve to be found.
            </h2>

            <p
              className="
                mt-5

                max-w-[570px]

                text-[14px]
                leading-7

                text-white/55

                sm:text-[16px]
              "
            >
              CAFÉTA starts here —
              helping people discover
              the cafés, milk-tea
              shops, food, and
              everyday places that
              make our own
              communities worth
              exploring.
            </p>

            <Link
              href="/map"
              className="
                group
                mt-8

                inline-flex
                h-12
                items-center
                justify-center
                gap-2

                rounded-full

                bg-white

                px-6

                text-[12px]
                font-black

                text-[#006241]

                transition-all

                hover:-translate-y-0.5
              "
            >
              Explore Basilan

              <ArrowRight
                className="
                  size-3.5

                  transition-transform

                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
            "
          >
            <BasilanCard
              icon={
                <MapPin className="size-5" />
              }
              label="Local first."
            />

            <BasilanCard
              offset
              light
              icon={
                <Heart className="size-5" />
              }
              label="Community powered."
            />
          </div>
        </div>
      </section>

      {/* BUSINESS */}
      <section
        id="business"
        className="
          section-spacing

          bg-white
        "
      >
        <div className="page-container">
          <div
            className="
              relative
              overflow-hidden

              rounded-[28px]

              bg-[#24251f]

              px-6
              py-9

              text-white

              sm:rounded-[36px]
              sm:px-10
              sm:py-12

              lg:px-14
              lg:py-14
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-32

                size-[420px]

                rounded-full

                border
                border-white/[0.055]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-16

                size-[270px]

                rounded-full

                border
                border-white/[0.055]
              "
            />

            <div
              className="
                relative

                grid
                gap-8

                lg:grid-cols-[1fr_auto]
                lg:items-center
                lg:gap-12
              "
            >
              <div className="max-w-[670px]">
                <div
                  className="
                    flex
                    size-10
                    items-center
                    justify-center

                    rounded-full

                    bg-white/[0.08]
                  "
                >
                  <Store className="size-4.5" />
                </div>

                <p
                  className="
                    mt-5

                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]

                    text-white/35
                  "
                >
                  CAFÉTA for
                  Business
                </p>

                <h2
                  className="
                    mt-3

                    text-[1.8rem]
                    font-black
                    tracking-[-0.045em]

                    sm:text-[2.3rem]
                  "
                >
                  Put your business
                  where people are
                  looking.
                </h2>

                <p
                  className="
                    mt-4

                    max-w-[590px]

                    text-[12px]
                    leading-6

                    text-white/45

                    sm:text-[14px]
                  "
                >
                  Create your CAFÉTA
                  business profile,
                  keep your hours and
                  menu updated, and
                  give people a
                  better way to
                  discover what you
                  serve before they
                  visit.
                </p>
              </div>

              <Link
                href="/auth/login?next=/business"
                className="
                  group

                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  bg-white

                  px-6

                  text-[11px]
                  font-black

                  text-[#24251f]

                  transition-all

                  hover:-translate-y-0.5

                  sm:h-13
                "
              >
                <Building2 className="size-4" />

                List your business

                <ArrowRight
                  className="
                    size-3.5

                    transition-transform

                    group-hover:translate-x-0.5
                  "
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="
          bg-white

          pb-20
          pt-6

          sm:pb-24
          sm:pt-10
        "
      >
        <div
          className="
            page-container

            text-center
          "
        >
          <div
            className="
              mx-auto

              flex
              size-12
              items-center
              justify-center

              rounded-full

              bg-[#eaf3ee]

              text-[#006241]
            "
          >
            <Coffee className="size-5" />
          </div>

          <p
            className="
              mt-5

              text-[9px]
              font-black
              uppercase
              tracking-[0.22em]

              text-[#006241]
            "
          >
            Kape tayo.
          </p>

          <h2
            className="
              mx-auto
              mt-4

              max-w-[780px]

              text-[2.2rem]
              font-black
              leading-[1.03]
              tracking-[-0.06em]

              sm:text-[3.2rem]

              lg:text-[4rem]
            "
          >
            Your next favorite
            place might be closer
            than you think.
          </h2>

          <p
            className="
              mx-auto
              mt-5

              max-w-[500px]

              text-[13px]
              leading-6

              text-black/40

              sm:text-[15px]
            "
          >
            Open CAFÉTA, see
            what's around you, and
            find somewhere worth
            going to.
          </p>

          <div
            className="
              mt-7

              flex
              flex-col
              justify-center
              gap-2.5

              sm:flex-row
            "
          >
            <Link
              href="/map"
              className="
                group

                inline-flex
                h-12
                items-center
                justify-center
                gap-2

                rounded-full

                bg-[#006241]

                px-6

                text-[12px]
                font-black

                text-white

                shadow-[0_12px_28px_-12px_rgba(0,98,65,0.6)]

                transition-all

                hover:-translate-y-0.5
                hover:bg-[#00754a]
              "
            >
              <Compass className="size-4" />

              Explore CAFÉTA

              <ArrowRight
                className="
                  size-3.5

                  transition-transform

                  group-hover:translate-x-0.5
                "
              />
            </Link>

            <Link
              href="/auth/register"
              className="
                inline-flex
                h-12
                items-center
                justify-center

                rounded-full

                border
                border-black/[0.08]

                px-6

                text-[12px]
                font-black

                transition

                hover:border-[#006241]/20
                hover:text-[#006241]
              "
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HeroProduct() {
  return (
    <div
      className="
        relative

        mx-auto
        w-full
        max-w-[610px]
      "
    >
      <div
        className="
          absolute
          -left-5
          top-16
          z-20

          hidden

          rounded-[16px]

          border
          border-black/[0.05]

          bg-white

          px-3.5
          py-3

          shadow-[0_16px_40px_rgba(23,33,28,0.1)]

          xl:block
        "
      >
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex
              size-8
              items-center
              justify-center

              rounded-full

              bg-[#eaf3ee]

              text-[#006241]
            "
          >
            <Camera className="size-3.5" />
          </div>

          <div>
            <p className="text-[8px] text-black/30">
              Community
              Memories
            </p>

            <p className="mt-0.5 text-[10px] font-black">
              See before you go
            </p>
          </div>
        </div>
      </div>

      <div
        className="
          relative
          ml-auto

          max-w-[540px]

          rounded-[28px]

          border
          border-black/[0.055]

          bg-white

          p-2

          shadow-[0_35px_100px_-35px_rgba(18,40,29,0.3)]

          sm:rounded-[36px]
          sm:p-2.5
        "
      >
        <div
          className="
            overflow-hidden

            rounded-[22px]

            bg-[#f7f9f7]

            sm:rounded-[29px]
          "
        >
          <div className="p-4 sm:p-5">
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div>
                <p className="text-[8px] font-semibold text-black/30">
                  Exploring
                  around
                </p>

                <div
                  className="
                    mt-1.5

                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <MapPin className="size-3.5 text-[#006241]" />

                  <p className="text-[11px] font-black">
                    Isabela City,
                    Basilan
                  </p>
                </div>
              </div>

              <div
                className="
                  flex
                  size-9
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-black/[0.05]

                  bg-white
                "
              >
                <Bookmark className="size-3.5 text-black/40" />
              </div>
            </div>

            <div
              className="
                mt-4

                flex
                h-11
                items-center
                gap-2.5

                rounded-full

                border
                border-black/[0.06]

                bg-white

                px-4

                shadow-sm
              "
            >
              <Search className="size-4 text-black/25" />

              <span className="truncate text-[10px] text-black/30">
                Search coffee,
                milk tea, or a
                place...
              </span>
            </div>

            <div
              className="
                mt-3

                flex
                gap-1.5

                overflow-hidden
              "
            >
              <FilterPill active>
                Coffee
              </FilterPill>

              <FilterPill>
                Milk Tea
              </FilterPill>

              <FilterPill>
                Open Now
              </FilterPill>

              <FilterPill>
                Nearby
              </FilterPill>
            </div>
          </div>

          <div
            className="
              relative

              h-[300px]

              overflow-hidden

              bg-[#e4eee8]

              sm:h-[380px]
            "
          >
            <MapRoad className="left-[13%] top-[-25%] h-[155%] rotate-[24deg]" />

            <MapRoad className="left-[64%] top-[-25%] h-[155%] -rotate-[17deg]" />

            <div
              className="
                absolute
                -left-[20%]
                top-[35%]

                h-[7px]
                w-[150%]

                -rotate-[7deg]

                bg-white/80
              "
            />

            <div
              className="
                absolute
                -left-[20%]
                top-[73%]

                h-[7px]
                w-[150%]

                rotate-[5deg]

                bg-white/80
              "
            />

            <MapMarker className="left-[20%] top-[21%]" />

            <MapMarker className="right-[17%] top-[17%]" />

            <MapMarker
              active
              className="left-[48%] top-[42%]"
            />

            <MapMarker className="left-[17%] bottom-[22%]" />

            <MapMarker className="right-[12%] bottom-[19%]" />

            <div
              className="
                absolute
                bottom-3
                left-3
                right-3

                rounded-[18px]

                bg-white

                p-3

                shadow-[0_16px_40px_rgba(23,33,28,0.16)]

                sm:bottom-4
                sm:left-4
                sm:right-4
                sm:p-3.5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    size-12
                    shrink-0
                    items-center
                    justify-center

                    rounded-[14px]

                    bg-[#f3efe7]

                    text-[#006241]

                    sm:size-14
                  "
                >
                  <Coffee className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <p className="truncate text-[12px] font-black">
                      Brew Cafe
                    </p>

                    <span
                      className="
                        rounded-full

                        bg-[#eaf3ee]

                        px-2
                        py-0.5

                        text-[7px]
                        font-black

                        text-[#006241]
                      "
                    >
                      OPEN
                    </span>
                  </div>

                  <p className="mt-1 text-[8px] text-black/35">
                    Coffee ·
                    Isabela City
                  </p>

                  <div
                    className="
                      mt-2

                      flex
                      flex-wrap
                      items-center
                      gap-x-3
                      gap-y-1

                      text-[8px]
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-1

                        font-bold

                        text-[#006241]
                      "
                    >
                      <UtensilsCrossed className="size-2.5" />

                      View menu
                    </span>

                    <span
                      className="
                        flex
                        items-center
                        gap-1

                        text-black/35
                      "
                    >
                      <Camera className="size-2.5" />

                      Memories
                    </span>

                    <span
                      className="
                        flex
                        items-center
                        gap-1

                        text-black/35
                      "
                    >
                      <Star className="size-2.5" />

                      Reviews
                    </span>
                  </div>
                </div>

                <ChevronRight className="size-4 shrink-0 text-black/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          absolute
          -bottom-5
          right-4

          hidden

          rounded-[16px]

          border
          border-black/[0.05]

          bg-white

          px-3.5
          py-3

          shadow-[0_16px_40px_rgba(23,33,28,0.1)]

          sm:block
        "
      >
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex
              size-8
              items-center
              justify-center

              rounded-full

              bg-[#eaf3ee]

              text-[#006241]
            "
          >
            <UtensilsCrossed className="size-3.5" />
          </div>

          <div>
            <p className="text-[8px] text-black/30">
              Before you go
            </p>

            <p className="mt-0.5 text-[10px] font-black">
              Check the menu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessProduct() {
  return (
    <div
      className="
        relative

        mx-auto
        w-full
        max-w-[680px]
      "
    >
      <div
        className="
          overflow-hidden

          rounded-[26px]

          border
          border-black/[0.055]

          bg-white

          shadow-[0_28px_80px_-35px_rgba(23,33,28,0.3)]

          sm:rounded-[34px]
        "
      >
        <div
          className="
            relative

            h-[150px]

            bg-[#dfece5]

            sm:h-[190px]
          "
        >
          <div
            className="
              absolute
              inset-0

              bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.65),transparent_35%)]
            "
          />

          <div
            className="
              absolute
              -bottom-8
              left-5

              flex
              size-20
              items-center
              justify-center

              rounded-[22px]

              border-4
              border-white

              bg-[#f2eee5]

              text-[#006241]

              shadow-lg

              sm:-bottom-10
              sm:left-7
              sm:size-24
              sm:rounded-[26px]
            "
          >
            <Coffee className="size-8" />
          </div>
        </div>

        <div
          className="
            px-5
            pb-5
            pt-12

            sm:px-7
            sm:pb-7
            sm:pt-14
          "
        >
          <div
            className="
              flex
              flex-col
              justify-between
              gap-4

              sm:flex-row
              sm:items-start
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <h3
                  className="
                    text-[20px]
                    font-black
                    tracking-[-0.04em]

                    sm:text-[23px]
                  "
                >
                  Brew Cafe
                </h3>

                <div
                  className="
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
              </div>

              <p className="mt-1 text-[10px] text-black/35">
                Coffee Shop ·
                Isabela City,
                Basilan
              </p>
            </div>

            <button
              type="button"
              className="
                flex
                h-9
                items-center
                justify-center
                gap-1.5

                self-start

                rounded-full

                bg-[#006241]

                px-4

                text-[9px]
                font-black

                text-white
              "
            >
              <Navigation className="size-3" />

              Directions
            </button>
          </div>

          <div
            className="
              mt-5

              grid
              grid-cols-4
              gap-1.5

              rounded-[15px]

              bg-[#f7f9f8]

              p-1.5
            "
          >
            <ProfileTab active>
              Home
            </ProfileTab>

            <ProfileTab>
              Menu
            </ProfileTab>

            <ProfileTab>
              Memories
            </ProfileTab>

            <ProfileTab>
              Reviews
            </ProfileTab>
          </div>

          <div
            className="
              mt-5

              grid
              gap-4

              md:grid-cols-[0.78fr_1.22fr]
            "
          >
            <div
              className="
                rounded-[18px]

                border
                border-black/[0.05]

                p-4
              "
            >
              <p className="text-[10px] font-black">
                About
              </p>

              <div className="mt-3 space-y-2.5">
                <InfoRow
                  icon={
                    <Clock3 className="size-3" />
                  }
                >
                  Open today
                </InfoRow>

                <InfoRow
                  icon={
                    <MapPin className="size-3" />
                  }
                >
                  Isabela City
                </InfoRow>

                <InfoRow
                  icon={
                    <Star className="size-3" />
                  }
                >
                  Community reviews
                </InfoRow>
              </div>
            </div>

            <div
              className="
                overflow-hidden

                rounded-[18px]

                border
                border-black/[0.05]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between

                  border-b
                  border-black/[0.05]

                  px-4
                  py-3
                "
              >
                <div>
                  <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-[#006241]">
                    Menu
                  </p>

                  <p className="mt-0.5 text-[10px] font-black">
                    Popular picks
                  </p>
                </div>

                <span className="text-[8px] font-bold text-[#006241]">
                  View menu
                </span>
              </div>

              <div className="divide-y divide-black/[0.045]">
                {menuItems.map(
                  (item) => (
                    <div
                      key={
                        item.name
                      }
                      className="
                        flex
                        items-center
                        gap-3

                        px-4
                        py-3
                      "
                    >
                      <div
                        className="
                          flex
                          size-10
                          shrink-0
                          items-center
                          justify-center

                          rounded-[12px]

                          bg-[#edf4f0]

                          text-[#006241]
                        "
                      >
                        <Coffee className="size-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] font-black">
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-0.5 truncate text-[7px] text-black/30">
                          {
                            item.category
                          }
                        </p>
                      </div>

                      <span className="text-[8px] font-black text-black/45">
                        {
                          item.price
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemoryProduct() {
  return (
    <div
      className="
        relative

        mx-auto
        w-full
        max-w-[570px]
      "
    >
      <div
        className="
          grid
          grid-cols-[0.72fr_1.28fr]
          gap-3

          sm:gap-4
        "
      >
        <div
          className="
            mt-12

            space-y-3

            sm:mt-20
            sm:space-y-4
          "
        >
          <div
            className="
              aspect-[0.82/1]

              rounded-[22px]

              bg-[#e9f3ee]

              p-4

              sm:rounded-[28px]
              sm:p-5
            "
          >
            <div
              className="
                flex
                size-8
                items-center
                justify-center

                rounded-full

                bg-white

                text-[#006241]
              "
            >
              <Camera className="size-3.5" />
            </div>

            <p
              className="
                mt-14

                text-[12px]
                font-black
                leading-5

                text-[#006241]

                sm:mt-20
                sm:text-[15px]
              "
            >
              See the place
              before you go.
            </p>
          </div>

          <div
            className="
              rounded-[20px]

              bg-[#006241]

              p-4

              text-white

              sm:rounded-[26px]
              sm:p-5
            "
          >
            <Heart className="size-4" />

            <p
              className="
                mt-8

                text-[11px]
                font-black

                sm:mt-12
                sm:text-[14px]
              "
            >
              Real places.
              <br />
              Real Memories.
            </p>
          </div>
        </div>

        <div
          className="
            flex
            min-h-[390px]
            flex-col
            justify-between

            rounded-[25px]

            bg-[#24251f]

            p-5

            text-white

            shadow-[0_25px_60px_-25px_rgba(0,0,0,0.45)]

            sm:min-h-[510px]
            sm:rounded-[32px]
            sm:p-6
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <span
              className="
                rounded-full

                bg-white/[0.08]

                px-2.5
                py-1.5

                text-[7px]
                font-bold

                text-white/60
              "
            >
              CAFÉTA Memory
            </span>

            <Camera className="size-4 text-white/35" />
          </div>

          <div>
            <div
              className="
                mb-5

                aspect-[1.6/1]

                rounded-[17px]

                bg-gradient-to-br
                from-white/[0.08]
                to-white/[0.025]

                p-4
              "
            >
              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center

                  rounded-[13px]

                  border
                  border-white/[0.06]
                "
              >
                <Coffee className="size-8 text-white/20" />
              </div>
            </div>

            <p
              className="
                text-[15px]
                font-medium
                leading-[1.45]
                tracking-[-0.025em]

                text-white/90

                sm:text-[19px]
              "
            >
              “Quiet upstairs,
              good coffee, and
              definitely somewhere
              I'd come back to.”
            </p>

            <div
              className="
                mt-5

                flex
                items-center
                gap-2.5

                border-t
                border-white/[0.08]

                pt-4
              "
            >
              <div
                className="
                  flex
                  size-8
                  items-center
                  justify-center

                  rounded-full

                  bg-white/[0.1]

                  text-[8px]
                  font-black
                "
              >
                C
              </div>

              <div>
                <p className="text-[9px] font-black">
                  @cafetauser
                </p>

                <p className="mt-0.5 text-[7px] text-white/35">
                  Brew Cafe ·
                  Isabela City
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-[22px]

        border
        border-black/[0.05]

        bg-white

        p-5

        sm:rounded-[26px]
        sm:p-6
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div
          className="
            flex
            size-10
            items-center
            justify-center

            rounded-full

            bg-[#eaf3ee]

            text-[#006241]
          "
        >
          {icon}
        </div>

        <span
          className="
            font-mono
            text-[9px]

            text-black/20
          "
        >
          {number}
        </span>
      </div>

      <h3
        className="
          mt-8

          text-[15px]
          font-black

          sm:text-[17px]
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2

          max-w-[300px]

          text-[10px]
          leading-5

          text-black/38

          sm:text-[11px]
        "
      >
        {description}
      </p>
    </div>
  );
}

function BasilanCard({
  icon,
  label,
  light = false,
  offset = false,
}: {
  icon: ReactNode;
  label: string;
  light?: boolean;
  offset?: boolean;
}) {
  return (
    <div
      className={`
        rounded-[22px]

        p-5

        sm:rounded-[28px]
        sm:p-6

        ${
          offset
            ? "mt-8 sm:mt-12"
            : ""
        }

        ${
          light
            ? "bg-white text-[#17211c]"
            : "border border-white/10 bg-white/[0.055] text-white"
        }
      `}
    >
      <div
        className={
          light
            ? "text-[#006241]"
            : "text-white/60"
        }
      >
        {icon}
      </div>

      <p
        className="
          mt-16

          text-[18px]
          font-black
          leading-[1.15]
          tracking-[-0.035em]

          sm:mt-24
          sm:text-[22px]
        "
      >
        {label}
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer
      className="
        border-t
        border-black/[0.055]

        bg-[#fafbfa]
      "
    >
      <div
        className="
          page-container

          py-10

          sm:py-12
        "
      >
        <div
          className="
            grid
            gap-8

            sm:grid-cols-2

            md:grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr]
          "
        >
          <div>
            <Link
              href="/"
              className="
                text-[1.5rem]
                font-black
                tracking-[-0.055em]

                text-[#006241]
              "
            >
              CAFÉTA
            </Link>

            <p
              className="
                mt-3

                max-w-[290px]

                text-[11px]
                leading-5

                text-black/38
              "
            >
              Discover cafés,
              menus, Memories, and
              places worth going to
              around Basilan.
            </p>

            <p
              className="
                mt-4

                text-[11px]
                font-black
              "
            >
              Kape tayo.
            </p>
          </div>

          <FooterGroup
            title="Explore"
            links={[
              {
                label:
                  "Map",
                href: "/map",
              },
              {
                label:
                  "Memories",
                href: "/memories",
              },
              {
                label:
                  "Saved",
                href: "/saved",
              },
            ]}
          />

          <FooterGroup
            title="Account"
            links={[
              {
                label:
                  "Join CAFÉTA",
                href: "/auth/register",
              },
              {
                label:
                  "Sign in",
                href: "/auth/login",
              },
              {
                label:
                  "For Business",
                href: "/auth/login?next=/business",
              },
            ]}
          />

          <FooterGroup
            title="Legal"
            links={[
              {
                label:
                  "Privacy",
                href: "/privacy",
              },
              {
                label:
                  "Terms",
                href: "/terms",
              },
            ]}
          />
        </div>

        <div
          className="
            mt-10

            flex
            flex-col
            gap-3

            border-t
            border-black/[0.055]

            pt-5

            text-[9px]

            text-black/30

            sm:mt-12
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            ©{" "}
            {new Date().getFullYear()}{" "}
            CAFÉTA. All rights
            reserved.
          </p>

          <p>
            Made for discovering
            Basilan.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;

  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <p
        className="
          text-[9px]
          font-black
          uppercase
          tracking-[0.14em]

          text-black/30
        "
      >
        {title}
      </p>

      <div
        className="
          mt-4

          flex
          flex-col
          gap-2.5
        "
      >
        {links.map(
          (link) => (
            <Link
              key={
                link.label
              }
              href={
                link.href
              }
              className="
                text-[11px]
                font-medium

                text-black/50

                transition

                hover:text-[#006241]
              "
            >
              {
                link.label
              }
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

function HeroBenefit({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span
      className="
        flex
        items-center
        gap-1.5

        text-[9px]
        font-bold

        text-black/40
      "
    >
      <Check className="size-3 text-[#006241]" />

      {children}
    </span>
  );
}

function ValuePoint({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="
          flex
          size-5
          shrink-0
          items-center
          justify-center

          rounded-full

          bg-[#006241]

          text-white
        "
      >
        <Check className="size-2.5" />
      </div>

      <p
        className="
          text-[11px]
          font-semibold

          text-black/60

          sm:text-[12px]
        "
      >
        {children}
      </p>
    </div>
  );
}

function Eyebrow({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p
      className="
        text-[9px]
        font-black
        uppercase
        tracking-[0.2em]

        text-[#006241]
      "
    >
      {children}
    </p>
  );
}

function SmallFeature({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div
      className="
        rounded-[15px]

        border
        border-black/[0.05]

        bg-[#fafbfa]

        p-3

        text-center
      "
    >
      <div
        className="
          mx-auto

          flex
          size-8
          items-center
          justify-center

          rounded-full

          bg-[#eaf3ee]

          text-[#006241]
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-2

          text-[8px]
          font-black

          text-black/55
        "
      >
        {title}
      </p>
    </div>
  );
}

function ProfileTab({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`
        flex
        h-8
        items-center
        justify-center

        rounded-[10px]

        text-[8px]
        font-black

        ${
          active
            ? "bg-white text-[#006241] shadow-sm"
            : "text-black/30"
        }
      `}
    >
      {children}
    </span>
  );
}

function InfoRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2

        text-[8px]
        font-semibold

        text-black/40
      "
    >
      <span className="text-[#006241]">
        {icon}
      </span>

      {children}
    </div>
  );
}

function FilterPill({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`
        shrink-0

        rounded-full

        px-3
        py-1.5

        text-[8px]
        font-bold

        ${
          active
            ? "bg-[#006241] text-white"
            : "border border-black/[0.055] bg-white text-black/40"
        }
      `}
    >
      {children}
    </span>
  );
}

function MapRoad({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`
        absolute

        w-[7px]

        bg-white/80

        ${className}
      `}
    />
  );
}

function MapMarker({
  className,
  active = false,
}: {
  className: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
        absolute

        flex
        items-center
        justify-center

        rounded-full

        border-[3px]
        border-white

        text-white

        shadow-lg

        ${
          active
            ? "size-11 bg-[#24251f]"
            : "size-9 bg-[#006241]"
        }

        ${className}
      `}
    >
      <Coffee
        className={
          active
            ? "size-4"
            : "size-3.5"
        }
      />
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

        bg-[#fafbfa]

        p-3
      "
    >
      <div
        className="
          flex
          size-7
          items-center
          justify-center

          rounded-full

          bg-[#eaf3ee]

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
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
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