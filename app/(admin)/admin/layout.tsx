import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import { requireSuperAdmin } from "@/lib/admin/require-super-admin";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const admin = await requireSuperAdmin();

  return (
    <div className="min-h-dvh bg-[#F7F8F6]">
      <AdminHeader
        fullName={admin.full_name}
        username={admin.username}
        avatarUrl={admin.avatar_url}
      />

      <main>{children}</main>
    </div>
  );
}