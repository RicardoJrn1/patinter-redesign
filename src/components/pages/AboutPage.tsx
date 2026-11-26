// "Sobre nós > A Patinter" / "Company > About us": the official "Quem somos" / "About us" page
// (patinter.com/pt|en/gca/index.php?id=9) on the home page's stage. All copy lives in
// src/content/a-patinter.ts and src/content/en/a-patinter.ts.
import { PageShell, pageMetadata } from "@/components/pages/PageShell";
import { AboutHistory } from "@/components/sections/about/AboutHistory";
import { AboutOpening } from "@/components/sections/about/AboutOpening";
import { AboutPurpose } from "@/components/sections/about/AboutPurpose";
import { AboutTimeline } from "@/components/sections/about/AboutTimeline";
import { AboutToday } from "@/components/sections/about/AboutToday";
import { AboutValues } from "@/components/sections/about/AboutValues";
import { PageContact } from "@/components/sections/page/PageContact";
import { aboutCopy } from "@/content/locales/about";
import type { Locale } from "@/lib/i18n";

// the official page's first paragraph (the Portuguese page's own meta description is outdated: '50 anos')
export const aboutMetadata = (locale: Locale) =>
  pageMetadata({ locale, page: "about", title: aboutCopy[locale].aboutOpening.title, description: aboutCopy[locale].aboutToday.paragraphs[0] });

export function AboutPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale} page="about">
      <AboutOpening locale={locale} />
      <AboutToday locale={locale} />
      <AboutPurpose locale={locale} />
      <AboutValues locale={locale} />
      <AboutHistory locale={locale} />
      <AboutTimeline locale={locale} />
      <PageContact locale={locale} {...aboutCopy[locale].aboutContact} />
    </PageShell>
  );
}
