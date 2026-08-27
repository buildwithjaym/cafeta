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
  Navigation,
  Search,
  Sparkles,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const quickDiscover = [
  {
    icon: Coffee,
    title: "Coffee",
    text: "Find your next cup.",
    href: "/explore?category=coffee",
  },
  {
    icon: Sparkles,
    title: "Milk Tea",
    text: "Something cold & sweet.",
    href: "/explore?category=milk-tea",
  },
  {
    icon: Clock3,
    title: "Open Now",
    text: "Places ready right now.",
    href: "/explore?open=true",
  },
  {
    icon: LocateFixed,
    title: "Near Me",
    text: "Start with what's close.",
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
    tone: "bg-[#e8f0eb]",
  },
  {
    name: "Kapehan sa Bakanté",
    type: "Coffee & Pastries",
    location: "Isabela City",
    distance: "1.1 km",
    moments: "18 Moments",
    label: "Hidden gem",
    tone: "bg-[#f3eee7]",
  },
  {
    name: "Milktea Lab",
    type: "Milk Tea",
    location: "Isabela City",
    distance: "1.3 km",
    moments: "32 Moments",
    label: "Trending",
    tone: "bg-[#edf2e9]",
  },
];

const vibes = [
  {
    icon: Laptop,
    title: "Study & Work",
    text: "Quiet tables, coffee, and somewhere to focus.",
    href: "/explore?vibe=study",
  },
  {
    icon: Users,
    title: "Catch Up",
    text: "Easygoing places made for long conversations.",
    href: "/explore?vibe=hangout",
  },
  {
    icon: Heart,
    title: "Coffee Date",
    text: "Cozy places for something a little more special.",
    href: "/explore?vibe=date",
  },
  {
    icon: UtensilsCrossed,
    title: "Coffee & Food",
    text: "When coffee alone isn't going to be enough.",
    href: "/explore?vibe=food",
  },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-white text-[#122019]">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.045] bg-white/90 backdrop-blur-xl">
        <div className="page-container flex h-[76px] items-center justify-between">
          <Link
            href="/"
            className="text-[1.7rem] font-black tracking-[-0.055em] text-brand-green"
          >
            CAFÉTA
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="/explore"
              className="text-sm font-medium text-black/60 transition hover:text-brand-green"
            >
              Explore
            </Link>

            <Link
              href="/discover"
              className="text-sm font-medium text-black/60 transition hover:text-brand-green"
            >
              Discover
            </Link>

            <Link
              href="#moments"
              className="text-sm font-medium text-black/60 transition hover:text-brand-green"
            >
              Moments
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-medium text-black/60 transition hover:text-brand-green"
            >
              How it works
            </Link>

            <Link
              href="#business"
              className="text-sm font-medium text-black/60 transition hover:text-brand-green"
            >
              For Business
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden h-11 items-center px-5 text-sm font-semibold sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/explore"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-brand-green px-5 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
            >
              Explore CAFÉTA
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* 1 — HERO */}
      <section className="relative min-h-screen overflow-hidden pt-[76px]">
        <div className="pointer-events-none absolute -right-[15%] top-[5%] size-[650px] rounded-full bg-[#edf5f0]" />
        <div className="pointer-events-none absolute -left-48 bottom-[-300px] size-[550px] rounded-full bg-brand-cream/60" />

        <div className="page-container relative grid min-h-[calc(100vh-76px)] items-center gap-14 py-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative z-10 max-w-[640px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-green/10 bg-[#f2f8f5] px-4 py-2 text-[13px] font-semibold text-brand-green">
              <MapPin className="size-4" />
              Discovering Basilan, one cup at a time
            </div>

            <h1 className="text-[3.5rem] font-bold leading-[0.97] tracking-[-0.065em] sm:text-[4.5rem] xl:text-[5.2rem]">
              Find a place
              <br />
              worth saying
              <br />
              <span className="text-brand-green">“Kape tayo.”</span>
            </h1>

            <p className="mt-7 max-w-[550px] text-[18px] leading-8 text-black/55">
              Discover cafés and milk-tea shops around Basilan through real
              places, local experiences, and moments shared by the community.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/explore?nearby=true"
                className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-brand-green px-7 text-[15px] font-semibold text-white shadow-[0_15px_35px_-15px_rgba(0,98,65,.65)] transition hover:-translate-y-0.5 hover:bg-brand-green-dark"
              >
                <LocateFixed className="size-[18px]" />
                Explore nearby
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/discover"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-black/10 px-7 text-[15px] font-semibold transition hover:border-brand-green/25 hover:text-brand-green"
              >
                <Compass className="size-[18px] text-brand-green" />
                Discover places
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-black/[0.06] pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex size-9 items-center justify-center rounded-full border-[3px] border-white bg-[#e7f2ec]"
                  >
                    <Users className="size-3.5 text-brand-green" />
                  </div>
                ))}
              </div>

              <p className="text-sm text-black/50">
                Discover through the{" "}
                <span className="font-semibold text-[#122019]">
                  local community.
                </span>
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="absolute -left-10 top-24 z-20 hidden rounded-2xl border border-black/[0.05] bg-white px-4 py-3 shadow-xl xl:block">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#eaf4ef]">
                  <Sparkles className="size-4 text-brand-green" />
                </div>

                <div>
                  <p className="text-[10px] text-black/40">Trending nearby</p>
                  <p className="text-sm font-semibold">New places to try</p>
                </div>
              </div>
            </div>

            <div className="relative ml-auto max-w-[510px] rounded-[38px] border border-black/[0.06] bg-white p-[10px] shadow-[0_40px_100px_-35px_rgba(15,35,25,.3)]">
              <div className="overflow-hidden rounded-[30px] bg-[#f7f8f5]">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] text-black/40">
                        Exploring near
                      </p>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        <MapPin className="size-4 text-brand-green" />
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

                  <div className="mt-5 flex h-13 items-center gap-3 rounded-full border border-black/[0.07] bg-white px-5 shadow-sm">
                    <Search className="size-[18px] text-black/35" />

                    <span className="truncate text-[13px] text-black/40">
                      Search coffee, milk tea, or a place...
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2 overflow-hidden">
                    {["Coffee", "Milk Tea", "Open Now", "Nearby"].map(
                      (item, index) => (
                        <span
                          key={item}
                          className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold ${
                            index === 0
                              ? "bg-brand-green text-white"
                              : "border border-black/[0.06] bg-white"
                          }`}
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="relative h-[390px] overflow-hidden bg-[#e5ede8]">
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
                          ? "size-12 bg-brand-espresso"
                          : "size-10 bg-brand-green"
                      }`}
                    >
                      <Coffee className="size-[17px]" />
                    </div>
                  ))}

                  <div className="absolute bottom-4 left-4 right-4 rounded-[22px] bg-white p-3.5 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex size-[60px] shrink-0 items-center justify-center rounded-[16px] bg-brand-cream">
                        <Coffee className="size-6 text-brand-green" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">Brew & Co.</p>

                          <span className="rounded-full bg-[#e7f4ed] px-2 py-0.5 text-[9px] font-bold text-brand-green">
                            OPEN
                          </span>
                        </div>

                        <p className="mt-1 text-[11px] text-black/45">
                          Coffee · 650 m away
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-brand-green">
                          <Camera className="size-3.5" />
                          8 Moments today
                        </p>
                      </div>

                      <ChevronRight className="size-5 text-black/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 right-0 hidden rounded-2xl border border-black/[0.05] bg-white px-4 py-3 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#eaf4ef]">
                  <Camera className="size-4 text-brand-green" />
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
              className={`group flex min-h-[145px] items-center gap-4 p-5 transition hover:bg-[#f7faf8] sm:p-7 ${
                index !== 3 ? "md:border-r md:border-black/[0.05]" : ""
              }`}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#edf6f1] text-brand-green transition group-hover:bg-brand-green group-hover:text-white">
                <Icon className="size-5" />
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold">{title}</h3>
                  <ChevronRight className="size-3.5 transition group-hover:translate-x-1" />
                </div>

                <p className="mt-1 text-sm text-black/45">{text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 — MAP PRODUCT */}
      <section className="section-spacing bg-[#f7f8f5]">
        <div className="page-container">
          <div className="grid items-center gap-16 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="max-w-[500px]">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                Explore the map
              </span>

              <h2 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                See what's around you.
                <span className="text-brand-green"> Right now.</span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-black/50">
                CAFÉTA turns local discovery into a map you can actually use.
                Search by place, category, distance, or what's open.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Find cafés and milk-tea shops nearby",
                  "Filter by what you're looking for",
                  "See local Moments before you visit",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex size-6 items-center justify-center rounded-full bg-brand-green text-white">
                      <Check className="size-3.5" />
                    </div>

                    <p className="text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/explore"
                className="group mt-9 inline-flex items-center gap-2 font-semibold text-brand-green"
              >
                Open the map
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[36px] border border-black/[0.05] bg-[#e5ede8] shadow-[0_30px_80px_-35px_rgba(0,0,0,.25)]">
              <div className="absolute left-[15%] top-[-30%] h-[160%] w-3 rotate-[25deg] bg-white/80" />
              <div className="absolute left-[60%] top-[-20%] h-[150%] w-3 -rotate-[16deg] bg-white/80" />
              <div className="absolute left-[-10%] top-[45%] h-3 w-[120%] -rotate-[6deg] bg-white/80" />

              <div className="relative min-h-[540px] p-6">
                <div className="flex max-w-sm items-center gap-3 rounded-full bg-white px-5 py-4 shadow-lg">
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
                        ? "size-14 bg-brand-espresso"
                        : "size-11 bg-brand-green"
                    } text-white`}
                  >
                    <Coffee className="size-5" />
                  </div>
                ))}

                <div className="absolute bottom-6 left-6 right-6 max-w-md rounded-[24px] bg-white p-4 shadow-2xl">
                  <div className="flex gap-4">
                    <div className="flex size-16 items-center justify-center rounded-[18px] bg-brand-cream">
                      <Store className="size-6 text-brand-green" />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold">The Daily Habit</p>
                      <p className="mt-1 text-xs text-black/45">
                        Specialty Coffee · 0.8 km
                      </p>

                      <div className="mt-3 flex items-center gap-4 text-xs">
                        <span className="font-semibold text-brand-green">
                          Open now
                        </span>

                        <span className="flex items-center gap-1 text-black/45">
                          <Camera className="size-3.5" />
                          24 Moments
                        </span>
                      </div>
                    </div>

                    <Bookmark className="size-5 text-black/35" />
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
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                Discover around Basilan
              </span>

              <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                Places worth knowing about.
              </h2>
            </div>

            <Link
              href="/discover"
              className="group flex items-center gap-2 text-sm font-semibold text-brand-green"
            >
              See all places
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {places.map((place) => (
              <Link
                key={place.name}
                href="/explore"
                className="group"
              >
                <div
                  className={`relative aspect-[1.1/1] overflow-hidden rounded-[30px] ${place.tone}`}
                >
                  <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold shadow-sm">
                    {place.label}
                  </span>

                  <button
                    type="button"
                    aria-label={`Save ${place.name}`}
                    className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <Heart className="size-[18px]" />
                  </button>

                  <div className="flex h-full items-center justify-center">
                    <Coffee className="size-16 text-brand-green/15" />
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-between gap-5">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight group-hover:text-brand-green">
                        {place.name}
                      </h3>

                      <p className="mt-1.5 text-sm text-black/45">
                        {place.type} · {place.location}
                      </p>
                    </div>

                    <ArrowRight className="size-5 -rotate-45 text-black/30 transition group-hover:rotate-0 group-hover:text-brand-green" />
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
      <section className="section-spacing bg-brand-espresso text-white">
        <div className="page-container">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Find your vibe
              </span>

              <h2 className="mt-5 max-w-md text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                Don't search by name.
                <span className="text-[#b9dbc9]"> Search by mood.</span>
              </h2>

              <p className="mt-6 max-w-sm leading-7 text-white/55">
                Sometimes you don't know the café. You just know what kind of
                place you need.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[28px] bg-white/10 sm:grid-cols-2">
              {vibes.map(({ icon: Icon, title, text, href }) => (
                <Link
                  href={href}
                  key={title}
                  className="group bg-brand-espresso p-7 transition hover:bg-white/[0.05] sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-full bg-white/10">
                      <Icon className="size-5" />
                    </div>

                    <ArrowRight className="size-5 -rotate-45 text-white/30 transition group-hover:rotate-0 group-hover:text-white" />
                  </div>

                  <h3 className="mt-12 text-xl font-semibold">{title}</h3>

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
        <div className="page-container grid items-center gap-16 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="grid grid-cols-[0.75fr_1.25fr] gap-4">
              <div className="mt-24 space-y-4">
                <div className="aspect-[3/4] rounded-[30px] bg-[#edf3ef] p-5">
                  <Camera className="size-5 text-brand-green" />
                </div>

                <div className="rounded-[28px] bg-brand-green p-6 text-white">
                  <Heart className="size-5" />

                  <p className="mt-16 text-xl font-semibold">
                    Real places.
                    <br />
                    Real moments.
                  </p>
                </div>
              </div>

              <div className="flex min-h-[570px] flex-col justify-between rounded-[34px] bg-brand-espresso p-7 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">
                    CAFÉTA Moment
                  </span>

                  <Camera className="size-5 text-white/60" />
                </div>

                <div>
                  <p className="text-[1.7rem] font-medium leading-[1.35] tracking-[-0.025em]">
                    “Found this after class. Quiet upstairs, good coffee, and
                    definitely coming back.”
                  </p>

                  <div className="mt-7 border-t border-white/10 pt-5">
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
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
              CAFÉTA Moments
            </span>

            <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
              A map tells you where.
              <span className="text-brand-green">
                {" "}
                A Moment tells you why.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-black/50">
              See real photos and short experiences from people who were
              actually there. Know the atmosphere before deciding where to go.
            </p>

            <Link
              href="/discover?tab=moments"
              className="group mt-9 inline-flex items-center gap-2 font-semibold text-brand-green"
            >
              Explore Moments
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7 — HOW IT WORKS */}
      <section
        id="how-it-works"
        className="section-spacing bg-[#f6f8f5]"
      >
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
              Simple by design
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Find it. Go there. Share it.
            </h2>

            <p className="mx-auto mt-5 max-w-lg leading-7 text-black/50">
              CAFÉTA keeps local discovery simple from the first search to the
              Moment you share afterward.
            </p>
          </div>

          <div className="relative mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Compass,
                title: "Discover",
                text: "Search the map or browse places that match what you're looking for.",
              },
              {
                number: "02",
                icon: Navigation,
                title: "Experience",
                text: "Choose somewhere interesting, get directions, and experience it yourself.",
              },
              {
                number: "03",
                icon: Camera,
                title: "Share",
                text: "Post a Moment so the next person knows what the place actually feels like.",
              },
            ].map(({ number, icon: Icon, title, text }) => (
              <div
                key={number}
                className="rounded-[28px] border border-black/[0.05] bg-white p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#eaf4ef] text-brand-green">
                    <Icon className="size-5" />
                  </div>

                  <span className="font-mono text-sm text-black/20">
                    {number}
                  </span>
                </div>

                <h3 className="mt-10 text-xl font-semibold">{title}</h3>

                <p className="mt-3 text-sm leading-6 text-black/45">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — SAVED PLACES */}
      <section className="section-spacing bg-white">
        <div className="page-container grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-lg">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
              Your CAFÉTA
            </span>

            <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
              Save now.
              <br />
              <span className="text-brand-green">Decide later.</span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-black/50">
              Found somewhere interesting? Save it to your list and build your
              own collection of places to try around Basilan.
            </p>

            <Link
              href="/login"
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand-green"
            >
              Create your account
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="rounded-[36px] bg-[#f2f6f3] p-6 sm:p-9">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_25px_60px_-30px_rgba(0,0,0,.25)]">
              <div className="flex items-center justify-between border-b border-black/[0.05] pb-5">
                <div>
                  <p className="text-xs text-black/40">Your collection</p>
                  <h3 className="mt-1 text-xl font-bold">Places to try</h3>
                </div>

                <div className="flex size-11 items-center justify-center rounded-full bg-[#eaf4ef]">
                  <Bookmark className="size-5 text-brand-green" />
                </div>
              </div>

              <div className="divide-y divide-black/[0.05]">
                {places.map((place) => (
                  <div
                    key={place.name}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-[16px] bg-brand-cream">
                      <Coffee className="size-5 text-brand-green" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{place.name}</p>
                      <p className="mt-1 text-xs text-black/40">
                        {place.type} · {place.distance}
                      </p>
                    </div>

                    <Bookmark className="size-[18px] fill-brand-green text-brand-green" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 — BASILAN */}
      <section className="section-spacing bg-brand-green text-white">
        <div className="page-container">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Built around Basilan
              </span>

              <h2 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Great local places deserve to be found.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                CAFÉTA starts where we are — highlighting the cafés, milk-tea
                shops, people, and experiences that make Basilan's local scene
                worth exploring.
              </p>

              <Link
                href="/explore"
                className="group mt-9 inline-flex h-13 items-center gap-2 rounded-full bg-white px-6 font-semibold text-brand-green"
              >
                Explore Basilan
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-7">
                <MapPin className="size-6 text-white/70" />

                <p className="mt-24 text-2xl font-semibold">
                  Local
                  <br />
                  first.
                </p>
              </div>

              <div className="mt-12 rounded-[30px] bg-white p-7 text-[#122019]">
                <Heart className="size-6 text-brand-green" />

                <p className="mt-24 text-2xl font-semibold">
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
          <div className="relative overflow-hidden rounded-[38px] bg-brand-espresso px-7 py-14 text-white sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute -right-20 -top-32 size-96 rounded-full border border-white/[0.06]" />
            <div className="absolute -right-4 -top-16 size-64 rounded-full border border-white/[0.06]" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
                  <Store className="size-5" />
                </div>

                <span className="mt-7 block text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                  CAFÉTA for Business
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  Put your place on the map.
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-white/55">
                  Own a café or milk-tea shop? Claim your business, keep your
                  information updated, and make it easier for people around
                  Basilan to discover you.
                </p>
              </div>

              <Link
                href="/login?type=business"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-brand-espresso"
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
        <div className="page-container py-24 text-center sm:py-32">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#eaf4ef]">
            <Coffee className="size-6 text-brand-green" />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-brand-green">
            Kape tayo.
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl text-balance text-4xl font-bold leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Your next favorite place
            <span className="text-brand-green">
              {" "}
              might be closer than you think.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-black/50">
            Open CAFÉTA, explore what's around you, and find somewhere worth
            going.
          </p>

          <Link
            href="/explore"
            className="group mt-9 inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-brand-green px-8 font-semibold text-white shadow-[0_15px_35px_-15px_rgba(0,98,65,.65)] transition hover:-translate-y-0.5 hover:bg-brand-green-dark"
          >
            <Compass className="size-[18px]" />
            Find my next spot
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <footer className="border-t border-black/[0.06]">
          <div className="page-container py-12">
            <div className="grid gap-10 md:grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr]">
              <div>
                <Link
                  href="/"
                  className="text-2xl font-black tracking-[-0.055em] text-brand-green"
                >
                  CAFÉTA
                </Link>

                <p className="mt-3 max-w-xs text-sm leading-6 text-black/45">
                  Discover cafés, milk tea, and local experiences around
                  Basilan.
                </p>

                <p className="mt-4 text-sm font-semibold">Kape tayo.</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/35">
                  Explore
                </p>

                <div className="mt-5 flex flex-col gap-3 text-sm">
                  <Link href="/explore" className="hover:text-brand-green">
                    Map
                  </Link>

                  <Link href="/discover" className="hover:text-brand-green">
                    Discover
                  </Link>

                  <Link href="#moments" className="hover:text-brand-green">
                    Moments
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/35">
                  Account
                </p>

                <div className="mt-5 flex flex-col gap-3 text-sm">
                  <Link href="/login" className="hover:text-brand-green">
                    Sign in
                  </Link>

                  <Link
                    href="/login?type=business"
                    className="hover:text-brand-green"
                  >
                    Business
                  </Link>

                  <Link href="/saved" className="hover:text-brand-green">
                    Saved
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/35">
                  Legal
                </p>

                <div className="mt-5 flex flex-col gap-3 text-sm">
                  <Link href="/privacy" className="hover:text-brand-green">
                    Privacy
                  </Link>

                  <Link href="/terms" className="hover:text-brand-green">
                    Terms
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-3 border-t border-black/[0.06] pt-6 text-xs text-black/40 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} CAFÉTA. All rights reserved.</p>

              <p>
                Developed by{" "}
                <a
                  href="https://www.jaymmaruji.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#122019] transition hover:text-brand-green"
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