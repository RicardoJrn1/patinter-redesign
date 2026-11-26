// "Sobre nós > Media" / "Company > Media": the official news archive (patinter.com/pt/noticias/,
// patinter.com/en/news/) on the home page's stage. All copy lives in src/content/media.ts and
// src/content/en/media.ts; each item opens its article on the official site.
import { PageShell, pageMetadata } from "@/components/pages/PageShell";
import { NewsArchive } from "@/components/sections/media/NewsArchive";
import { mediaCopy } from "@/content/locales/media";
import type { Locale } from "@/lib/i18n";

// the newest item's title (the official page has no text of its own besides the list)
export const newsMetadata = (locale: Locale) => {
  const { mediaTitle, newsArchive } = mediaCopy[locale];
  return pageMetadata({ locale, page: "news", title: mediaTitle, description: newsArchive[0]?.title ?? mediaTitle });
};

export function NewsPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale} page="news">
      <NewsArchive locale={locale} />
    </PageShell>
  );
}
