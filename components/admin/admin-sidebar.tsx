"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Building2,
  Coffee,
  LayoutDashboard,
  LogOut,
  Map,
} from "lucide-react";

type AdminSidebarProps = {
  adminName: string;
};

const navigation = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Businesses",
    href: "/admin/businesses",
    icon: Building2,
  },
  {
    label: "Activity",
    href: "/admin/activity",
    icon: Activity,
    disabled: true,
  },
];

export function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden h-dvh w-[270px] shrink-0 border-r border-black/[0.06] bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-black/[0.06] px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#006241] text-white">
            <Coffee className="size-5" />
          </div>

          <div>
            <p className="text-[17px] font-bold tracking-[-0.03em] text-[#111713]">
              CAFÉTA
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#006241]">
              Admin
            </p>
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
          Management
        </p>

        <nav className="mt-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex cursor-not-allowed items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-black/25"
                >
                  <Icon className="size-[18px]" />
                  <span>{item.label}</span>

                  <span className="ml-auto rounded-full bg-black/[0.04] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#006241]/8 text-[#006241]"
                    : "text-black/55 hover:bg-black/[0.035] hover:text-black"
                }`}
              >
                <Icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-black/[0.06] pt-5">
          <Link
            href="/map"
            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-black/50 transition-colors hover:bg-black/[0.035] hover:text-black"
          >
            <Map className="size-[18px]" />
            Back to CAFÉTA
          </Link>

          <div className="mt-3 rounded-[20px] bg-[#F6F7F5] p-4">
            <p className="truncate text-sm font-semibold text-[#111713]">
              {adminName}
            </p>

            <p className="mt-0.5 text-xs text-black/40">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}