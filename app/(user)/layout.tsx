import {
  AppNavigationWrapper,
} from "@/components/app/app-navigation-wrapper";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-[#f7f8f6]">
      <AppNavigationWrapper />

      {children}
    </div>
  );
}