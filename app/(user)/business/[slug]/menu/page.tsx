import type {
  Metadata,
} from "next";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  BusinessMenuPage,
} from "@/components/business/menu/business-menu-page";

import {
  createClient,
} from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const supabase =
    await createClient();

  const {
    data,
  } =
    await supabase
      .from("businesses")
      .select(
        "name",
      )
      .eq(
        "slug",
        slug,
      )
      .eq(
        "status",
        "approved",
      )
      .maybeSingle();

  if (!data) {
    return {
      title:
        "Menu | CAFÉTA",
    };
  }

  return {
    title:
      `${data.name} Menu | CAFÉTA`,

    description:
      `Explore the menu, food, drinks, and prices at ${data.name}.`,
  };
}

export default async function BusinessMenuRoute({
  params,
}: Props) {
  const {
    slug,
  } = await params;

  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=${encodeURIComponent(
        `/business/${slug}/menu`,
      )}`,
    );
  }

  const {
    data:
      business,
    error:
      businessError,
  } =
    await supabase
      .from(
        "businesses",
      )
      .select(`
        id,
        name,
        slug,
        category,
        description,
        logo_url,
        cover_url,
        barangay,
        city,
        province,
        is_verified
      `)
      .eq(
        "slug",
        slug,
      )
      .eq(
        "status",
        "approved",
      )
      .maybeSingle();

  if (
    businessError
  ) {
    console.error(
      "[CAFÉTA] Failed to load menu business:",
      businessError,
    );
  }

  if (!business) {
    notFound();
  }

  const [
    categoriesResult,
    itemsResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "menu_categories",
        )
        .select(`
          id,
          business_id,
          name,
          sort_order
        `)
        .eq(
          "business_id",
          business.id,
        )
        .order(
          "sort_order",
          {
            ascending: true,
          },
        )
        .order(
          "created_at",
          {
            ascending: true,
          },
        ),

      supabase
        .from(
          "menu_items",
        )
        .select(`
          id,
          business_id,
          category_id,
          name,
          description,
          price,
          image_url,
          is_available,
          sort_order
        `)
        .eq(
          "business_id",
          business.id,
        )
        .order(
          "sort_order",
          {
            ascending: true,
          },
        )
        .order(
          "created_at",
          {
            ascending: true,
          },
        ),
    ]);

  if (
    categoriesResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load menu categories:",
      categoriesResult.error,
    );
  }

  if (
    itemsResult.error
  ) {
    console.error(
      "[CAFÉTA] Failed to load menu items:",
      itemsResult.error,
    );
  }

  return (
    <BusinessMenuPage
      business={
        business
      }
      categories={
        categoriesResult.data ??
        []
      }
      items={
        itemsResult.data ??
        []
      }
    />
  );
}