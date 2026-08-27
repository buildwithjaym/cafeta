import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CAFÉTA — Discover Your Next Coffee Spot",
    template: "%s | CAFÉTA",
  },
  description:
    "Discover cafés and milk-tea shops around Basilan, explore real community moments, and find your next favorite place with CAFÉTA.",
  keywords: [
    "CAFÉTA",
    "Basilan cafes",
    "Basilan coffee shops",
    "milk tea Basilan",
    "coffee near me",
    "cafe discovery",
  ],
  authors: [
    {
      name: "CAFÉTA",
    },
  ],
  creator: "CAFÉTA",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}