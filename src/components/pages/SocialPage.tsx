// "Sobre nós > Sustentabilidade > Responsabilidade Social e Corporativa" / "Company > Sustainability >
// Corporate Social Responsibility": the official page (patinter.com/pt|en/gca/index.php?id=32) on the
// home page's stage. All copy lives in src/content/responsabilidade-social.ts and its English twin.

// The official page's photograph for "Compromisso com o Desporto, a Formação e a Comunidade", re-encoded
// to WebP (quality 92): https://www.patinter.com/fotos/gca/fotos_gigantes_pequenos_1__17347319945d5fcdd4bde33.jpg (1440×969)
import photo from "@/assets/images/responsabilidade-criancas.webp";
import { PageShell, pageMetadata } from "@/components/pages/PageShell";
import { PageContact } from "@/components/sections/page/PageContact";
import { PageOpening } from "@/components/sections/page/PageOpening";
import { SocialCommitments } from "@/components/sections/sustentabilidade/SocialCommitments";
import { socialCopy } from "@/content/locales/social";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

// The frame crops the photograph (1440×969, 1.49:1) with object-fit: cover. Wide screens: the frame is
// the --frame-col (58% of the screen, less an inset) wide and min(100vh - 10.125rem, 40rem) tall (or as
// tall as the copy, some 32rem and up), so the picture is drawn at the larger of that width and the
// height times 1.49. Narrow: a 4:3 frame the screen's width less the two insets, the picture drawn at
// that width times 1.12.
const PHOTO_SIZES = "(min-width: 64rem) max(58vw, calc(clamp(32rem, 100vh - 10.125rem, 40rem) * 1.49)), calc((100vw - 1.5rem) * 1.12)";

export const socialMetadata = (locale: Locale) => {
  const { lead, title } = socialCopy[locale].socialOpening;
  return pageMetadata({ locale, page: "social", title, description: lead });
};

export function SocialPage({ locale }: { locale: Locale }) {
  const { socialCommitments, socialContact, socialOpening, socialPlace } = socialCopy[locale];
  return (
    <PageShell locale={locale} page="social">
      <PageOpening
        id="responsabilidade-social"
        place={socialPlace}
        title={socialOpening.title}
        titleLines={socialOpening.titleLines}
        longTitle
        lead={socialOpening.lead}
        // the six commitments; from lg the page holds the same index in a column beside them
        index={socialCommitments.map((c) => ({ label: c.short, href: `#${c.id}` }))}
        indexLabel={ui[locale].onThisPage}
        indexClassName="lg:hidden"
        photo={{
          src: photo,
          alt: ui[locale].alt.kidsTeam,
          sizes: PHOTO_SIZES,
          framing: "[--opening-pos:42%_50%] lg:[--opening-pos:45%_50%]",
        }}
      />
      <SocialCommitments locale={locale} />
      <PageContact locale={locale} {...socialContact} />
    </PageShell>
  );
}
