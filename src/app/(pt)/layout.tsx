import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/layout/RootDocument";
import { siteCopy } from "@/content/locales/site";
import "../globals.css";

// The Portuguese pages' document (the site's root: /, /a-patinter…). The English pages have their own,
// app/(en)/layout.tsx.
const description = siteCopy.pt.heroSlides[0].description;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Patinter — Soluções globais de transporte e logística", template: "%s | Patinter" },
  description,
  applicationName: "Patinter",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "/",
    siteName: "Patinter",
    title: "Patinter — Soluções globais de transporte e logística",
    description,
  },
  twitter: { card: "summary_large_image", title: "Patinter — Soluções globais", description },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ef",
};

export default function PortugueseLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="pt">{children}</RootDocument>;
}
