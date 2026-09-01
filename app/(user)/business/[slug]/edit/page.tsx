import {
  notFound,
  redirect,
} from "next/navigation";

import {
  BusinessEditClient,
} from "@/components/business/edit/business-edit-client";

import {
  createClient,
} from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditBusinessPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=${encodeURIComponent(
        `/business/${slug}/edit`,
      )}`,
    );
  }

  const {
    data: business,
    error: businessError,
  } = await supabase
    .from("businesses")
    .select(`
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
      created_by
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (businessError || !business) {
    console.error(
      "[CAFÉTA] Failed to load business for editing:",
      businessError,
    );

    notFound();
  }

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from("business_members")
    .select("role")
    .eq("business_id", business.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    console.error(
      "[CAFÉTA] Failed to check business membership:",
      membershipError,
    );
  }

  const canEdit =
    business.created_by === user.id ||
    membership?.role === "owner" ||
    membership?.role === "manager";

  if (!canEdit) {
    redirect(
      `/business/${business.slug}`,
    );
  }

  const [
    hoursResult,
    categoriesResult,
    itemsResult,
  ] = await Promise.all([
    supabase
      .from("business_hours")
      .select(`
        id,
        day_of_week,
        opens_at,
        closes_at,
        is_closed
      `)
      .eq("business_id", business.id)
      .order("day_of_week", {
        ascending: true,
      }),

    supabase
      .from("menu_categories")
      .select(`
        id,
        name,
        sort_order
      `)
      .eq("business_id", business.id)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("menu_items")
      .select(`
        id,
        category_id,
        name,
        description,
        price,
        image_url,
        is_available,
        sort_order,
        menu_item_variants (
          id,
          name,
          price,
          is_available,
          sort_order,
          created_at
        )
      `)
      .eq("business_id", business.id)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      }),
  ]);

  if (hoursResult.error) {
    console.error(
      "[CAFÉTA] Failed to load business hours:",
      hoursResult.error,
    );
  }

  if (categoriesResult.error) {
    console.error(
      "[CAFÉTA] Failed to load menu categories:",
      categoriesResult.error,
    );
  }

  if (itemsResult.error) {
    console.error(
      "[CAFÉTA] Failed to load menu items:",
      itemsResult.error,
    );
  }

  const hours = Array.from(
    {
      length: 7,
    },
    (_, day) => {
      const existing =
        hoursResult.data?.find(
          (hour) =>
            hour.day_of_week === day,
        );

      return {
        id: existing?.id,

        day_of_week: day,

        opens_at:
          existing?.opens_at?.slice(
            0,
            5,
          ) ?? "08:00",

        closes_at:
          existing?.closes_at?.slice(
            0,
            5,
          ) ?? "18:00",

        is_closed:
          existing?.is_closed ??
          false,
      };
    },
  );

  const categories = (
    categoriesResult.data ?? []
  ).map((category) => ({
    id: category.id,

    name: category.name,

    sort_order:
      category.sort_order,
  }));

  const items = (
    itemsResult.data ?? []
  ).map((item) => ({
    id: item.id,

    category_id:
      item.category_id,

    name: item.name,

    description:
      item.description ?? "",

    price: String(item.price),

    image_url:
      item.image_url,

    is_available:
      item.is_available,

    sort_order:
      item.sort_order,

    variants: (
      item.menu_item_variants ?? []
    )
      .sort(
        (a, b) =>
          a.sort_order -
          b.sort_order,
      )
      .map((variant) => ({
        id: variant.id,

        name: variant.name,

        price: String(
          variant.price,
        ),

        is_available:
          variant.is_available,

        sort_order:
          variant.sort_order,
      })),
  }));

  return (
    <BusinessEditClient
      business={{
        id: business.id,

        name: business.name,

        slug: business.slug,

        category:
          business.category,

        description:
          business.description,

        logo_url:
          business.logo_url,

        cover_url:
          business.cover_url,

        phone: business.phone,

        email: business.email,

        facebook_url:
          business.facebook_url,

        instagram_url:
          business.instagram_url,

        website_url:
          business.website_url,

        address:
          business.address,

        barangay:
          business.barangay,

        city: business.city,

        province:
          business.province,

        latitude:
          Number(
            business.latitude,
          ),

        longitude:
          Number(
            business.longitude,
          ),
      }}
      initialHours={hours}
      initialCategories={
        categories
      }
      initialItems={items}
    />
  );
}