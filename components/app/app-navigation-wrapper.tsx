"use client";

import {
  usePathname,
} from "next/navigation";

import {
  AppNavbar,
} from "@/components/app/app-navbar";

import {
  MobileNavigation,
} from "@/components/app/mobile-navigation";

export function AppNavigationWrapper() {
  const pathname =
    usePathname();

  const hideNavigation =
    pathname === "/onboarding" ||
    pathname.startsWith(
      "/onboarding/",
    );

  if (hideNavigation) {
    return null;
  }

  return (
    <>
      <AppNavbar />
      <MobileNavigation />
    </>
  );
}