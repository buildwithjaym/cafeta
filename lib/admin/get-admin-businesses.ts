import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AdminBusiness,
} from "@/components/admin/admin-business-browser";

export const ADMIN_BUSINESS_PAGE_SIZE =
  12;

export type AdminBusinessStatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "verified"
  | "rejected"
  | "suspended";

export type AdminBusinessSort =
  | "newest"
  | "oldest"
  | "name";

export type AdminBusinessCounts = {
  all: number;
  pending: number;
  approved: number;
  verified: number;
  rejected: number;
  suspended: number;
};

export type AdminBusinessQuery = {
  page?: number;
  status?: AdminBusinessStatusFilter;
  search?: string;
  sort?: AdminBusinessSort;
};

export type AdminBusinessResult = {
  businesses: AdminBusiness[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  counts: AdminBusinessCounts;
};

function escapeSearch(
  value: string,
) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/,/g, " ")
    .trim()
    .slice(0, 100);
}

export async function getAdminBusinesses({
  page = 1,
  status = "all",
  search = "",
  sort = "newest",
}: AdminBusinessQuery): Promise<AdminBusinessResult> {
  const supabase =
    await createClient();

  const safePage = Math.max(
    1,
    Math.floor(page),
  );

  const [
    allCountResult,
    pendingCountResult,
    approvedCountResult,
    verifiedCountResult,
    rejectedCountResult,
    suspendedCountResult,
  ] = await Promise.all([
    supabase
      .from("businesses")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("businesses")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending"),

    supabase
      .from("businesses")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "approved"),

    supabase
      .from("businesses")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "approved")
      .eq("is_verified", true),

    supabase
      .from("businesses")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "rejected"),

    supabase
      .from("businesses")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "suspended"),
  ]);

  const counts: AdminBusinessCounts =
    {
      all:
        allCountResult.count ??
        0,

      pending:
        pendingCountResult.count ??
        0,

      approved:
        approvedCountResult.count ??
        0,

      verified:
        verifiedCountResult.count ??
        0,

      rejected:
        rejectedCountResult.count ??
        0,

      suspended:
        suspendedCountResult.count ??
        0,
    };

  let query = supabase
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
        address,
        barangay,
        city,
        province,
        status,
        is_verified,
        created_at,
        submitted_at,
        owner:profiles!businesses_created_by_fkey (
          full_name,
          username,
          avatar_url
        )
      `,
      {
        count: "exact",
      },
    );

  if (status === "verified") {
    query = query
      .eq("status", "approved")
      .eq(
        "is_verified",
        true,
      );
  } else if (
    status !== "all"
  ) {
    query = query.eq(
      "status",
      status,
    );
  }

  const safeSearch =
    escapeSearch(search);

  if (safeSearch) {
    query = query.or(
      [
        `name.ilike.%${safeSearch}%`,
        `address.ilike.%${safeSearch}%`,
        `barangay.ilike.%${safeSearch}%`,
        `city.ilike.%${safeSearch}%`,
        `province.ilike.%${safeSearch}%`,
      ].join(","),
    );
  }

  if (sort === "oldest") {
    query = query
      .order("submitted_at", {
        ascending: true,
        nullsFirst: false,
      })
      .order("created_at", {
        ascending: true,
      });
  } else if (
    sort === "name"
  ) {
    query = query.order(
      "name",
      {
        ascending: true,
      },
    );
  } else {
    query = query
      .order("submitted_at", {
        ascending: false,
        nullsFirst: false,
      })
      .order("created_at", {
        ascending: false,
      });
  }

  const countOnlyQuery =
    await query.range(0, 0);

  if (countOnlyQuery.error) {
    console.error(
      "[CAFÉTA Admin] Failed to count filtered businesses:",
      countOnlyQuery.error,
    );

    throw new Error(
      "Failed to load business applications.",
    );
  }

  const totalCount =
    countOnlyQuery.count ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalCount /
        ADMIN_BUSINESS_PAGE_SIZE,
    ),
  );

  const currentPage = Math.min(
    safePage,
    totalPages,
  );

  const from =
    (currentPage - 1) *
    ADMIN_BUSINESS_PAGE_SIZE;

  const to =
    from +
    ADMIN_BUSINESS_PAGE_SIZE -
    1;

  let pageQuery = supabase
    .from("businesses")
    .select(`
      id,
      name,
      slug,
      category,
      description,
      logo_url,
      cover_url,
      address,
      barangay,
      city,
      province,
      status,
      is_verified,
      created_at,
      submitted_at,
      owner:profiles!businesses_created_by_fkey (
        full_name,
        username,
        avatar_url
      )
    `);

  if (status === "verified") {
    pageQuery = pageQuery
      .eq("status", "approved")
      .eq(
        "is_verified",
        true,
      );
  } else if (
    status !== "all"
  ) {
    pageQuery =
      pageQuery.eq(
        "status",
        status,
      );
  }

  if (safeSearch) {
    pageQuery = pageQuery.or(
      [
        `name.ilike.%${safeSearch}%`,
        `address.ilike.%${safeSearch}%`,
        `barangay.ilike.%${safeSearch}%`,
        `city.ilike.%${safeSearch}%`,
        `province.ilike.%${safeSearch}%`,
      ].join(","),
    );
  }

  if (sort === "oldest") {
    pageQuery = pageQuery
      .order("submitted_at", {
        ascending: true,
        nullsFirst: false,
      })
      .order("created_at", {
        ascending: true,
      });
  } else if (
    sort === "name"
  ) {
    pageQuery =
      pageQuery.order(
        "name",
        {
          ascending: true,
        },
      );
  } else {
    pageQuery = pageQuery
      .order("submitted_at", {
        ascending: false,
        nullsFirst: false,
      })
      .order("created_at", {
        ascending: false,
      });
  }

  const {
    data,
    error,
  } = await pageQuery.range(
    from,
    to,
  );

  if (error) {
    console.error(
      "[CAFÉTA Admin] Failed to load paginated businesses:",
      error,
    );

    throw new Error(
      "Failed to load business applications.",
    );
  }

  const businesses = (
    data ?? []
  ).map((business) => ({
    ...business,

    owner: Array.isArray(
      business.owner,
    )
      ? business.owner[0] ??
        null
      : business.owner ??
        null,
  })) as unknown as AdminBusiness[];

  return {
    businesses,
    totalCount,
    currentPage,
    totalPages,
    pageSize:
      ADMIN_BUSINESS_PAGE_SIZE,
    counts,
  };
}