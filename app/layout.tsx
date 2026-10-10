import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { OrganizationJsonLd, WebSiteJsonLd } from "./components/JsonLd";
import CookieConsent from "./components/CookieConsent";
import AnalyticsTracker from "./components/AnalyticsTracker";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  alternates: {
    canonical: site.url,
  },
  title: {
    default: "SPM Store | Gorras Streetwear & Jockeys Chile Oficial",
    template: `%s | SPM Store Chile`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "lvJGX_CtjSMnb8rznieITeTxBrty_vY_w_MWpXB5rXI",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: "SPM Store | Gorras Streetwear & Jockeys Chile Oficial",
    description: site.description,
    images: [
      {
        url: "/brand/spm-logo-black.png",
        width: 1200,
        height: 630,
        alt: "SPM Store - Gorras Streetwear Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPM Store | Gorras Streetwear Chile",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={site.lang} className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <AnalyticsTracker />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
