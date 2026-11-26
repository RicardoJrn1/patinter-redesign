// "Sobre nós > Sustentabilidade > Compromissos de Sustentabilidade" / "Company > Sustainability >
// Sustainability Commitments": the official page (patinter.com/pt|en/gca/index.php?id=61) on the home
// page's stage. All copy lives in src/content/sustentabilidade.ts and src/content/en/sustentabilidade.ts.

// The official page's photograph for "Ambiente", re-encoded from PNG to WebP (quality 92):
// https://www.patinter.com/fotos/gca/patinter_ambiente_10526309456aa9016c0f6dd.png (1672×941)
import photo from "@/assets/images/sustentabilidade-estrada.webp";
import { PageShell, pageMetadata } from "@/components/pages/PageShell";
import { PageContact } from "@/components/sections/page/PageContact";
import { PageOpening } from "@/components/sections/page/PageOpening";
import { CommitmentsThemes } from "@/components/sections/sustentabilidade/CommitmentsThemes";
import { commitmentsCopy } from "@/content/locales/commitments";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

// The frame crops the photograph (1672×941, 1.78:1) with object-fit: cover. Wide screens: the frame is
// the --frame-col (58% of the screen, less an inset) wide and min(100vh - 10.125rem, 40rem) tall (or as
// tall as the copy, some 32rem and up), so the picture is drawn at the larger of that width and the
// height times 1.78. Narrow: a 4:3 frame the screen's width less the two insets, the picture drawn at
// that width times 1.34.
const PHOTO_SIZES = "(min-width: 64rem) max(58vw, calc(clamp(32rem, 100vh - 10.125rem, 40rem) * 1.78)), calc((100vw - 1.5rem) * 1.34)";

// the official lead's first sentence
export const commitmentsMetadata = (locale: Locale) => {
  const { lead, title } = commitmentsCopy[locale].commitmentsOpening;
  return pageMetadata({ locale, page: "commitments", title, description: lead.slice(0, lead.indexOf(".") + 1) });
};

export function CommitmentsPage({ locale }: { locale: Locale }) {
  const { commitmentsContact, commitmentsOpening, commitmentsPlace, commitmentThemes } = commitmentsCopy[locale];
  return (
    <PageShell locale={locale} page="commitments">
      <PageOpening
        id="compromissos-de-sustentabilidade"
        place={commitmentsPlace}
        title={commitmentsOpening.title}
        titleLines={commitmentsOpening.titleLines}
        longTitle
        lead={commitmentsOpening.lead}
        // the five themes; from lg the page holds the same index in a column beside them
        index={commitmentThemes.map((theme) => ({ label: theme.title, href: `#${theme.id}` }))}
        indexLabel={ui[locale].onThisPage}
        indexClassName="lg:hidden"
        photo={{
          src: photo,
          alt: ui[locale].alt.motorwayHills,
          sizes: PHOTO_SIZES,
          // the truck and the road's curve in view
          framing: "[--opening-pos:62%_60%] lg:[--opening-pos:58%_55%]",
        }}
      />
      <CommitmentsThemes locale={locale} />
      <PageContact locale={locale} {...commitmentsContact} />
    </PageShell>
  );
}
