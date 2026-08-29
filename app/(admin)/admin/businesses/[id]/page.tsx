import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

import { BusinessReviewActions } from "@/components/admin/businesses/business-review-actions";
import {
  BusinessReviewDetails,
  type ReviewBusinessHour,
  type ReviewMenuCategory,
  type ReviewMenuItem,
} from "@/components/admin/businesses/business-review-details";
import {
  BusinessStatusBadge,
  type BusinessStatus,
} from "@/components/admin/businesses/business-status-badge";
import {
  ModerationHistory,
  type ModerationLog,
} from "@/components/admin/businesses/moderation-history";
import { createClient } from "@/lib/supabase/server";

type AdminBusinessReviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Owner = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
};

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
  status: BusinessStatus;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function ownerDisplayName(owner: Owner | null) {
  if (!owner) {
    return "No owner attached";
  }

  return (
    owner.full_name?.trim() ||
    (owner.username ? `@${owner.username}` : "CAFÉTA user")
  );
}

export default async function AdminBusinessReviewPage({
  params,
}: AdminBusinessReviewPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: businessData, error: businessError } = await supabase
    .from("businesses")
    .select(
      `
        id,
        name,
        slug,
        category,
        description,
        logo_url,
        cover_url,
        phone,
        email,
        facebook_url,
        instagram_url,
        website_url,
        address,
        barangay,
        city,
        province,
        latitude,
        longitude,
        status,
        is_verified,
        created_by,
        created_at,
        updated_at,
        submitted_at,
        reviewed_at,
        reviewed_by,
        rejection_reason
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (businessError) {
    console.error("Failed to load admin business:", businessError);
  }

  if (!businessData) {
    notFound();
  }

  const business = businessData as Business;

  const [
    ownerResult,
    hoursResult,
    categoriesResult,
    menuItemsResult,
    logsResult,
  ] = await Promise.all([
    business.created_by
      ? supabase
          .from("profiles")
          .select(
            `
              id,
              full_name,
              username,
              avatar_url,
              created_at
            `,
          )
          .eq("id", business.created_by)
          .maybeSingle()
      : Promise.resolve({
          data: null,
          error: null,
        }),

    supabase
      .from("business_hours")
      .select(
        `
          id,
          day_of_week,
          opens_at,
          closes_at,
          is_closed
        `,
      )
      .eq("business_id", business.id)
      .order("day_of_week"),

    supabase
      .from("menu_categories")
      .select(
        `
          id,
          name,
          sort_order
        `,
      )
      .eq("business_id", business.id)
      .order("sort_order"),

    supabase
      .from("menu_items")
      .select(
        `
          id,
          category_id,
          name,
          description,
          price,
          image_url,
          is_available,
          sort_order
        `,
      )
      .eq("business_id", business.id)
      .order("sort_order"),

    supabase
      .from("business_moderation_logs")
      .select(
        `
          id,
          action,
          previous_status,
          new_status,
          previous_verified,
          new_verified,
          reason,
          created_at,
          admin:profiles!business_moderation_logs_admin_id_fkey (
            full_name,
            username,
            avatar_url
          )
        `,
      )
      .eq("business_id", business.id)
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (ownerResult.error) {
    console.error("Failed to load business owner:", ownerResult.error);
  }

  if (hoursResult.error) {
    console.error("Failed to load business hours:", hoursResult.error);
  }

  if (categoriesResult.error) {
    console.error(
      "Failed to load menu categories:",
      categoriesResult.error,
    );
  }

  if (menuItemsResult.error) {
    console.error("Failed to load menu items:", menuItemsResult.error);
  }

  if (logsResult.error) {
    console.error(
      "Failed to load moderation history:",
      logsResult.error,
    );
  }

  const owner = (ownerResult.data ?? null) as Owner | null;

  const hours = (hoursResult.data ?? []) as ReviewBusinessHour[];
  const categories = (categoriesResult.data ?? []) as ReviewMenuCategory[];
  const menuItems = (menuItemsResult.data ?? []) as ReviewMenuItem[];

  const logs = (logsResult.data ?? []).map((log) => ({
    ...log,
    admin: Array.isArray(log.admin)
      ? log.admin[0] ?? null
      : log.admin ?? null,
  })) as ModerationLog[];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-xs font-semibold text-black/45 transition hover:text-[#006241]"
      >
        <ArrowLeft className="size-4" />
        Businesses
      </Link>

      <section className="mt-6 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <BusinessStatusBadge
              status={business.status}
              verified={business.is_verified}
            />

            {business.is_verified ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006241]">
                <ShieldCheck className="size-3.5" />
                CAFÉTA Verified
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-[#111713] sm:text-4xl">
            {business.name}
          </h1>

          <p className="mt-2 text-sm text-black/45">
            Review the complete business application and moderation history.
          </p>
        </div>

        <Link
          href={`/business/${business.slug}`}
          target="_blank"
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-black/[0.07] bg-white px-4 text-xs font-semibold text-black/55 hover:bg-black/[0.03]"
        >
          <Store className="size-4" />
          Open business profile
        </Link>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <BusinessReviewDetails
          business={business}
          hours={hours}
          categories={categories}
          menuItems={menuItems}
        />

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <BusinessReviewActions
            businessId={business.id}
            businessName={business.name}
            status={business.status}
            isVerified={business.is_verified}
          />

          {business.status === "rejected" &&
          business.rejection_reason ? (
            <section className="rounded-[26px] border border-red-100 bg-red-50/60 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-500">
                Rejection reason
              </p>

              <p className="mt-3 text-sm leading-6 text-red-800/80">
                {business.rejection_reason}
              </p>
            </section>
          ) : null}

          <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-6">
            <h2 className="text-sm font-bold text-[#111713]">
              Application
            </h2>

            <div className="mt-5 space-y-5">
              <MetadataRow
                icon={CalendarDays}
                label="Created"
                value={formatDate(business.created_at)}
              />

              <MetadataRow
                icon={Clock3}
                label="Submitted"
                value={formatDate(business.submitted_at)}
              />

              <MetadataRow
                icon={ShieldCheck}
                label="Reviewed"
                value={formatDate(business.reviewed_at)}
              />
            </div>
          </section>

          <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-6">
            <h2 className="text-sm font-bold text-[#111713]">
              Business owner
            </h2>

            <div className="mt-5 flex items-center gap-3">
              {owner?.avatar_url ? (
                <img
                  src={owner.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="size-12 rounded-full border border-black/[0.06] object-cover"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-[#006241]/8 text-[#006241]">
                  <UserRound className="size-5" />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#111713]">
                  {ownerDisplayName(owner)}
                </p>

                {owner?.username ? (
                  <p className="mt-0.5 truncate text-xs text-black/40">
                    @{owner.username}
                  </p>
                ) : null}
              </div>
            </div>

            {owner ? (
              <p className="mt-4 border-t border-black/[0.05] pt-4 text-xs text-black/35">
                Account created {formatDate(owner.created_at)}
              </p>
            ) : null}
          </section>

          <ModerationHistory logs={logs} />
        </aside>
      </div>
    </div>
  );
}

function MetadataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F7F5] text-black/35">
        <Icon className="size-4" />
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/30">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-black/55">
          {value}
        </p>
      </div>
    </div>
  );
}