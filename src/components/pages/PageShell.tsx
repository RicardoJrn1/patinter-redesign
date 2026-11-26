// Every page's frame, in either language: the skip link, the header, the page's own sections in
// <main>, the footer. And each page's metadata: its title and description in the page's language, its
// address as canonical and both languages' addresses for hreflang (lib/i18n.ts).
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ui } from "@/content/ui";
import { alternates, type Locale, ogLocale, type PageKey, pages } from "@/lib/i18n";

export function PageShell({ locale, page, children }: { locale: Locale; page: PageKey; children: ReactNode }) {
  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-3 top-3 z-[60] -translate-y-[150%] rounded-md bg-ink px-4 py-3 text-sm text-paper transition-transform focus:translate-y-0"
      >
        {ui[locale].skipToContent}
      </a>
      <Header locale={locale} page={page} />
      <main id="conteudo">{children}</main>
      <Footer locale={locale} page={page} />
    </>
  );
}

/**
 * An inner page's metadata. Next merges metadata shallowly: openGraph and twitter are restated whole,
 * or the layout's fields would be lost.
 */
export function pageMetadata({ locale, page, title, description }: { locale: Locale; page: PageKey; title: string; description: string }): Metadata {
  const shareTitle = `${title} | Patinter`;
  return {
    title,
    description,
    alternates: alternates(page, locale),
    openGraph: { type: "website", locale: ogLocale[locale], url: pages[page][locale], siteName: "Patinter", title: shareTitle, description },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}
