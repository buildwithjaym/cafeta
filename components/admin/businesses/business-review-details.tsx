import {
  Clock3,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Store,
} from "lucide-react";

export type ReviewBusinessHour = {
  id: string;
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
};

export type ReviewMenuCategory = {
  id: string;
  name: string;
  sort_order: number;
};

export type ReviewMenuItem = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
};

type BusinessReviewDetailsProps = {
  business: {
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
  };
  hours: ReviewBusinessHour[];
  categories: ReviewMenuCategory[];
  menuItems: ReviewMenuItem[];
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatTime(value: string | null) {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatPrice(price: number | string) {
  const value = Number(price);

  if (Number.isNaN(value)) {
    return String(price);
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-current"
    >
      <path d="M13.5 8.5V6.8c0-.8.5-1 1-1h2.3V2.1L13.7 2C10.3 2 9.5 4.1 9.5 6.4v2.1H7v4.1h2.5V22h4v-9.4h3.1l.5-4.1h-3.6Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

export function BusinessReviewDetails({
  business,
  hours,
  categories,
  menuItems,
}: BusinessReviewDetailsProps) {
  const sortedHours = [...hours].sort(
    (a, b) => a.day_of_week - b.day_of_week,
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[26px] border border-black/[0.06] bg-white">
        <div className="relative h-44 bg-[#E8EFEA] sm:h-60">
          {business.cover_url ? (
            <img
              src={business.cover_url}
              alt={`${business.name} cover`}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-[#006241]/30">
              <Store className="size-12" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>

        <div className="relative px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
            <div className="relative z-10 size-24 shrink-0 overflow-hidden rounded-[24px] border-4 border-white bg-white shadow-sm sm:size-28">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={`${business.name} logo`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-[#006241]/8 text-[#006241]">
                  <Store className="size-8" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#111713]">
                {business.name}
              </h2>

              <p className="mt-1 text-sm text-black/45">
                {formatCategory(business.category)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-7">
        <SectionHeading
          title="Business information"
          description="Core information submitted for this business."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Information label="Business name" value={business.name} />
          <Information
            label="Category"
            value={formatCategory(business.category)}
          />
          <Information label="Slug" value={business.slug} />
          <Information
            label="Business ID"
            value={business.id}
            mono
          />
        </div>

        <div className="mt-6 border-t border-black/[0.06] pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/35">
            Description
          </p>

          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-black/60">
            {business.description?.trim() || "No description provided."}
          </p>
        </div>
      </section>

      <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-7">
        <SectionHeading
          title="Location"
          description="Confirm that the address and coordinates match the business."
        />

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#F7F9F7] p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#006241]/8 text-[#006241]">
            <MapPin className="size-[18px]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111713]">
              {business.address}
            </p>

            <p className="mt-1 text-xs leading-5 text-black/45">
              {[business.barangay, business.city, business.province]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Information
            label="Latitude"
            value={String(business.latitude)}
            mono
          />
          <Information
            label="Longitude"
            value={String(business.longitude)}
            mono
          />
        </div>
      </section>

      <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-7">
        <SectionHeading
          title="Contact & online presence"
          description="Review the contact information supplied by the business."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ContactItem
            icon={Phone}
            label="Phone"
            value={business.phone}
          />

          <ContactItem
            icon={Mail}
            label="Email"
            value={business.email}
          />

          <SocialItem
            icon={<FacebookIcon />}
            label="Facebook"
            value={business.facebook_url}
          />

          <SocialItem
            icon={<InstagramIcon />}
            label="Instagram"
            value={business.instagram_url}
          />

          <ContactItem
            icon={Globe2}
            label="Website"
            value={business.website_url}
            link
          />
        </div>
      </section>

      <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-7">
        <SectionHeading
          title="Operating hours"
          description="Hours currently configured for the business."
        />

        <div className="mt-6 divide-y divide-black/[0.05]">
          {sortedHours.length > 0 ? (
            sortedHours.map((hour) => (
              <div
                key={hour.id}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <Clock3 className="size-4 text-black/30" />

                  <span className="text-sm font-medium text-[#111713]">
                    {DAYS[hour.day_of_week] ?? `Day ${hour.day_of_week}`}
                  </span>
                </div>

                <span
                  className={`text-sm ${
                    hour.is_closed
                      ? "font-medium text-red-500"
                      : "text-black/50"
                  }`}
                >
                  {hour.is_closed
                    ? "Closed"
                    : hour.opens_at && hour.closes_at
                      ? `${formatTime(hour.opens_at)} – ${formatTime(
                          hour.closes_at,
                        )}`
                      : "Not configured"}
                </span>
              </div>
            ))
          ) : (
            <EmptyState text="No operating hours configured." />
          )}
        </div>
      </section>

      <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-7">
        <SectionHeading
          title="Menu"
          description={`${menuItems.length} menu item${
            menuItems.length === 1 ? "" : "s"
          } submitted.`}
        />

        <div className="mt-6 space-y-7">
          {categories.length > 0 ? (
            categories.map((category) => {
              const items = menuItems
                .filter((item) => item.category_id === category.id)
                .sort((a, b) => a.sort_order - b.sort_order);

              if (items.length === 0) {
                return null;
              }

              return (
                <div key={category.id}>
                  <h3 className="text-sm font-bold text-[#111713]">
                    {category.name}
                  </h3>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {items.map((item) => (
                      <MenuItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : menuItems.length === 0 ? (
            <EmptyState text="No menu has been added yet." />
          ) : null}

          {menuItems.some((item) => !item.category_id) ? (
            <div>
              <h3 className="text-sm font-bold text-[#111713]">
                Other items
              </h3>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {menuItems
                  .filter((item) => !item.category_id)
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-base font-bold tracking-[-0.02em] text-[#111713]">
        {title}
      </h2>

      <p className="mt-1 text-xs leading-5 text-black/40">
        {description}
      </p>
    </div>
  );
}

function Information({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/35">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-sm text-black/65 ${
          mono ? "font-mono text-xs" : "font-medium"
        }`}
      >
        {value?.trim() || "Not provided"}
      </p>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  link = false,
}: {
  icon: typeof Phone;
  label: string;
  value: string | null;
  link?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] p-4">
      <div className="flex items-center gap-2 text-black/35">
        <Icon className="size-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      {value ? (
        link ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center gap-2 break-all text-sm font-medium text-[#006241] hover:underline"
          >
            {value}
            <ExternalLink className="size-3 shrink-0" />
          </a>
        ) : (
          <p className="mt-3 break-all text-sm font-medium text-black/65">
            {value}
          </p>
        )
      ) : (
        <p className="mt-3 text-sm text-black/30">Not provided</p>
      )}
    </div>
  );
}

function SocialItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] p-4">
      <div className="flex items-center gap-2 text-black/35">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-2 break-all text-sm font-medium text-[#006241] hover:underline"
        >
          {value}
          <ExternalLink className="size-3 shrink-0" />
        </a>
      ) : (
        <p className="mt-3 text-sm text-black/30">Not provided</p>
      )}
    </div>
  );
}

function MenuItem({
  item,
}: {
  item: ReviewMenuItem;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/[0.06] p-3">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt=""
          className="size-16 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#F5F7F5] text-black/20">
          <Store className="size-5" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-[#111713]">
            {item.name}
          </p>

          <span className="shrink-0 text-xs font-bold text-[#006241]">
            {formatPrice(item.price)}
          </span>
        </div>

        {item.description ? (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-black/40">
            {item.description}
          </p>
        ) : null}

        {!item.is_available ? (
          <span className="mt-2 inline-flex rounded-full bg-black/[0.05] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-black/40">
            Unavailable
          </span>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[#F7F9F7] px-4 py-8 text-center text-sm text-black/35">
      {text}
    </div>
  );
}