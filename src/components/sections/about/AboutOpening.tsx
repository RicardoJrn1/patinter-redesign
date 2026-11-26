// About page (/a-patinter), the opening: the menu's place ("Sobre nós / A Patinter"), the official H1
// and lead, an index of the page's own sections and the official page's own photograph, in the shared
// inner-page opening (PageOpening.tsx: the home hero's first chapter, smaller, entrance in CSS only).
// The official page's banner, https://www.patinter.com/fotos/galerias/imagem_amb_1064537733574dd01eb93cc.jpg
// (1920×667), copied unchanged: next/image serves it as AVIF/WebP.
import photo from "@/assets/images/sobre-estrada.jpg";
import { PageOpening } from "@/components/sections/page/PageOpening";
import { aboutCopy } from "@/content/locales/about";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

// The frame crops a panorama (1920×667, 2.88:1) with object-fit: cover, so the picture is drawn at the
// frame's height times 2.88, much wider than the frame itself. `sizes` gives that drawn width, or the
// browser would pick a file half as wide and stretch it. Wide screens: the frame is
// min(100vh - --frame-top - 4rem, 40rem) tall (--frame-top ≈ 6.125rem), or as tall as the copy beside
// it on a short window (some 32rem and up); narrow ones: 4:3, the screen's width less the two insets.
const PHOTO_SIZES = "(min-width: 64rem) calc(clamp(32rem, 100vh - 10.125rem, 40rem) * 2.88), calc((100vw - 1.5rem) * 2.16)";

export function AboutOpening({ locale }: { locale: Locale }) {
  const { aboutIndex, aboutOpening, aboutPlace } = aboutCopy[locale];
  return (
    <PageOpening
      id="quem-somos"
      place={aboutPlace}
      title={aboutOpening.title}
      titleLines={aboutOpening.titleLines}
      lead={aboutOpening.lead}
      index={aboutIndex}
      indexLabel={ui[locale].onThisPage}
      photo={{
        src: photo,
        alt: ui[locale].alt.roadAerial,
        sizes: PHOTO_SIZES,
        // keeps the cab and the road lines in view
        framing: "[--opening-pos:66%_30%] lg:[--opening-pos:64%_40%]",
      }}
    />
  );
}
