import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/layout/RootDocument";
import { siteCopy } from "@/content/locales/site";
import "../globals.css";

// The English pages' document (/en, /en/about-us…), <html lang="en-GB">. NOT OFFICIAL: the default
// title is English for the Portuguese layout's own; the description is the official hero's.
const description = siteCopy.en.heroSlides[0].description;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Patinter — Global transport and logistics solutions", template: "%s | Patinter" },
  description,
  applicationName: "Patinter",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/en",
    siteName: "Patinter",
    title: "Patinter — Global transport and logistics solutions",
    description,
  },
  twitter: { card: "summary_large_image", title: "Patinter — Global solutions", description },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ef",
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
