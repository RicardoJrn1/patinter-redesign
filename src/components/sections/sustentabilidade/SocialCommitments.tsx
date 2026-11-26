// Responsabilidade Social e Corporativa (/sustentabilidade/responsabilidade-social): the rest of the
// official introduction, then the six official commitments (content/responsabilidade-social.ts) as
// numbered chapters beside a held index (IndexedChapters.tsx), in the same arrangement as the
// Compromissos page — each with its official text beside its photograph, and, where the official page
// has them, WellCare's four areas, Solidariedade's three fronts, and Segurança Rodoviária's statement and
// its eleven measures. Desporto's photograph opens the page, so that chapter has none of its own.
// The official photographs, re-encoded to WebP (quality 92), from https://www.patinter.com/fotos/gca/:
// academia_stem_patinter_16259137456810d6bf537f4.png (3227×2522, scaled to 2000 wide)
import academia from "@/assets/images/responsabilidade-academia.webp";
// socialresp-bombeiro-patinter_185806702957479045a5cba.jpg (427×285)
import bombeiros from "@/assets/images/responsabilidade-bombeiros.webp";
// jca_viajantes_solitarios_10_3082211576810d7ac836ca.jpg (1160×774)
import cultura from "@/assets/images/responsabilidade-cultura.webp";
// 04janpost_patinter_stories1_teste_87683233361e6f7d100032.jpg (344×344)
import estrada from "@/assets/images/responsabilidade-estrada.webp";
// db1b271c-00e3-4dd5-9de6-3d5dc15c15e3_311124405d5ffe5199d46.jpg (1920×1224)
import wellcare from "@/assets/images/responsabilidade-wellcare.webp";
import { BlockLabel, type ChapterPhoto, ChapterText, pad2 } from "@/components/sections/page/chapter-blocks";
import { IndexedChapters } from "@/components/sections/page/IndexedChapters";
import { socialCopy } from "@/content/locales/social";
import type { SocialCommitment } from "@/content/responsabilidade-social";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

/** Each commitment's photograph (Desporto's opens the page); what it shows, and nothing more, in the
 *  page's language. */
const photos = (locale: Locale): Partial<Record<SocialCommitment["id"], ChapterPhoto>> => {
  const { alt } = ui[locale];
  return {
    educacao: { src: academia, alt: alt.studyVisit, position: "50% 40%" },
    cultura: { src: cultura, alt: alt.stagePlay, position: "40% 55%" },
    wellcare: { src: wellcare, alt: alt.exerciseSession, position: "55% 50%" },
    solidariedade: { src: bombeiros, alt: alt.firefighters, position: "70% 50%" },
    "seguranca-rodoviaria": { src: estrada, alt: alt.bridgeAerial, position: "50% 50%" },
  };
};

export function SocialCommitments({ locale }: { locale: Locale }) {
  const { socialCommitments, socialOpening } = socialCopy[locale];
  const PHOTOS = photos(locale);
  return (
    <IndexedChapters
      navLabel={socialOpening.title}
      intro={
        // the official introduction's second half (its first sentence is the opening's lead)
        <p
          data-reveal-block
          className="max-w-[34ch] text-[clamp(1.375rem,2.1vw,2.125rem)] font-medium leading-[1.2] tracking-[-0.025em] text-pretty [font-stretch:88%]"
        >
          <span data-fade data-reveal className="block">
            {socialOpening.statement}
          </span>
        </p>
      }
      chapters={socialCommitments.map((c) => ({ id: c.id, title: c.title, navTitle: c.short, content: <CommitmentContent commitment={c} photo={PHOTOS[c.id]} /> }))}
    />
  );
}

function CommitmentContent({ commitment: c, photo }: { commitment: SocialCommitment; photo?: ChapterPhoto }) {
  return (
    <>
      <ChapterText paragraphs={c.paragraphs} photo={photo} />

      {c.areas && (
        <div className="mt-[clamp(3rem,6vw,4.5rem)]">
          <BlockLabel id={`${c.id}-areas`}>{c.areas.intro}</BlockLabel>
          {/* the four areas: two by two from md, between hairlines */}
          <ol aria-labelledby={`${c.id}-areas`} className="mt-5 grid gap-x-[clamp(2rem,4vw,4rem)] md:grid-cols-2">
            {c.areas.items.map((area, i) => (
              <li key={area.name} data-reveal-block className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 py-6">
                <span data-rule data-reveal aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-line" />
                <span data-fade data-reveal aria-hidden="true" className="t-label pt-1.5 text-red-deep">
                  {pad2(i)}
                </span>
                <div data-fade data-reveal>
                  <h3 className="text-[clamp(1.125rem,1.35vw,1.375rem)] font-medium leading-snug tracking-[-0.015em]">{area.name}</h3>
                  <p className="mt-2 max-w-[48ch] text-[1rem] leading-[1.6] text-pretty text-graphite">{area.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {c.areas.outro && (
            <p data-reveal-block className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.6] text-pretty text-graphite">
              <span data-fade data-reveal className="block">
                {c.areas.outro}
              </span>
            </p>
          )}
        </div>
      )}

      {c.subsections && (
        <ul className="mt-[clamp(3rem,6vw,4.5rem)]">
          {c.subsections.map((s) => (
            <li
              key={s.title}
              data-reveal-block
              className="relative grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-3 py-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            >
              <span data-rule data-reveal aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-line" />
              <h3 data-fade data-reveal className="text-[clamp(1.125rem,1.35vw,1.375rem)] font-medium leading-snug tracking-[-0.015em] text-pretty">
                {s.title}
              </h3>
              <div data-fade data-reveal className="space-y-4">
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="max-w-[56ch] text-[1.0625rem] leading-[1.6] text-pretty text-graphite">
                    {p}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {c.quote && (
        // the official statement in quotation marks, set large between hairlines
        <figure data-reveal-block className="relative mt-[clamp(3rem,6vw,4.5rem)] py-[clamp(2rem,4vw,3rem)]">
          <span data-rule data-reveal aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-line" />
          <blockquote
            data-fade
            data-reveal
            className="max-w-[40ch] text-[clamp(1.375rem,2vw,2rem)] font-medium leading-[1.25] tracking-[-0.02em] text-pretty [font-stretch:88%]"
          >
            <span className="text-signal">“</span>
            {c.quote}
            <span className="text-signal">”</span>
          </blockquote>
        </figure>
      )}

      {c.steps && (
        <div className="mt-[clamp(2rem,4vw,3rem)]">
          <BlockLabel id={`${c.id}-medidas`}>{c.steps.intro}</BlockLabel>
          <ol aria-labelledby={`${c.id}-medidas`} className="mt-5">
            {c.steps.items.map((item, i) => (
              <li key={i} data-reveal-block className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 py-4 md:grid-cols-[3rem_minmax(0,1fr)]">
                <span data-rule data-reveal aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-line" />
                <span data-fade data-reveal aria-hidden="true" className="t-label pt-1.5 text-red-deep">
                  {pad2(i)}
                </span>
                <p data-fade data-reveal className="max-w-[72ch] text-[1.0625rem] leading-[1.6] text-pretty text-coal/85">
                  {item}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
