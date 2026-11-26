// The home page, in either language: the hero (with the opening logo screen), the fleet, the presence
// and the news strip. Its title and description are the layout's (app/(pt)/layout.tsx, app/(en)/layout.tsx).
import type { Metadata } from "next";
import { PageShell } from "@/components/pages/PageShell";
import { Fleet } from "@/components/sections/Fleet";
import { Hero } from "@/components/sections/Hero";
import { News } from "@/components/sections/News";
import { Presence } from "@/components/sections/Presence";
import { alternates, type Locale } from "@/lib/i18n";

export const homeMetadata = (locale: Locale): Metadata => ({ alternates: alternates("home", locale) });

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale} page="home">
      <Hero locale={locale} />
      <Fleet locale={locale} />
      <Presence locale={locale} />
      <News locale={locale} />
    </PageShell>
  );
}
