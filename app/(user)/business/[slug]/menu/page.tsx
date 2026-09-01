import type { Metadata } from "next";

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
    data: business,
  } =
    await supabase
      .from("businesses")
      .select("name")
      .eq("slug", slug)
      .eq("status", "approved")
      .maybeSingle();

  if (!business) {
    return {
      title: "Menu | CAFÉTA",
    };
  }

  return {
    title: `${business.name} Menu | CAFÉTA`,
    description: `Explore the menu, food, drinks, and prices at ${business.name}.`,
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
    data: business,
    error: businessError,
  } =
    await supabase
      .from("businesses")
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
      .eq("slug", slug)
      .eq("status", "approved")
      .maybeSingle();

  if (businessError) {
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
        .from("menu_categories")
        .select(`
          id,
          business_id,
          name,
          sort_order,
          created_at
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
        .from("menu_items")
        .select(`
          id,
          business_id,
          category_id,
          name,
          description,
          price,
          image_url,
          is_available,
          sort_order,
          created_at,
          menu_item_variants (
            id,
            menu_item_id,
            name,
            price,
            is_available,
            sort_order,
            created_at
          )
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

  const categories =
    categoriesResult.data ?? [];

  const items =
    (itemsResult.data ?? []).map(
      (item) => ({
        id:
          item.id,

        business_id:
          item.business_id,

        category_id:
          item.category_id,

        name:
          item.name,

        description:
          item.description,

        price:
          Number(item.price),

        image_url:
          item.image_url,

        is_available:
          item.is_available,

        sort_order:
          item.sort_order,

        variants:
          (
            item.menu_item_variants ?? []
          )
            .map(
              (variant) => ({
                id:
                  variant.id,

                menu_item_id:
                  variant.menu_item_id,

                name:
                  variant.name,

                price:
                  Number(
                    variant.price,
                  ),

                is_available:
                  variant.is_available,

                sort_order:
                  variant.sort_order,
              }),
            )
            .sort(
              (a, b) =>
                a.sort_order -
                b.sort_order,
            ),
      }),
    );

  return (
    <BusinessMenuPage
      business={business}
      categories={categories}
      items={items}
    />
  );
}