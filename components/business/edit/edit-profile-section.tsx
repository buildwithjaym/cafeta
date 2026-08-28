"use client";

import {
  Building2,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  ImageUpload,
} from "./image-upload";

export type BusinessCategory =
  | "coffee_shop"
  | "cafe"
  | "milk_tea"
  | "bakery_cafe"
  | "restaurant_cafe"
  | "other";

export type BusinessEditForm = {
  name: string;
  category: BusinessCategory;
  description: string;

  phone: string;
  email: string;

  website_url: string;
  facebook_url: string;
  instagram_url: string;

  address: string;
  barangay: string;
  city: string;
  province: string;

  latitude: string;
  longitude: string;
};

type Props = {
  form: BusinessEditForm;

  logoUrl:
    | string
    | null;

  coverUrl:
    | string
    | null;

  onChange: <
    K extends keyof BusinessEditForm,
  >(
    key: K,
    value: BusinessEditForm[K],
  ) => void;

  onLogoChange: (
    file: File | null,
  ) => void;

  onCoverChange: (
    file: File | null,
  ) => void;
};

const categories: {
  value: BusinessCategory;
  label: string;
}[] = [
  {
    value:
      "coffee_shop",
    label:
      "Coffee Shop",
  },
  {
    value: "cafe",
    label: "Café",
  },
  {
    value:
      "milk_tea",
    label:
      "Milk Tea",
  },
  {
    value:
      "bakery_cafe",
    label:
      "Bakery Café",
  },
  {
    value:
      "restaurant_cafe",
    label:
      "Restaurant Café",
  },
  {
    value: "other",
    label:
      "Other",
  },
];

export function EditProfileSection({
  form,
  logoUrl,
  coverUrl,
  onChange,
  onLogoChange,
  onCoverChange,
}: Props) {
  return (
    <div
      className="
        space-y-5
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-300
      "
    >
      <Section>
        <SectionHeading
          title="Business photos"
          description="Update the images customers see on your business profile."
        />

        <div
          className="
            mt-6
            space-y-6
          "
        >
          <ImageUpload
            label="Cover photo"
            description="Displayed across the top of your business profile."
            preset="cover"
            aspect="cover"
            currentUrl={
              coverUrl
            }
            onChange={
              onCoverChange
            }
          />

          <ImageUpload
            label="Business logo"
            description="Use a square logo or recognizable business image."
            preset="logo"
            aspect="square"
            currentUrl={
              logoUrl
            }
            onChange={
              onLogoChange
            }
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Business information"
          description="Keep your public business information accurate."
        />

        <div
          className="
            mt-6
            space-y-5
          "
        >
          <Field
            label="Business name"
          >
            <input
              value={
                form.name
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "name",
                  event.target
                    .value,
                )
              }
              className={
                inputClass
              }
            />
          </Field>

          <Field label="Category">
            <select
              value={
                form.category
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "category",
                  event.target
                    .value as BusinessCategory,
                )
              }
              className={
                inputClass
              }
            >
              {categories.map(
                (
                  category,
                ) => (
                  <option
                    key={
                      category.value
                    }
                    value={
                      category.value
                    }
                  >
                    {
                      category.label
                    }
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field
            label="Description"
          >
            <textarea
              value={
                form.description
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "description",
                  event.target
                    .value,
                )
              }
              rows={6}
              maxLength={
                1000
              }
              className={`
                ${inputClass}
                min-h-[140px]
                resize-none
                py-3
              `}
            />

            <p
              className="
                mt-1.5
                text-right
                text-[9px]
                text-black/25
              "
            >
              {
                form.description
                  .length
              }
              /1000
            </p>
          </Field>
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Location"
          description="Where customers can find your business."
          icon={
            <MapPin className="size-4" />
          }
        />

        <div
          className="
            mt-6
            grid
            gap-4
            sm:grid-cols-2
          "
        >
          <div className="sm:col-span-2">
            <Field
              label="Address"
            >
              <input
                value={
                  form.address
                }
                onChange={(
                  event,
                ) =>
                  onChange(
                    "address",
                    event.target
                      .value,
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>
          </div>

          <Field label="Barangay">
            <input
              value={
                form.barangay
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "barangay",
                  event.target
                    .value,
                )
              }
              className={
                inputClass
              }
            />
          </Field>

          <Field label="City">
            <input
              value={
                form.city
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "city",
                  event.target
                    .value,
                )
              }
              className={
                inputClass
              }
            />
          </Field>

          <Field label="Province">
            <input
              value={
                form.province
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "province",
                  event.target
                    .value,
                )
              }
              className={
                inputClass
              }
            />
          </Field>

          <div />

          <Field label="Latitude">
            <input
              type="number"
              step="any"
              value={
                form.latitude
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "latitude",
                  event.target
                    .value,
                )
              }
              className={
                inputClass
              }
            />
          </Field>

          <Field label="Longitude">
            <input
              type="number"
              step="any"
              value={
                form.longitude
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "longitude",
                  event.target
                    .value,
                )
              }
              className={
                inputClass
              }
            />
          </Field>
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Contact & social"
          description="Help customers contact and follow your business."
        />

        <div
          className="
            mt-6
            space-y-4
          "
        >
          <IconInput
            icon={
              <Phone className="size-4" />
            }
          >
            <input
              value={
                form.phone
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "phone",
                  event.target
                    .value,
                )
              }
              placeholder="Phone number"
              className={
                iconInputClass
              }
            />
          </IconInput>

          <IconInput
            icon={
              <Mail className="size-4" />
            }
          >
            <input
              value={
                form.email
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "email",
                  event.target
                    .value,
                )
              }
              placeholder="Email"
              className={
                iconInputClass
              }
            />
          </IconInput>

          <IconInput
            icon={
              <Globe2 className="size-4" />
            }
          >
            <input
              value={
                form.website_url
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "website_url",
                  event.target
                    .value,
                )
              }
              placeholder="Website"
              className={
                iconInputClass
              }
            />
          </IconInput>

          <IconInput
            icon={
              <FacebookIcon className="size-4" />
            }
          >
            <input
              value={
                form.facebook_url
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "facebook_url",
                  event.target
                    .value,
                )
              }
              placeholder="Facebook URL"
              className={
                iconInputClass
              }
            />
          </IconInput>

          <IconInput
            icon={
              <InstagramIcon className="size-4" />
            }
          >
            <input
              value={
                form.instagram_url
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "instagram_url",
                  event.target
                    .value,
                )
              }
              placeholder="Instagram URL"
              className={
                iconInputClass
              }
            />
          </IconInput>
        </div>
      </Section>
    </div>
  );
}

function Section({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        rounded-[22px]
        border
        border-black/[0.055]
        bg-white
        p-5
        shadow-[0_2px_12px_rgba(23,33,28,0.035)]
        sm:p-6
      "
    >
      {children}
    </section>
  );
}

function SectionHeading({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >
      {icon && (
        <div
          className="
            flex
            size-9
            shrink-0
            items-center
            justify-center
            rounded-[12px]
            bg-[#e8f2ed]
            text-[#006241]
          "
        >
          {icon}
        </div>
      )}

      <div>
        <h2
          className="
            text-[16px]
            font-black
            text-[#17211c]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-[10px]
            leading-4
            text-black/35
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="
          text-[10px]
          font-bold
          text-[#39433e]
        "
      >
        {label}
      </span>

      <div className="mt-2">
        {children}
      </div>
    </label>
  );
}

function IconInput({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        h-12
        items-center
        rounded-[14px]
        border
        border-black/[0.07]
        bg-[#fafbfa]
        transition-all
        focus-within:border-[#006241]/25
        focus-within:bg-white
        focus-within:ring-4
        focus-within:ring-[#006241]/[0.04]
      "
    >
      <span
        className="
          ml-3
          flex
          size-7
          items-center
          justify-center
          rounded-[9px]
          bg-[#e8f2ed]
          text-[#006241]
        "
      >
        {icon}
      </span>

      {children}
    </div>
  );
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
      className={className}
      fill="currentColor"
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
      className={className}
      fill="none"
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

const inputClass = `
  h-12
  w-full
  rounded-[14px]
  border
  border-black/[0.07]
  bg-[#fafbfa]
  px-4
  text-[12px]
  font-medium
  text-[#17211c]
  outline-none
  transition-all
  duration-200
  placeholder:text-black/20
  focus:border-[#006241]/25
  focus:bg-white
  focus:ring-4
  focus:ring-[#006241]/[0.04]
`;

const iconInputClass = `
  h-full
  min-w-0
  flex-1
  bg-transparent
  px-3
  text-[12px]
  font-medium
  text-[#17211c]
  outline-none
  placeholder:text-black/20
`;