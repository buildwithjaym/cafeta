"use client";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock3,
  Coffee,
  ExternalLink,
  Globe2,
  Info,
  Mail,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Navigation,
  Pencil,
  Phone,
  Share2,
  Star,
  Store,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  BusinessMemories,
} from "@/components/business/memories/business-memories";

import {
  SaveBusinessButton,
} from "@/components/explore/save-business-button";

import type {
  BusinessMemoryPreview,
} from "@/lib/memories/types";

type Business = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;

  logo_url: string | null;
  cover_url: string | null;

  phone: string | null;
  email: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  website_url: string | null;

  address: string;
  barangay: string | null;
  city: string;
  province: string;

  latitude: number;
  longitude: number;

  is_verified: boolean;
};

type BusinessHour = {
  id: string;
  business_id: string;
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
};

type MenuCategory = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
};

type MenuItem = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
};

type ReviewProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type Review = {
  id: string;
  user_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  profile: ReviewProfile | null;
};

type Props = {
  business: Business;
  hours: BusinessHour[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  reviews: Review[];
  memories: BusinessMemoryPreview[];
  averageRating: number;
  reviewCount: number;
  initialSaved: boolean;
  canEdit: boolean;
};

type Tab =
  | "home"
  | "memories"
  | "about"
  | "menu"
  | "reviews";

const [sharing, setSharing] = useState(false);


export function BusinessProfileClient({
  business,
  hours,
  categories,
  menuItems,
  reviews,
  memories,
  averageRating,
  reviewCount,
  initialSaved,
  canEdit,
}: Props) {
  const [
    activeTab,
    setActiveTab,
  ] = useState<Tab>(
    "home",
  );

  const today =
    new Date().getDay();

  const todayHours =
    hours.find(
      (hour) =>
        hour.day_of_week ===
        today,
    );

  const openState =
    getOpenState(
      todayHours,
    );

  const location = [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");

  const mapUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${business.latitude},${business.longitude}`,
    )}`;

  const menuGroups =
    useMemo(
      () =>
        buildMenuGroups(
          categories,
          menuItems,
        ),
      [
        categories,
        menuItems,
      ],
    );

  const week =
    useMemo(
      () =>
        buildWeek(
          hours,
        ),
      [hours],
    );

  async function shareBusiness() {
  if (sharing) {
    return;
  }

  setSharing(true);

  const url =
    `https://www.cafeta.online/business/${encodeURIComponent(
      business.slug,
    )}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: business.name,
        text:
          `Check out ${business.name} on CAFÉTA ☕ View their menu, location, hours, and reviews.`,
        url,
      });

      return;
    }

    await navigator.clipboard.writeText(url);

    toast.success(
      "Business link copied.",
    );

  } catch(error) {

    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return;
    }

    toast.error(
      "Unable to share this business.",
    );

  } finally {

    setSharing(false);

  }
}
  return (
    <main
      className="
        min-h-screen
        bg-[#f0f2f0]
        pb-24
      "
    >
      <section
        className="
          border-b
          border-black/[0.06]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            max-w-[1180px]
          "
        >
          <div
            className="
              relative
              h-[250px]
              overflow-hidden
              bg-[#dfe8e3]

              animate-in
              fade-in
              duration-500

              sm:h-[330px]

              lg:h-[390px]
              lg:rounded-b-[18px]
            "
          >
            {business.cover_url ? (
              <img
                src={
                  business.cover_url
                }
                alt={`${business.name} cover`}
                className="
                  size-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  hover:scale-[1.01]
                "
              />
            ) : business.logo_url ? (
              <>
                <img
                  src={
                    business.logo_url
                  }
                  alt=""
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    size-full
                    scale-110
                    object-cover
                    opacity-25
                    blur-3xl
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-[#e4eee8]/60
                  "
                />
              </>
            ) : (
              <div
                className="
                  flex
                  size-full
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-[#dbe9e1]
                  to-[#eef4f0]
                "
              >
                <Coffee
                  className="
                    size-16
                    text-[#006241]/15
                  "
                />
              </div>
            )}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-b
                from-black/15
                via-transparent
                to-black/25
              "
            />

            <Link
              href="/explore"
              aria-label="Back to Explore"
              className="
                absolute
                left-4
                top-4
                z-10

                flex
                size-10
                items-center
                justify-center

                rounded-full
                border
                border-white/40
                bg-white/90
                text-[#17211c]
                shadow-md
                backdrop-blur-xl

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:scale-105
                hover:bg-white

                active:scale-95
              "
            >
              <ArrowLeft className="size-4" />
            </Link>

            {canEdit && (
              <Link
                href={`/business/${business.slug}/edit`}
                className="
                  group
                  absolute
                  right-4
                  top-4
                  z-10

                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2

                  rounded-full
                  border
                  border-white/40
                  bg-white/90
                  px-4

                  text-[11px]
                  font-bold
                  text-[#17211c]

                  shadow-md
                  backdrop-blur-xl

                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-white
                  hover:shadow-lg

                  active:translate-y-0
                  active:scale-[0.98]
                "
              >
                <Pencil
                  className="
                    size-3.5
                    text-[#006241]
                    transition-transform
                    duration-200
                    group-hover:-rotate-6
                  "
                />

                Edit profile
              </Link>
            )}
          </div>

          <div
            className="
              px-4
              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                relative
                flex
                flex-col
                border-b
                border-black/[0.07]
                pb-5

                sm:flex-row
                sm:items-end
                sm:gap-5
              "
            >
              <div
                className="
                  relative
                  z-10
                  -mt-[72px]

                  size-[142px]
                  shrink-0
                  overflow-hidden

                  rounded-full
                  border-[5px]
                  border-white
                  bg-[#e8f2ed]

                  shadow-[0_4px_14px_rgba(0,0,0,0.12)]

                  animate-in
                  fade-in
                  zoom-in-95
                  duration-500

                  sm:size-[168px]
                "
              >
                {business.logo_url ? (
                  <img
                    src={
                      business.logo_url
                    }
                    alt={`${business.name} logo`}
                    className="
                      size-full
                      object-cover
                      transition-transform
                      duration-500
                      hover:scale-105
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      size-full
                      items-center
                      justify-center
                      text-[#006241]
                    "
                  >
                    <Store className="size-12" />
                  </div>
                )}
              </div>

              <div
                className="
                  mt-3
                  min-w-0
                  flex-1

                  animate-in
                  fade-in
                  slide-in-from-bottom-1
                  duration-500

                  sm:mb-2
                  sm:mt-0
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <h1
                    className="
                      truncate
                      text-[28px]
                      font-black
                      leading-tight
                      tracking-[-0.045em]
                      text-[#17211c]
                      sm:text-[34px]
                    "
                  >
                    {business.name}
                  </h1>

                  {business.is_verified && (
                    <BadgeCheck
                      aria-label="Verified business"
                      className="
                        size-[22px]
                        shrink-0
                        fill-[#1683f3]
                        text-white
                      "
                    />
                  )}
                </div>

                <div
                  className="
                    mt-1
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    text-[12px]
                    text-black/45
                  "
                >
                  <span
                    className="
                      font-semibold
                      text-[#006241]
                    "
                  >
                    {formatCategory(
                      business.category,
                    )}
                  </span>

                  {reviewCount >
                    0 && (
                    <>
                      <span>
                        ·
                      </span>

                      <span
                        className="
                          flex
                          items-center
                          gap-1
                          font-semibold
                          text-[#39433e]
                        "
                      >
                        <Star
                          className="
                            size-3.5
                            fill-[#f5a623]
                            text-[#f5a623]
                          "
                        />

                        {averageRating.toFixed(
                          1,
                        )}
                      </span>

                      <span>
                        ·
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveTab(
                            "reviews",
                          )
                        }
                        className="
                          font-medium
                          transition-colors
                          hover:text-[#006241]
                        "
                      >
                        {reviewCount}{" "}
                        {reviewCount ===
                        1
                          ? "review"
                          : "reviews"}
                      </button>
                    </>
                  )}

                  {location && (
                    <>
                      <span>
                        ·
                      </span>

                      <span>
                        {location}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2

                  animate-in
                  fade-in
                  slide-in-from-right-2
                  duration-500

                  sm:mb-2
                  sm:mt-0
                  sm:justify-end
                "
              >
                {canEdit && (
                  <Link
                    href={`/business/${business.slug}/edit`}
                    className="
                      inline-flex
                      h-10
                      flex-1
                      items-center
                      justify-center
                      gap-2

                      rounded-[10px]
                      border
                      border-[#006241]/10
                      bg-[#e8f2ed]
                      px-4

                      text-[11px]
                      font-bold
                      text-[#006241]

                      shadow-sm
                      transition-all
                      duration-200

                      hover:-translate-y-0.5
                      hover:bg-[#dcece4]

                      sm:flex-none
                    "
                  >
                    <Pencil className="size-3.5" />
                    Edit profile
                  </Link>
                )}

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    h-10
                    flex-1
                    items-center
                    justify-center
                    gap-2

                    rounded-[10px]
                    bg-[#006241]
                    px-4

                    text-[11px]
                    font-bold
                    text-white

                    shadow-sm
                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:bg-[#00754a]

                    sm:flex-none
                  "
                >
                  <Navigation className="size-4" />
                  Directions
                </a>

                <div
                  className="
                    [&>button]:size-10
                    [&>button]:rounded-[10px]
                  "
                >
                  <SaveBusinessButton
                    businessId={
                      business.id
                    }
                    initialSaved={
                      initialSaved
                    }
                  />
                </div>

                <button
  disabled={sharing}
  onClick={() => void shareBusiness()}
  className="
    flex
    size-10
    items-center
    justify-center

    rounded-[10px]
    bg-[#e8ebe9]
    text-[#39433e]

    transition-all
    hover:bg-[#dfe5e1]
    hover:text-[#006241]

    active:scale-95
  "
  aria-label="Share business"
>
  <Share2 className="size-4" />
</button>
              </div>
            </div>

            <nav
              className="
                flex
                overflow-x-auto
                scrollbar-none
              "
            >
              <PageTab
                active={
                  activeTab ===
                  "home"
                }
                onClick={() =>
                  setActiveTab(
                    "home",
                  )
                }
              >
                Home
              </PageTab>

              <PageTab
                active={
                  activeTab ===
                  "memories"
                }
                onClick={() =>
                  setActiveTab(
                    "memories",
                  )
                }
              >
                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  Memories

                  {memories.length >
                    0 && (
                    <span
                      className={`
                        rounded-full
                        px-1.5
                        py-0.5
                        text-[8px]
                        font-black

                        ${
                          activeTab ===
                          "memories"
                            ? "bg-[#006241]/10 text-[#006241]"
                            : "bg-black/[0.05] text-black/35"
                        }
                      `}
                    >
                      {memories.length}
                    </span>
                  )}
                </span>
              </PageTab>

              <PageTab
                active={
                  activeTab ===
                  "about"
                }
                onClick={() =>
                  setActiveTab(
                    "about",
                  )
                }
              >
                About
              </PageTab>

              <PageTab
                active={
                  activeTab ===
                  "menu"
                }
                onClick={() =>
                  setActiveTab(
                    "menu",
                  )
                }
              >
                Menu
              </PageTab>

              <PageTab
                active={
                  activeTab ===
                  "reviews"
                }
                onClick={() =>
                  setActiveTab(
                    "reviews",
                  )
                }
              >
                Reviews
              </PageTab>
            </nav>
          </div>
        </div>
      </section>

      <div
        className="
          mx-auto
          max-w-[1180px]
          px-3
          py-4
          sm:px-6
          lg:px-8
        "
      >
        {activeTab ===
          "home" && (
          <HomeTab
            business={
              business
            }
            week={week}
            openState={
              openState
            }
            mapUrl={mapUrl}
            location={
              location
            }
            menuItems={
              menuItems
            }
            reviews={
              reviews
            }
            memories={
              memories
            }
            averageRating={
              averageRating
            }
            reviewCount={
              reviewCount
            }
            canEdit={
              canEdit
            }
            onOpenReviews={() =>
              setActiveTab(
                "reviews",
              )
            }
          />
        )}

        {activeTab ===
          "memories" && (
          <div
            className="
              mx-auto
              max-w-[900px]

              animate-in
              fade-in
              slide-in-from-bottom-2
              duration-300
            "
          >
            <BusinessMemories
              businessSlug={
                business.slug
              }
              businessName={
                business.name
              }
              memories={
                memories
              }
            />
          </div>
        )}

        {activeTab ===
          "about" && (
          <AboutTab
            business={
              business
            }
            week={week}
            openState={
              openState
            }
            mapUrl={mapUrl}
            location={
              location
            }
            canEdit={
              canEdit
            }
          />
        )}

        {activeTab ===
          "menu" && (
          <MenuTab
            business={
              business
            }
            menuGroups={
              menuGroups
            }
            canEdit={
              canEdit
            }
          />
        )}

        {activeTab ===
          "reviews" && (
          <ReviewsTab
            reviews={
              reviews
            }
            averageRating={
              averageRating
            }
            reviewCount={
              reviewCount
            }
          />
        )}
      </div>
    </main>
  );
}

function HomeTab({
  business,
  week,
  openState,
  mapUrl,
  location,
  menuItems,
  reviews,
  memories,
  averageRating,
  reviewCount,
  canEdit,
  onOpenReviews,
}: {
  business: Business;

  week: ReturnType<
    typeof buildWeek
  >;

  openState: ReturnType<
    typeof getOpenState
  >;

  mapUrl: string;
  location: string;
  menuItems: MenuItem[];
  reviews: Review[];
  memories: BusinessMemoryPreview[];
  averageRating: number;
  reviewCount: number;
  canEdit: boolean;
  onOpenReviews: () => void;
}) {
  return (
    <div
      className="
        grid
        items-start
        gap-4
        lg:grid-cols-[390px_minmax(0,1fr)]
      "
    >
      <aside
        className="
          space-y-4
          lg:sticky
          lg:top-4
        "
      >
        <PageCard>
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <CardTitle>
              Intro
            </CardTitle>

            {canEdit && (
              <Link
                href={`/business/${business.slug}/edit`}
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-full
                  text-black/35
                  transition
                  hover:bg-[#e8f2ed]
                  hover:text-[#006241]
                "
              >
                <Pencil className="size-3.5" />
              </Link>
            )}
          </div>

          {business.description ? (
            <p
              className="
                mt-3
                text-center
                text-[13px]
                leading-5
                text-[#39433e]
              "
            >
              {
                business.description
              }
            </p>
          ) : (
            <p
              className="
                mt-3
                text-center
                text-xs
                text-black/35
              "
            >
              No description
              added yet.
            </p>
          )}

          <div
            className="
              mt-5
              space-y-4
            "
          >
            <InfoRow
              icon={
                <Store className="size-[18px]" />
              }
            >
              {formatCategory(
                business.category,
              )}
            </InfoRow>

            <InfoRow
              icon={
                <MapPin className="size-[18px]" />
              }
            >
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  hover:text-[#006241]
                  hover:underline
                "
              >
                {business.address}

                {location
                  ? `, ${location}`
                  : ""}
              </a>
            </InfoRow>

            <InfoRow
              icon={
                <Clock3 className="size-[18px]" />
              }
            >
              <span
                className={
                  openState.open
                    ? "font-semibold text-[#006241]"
                    : "font-semibold text-red-600"
                }
              >
                {
                  openState.label
                }
              </span>
            </InfoRow>

            {business.phone && (
              <InfoRow
                icon={
                  <Phone className="size-[18px]" />
                }
              >
                <a
                  href={`tel:${business.phone}`}
                  className="hover:underline"
                >
                  {
                    business.phone
                  }
                </a>
              </InfoRow>
            )}

            {business.website_url && (
              <InfoRow
                icon={
                  <Globe2 className="size-[18px]" />
                }
              >
                <a
                  href={
                    business.website_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="
                    font-medium
                    text-[#006241]
                    hover:underline
                  "
                >
                  Website
                </a>
              </InfoRow>
            )}
          </div>
        </PageCard>

        <PageCard>
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <CardTitle>
              Hours
            </CardTitle>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[9px]
                  font-bold

                  ${
                    openState.open
                      ? "bg-[#e8f2ed] text-[#006241]"
                      : "bg-red-50 text-red-600"
                  }
                `}
              >
                {openState.open
                  ? "Open now"
                  : "Closed"}
              </span>

              {canEdit && (
                <Link
                  href={`/business/${business.slug}/edit?section=hours`}
                  className="
                    flex
                    size-7
                    items-center
                    justify-center
                    rounded-full
                    text-black/30
                    transition
                    hover:bg-[#e8f2ed]
                    hover:text-[#006241]
                  "
                >
                  <Pencil className="size-3" />
                </Link>
              )}
            </div>
          </div>

          <div
            className="
              mt-3
              space-y-1
            "
          >
            {week.map(
              (day) => (
                <HoursRow
                  key={
                    day.day
                  }
                  day={day}
                />
              ),
            )}
          </div>
        </PageCard>

        <PageCard>
          <CardTitle>
            Connect
          </CardTitle>

          <div
            className="
              mt-3
              grid
              gap-2
            "
          >
            {business.facebook_url && (
              <SocialLink
                href={
                  business.facebook_url
                }
                icon={
                  <FacebookIcon className="size-[18px]" />
                }
                label="Facebook"
              />
            )}

            {business.instagram_url && (
              <SocialLink
                href={
                  business.instagram_url
                }
                icon={
                  <InstagramIcon className="size-[18px]" />
                }
                label="Instagram"
              />
            )}

            {business.email && (
              <SocialLink
                href={`mailto:${business.email}`}
                icon={
                  <Mail className="size-[18px]" />
                }
                label={
                  business.email
                }
                external={
                  false
                }
              />
            )}

            {!business.facebook_url &&
              !business.instagram_url &&
              !business.email && (
                <p
                  className="
                    py-3
                    text-xs
                    text-black/35
                  "
                >
                  No social links
                  added.
                </p>
              )}
          </div>
        </PageCard>
      </aside>

      <section className="space-y-4">
        <PageCard>
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <BusinessAvatar
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
              <p
                className="
                  truncate
                  text-[13px]
                  font-bold
                  text-[#17211c]
                "
              >
                {business.name}
              </p>

              <p
                className="
                  text-[10px]
                  text-black/35
                "
              >
                Business profile
                on CAFÉTA
              </p>
            </div>
          </div>

          <div
            className="
              mt-4
              rounded-[18px]
              bg-[#f5f7f5]
              px-4
              py-4
            "
          >
            <p
              className="
                text-sm
                font-bold
                text-[#17211c]
              "
            >
              Welcome to{" "}
              {business.name}
            </p>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-black/45
              "
            >
              {business.description ??
                `Discover ${business.name}, view the menu, opening hours, location, and reviews on CAFÉTA.`}
            </p>
          </div>
        </PageCard>

        <BusinessMemories
          businessSlug={
            business.slug
          }
          businessName={
            business.name
          }
          memories={
            memories.slice(
              0,
              3,
            )
          }
        />

        <PageCard>
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <CardTitle>
                Featured menu
              </CardTitle>

              <p
                className="
                  mt-1
                  text-[11px]
                  text-black/35
                "
              >
                A taste of what&apos;s
                being served.
              </p>
            </div>

            {menuItems.length >
              0 && (
              <Link
                href={`/business/${encodeURIComponent(
                  business.slug,
                )}/menu`}
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-1

                  text-[10px]
                  font-black
                  text-[#006241]

                  transition
                  hover:text-[#00754a]
                "
              >
                View menu

                <ArrowRight className="size-3" />
              </Link>
            )}
          </div>

          {menuItems.length >
          0 ? (
            <>
              <div
                className="
                  mt-4
                  grid
                  grid-cols-2
                  gap-2
                  sm:grid-cols-3
                "
              >
                {menuItems
                  .slice(
                    0,
                    6,
                  )
                  .map(
                    (item) => (
                      <FeaturedMenuItem
                        key={
                          item.id
                        }
                        item={
                          item
                        }
                      />
                    ),
                  )}
              </div>

              <Link
                href={`/business/${encodeURIComponent(
                  business.slug,
                )}/menu`}
                className="
                  group

                  mt-4
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-[12px]
                  border
                  border-[#006241]/10
                  bg-[#f2f8f5]

                  text-[10px]
                  font-black
                  text-[#006241]

                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:border-[#006241]/20
                  hover:bg-[#e8f2ed]

                  active:scale-[0.99]
                "
              >
                <UtensilsCrossed className="size-3.5" />

                View full menu

                <ArrowRight
                  className="
                    size-3.5
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </Link>

              {canEdit && (
                <Link
                  href={`/business/${business.slug}/edit?section=menu`}
                  className="
                    mt-2
                    flex
                    h-9
                    items-center
                    justify-center
                    gap-1.5

                    rounded-[10px]

                    text-[9px]
                    font-bold
                    text-black/35

                    transition
                    hover:bg-black/[0.025]
                    hover:text-[#006241]
                  "
                >
                  <Pencil className="size-3" />

                  Manage menu
                </Link>
              )}
            </>
          ) : (
            <div
              className="
                mt-4
                rounded-[16px]
                bg-[#f5f7f5]
                px-5
                py-9
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
                  rounded-full
                  bg-[#e8f2ed]
                  text-[#006241]
                "
              >
                <Coffee className="size-5" />
              </div>

              <p
                className="
                  mt-3
                  text-[13px]
                  font-bold
                  text-[#17211c]
                "
              >
                Menu coming soon
              </p>

              <p
                className="
                  mx-auto
                  mt-1
                  max-w-[300px]
                  text-[10px]
                  leading-4
                  text-black/35
                "
              >
                {canEdit
                  ? "Create categories and add the food and drinks your business serves."
                  : `${business.name} hasn't published menu items yet.`}
              </p>

              {canEdit && (
                <Link
                  href={`/business/${business.slug}/edit?section=menu`}
                  className="
                    mt-4
                    inline-flex
                    h-9
                    items-center
                    gap-2

                    rounded-full
                    bg-[#006241]
                    px-4

                    text-[10px]
                    font-bold
                    text-white

                    transition
                    hover:bg-[#00754a]
                  "
                >
                  <Pencil className="size-3.5" />

                  Build menu
                </Link>
              )}
            </div>
          )}
        </PageCard>

        <PageCard>
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <CardTitle>
                Reviews
              </CardTitle>

              {reviewCount >
                0 && (
                <div
                  className="
                    mt-1
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <Star
                    className="
                      size-4
                      fill-[#f5a623]
                      text-[#f5a623]
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-black
                      text-[#17211c]
                    "
                  >
                    {averageRating.toFixed(
                      1,
                    )}
                  </span>

                  <span
                    className="
                      text-[11px]
                      text-black/35
                    "
                  >
                    · {reviewCount}{" "}
                    {reviewCount ===
                    1
                      ? "review"
                      : "reviews"}
                  </span>
                </div>
              )}
            </div>

            {reviewCount >
              0 && (
              <button
                type="button"
                onClick={
                  onOpenReviews
                }
                className="
                  text-[11px]
                  font-bold
                  text-[#006241]
                  hover:underline
                "
              >
                See all
              </button>
            )}
          </div>

          {reviews.length >
          0 ? (
            <div
              className="
                mt-4
                divide-y
                divide-black/[0.06]
              "
            >
              {reviews
                .slice(
                  0,
                  3,
                )
                .map(
                  (review) => (
                    <ReviewCard
                      key={
                        review.id
                      }
                      review={
                        review
                      }
                    />
                  ),
                )}
            </div>
          ) : (
            <EmptyReviews />
          )}
        </PageCard>
      </section>
    </div>
  );
}

function AboutTab({
  business,
  week,
  openState,
  mapUrl,
  location,
  canEdit,
}: {
  business: Business;

  week: ReturnType<
    typeof buildWeek
  >;

  openState: ReturnType<
    typeof getOpenState
  >;

  mapUrl: string;
  location: string;
  canEdit: boolean;
}) {
  return (
    <div
      className="
        mx-auto
        grid
        max-w-[900px]
        gap-4
        md:grid-cols-2
      "
    >
      <PageCard>
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
              size-10
              items-center
              justify-center
              rounded-full
              bg-[#e8f2ed]
              text-[#006241]
            "
          >
            <Info className="size-[18px]" />
          </div>

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <CardTitle>
              About
            </CardTitle>

            <p
              className="
                text-[10px]
                text-black/35
              "
            >
              Business details
            </p>
          </div>

          {canEdit && (
            <Link
              href={`/business/${business.slug}/edit`}
              className="
                inline-flex
                h-8
                items-center
                gap-1.5
                rounded-full
                bg-[#e8f2ed]
                px-3
                text-[10px]
                font-bold
                text-[#006241]
              "
            >
              <Pencil className="size-3" />
              Edit
            </Link>
          )}
        </div>

        <p
          className="
            mt-5
            text-[13px]
            leading-6
            text-[#39433e]
          "
        >
          {business.description ??
            `${business.name} hasn't added a business description yet.`}
        </p>

        <div
          className="
            mt-6
            space-y-4
            border-t
            border-black/[0.06]
            pt-5
          "
        >
          <InfoRow
            icon={
              <Store className="size-[18px]" />
            }
          >
            {formatCategory(
              business.category,
            )}
          </InfoRow>

          <InfoRow
            icon={
              <MapPin className="size-[18px]" />
            }
          >
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {business.address}

              {location
                ? `, ${location}`
                : ""}
            </a>
          </InfoRow>

          {business.phone && (
            <InfoRow
              icon={
                <Phone className="size-[18px]" />
              }
            >
              <a
                href={`tel:${business.phone}`}
                className="hover:underline"
              >
                {
                  business.phone
                }
              </a>
            </InfoRow>
          )}

          {business.email && (
            <InfoRow
              icon={
                <Mail className="size-[18px]" />
              }
            >
              <a
                href={`mailto:${business.email}`}
                className="hover:underline"
              >
                {
                  business.email
                }
              </a>
            </InfoRow>
          )}

          {business.website_url && (
            <InfoRow
              icon={
                <Globe2 className="size-[18px]" />
              }
            >
              <a
                href={
                  business.website_url
                }
                target="_blank"
                rel="noreferrer"
                className="
                  text-[#006241]
                  hover:underline
                "
              >
                Visit website
              </a>
            </InfoRow>
          )}
        </div>
      </PageCard>

      <div className="space-y-4">
        <PageCard>
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div>
              <CardTitle>
                Opening hours
              </CardTitle>

              <p
                className={
                  openState.open
                    ? "mt-1 text-[10px] font-bold text-[#006241]"
                    : "mt-1 text-[10px] font-bold text-red-600"
                }
              >
                {
                  openState.label
                }
              </p>
            </div>

            {canEdit && (
              <Link
                href={`/business/${business.slug}/edit?section=hours`}
                className="
                  inline-flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-full
                  bg-[#e8f2ed]
                  px-3
                  text-[10px]
                  font-bold
                  text-[#006241]
                "
              >
                <Pencil className="size-3" />

                Edit hours
              </Link>
            )}
          </div>

          <div
            className="
              mt-4
              space-y-1
            "
          >
            {week.map(
              (day) => (
                <HoursRow
                  key={
                    day.day
                  }
                  day={day}
                />
              ),
            )}
          </div>
        </PageCard>

        <PageCard>
          <CardTitle>
            Social links
          </CardTitle>

          <div
            className="
              mt-4
              space-y-2
            "
          >
            {business.facebook_url && (
              <SocialLink
                href={
                  business.facebook_url
                }
                icon={
                  <FacebookIcon className="size-[18px]" />
                }
                label="Facebook"
              />
            )}

            {business.instagram_url && (
              <SocialLink
                href={
                  business.instagram_url
                }
                icon={
                  <InstagramIcon className="size-[18px]" />
                }
                label="Instagram"
              />
            )}

            {!business.facebook_url &&
              !business.instagram_url && (
                <p
                  className="
                    text-xs
                    text-black/35
                  "
                >
                  No social media
                  links added yet.
                </p>
              )}
          </div>
        </PageCard>
      </div>
    </div>
  );
}

function MenuTab({
  business,
  menuGroups,
  canEdit,
}: {
  business: Business;

  menuGroups: ReturnType<
    typeof buildMenuGroups
  >;

  canEdit: boolean;
}) {
  const totalItems =
    menuGroups.reduce(
      (
        total,
        group,
      ) =>
        total +
        group.items.length,
      0,
    );

  return (
    <div
      className="
        mx-auto
        max-w-[900px]
        space-y-4

        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-300
      "
    >
      <PageCard>
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
              size-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#e8f2ed]
              text-[#006241]
            "
          >
            <UtensilsCrossed className="size-[18px]" />
          </div>

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <CardTitle>
              Menu
            </CardTitle>

            <p
              className="
                mt-0.5
                text-[10px]
                text-black/35
              "
            >
              Browse what{" "}
              {business.name} serves
            </p>
          </div>

          {canEdit && (
            <Link
              href={`/business/${business.slug}/edit?section=menu`}
              className="
                inline-flex
                h-9
                items-center
                gap-2
                rounded-full
                bg-[#e8f2ed]
                px-3.5
                text-[10px]
                font-bold
                text-[#006241]
                transition
                hover:bg-[#dcece4]
              "
            >
              <Pencil className="size-3.5" />
              Edit
            </Link>
          )}
        </div>
      </PageCard>

      {menuGroups.length >
      0 ? (
        <>
          <PageCard>
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
                    tracking-[0.08em]
                    text-[#006241]
                  "
                >
                  Menu categories
                </p>

                <h3
                  className="
                    mt-1
                    text-[18px]
                    font-black
                    tracking-[-0.025em]
                    text-[#17211c]
                  "
                >
                  What&apos;s being served
                </h3>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-black/35
                  "
                >
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "menu item"
                    : "menu items"}{" "}
                  across{" "}
                  {menuGroups.length}{" "}
                  {menuGroups.length === 1
                    ? "category"
                    : "categories"}
                </p>
              </div>

              <div
                className="
                  hidden
                  size-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f2f8f5]
                  text-[#006241]
                  sm:flex
                "
              >
                <MenuIcon className="size-5" />
              </div>
            </div>

            <div
              className="
                mt-5
                grid
                gap-2
                sm:grid-cols-2
              "
            >
              {menuGroups.map(
                (
                  group,
                ) => (
                  <Link
                    key={
                      group.id
                    }
                    href={
                      group.id ===
                      "uncategorized"
                        ? `/business/${encodeURIComponent(
                            business.slug,
                          )}/menu`
                        : `/business/${encodeURIComponent(
                            business.slug,
                          )}/menu?category=${encodeURIComponent(
                            group.id,
                          )}`
                    }
                    className="
                      group

                      flex
                      min-h-[72px]
                      items-center
                      gap-3

                      rounded-[14px]
                      border
                      border-black/[0.055]
                      bg-[#fafbfa]
                      p-3

                      transition-all
                      duration-200

                      hover:-translate-y-0.5
                      hover:border-[#006241]/15
                      hover:bg-[#f3f8f5]
                      hover:shadow-sm
                    "
                  >
                    <div
                      className="
                        flex
                        size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-[11px]
                        bg-[#e8f2ed]
                        text-[#006241]
                      "
                    >
                      <Coffee className="size-4" />
                    </div>

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        className="
                          truncate
                          text-[12px]
                          font-black
                          text-[#17211c]
                        "
                      >
                        {group.name}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[9px]
                          text-black/35
                        "
                      >
                        {
                          group.items
                            .length
                        }{" "}
                        {group.items
                          .length ===
                        1
                          ? "item"
                          : "items"}
                      </p>
                    </div>

                    <ArrowRight
                      className="
                        size-4
                        shrink-0
                        text-black/20
                        transition
                        group-hover:translate-x-0.5
                        group-hover:text-[#006241]
                      "
                    />
                  </Link>
                ),
              )}
            </div>
          </PageCard>

          <PageCard>
            <div
              className="
                flex
                flex-col
                items-center
                px-3
                py-5
                text-center
              "
            >
              <div
                className="
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-full
                  bg-[#e8f2ed]
                  text-[#006241]
                "
              >
                <UtensilsCrossed className="size-5" />
              </div>

              <h3
                className="
                  mt-3
                  text-[15px]
                  font-black
                  text-[#17211c]
                "
              >
                Explore the full menu
              </h3>

              <p
                className="
                  mt-1
                  max-w-[420px]
                  text-[10px]
                  leading-4
                  text-black/35
                "
              >
                See all categories,
                menu items, prices,
                photos, descriptions,
                and availability from{" "}
                {business.name}.
              </p>

              <Link
                href={`/business/${encodeURIComponent(
                  business.slug,
                )}/menu`}
                className="
                  group

                  mt-5
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2

                  rounded-full
                  bg-[#006241]
                  px-6

                  text-[10px]
                  font-black
                  text-white

                  shadow-[0_6px_18px_rgba(0,98,65,0.16)]

                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#00754a]

                  active:scale-[0.98]
                "
              >
                View full menu

                <ArrowRight
                  className="
                    size-3.5
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </Link>
            </div>
          </PageCard>
        </>
      ) : (
        <PageCard>
          <div
            className="
              py-12
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
                bg-[#e8f2ed]
                text-[#006241]
              "
            >
              <MenuIcon className="size-5" />
            </div>

            <p
              className="
                mt-3
                text-sm
                font-bold
                text-[#17211c]
              "
            >
              Menu coming soon
            </p>

            <p
              className="
                mx-auto
                mt-1
                max-w-[320px]
                text-xs
                leading-5
                text-black/35
              "
            >
              {canEdit
                ? "Create categories and add the food and drinks your business serves."
                : `${business.name} hasn't published its menu yet.`}
            </p>

            {canEdit && (
              <Link
                href={`/business/${business.slug}/edit?section=menu`}
                className="
                  mt-4
                  inline-flex
                  h-9
                  items-center
                  gap-2
                  rounded-full
                  bg-[#006241]
                  px-4
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                <Pencil className="size-3.5" />

                Build menu
              </Link>
            )}
          </div>
        </PageCard>
      )}
    </div>
  );
}

function ReviewsTab({
  reviews,
  averageRating,
  reviewCount,
}: {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}) {
  return (
    <div
      className="
        mx-auto
        max-w-[800px]
        space-y-4
      "
    >
      <PageCard>
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              text-[42px]
              font-black
              leading-none
              tracking-[-0.06em]
              text-[#17211c]
            "
          >
            {reviewCount >
            0
              ? averageRating.toFixed(
                  1,
                )
              : "—"}
          </div>

          <div>
            <StarRating
              rating={
                Math.round(
                  averageRating,
                )
              }
              size="large"
            />

            <p
              className="
                mt-1
                text-[11px]
                text-black/35
              "
            >
              Based on{" "}
              {reviewCount}{" "}
              {reviewCount ===
              1
                ? "review"
                : "reviews"}
            </p>
          </div>
        </div>
      </PageCard>

      <PageCard>
        <CardTitle>
          Customer reviews
        </CardTitle>

        {reviews.length >
        0 ? (
          <div
            className="
              mt-4
              divide-y
              divide-black/[0.06]
            "
          >
            {reviews.map(
              (review) => (
                <ReviewCard
                  key={
                    review.id
                  }
                  review={
                    review
                  }
                />
              ),
            )}
          </div>
        ) : (
          <EmptyReviews />
        )}
      </PageCard>
    </div>
  );
}

function PageTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        h-[52px]
        shrink-0
        px-4
        text-[12px]
        font-bold
        transition-all
        duration-200

        ${
          active
            ? "text-[#006241]"
            : "text-black/45 hover:bg-black/[0.025] hover:text-[#17211c]"
        }
      `}
    >
      {children}

      {active && (
        <span
          className="
            absolute
            inset-x-2
            bottom-0
            h-[3px]
            rounded-t-full
            bg-[#006241]
          "
        />
      )}
    </button>
  );
}

function PageCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        rounded-[14px]
        border
        border-black/[0.055]
        bg-white
        p-4

        shadow-[0_1px_2px_rgba(0,0,0,0.07)]

        animate-in
        fade-in
        slide-in-from-bottom-1
        duration-300

        sm:p-5
      "
    >
      {children}
    </div>
  );
}

function CardTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h2
      className="
        text-[17px]
        font-black
        tracking-[-0.025em]
        text-[#17211c]
      "
    >
      {children}
    </h2>
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
        items-start
        gap-3
        text-[12px]
        leading-5
        text-[#39433e]
      "
    >
      <span
        className="
          mt-px
          shrink-0
          text-black/45
        "
      >
        {icon}
      </span>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        {children}
      </div>
    </div>
  );
}

function HoursRow({
  day,
}: {
  day: ReturnType<
    typeof buildWeek
  >[number];
}) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        rounded-[8px]
        px-2
        py-2
        text-[11px]

        ${
          day.isToday
            ? "bg-[#f0f6f3]"
            : ""
        }
      `}
    >
      <span
        className={
          day.isToday
            ? "font-bold text-[#006241]"
            : "font-medium text-black/50"
        }
      >
        {day.label}
      </span>

      <span
        className={
          day.closed
            ? "text-black/30"
            : "font-semibold text-[#39433e]"
        }
      >
        {day.value}
      </span>
    </div>
  );
}

function SocialLink({
  href,
  icon,
  label,
  external = true,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={
        external
          ? "_blank"
          : undefined
      }
      rel={
        external
          ? "noopener noreferrer"
          : undefined
      }
      className="
        group
        flex
        items-center
        gap-3
        rounded-[10px]
        px-2
        py-2
        transition
        hover:bg-[#f4f6f4]
      "
    >
      <span
        className="
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#e8f2ed]
          text-[#006241]
        "
      >
        {icon}
      </span>

      <span
        className="
          min-w-0
          flex-1
          truncate
          text-[12px]
          font-semibold
          text-[#39433e]
          group-hover:text-[#006241]
        "
      >
        {label}
      </span>

      {external && (
        <ExternalLink
          className="
            size-3.5
            text-black/20
          "
        />
      )}
    </a>
  );
}

function BusinessAvatar({
  business,
}: {
  business: Business;
}) {
  return (
    <div
      className="
        flex
        size-10
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
        bg-[#e8f2ed]
        text-[#006241]
      "
    >
      {business.logo_url ? (
        <img
          src={
            business.logo_url
          }
          alt=""
          className="
            size-full
            object-cover
          "
        />
      ) : (
        <Store className="size-4" />
      )}
    </div>
  );
}

function FeaturedMenuItem({
  item,
}: {
  item: MenuItem;
}) {
  return (
    <div
      className={`
        group
        overflow-hidden
        rounded-[12px]
        border
        border-black/[0.055]
        bg-[#fafbfa]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:bg-white
        hover:shadow-md

        ${
          item.is_available
            ? ""
            : "opacity-60"
        }
      `}
    >
      <div
        className="
          aspect-square
          overflow-hidden
          bg-[#e8eeeb]
        "
      >
        {item.image_url ? (
          <img
            src={
              item.image_url
            }
            alt={
              item.name
            }
            loading="lazy"
            className="
              size-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              size-full
              items-center
              justify-center
              bg-[#e8f2ed]
              text-[#006241]/30
            "
          >
            <Coffee className="size-7" />
          </div>
        )}
      </div>

      <div className="p-2.5">
        <p
          className="
            truncate
            text-[11px]
            font-bold
            text-[#17211c]
          "
        >
          {item.name}
        </p>

        <p
          className="
            mt-0.5
            text-[10px]
            font-black
            text-[#006241]
          "
        >
          {formatPrice(
            item.price,
          )}
        </p>

        {!item.is_available && (
          <p
            className="
              mt-1
              text-[8px]
              font-semibold
              text-black/35
            "
          >
            Unavailable
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: Review;
}) {
  const name =
    review.profile
      ?.full_name ||
    review.profile
      ?.username ||
    "CAFÉTA User";

  return (
    <article
      className="
        py-4
        first:pt-0
        last:pb-0
      "
    >
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
            size-10
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-[#e8f2ed]
            text-[#006241]
          "
        >
          {review.profile
            ?.avatar_url ? (
            <img
              src={
                review.profile
                  .avatar_url
              }
              alt={name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="
                size-full
                object-cover
              "
            />
          ) : (
            <UserRound className="size-4" />
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
              items-start
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[12px]
                  font-bold
                  text-[#17211c]
                "
              >
                {name}
              </p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  text-black/30
                "
              >
                {formatReviewDate(
                  review.created_at,
                )}
              </p>
            </div>

            <StarRating
              rating={
                review.rating
              }
            />
          </div>

          {review.content && (
            <p
              className="
                mt-2
                text-[12px]
                leading-5
                text-[#39433e]
              "
            >
              {review.content}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function StarRating({
  rating,
  size = "normal",
}: {
  rating: number;
  size?:
    | "normal"
    | "large";
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-0.5
      "
    >
      {Array.from({
        length: 5,
      }).map(
        (_, index) => (
          <Star
            key={
              index
            }
            className={`
              ${
                size ===
                "large"
                  ? "size-4"
                  : "size-3"
              }

              ${
                index <
                rating
                  ? "fill-[#f5a623] text-[#f5a623]"
                  : "text-black/10"
              }
            `}
          />
        ),
      )}
    </div>
  );
}

function EmptyReviews() {
  return (
    <div
      className="
        mt-4
        rounded-[12px]
        bg-[#f5f7f5]
        px-5
        py-9
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
          rounded-full
          bg-[#e8f2ed]
          text-[#006241]
        "
      >
        <MessageCircle className="size-[18px]" />
      </div>

      <p
        className="
          mt-3
          text-[13px]
          font-bold
          text-[#17211c]
        "
      >
        No reviews yet
      </p>

      <p
        className="
          mt-1
          text-[10px]
          text-black/35
        "
      >
        Be the first to share
        your experience.
      </p>
    </div>
  );
}

function buildMenuGroups(
  categories: MenuCategory[],
  items: MenuItem[],
) {
  const groups =
    categories
      .map(
        (category) => ({
          id:
            category.id,

          name:
            category.name,

          items:
            items.filter(
              (item) =>
                item.category_id ===
                category.id,
            ),
        }),
      )
      .filter(
        (group) =>
          group.items.length >
          0,
      );

  const uncategorized =
    items.filter(
      (item) =>
        !item.category_id ||
        !categories.some(
          (category) =>
            category.id ===
            item.category_id,
        ),
    );

  if (
    uncategorized.length >
    0
  ) {
    groups.push({
      id:
        "uncategorized",

      name:
        "More",

      items:
        uncategorized,
    });
  }

  return groups;
}

function buildWeek(
  hours: BusinessHour[],
) {
  const today =
    new Date().getDay();

  return [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
  ].map(
    (day) => {
      const hour =
        hours.find(
          (entry) =>
            entry.day_of_week ===
            day,
        );

      const closed =
        !hour ||
        hour.is_closed ||
        !hour.opens_at ||
        !hour.closes_at;

      return {
        day,

        label:
          getDayName(
            day,
          ),

        isToday:
          day ===
          today,

        closed,

        value:
          closed
            ? "Closed"
            : `${formatTime(
                hour.opens_at!,
              )} – ${formatTime(
                hour.closes_at!,
              )}`,
      };
    },
  );
}

function getOpenState(
  hours:
    | BusinessHour
    | undefined,
) {
  if (
    !hours ||
    hours.is_closed ||
    !hours.opens_at ||
    !hours.closes_at
  ) {
    return {
      open: false,
      label:
        "Closed today",
    };
  }

  const now =
    new Date();

  const currentMinutes =
    now.getHours() *
      60 +
    now.getMinutes();

  const openMinutes =
    timeToMinutes(
      hours.opens_at,
    );

  const closeMinutes =
    timeToMinutes(
      hours.closes_at,
    );

  const open =
    closeMinutes >
    openMinutes
      ? currentMinutes >=
          openMinutes &&
        currentMinutes <
          closeMinutes
      : currentMinutes >=
          openMinutes ||
        currentMinutes <
          closeMinutes;

  return {
    open,

    label: open
      ? `Open · closes ${formatTime(
          hours.closes_at,
        )}`
      : `Closed · opens ${formatTime(
          hours.opens_at,
        )}`,
  };
}

function timeToMinutes(
  value: string,
) {
  const [
    hour,
    minute,
  ] =
    value
      .split(":")
      .map(Number);

  return (
    hour * 60 +
    minute
  );
}

function formatTime(
  value: string,
) {
  const [
    hours,
    minutes,
  ] =
    value.split(":");

  const date =
    new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0,
  );

  return new Intl.DateTimeFormat(
    "en-PH",
    {
      hour:
        "numeric",

      minute:
        "2-digit",
    },
  ).format(
    date,
  );
}

function getDayName(
  day: number,
) {
  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    names[day] ??
    ""
  );
}

function formatPrice(
  price: number,
) {
  return new Intl.NumberFormat(
    "en-PH",
    {
      style:
        "currency",

      currency:
        "PHP",

      minimumFractionDigits:
        0,

      maximumFractionDigits:
        2,
    },
  ).format(
    price,
  );
}

function formatReviewDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-PH",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",
    },
  ).format(
    new Date(
      value,
    ),
  );
}

function formatCategory(
  category: string,
) {
  switch (
    category
  ) {
    case "coffee_shop":
      return "Coffee Shop";

    case "cafe":
      return "Café";

    case "milk_tea":
      return "Milk Tea";

    case "bakery_cafe":
      return "Bakery Café";

    case "restaurant_cafe":
      return "Restaurant Café";

    case "other":
      return "Local Spot";

    default:
      return category.replace(
        /_/g,
        " ",
      );
  }
}

function FacebookIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={
        className
      }
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.62 22V12.87H16.68L17.14 9.31H13.62V7.04C13.62 6.01 13.91 5.31 15.38 5.31H17.26V2.13C16.94 2.09 15.82 2 14.5 2C11.76 2 9.88 3.67 9.88 6.75V9.31H6.77V12.87H9.88V22H13.62Z" />
    </svg>
  );
}

function InstagramIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={
        className
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="17.4"
        cy="6.6"
        r="1.15"
        fill="currentColor"
      />
    </svg>
  );
}