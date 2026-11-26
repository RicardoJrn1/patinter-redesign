// The document every page lives in, in either language: <html lang>, the fonts, the pre-hydration
// flags and the smooth scroll. Each language has its own root layout (app/(pt)/layout.tsx,
// app/(en)/layout.tsx), so each document says its own language from the first byte; going from one
// language to the other is a full page load (lib/i18n.ts).
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { PreHydrationFlags } from "@/components/motion/PreHydrationFlags";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { htmlLang, type Locale } from "@/lib/i18n";

const sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={htmlLang[locale]} className={`${sans.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      {/* browser extensions write their own attributes on <body> before React loads (random data-*
          names); this only ignores attribute differences on this one element, nothing inside it */}
      <body className="min-h-svh bg-paper text-ink antialiased" suppressHydrationWarning>
        <PreHydrationFlags />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
