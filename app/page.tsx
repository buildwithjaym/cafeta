"use client";

import { useState } from "react";
import Link from "next/link";
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
  Map,
  MapPin,
  Menu,
  Navigation,
  Search,
  Sparkles,
  Store,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";



const quickDiscover = [
  {
    icon: Coffee,
    title: "Coffee",
    text: "Every roast, every corner shop.",
    href: "/explore?category=coffee",
  },
  {
    icon: Sparkles,
    title: "Milk Tea",
    text: "Cold, sweet, and close by.",
    href: "/explore?category=milk-tea",
  },
  {
    icon: Clock3,
    title: "Open Now",
    text: "Skip the ones that are closed.",
    href: "/explore?open=true",
  },
  {
    icon: LocateFixed,
    title: "Near Me",
    text: "Start from right where you're standing.",
    href: "/explore?nearby=true",
  },
];

const places = [
  {
    name: "The Daily Habit",
    type: "Specialty Coffee",
    location: "Isabela City",
    distance: "0.8 km",
    moments: "24 Moments",
    label: "Popular nearby",
    tone: "bg-[#EAF3EE]",
  },
  {
    name: "Kapehan sa Bakanté",
    type: "Coffee & Pastries",
    location: "Isabela City",
    distance: "1.1 km",
    moments: "18 Moments",
    label: "Hidden gem",
    tone: "bg-[#F3EFE7]",
  },
  {
    name: "Milktea Lab",
    type: "Milk Tea",
    location: "Isabela City",
    distance: "1.3 km",
    moments: "32 Moments",
    label: "Trending",
    tone: "bg-[#EAF3EE]",
  },
];

const vibes = [
  {
    icon: Laptop,
    title: "Study & Work",
    text: "A quiet table, steady wifi, and coffee that lasts.",
    href: "/explore?vibe=study",
  },
  {
    icon: Users,
    title: "Catch Up",
    text: "Room to talk for longer than one cup.",
    href: "/explore?vibe=hangout",
  },
  {
    icon: Heart,
    title: "Coffee Date",
    text: "Somewhere a little nicer than usual.",
    href: "/explore?vibe=date",
  },
  {
    icon: UtensilsCrossed,
    title: "Coffee & Food",
    text: "For when coffee alone won't cut it.",
    href: "/explore?vibe=food",
  },
];

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Discover", href: "/discover" },
  { label: "Moments", href: "#moments" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For Business", href: "#business" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="overflow-x-hidden bg-white text-[#122019]">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.045] bg-white/90 backdrop-blur-xl">
        <div className="page-container flex h-[68px] items-center justify-between sm:h-[76px]">
          <Link
            href="/"
            className="text-[1.4rem] font-black tracking-[-0.055em] text-[#00704A] sm:text-[1.7rem]"
          >
            CAFÉTA
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-black/60 transition hover:text-[#00704A]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="hidden h-11 items-center px-4 text-sm font-semibold sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/explore"
              className="group hidden h-11 items-center gap-2 rounded-full bg-[#00704A] px-5 text-sm font-semibold text-white transition hover:bg-[#00563A] sm:inline-flex"
            >
              Explore CAFÉTA
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-full border border-black/10 lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-black/[0.06] bg-white px-5 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-[15px] font-medium text-black/70 transition hover:bg-[#F3EFE7] hover:text-[#00704A]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 flex flex-col gap-2 border-t border-black/[0.06] pt-4">
              <Link
                href="/auth/login"
                className="flex h-11 items-center justify-center rounded-full border border-black/10 text-sm font-semibold"
              >
                Sign in
              </Link>

              <Link
                href="/explore"
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#00704A] text-sm font-semibold text-white"
              >
                Explore CAFÉTA
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 1 — HERO */}
      <section className="relative min-h-screen overflow-hidden pt-[68px] sm:pt-[76px]">
        <div className="pointer-events-none absolute -right-[30%] top-[5%] size-[360px] rounded-full bg-[#EAF3EE] sm:-right-[15%] sm:size-[650px]" />
        <div className="pointer-events-none absolute -left-32 bottom-[-200px] size-[300px] rounded-full bg-[#F3EFE7]/70 sm:-left-48 sm:bottom-[-300px] sm:size-[550px]" />

        <div className="page-container relative grid min-h-[calc(100vh-68px)] items-center gap-10 py-10 sm:min-h-[calc(100vh-76px)] sm:gap-14 sm:py-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative z-10 max-w-[640px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00704A]/10 bg-[#F2F8F5] px-4 py-2 text-[12px] font-semibold text-[#00704A] sm:mb-7 sm:text-[13px]">
              <MapPin className="size-4" />
              Basilan's cafés, mapped by the people who live here
            </div>

            <h1 className="text-[2.6rem] font-bold leading-[1.02] tracking-[-0.055em] sm:text-[3.5rem] sm:leading-[0.97] sm:tracking-[-0.065em] xl:text-[5.2rem]">
              Find a place
              <br />
              worth saying
              <br />
              <span className="text-[#00704A]">"Kape tayo."</span>
            </h1>

            <p className="mt-6 max-w-[550px] text-[16px] leading-7 text-black/55 sm:mt-7 sm:text-[18px] sm:leading-8">
              CAFÉTA is a local map of Basilan's cafés and milk-tea shops,
              built from real visits and real photos — not star ratings from
              nowhere.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <Link
                href="/explore?nearby=true"
                className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-[#00704A] px-6 text-[15px] font-semibold text-white shadow-[0_15px_35px_-15px_rgba(0,112,74,.65)] transition hover:-translate-y-0.5 hover:bg-[#00563A] sm:h-14 sm:px-7"
              >
                <LocateFixed className="size-[18px]" />
                Explore nearby
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/discover"
                className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-black/10 px-6 text-[15px] font-semibold transition hover:border-[#00704A]/25 hover:text-[#00704A] sm:h-14 sm:px-7"
              >
                <Compass className="size-[18px] text-[#00704A]" />
                Browse the list
              </Link>
            </div>

            <div className="mt-9 flex items-center gap-4 border-t border-black/[0.06] pt-6 sm:mt-10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex size-9 items-center justify-center rounded-full border-[3px] border-white bg-[#EAF3EE]"
                  >
                    <Users className="size-3.5 text-[#00704A]" />
                  </div>
                ))}
              </div>

              <p className="text-sm text-black/50">
                Every listing comes from{" "}
                <span className="font-semibold text-[#122019]">
                  someone who's actually been there.
                </span>
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="absolute -left-10 top-24 z-20 hidden rounded-2xl border border-black/[0.05] bg-white px-4 py-3 shadow-xl xl:block">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#EAF3EE]">
                  <Sparkles className="size-4 text-[#00704A]" />
                </div>

                <div>
                  <p className="text-[10px] text-black/40">Just added</p>
                  <p className="text-sm font-semibold">3 new spots this week</p>
                </div>
              </div>
            </div>

            <div className="relative ml-auto max-w-[510px] rounded-[28px] border border-black/[0.06] bg-white p-2 shadow-[0_40px_100px_-35px_rgba(15,35,25,.3)] sm:rounded-[38px] sm:p-[10px]">
              <div className="overflow-hidden rounded-[22px] bg-[#f7f8f5] sm:rounded-[30px]">
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] text-black/40">
                        Exploring near
                      </p>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        <MapPin className="size-4 text-[#00704A]" />
                        <p className="text-sm font-semibold">
                          Isabela City, Basilan
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Saved places"
                      className="flex size-10 items-center justify-center rounded-full border border-black/[0.06] bg-white"
                    >
                      <Bookmark className="size-[17px]" />
                    </button>
                  </div>

                  <div className="mt-5 flex h-12 items-center gap-3 rounded-full border border-black/[0.07] bg-white px-5 shadow-sm sm:h-13">
                    <Search className="size-[18px] text-black/35" />

                    <span className="truncate text-[13px] text-black/40">
                      Search coffee, milk tea, or a place...
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2 overflow-x-auto">
                    {["Coffee", "Milk Tea", "Open Now", "Nearby"].map(
                      (item, index) => (
                        <span
                          key={item}
                          className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold ${
                            index === 0
                              ? "bg-[#00704A] text-white"
                              : "border border-black/[0.06] bg-white"
                          }`}
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="relative h-[320px] overflow-hidden bg-[#e5ede8] sm:h-[390px]">
                  <div className="absolute left-[10%] top-[-20%] h-[150%] w-[7px] rotate-[24deg] bg-white/80" />
                  <div className="absolute left-[61%] top-[-20%] h-[150%] w-[7px] -rotate-[17deg] bg-white/80" />
                  <div className="absolute left-[-20%] top-[34%] h-[7px] w-[150%] -rotate-[7deg] bg-white/80" />
                  <div className="absolute left-[-20%] top-[72%] h-[7px] w-[150%] rotate-[6deg] bg-white/80" />

                  {[
                    "left-[21%] top-[23%]",
                    "right-[18%] top-[18%]",
                    "left-[48%] top-[46%]",
                    "left-[18%] bottom-[22%]",
                    "right-[13%] bottom-[18%]",
                  ].map((position, index) => (
                    <div
                      key={position}
                      className={`absolute ${position} flex items-center justify-center rounded-full border-[3px] border-white text-white shadow-lg ${
                        index === 2
                          ? "size-10 bg-[#27251F] sm:size-12"
                          : "size-9 bg-[#00704A] sm:size-10"
                      }`}
                    >
                      <Coffee className="size-4 sm:size-[17px]" />
                    </div>
                  ))}

                  <div className="absolute bottom-4 left-4 right-4 rounded-[18px] bg-white p-3 shadow-xl sm:rounded-[22px] sm:p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F3EFE7] sm:size-[60px] sm:rounded-[16px]">
                        <Coffee className="size-5 text-[#00704A] sm:size-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-bold">Brew & Co.</p>

                          <span className="shrink-0 rounded-full bg-[#EAF3EE] px-2 py-0.5 text-[9px] font-bold text-[#00704A]">
                            OPEN
                          </span>
                        </div>

                        <p className="mt-1 text-[11px] text-black/45">
                          Coffee · 650 m away
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#00704A]">
                          <Camera className="size-3.5" />
                          8 Moments today
                        </p>
                      </div>

                      <ChevronRight className="size-5 shrink-0 text-black/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 right-0 hidden rounded-2xl border border-black/[0.05] bg-white px-4 py-3 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#EAF3EE]">
                  <Camera className="size-4 text-[#00704A]" />
                </div>

                <div>
                  <p className="text-[10px] text-black/40">Fresh Moment</p>
                  <p className="text-sm font-semibold">Shared 8 min ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — QUICK DISCOVERY */}
      <section className="border-y border-black/[0.05] bg-white">
        <div className="page-container grid grid-cols-2 md:grid-cols-4">
          {quickDiscover.map(({ icon: Icon, title, text, href }, index) => (
            <Link
              key={title}
              href={href}
              className={`group flex min-h-[130px] items-center gap-3 p-4 transition hover:bg-[#f7faf8] sm:min-h-[145px] sm:gap-4 sm:p-5 lg:p-7 ${
                index % 2 === 0 ? "border-r border-black/[0.05]" : ""
              } ${index < 2 ? "border-b border-black/[0.05] md:border-b-0" : ""} ${
                index !== 3 ? "md:border-r" : "md:border-r-0"
              }`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#00704A] transition group-hover:bg-[#00704A] group-hover:text-white sm:size-12">
                <Icon className="size-4 sm:size-5" />
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-semibold sm:text-base">{title}</h3>
                  <ChevronRight className="size-3.5 transition group-hover:translate-x-1" />
                </div>

                <p className="mt-1 text-xs text-black/45 sm:text-sm">{text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 — MAP PRODUCT */}
      <section className="section-spacing bg-[#f7f8f5]">
        <div className="page-container">
          <div className="grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div className="max-w-[500px]">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#00704A]">
                The map
              </span>

              <h2 className="mt-5 text-balance text-3xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-4xl sm:leading-[1.05] sm:tracking-[-0.045em] lg:text-5xl">
                Everything nearby,
                <span className="text-[#00704A]"> at a glance.</span>
              </h2>

              <p className="mt-5 text-base leading-7 text-black/50 sm:mt-6 sm:text-lg sm:leading-8">
                No more guessing which café is actually open, or scrolling
                past ten places that are nowhere near you. Search by name,
                category, distance, or what's open right now.
              </p>

              <div className="mt-7 space-y-4 sm:mt-8">
                {[
                  "See every café and milk-tea shop near you",
                  "Filter down to exactly what you're craving",
                  "Read local Moments before you commit to going",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00704A] text-white">
                      <Check className="size-3.5" />
                    </div>

                    <p className="text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/explore"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-[#00704A] sm:mt-9"
              >
                Open the map
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-black/[0.05] bg-[#e5ede8] shadow-[0_30px_80px_-35px_rgba(0,0,0,.25)] sm:rounded-[36px]">
              <div className="absolute left-[15%] top-[-30%] h-[160%] w-3 rotate-[25deg] bg-white/80" />
              <div className="absolute left-[60%] top-[-20%] h-[150%] w-3 -rotate-[16deg] bg-white/80" />
              <div className="absolute left-[-10%] top-[45%] h-3 w-[120%] -rotate-[6deg] bg-white/80" />

              <div className="relative min-h-[420px] p-4 sm:min-h-[540px] sm:p-6">
                <div className="flex max-w-sm items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg sm:px-5 sm:py-4">
                  <Search className="size-5 text-black/35" />
                  <p className="text-sm text-black/45">
                    Coffee near Isabela City
                  </p>
                </div>

                {[
                  "left-[20%] top-[34%]",
                  "left-[53%] top-[26%]",
                  "right-[13%] top-[46%]",
                  "left-[35%] bottom-[22%]",
                ].map((position, index) => (
                  <div
                    key={position}
                    className={`absolute ${position} flex items-center justify-center rounded-full border-4 border-white shadow-lg ${
                      index === 1
                        ? "size-11 bg-[#27251F] sm:size-14"
                        : "size-9 bg-[#00704A] sm:size-11"
                    } text-white`}
                  >
                    <Coffee className="size-4 sm:size-5" />
                  </div>
                ))}

                <div className="absolute bottom-4 left-4 right-4 max-w-md rounded-[18px] bg-white p-3.5 shadow-2xl sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-[24px] sm:p-4">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[#F3EFE7] sm:size-16 sm:rounded-[18px]">
                      <Store className="size-5 text-[#00704A] sm:size-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">The Daily Habit</p>
                      <p className="mt-1 text-xs text-black/45">
                        Specialty Coffee · 0.8 km
                      </p>

                      <div className="mt-3 flex items-center gap-4 text-xs">
                        <span className="font-semibold text-[#00704A]">
                          Open now
                        </span>

                        <span className="flex items-center gap-1 text-black/45">
                          <Camera className="size-3.5" />
                          24 Moments
                        </span>
                      </div>
                    </div>

                    <Bookmark className="size-5 shrink-0 text-black/35" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — DISCOVER PLACES */}
      <section className="section-spacing bg-white">
        <div className="page-container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end md:gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#00704A]">
                Around Basilan right now
              </span>

              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Three places people keep going back to.
              </h2>
            </div>

            <Link
              href="/discover"
              className="group flex items-center gap-2 text-sm font-semibold text-[#00704A]"
            >
              See all places
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
            {places.map((place) => (
              <Link key={place.name} href="/explore" className="group">
                <div
                  className={`relative aspect-[1.1/1] overflow-hidden rounded-[22px] sm:rounded-[30px] ${place.tone}`}
                >
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold shadow-sm sm:left-5 sm:top-5">
                    {place.label}
                  </span>

                  <button
                    type="button"
                    aria-label={`Save ${place.name}`}
                    className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white shadow-sm sm:right-5 sm:top-5 sm:size-10"
                  >
                    <Heart className="size-4 sm:size-[18px]" />
                  </button>

                  <div className="flex h-full items-center justify-center">
                    <Coffee className="size-14 text-[#00704A]/15 sm:size-16" />
                  </div>
                </div>

                <div className="pt-4 sm:pt-5">
                  <div className="flex justify-between gap-4 sm:gap-5">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight group-hover:text-[#00704A] sm:text-xl">
                        {place.name}
                      </h3>

                      <p className="mt-1.5 text-sm text-black/45">
                        {place.type} · {place.location}
                      </p>
                    </div>

                    <ArrowRight className="size-5 shrink-0 -rotate-45 text-black/30 transition group-hover:rotate-0 group-hover:text-[#00704A]" />
                  </div>

                  <div className="mt-4 flex gap-5 text-xs text-black/45">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {place.distance}
                    </span>

                    <span className="flex items-center gap-1">
                      <Camera className="size-3.5" />
                      {place.moments}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — FIND YOUR VIBE */}
      <section className="section-spacing bg-[#27251F] text-white">
        <div className="page-container">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Find your vibe
              </span>

              <h2 className="mt-5 max-w-md text-3xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-4xl sm:leading-[1.05] sm:tracking-[-0.045em] lg:text-5xl">
                Don't search by name.
                <span className="text-[#8FCBAB]"> Search by mood.</span>
              </h2>

              <p className="mt-5 max-w-sm leading-7 text-white/55 sm:mt-6">
                Sometimes you don't know which café you want. You just know
                what the next hour needs to feel like.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[20px] bg-white/10 sm:grid-cols-2 sm:rounded-[28px]">
              {vibes.map(({ icon: Icon, title, text, href }) => (
                <Link
                  href={href}
                  key={title}
                  className="group bg-[#27251F] p-6 transition hover:bg-white/[0.05] sm:p-7 lg:p-8"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/10 sm:size-11">
                      <Icon className="size-5" />
                    </div>

                    <ArrowRight className="size-5 -rotate-45 text-white/30 transition group-hover:rotate-0 group-hover:text-white" />
                  </div>

                  <h3 className="mt-9 text-lg font-semibold sm:mt-12 sm:text-xl">
                    {title}
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/50">
                    {text}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 — MOMENTS */}
      <section id="moments" className="section-spacing bg-white">
        <div className="page-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="grid grid-cols-[0.75fr_1.25fr] gap-3 sm:gap-4">
              <div className="mt-16 space-y-3 sm:mt-24 sm:space-y-4">
                <div className="aspect-[3/4] rounded-[22px] bg-[#EAF3EE] p-4 sm:rounded-[30px] sm:p-5">
                  <Camera className="size-5 text-[#00704A]" />
                </div>

                <div className="rounded-[20px] bg-[#00704A] p-5 text-white sm:rounded-[28px] sm:p-6">
                  <Heart className="size-5" />

                  <p className="mt-10 text-lg font-semibold sm:mt-16 sm:text-xl">
                    Real places.
                    <br />
                    Real moments.
                  </p>
                </div>
              </div>

              <div className="flex min-h-[420px] flex-col justify-between rounded-[24px] bg-[#27251F] p-5 text-white shadow-2xl sm:min-h-[570px] sm:rounded-[34px] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">
                    CAFÉTA Moment
                  </span>

                  <Camera className="size-5 text-white/60" />
                </div>

                <div>
                  <p className="text-[1.3rem] font-medium leading-[1.35] tracking-[-0.02em] sm:text-[1.7rem] sm:tracking-[-0.025em]">
                    "Found this after class. Quiet upstairs, good coffee, and
                    definitely coming back."
                  </p>

                  <div className="mt-6 border-t border-white/10 pt-5 sm:mt-7">
                    <p className="text-sm font-semibold">@coffeeexplorer</p>
                    <p className="mt-1 text-xs text-white/45">
                      Brew & Co. · Isabela City
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[550px]">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#00704A]">
              CAFÉTA Moments
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-4xl sm:leading-[1.05] sm:tracking-[-0.045em] lg:text-5xl">
              A map tells you where.
              <span className="text-[#00704A]"> A Moment tells you why.</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-black/50 sm:mt-6 sm:text-lg sm:leading-8">
              Photos and short write-ups from people who were actually
              sitting there. You'll know the vibe, the noise level, and
              whether it's worth the walk before you leave the house.
            </p>

            <Link
              href="/discover?tab=moments"
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-[#00704A] sm:mt-9"
            >
              Explore Moments
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7 — HOW IT WORKS */}
      <section id="how-it-works" className="section-spacing bg-[#f6f8f5]">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#00704A]">
              Simple by design
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Find it. Go there. Share it.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-black/50 sm:text-lg">
              Three steps, start to finish — from your first search to the
              Moment you leave behind for the next person.
            </p>
          </div>

          <div className="relative mt-12 grid gap-5 sm:mt-14 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Compass,
                title: "Discover",
                text: "Search the map or browse places sorted by what you're actually craving.",
              },
              {
                number: "02",
                icon: Navigation,
                title: "Experience",
                text: "Pick somewhere that looks right, get walking directions, and go see for yourself.",
              },
              {
                number: "03",
                icon: Camera,
                title: "Share",
                text: "Drop a photo and a line about the place — the next person searching will thank you.",
              },
            ].map(({ number, icon: Icon, title, text }) => (
              <div
                key={number}
                className="rounded-[24px] border border-black/[0.05] bg-white p-6 sm:rounded-[28px] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#EAF3EE] text-[#00704A] sm:size-12">
                    <Icon className="size-5" />
                  </div>

                  <span className="font-mono text-sm text-black/20">
                    {number}
                  </span>
                </div>

                <h3 className="mt-8 text-lg font-semibold sm:mt-10 sm:text-xl">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-black/45">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — SAVED PLACES */}
      <section className="section-spacing bg-white">
        <div className="page-container grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-lg">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#00704A]">
              Your CAFÉTA
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-4xl sm:leading-[1.05] sm:tracking-[-0.045em] lg:text-5xl">
              Save now.
              <br />
              <span className="text-[#00704A]">Decide later.</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-black/50 sm:mt-6 sm:text-lg sm:leading-8">
              Saw something on the map you liked but weren't ready to visit?
              Bookmark it. Your list is always there when you're finally
              craving it.
            </p>

            <Link
              href="/auth/login"
              className="group mt-7 inline-flex items-center gap-2 font-semibold text-[#00704A] sm:mt-8"
            >
              Create your account
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="rounded-[28px] bg-[#f2f6f3] p-5 sm:rounded-[36px] sm:p-6 lg:p-9">
            <div className="rounded-[22px] bg-white p-4 shadow-[0_25px_60px_-30px_rgba(0,0,0,.25)] sm:rounded-[28px] sm:p-5">
              <div className="flex items-center justify-between border-b border-black/[0.05] pb-4 sm:pb-5">
                <div>
                  <p className="text-xs text-black/40">Your collection</p>
                  <h3 className="mt-1 text-lg font-bold sm:text-xl">
                    Places to try
                  </h3>
                </div>

                <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF3EE] sm:size-11">
                  <Bookmark className="size-5 text-[#00704A]" />
                </div>
              </div>

              <div className="divide-y divide-black/[0.05]">
                {places.map((place) => (
                  <div key={place.name} className="flex items-center gap-3 py-4 sm:gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F3EFE7] sm:size-14 sm:rounded-[16px]">
                      <Coffee className="size-5 text-[#00704A]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{place.name}</p>
                      <p className="mt-1 text-xs text-black/40">
                        {place.type} · {place.distance}
                      </p>
                    </div>

                    <Bookmark className="size-[18px] shrink-0 fill-[#00704A] text-[#00704A]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 — BASILAN */}
      <section className="section-spacing bg-[#00704A] text-white">
        <div className="page-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Built around Basilan
              </span>

              <h2 className="mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-4xl sm:leading-[1.05] sm:tracking-[-0.045em] lg:text-6xl">
                Great local places deserve to be found.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/60 sm:mt-6 sm:text-lg sm:leading-8">
                We're not trying to cover the whole country. CAFÉTA starts
                here, in Basilan, mapping the cafés and milk-tea shops that
                make our own neighborhoods worth exploring.
              </p>

              <Link
                href="/explore"
                className="group mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#00704A] sm:mt-9 sm:h-13"
              >
                Explore Basilan
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 sm:rounded-[30px] sm:p-7">
                <MapPin className="size-6 text-white/70" />

                <p className="mt-14 text-xl font-semibold sm:mt-24 sm:text-2xl">
                  Local
                  <br />
                  first.
                </p>
              </div>

              <div className="mt-8 rounded-[24px] bg-white p-5 text-[#122019] sm:mt-12 sm:rounded-[30px] sm:p-7">
                <Heart className="size-6 text-[#00704A]" />

                <p className="mt-14 text-xl font-semibold sm:mt-24 sm:text-2xl">
                  Community
                  <br />
                  powered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 — BUSINESS */}
      <section id="business" className="section-spacing bg-white">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-[28px] bg-[#27251F] px-6 py-10 text-white sm:rounded-[38px] sm:px-12 sm:py-14 lg:px-16 lg:py-16">
            <div className="absolute -right-20 -top-32 size-96 rounded-full border border-white/[0.06]" />
            <div className="absolute -right-4 -top-16 size-64 rounded-full border border-white/[0.06]" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
              <div className="max-w-2xl">
                <div className="flex size-11 items-center justify-center rounded-full bg-white/10 sm:size-12">
                  <Store className="size-5" />
                </div>

                <span className="mt-6 block text-xs font-bold uppercase tracking-[0.18em] text-white/40 sm:mt-7">
                  CAFÉTA for Business
                </span>

                <h2 className="mt-4 text-2xl font-bold tracking-[-0.035em] sm:text-3xl lg:text-4xl">
                  Put your place on the map.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
                  Run a café or milk-tea shop in Basilan? Claim your listing,
                  keep your hours and menu current, and let people searching
                  nearby actually find you.
                </p>
              </div>

              <Link
                href="/auth/login?next=/business"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-[#27251F] sm:h-14 sm:px-7"
              >
                <Building2 className="size-[18px]" />
                List your business
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11 — FINAL CTA + FOOTER */}
      <section className="bg-white">
        <div className="page-container py-16 text-center sm:py-24 lg:py-32">
          <div className="mx-auto flex size-13 items-center justify-center rounded-full bg-[#EAF3EE] sm:size-14">
            <Coffee className="size-6 text-[#00704A]" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#00704A] sm:mt-7">
            Kape tayo.
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl text-balance text-3xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-4xl sm:leading-[1.02] sm:tracking-[-0.05em] lg:text-6xl">
            Your next favorite place
            <span className="text-[#00704A]">
              {" "}
              might be closer than you think.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-black/50 sm:mt-6 sm:text-lg sm:leading-8">
            Open the map, see what's around you, and find somewhere worth the
            walk.
          </p>

          <Link
            href="/explore"
            className="group mt-8 inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-[#00704A] px-7 font-semibold text-white shadow-[0_15px_35px_-15px_rgba(0,112,74,.65)] transition hover:-translate-y-0.5 hover:bg-[#00563A] sm:mt-9 sm:h-14 sm:px-8"
          >
            <Compass className="size-[18px]" />
            Find my next spot
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <footer className="border-t border-black/[0.06]">
          <div className="page-container py-10 sm:py-12">
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr]">
              <div>
                <Link
                  href="/"
                  className="text-2xl font-black tracking-[-0.055em] text-[#00704A]"
                >
                  CAFÉTA
                </Link>

                <p className="mt-3 max-w-xs text-sm leading-6 text-black/45">
                  A local map of cafés, milk tea, and everyday moments around
                  Basilan.
                </p>

                <p className="mt-4 text-sm font-semibold">Kape tayo.</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/35">
                  Explore
                </p>

                <div className="mt-4 flex flex-col gap-3 text-sm sm:mt-5">
                  <Link href="/explore" className="hover:text-[#00704A]">
                    Map
                  </Link>

                  <Link href="/discover" className="hover:text-[#00704A]">
                    Discover
                  </Link>

                  <Link href="#moments" className="hover:text-[#00704A]">
                    Moments
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/35">
                  Account
                </p>

                <div className="mt-4 flex flex-col gap-3 text-sm sm:mt-5">
                  <Link href="/auth/login" className="hover:text-[#00704A]">
                    Sign in
                  </Link>

                  <Link
                    href="/auth/login?next=/business"
                    className="hover:text-[#00704A]"
                  >
                    Business
                  </Link>

                  <Link href="/saved" className="hover:text-[#00704A]">
                    Saved
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/35">
                  Legal
                </p>

                <div className="mt-4 flex flex-col gap-3 text-sm sm:mt-5">
                  <Link href="/privacy" className="hover:text-[#00704A]">
                    Privacy
                  </Link>

                  <Link href="/terms" className="hover:text-[#00704A]">
                    Terms
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-black/[0.06] pt-6 text-xs text-black/40 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} CAFÉTA. All rights reserved.</p>

              <p>
                Developed by{" "}
                <a
                  href="https://www.jaymmaruji.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#122019] transition hover:text-[#00704A]"
                >
                  Jaymar Maruji
                </a>
              </p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}