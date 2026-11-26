// The site's two languages. Portuguese lives at the root (/, /a-patinter…), English under /en with
// English addresses, as the official site does (patinter.com/pt/…, patinter.com/en/…). Every page is
// listed here in both languages: the menu's language switch and the hreflang links pair them from
// this table, so a new page is added here once, with both its addresses.

export type Locale = "pt" | "en";

export const locales: Locale[] = ["pt", "en"];

export const pages = {
  home: { pt: "/", en: "/en" },
  about: { pt: "/a-patinter", en: "/en/about-us" },
  commitments: { pt: "/sustentabilidade/compromissos", en: "/en/sustainability/commitments" },
  social: { pt: "/sustentabilidade/responsabilidade-social", en: "/en/sustainability/social-responsibility" },
  policies: { pt: "/sustentabilidade/politicas", en: "/en/sustainability/policies" },
  sponsorships: { pt: "/sustentabilidade/patrocinios", en: "/en/sustainability/sponsorships" },
  news: { pt: "/noticias", en: "/en/news" },
} satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof pages;

/** The <html lang> of each language (the official English pages write British English). */
export const htmlLang: Record<Locale, string> = { pt: "pt-PT", en: "en-GB" };

/** Open Graph's locale of each language. */
export const ogLocale: Record<Locale, string> = { pt: "pt_PT", en: "en_GB" };

/** A page's metadata alternates: its own address as canonical, and both languages for hreflang. */
export function alternates(page: PageKey, locale: Locale) {
  const { pt, en } = pages[page];
  return { canonical: pages[page][locale], languages: { "pt-PT": pt, "en-GB": en, "x-default": pt } };
}
