// "Sobre nós > Sustentabilidade > Políticas e Sistemas de Gestão" / "Company > Sustainability >
// Integrated Management System Policy": the official page (patinter.com/pt|en/gca/index.php?id=34) on
// the home page's stage. All copy lives in src/content/politicas.ts and src/content/en/politicas.ts.

// The official pages' banner (as on "A Patinter"): the page's own two photographs are too small for the
// opening's frame. https://www.patinter.com/fotos/galerias/imagem_amb_1064537733574dd01eb93cc.jpg (1920×667)
import photo from "@/assets/images/sobre-estrada.jpg";
import { PageShell, pageMetadata } from "@/components/pages/PageShell";
import { PageContact } from "@/components/sections/page/PageContact";
import { PageOpening } from "@/components/sections/page/PageOpening";
import { ManagementPolicies } from "@/components/sections/sustentabilidade/ManagementPolicies";
import { policiesCopy } from "@/content/locales/policies";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

// A panorama (1920×667, 2.88:1) cropped with object-fit: cover: drawn at the frame's height times 2.88
// on wide screens, and at the 4:3 frame's width times 2.16 on narrow ones (as on "A Patinter").
const PHOTO_SIZES = "(min-width: 64rem) calc(clamp(32rem, 100vh - 10.125rem, 40rem) * 2.88), calc((100vw - 1.5rem) * 2.16)";

export const policiesMetadata = (locale: Locale) => {
  const { lead, title } = policiesCopy[locale].policiesOpening;
  return pageMetadata({ locale, page: "policies", title, description: lead });
};

export function PoliciesPage({ locale }: { locale: Locale }) {
  const { policiesContact, policiesOpening, policiesParts, policiesPlace } = policiesCopy[locale];
  return (
    <PageShell locale={locale} page="policies">
      <PageOpening
        id="politicas-e-sistemas-de-gestao"
        place={policiesPlace}
        title={policiesOpening.title}
        titleLines={policiesOpening.titleLines}
        longTitle
        lead={policiesOpening.lead}
        // the two parts; from lg the page holds the same index in a column beside them
        index={policiesParts.map((part) => ({ label: part.title, href: `#${part.id}` }))}
        indexLabel={ui[locale].onThisPage}
        indexClassName="lg:hidden"
        photo={{
          src: photo,
          alt: ui[locale].alt.roadAerial,
          sizes: PHOTO_SIZES,
          framing: "[--opening-pos:66%_30%] lg:[--opening-pos:64%_40%]",
        }}
      />
      <ManagementPolicies locale={locale} />
      <PageContact locale={locale} {...policiesContact} />
    </PageShell>
  );
}
