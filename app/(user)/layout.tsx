import { AppNavbar } from "@/components/app/app-navbar";
import { MobileNavigation } from "@/components/app/mobile-navigation";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-[#f7f8f6]">
      <div className="hidden md:block">
        <AppNavbar />
      </div>

      <MobileNavigation />

      {children}
    </div>
  );
}