import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";
import { Toaster } from "sonner";

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

const siteUrl =
  "https://www.cafeta.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "CAFÉTA — Discover Cafés in Basilan",
    template: "%s | CAFÉTA",
  },

  description:
    "Discover cafés, coffee shops, milk tea spots, and local places around Basilan with CAFÉTA. Explore places, browse menus, read reviews, and discover community Memories.",

  applicationName: "CAFÉTA",

  authors: [
    {
      name: "CAFÉTA",
    },
  ],

  creator: "CAFÉTA",
  publisher: "CAFÉTA",

  category: "Local Discovery",

  keywords: [
    "CAFÉTA",
    "Cafeta",
    "cafes in Basilan",
    "coffee shops in Basilan",
    "milk tea in Basilan",
    "Basilan cafes",
    "Basilan coffee shops",
    "Basilan milk tea",
    "cafes near me",
    "coffee shops near me",
    "milk tea near me",
    "Isabela City cafes",
    "Isabela City coffee shops",
    "local cafes Basilan",
    "cafe discovery",
    "coffee shop discovery",
    "Basilan food and drinks",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteUrl,
    siteName: "CAFÉTA",

    title:
      "CAFÉTA — Discover Cafés in Basilan",

    description:
      "Discover cafés, coffee shops, milk tea spots, menus, reviews, and community Memories around Basilan.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt:
          "CAFÉTA — Discover cafés and local spots around Basilan",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "CAFÉTA — Discover Cafés in Basilan",

    description:
      "Discover cafés, coffee shops, milk tea spots, menus, reviews, and community Memories around Basilan.",

    images: [
      "/og-image.jpg",
    ],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-image-preview":
        "large",

      "max-snippet": -1,

      "max-video-preview":
        -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],

    
  },

  manifest:
    "/manifest.webmanifest",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh bg-white font-sans text-[#17211c] antialiased">
        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            className:
              "font-sans",
          }}
        />
      </body>
    </html>
  );
}