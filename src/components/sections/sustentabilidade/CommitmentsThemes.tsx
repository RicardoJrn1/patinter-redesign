// Compromissos de Sustentabilidade (/sustentabilidade/compromissos): the official "OS NOSSOS
// COMPROMISSOS" statement and the five themes after it (content/sustentabilidade.ts) — Ambiente,
// Pessoas e Desenvolvimento, Saúde e Segurança no Trabalho, Segurança Rodoviária, Ética — as numbered
// chapters beside a held index (IndexedChapters.tsx), each with its official text, its photograph where
// the official page has one, and its indicators.
//
// A long page of figures, set to be read and compared, in the language of the home's news index and
// the About page's values: hairlines, mono labels, one row per indicator (its number, its name, then
// its lines — the target in red-deep, the results and base years in grey — each value with the
// official note under it). Nothing is charted or computed: every figure is the official one.
import { ArrowUpRight } from "lucide-react";
// The official page's photographs, re-encoded from PNG to WebP (quality 92):
// https://www.patinter.com/fotos/gca/2019-10-30_2__358390812619b69a1a026f.png (1920×1080)
import pessoas from "@/assets/images/sustentabilidade-pessoas.webp";
// https://www.patinter.com/fotos/gca/higiene_e_seguranca_2026_15848536076aa96a8a8866c.png (1448×1086)
import armazem from "@/assets/images/sustentabilidade-armazem.webp";
// https://www.patinter.com/fotos/gca/seguranca_rodoviaria_foto_145481877268a5ae1b83f27.png (630×400)
import cone from "@/assets/images/sustentabilidade-cone.webp";
import { BlockLabel, type ChapterPhoto, ChapterText, pad2 } from "@/components/sections/page/chapter-blocks";
import { IndexedChapters } from "@/components/sections/page/IndexedChapters";
import { commitmentsCopy } from "@/content/locales/commitments";
import type { CommitmentTheme, Indicator, IndicatorLine } from "@/content/sustentabilidade";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

/** Each theme's photograph, where the official page has one (described in the page's language). */
const photos = (locale: Locale): Partial<Record<CommitmentTheme["id"], ChapterPhoto>> => {
  const { alt } = ui[locale];
  return {
    pessoas: { src: pessoas, alt: alt.teamMemberRedShirt, position: "28% 50%" },
    "saude-seguranca": { src: armazem, alt: alt.loadCheck, position: "50% 55%" },
    "seguranca-rodoviaria": { src: cone, alt: alt.trafficCone, position: "70% 50%" },
  };
};

export function CommitmentsThemes({ locale }: { locale: Locale }) {
  const { commitmentsIntro, commitmentsUpdated, commitmentThemes } = commitmentsCopy[locale];
  const PHOTOS = photos(locale);
  const NEW_TAB = ui[locale].newTab;
  return (
    <IndexedChapters
      navLabel={commitmentsIntro.label}
      labelledBy="compromissos-title"
      intro={
        // OS NOSSOS COMPROMISSOS: the label (shown over the index from lg), then the official statement
        <div data-reveal-block>
          <BlockLabel as="h2" id="compromissos-title" reveal className="lg:sr-only">
            {commitmentsIntro.label}
          </BlockLabel>
          <p
            data-fade
            data-reveal
            className="mt-6 max-w-[34ch] text-[clamp(1.5rem,2.3vw,2.375rem)] font-medium leading-[1.18] tracking-[-0.025em] text-pretty [font-stretch:88%] lg:mt-0"
          >
            {commitmentsIntro.statement}
          </p>
        </div>
      }
      chapters={commitmentThemes.map((theme) => ({ id: theme.id, title: theme.title, content: <ThemeContent theme={theme} photo={PHOTOS[theme.id]} newTab={NEW_TAB} /> }))}
      after={<p className="t-label mt-[clamp(3rem,6vw,5rem)] text-muted">{commitmentsUpdated}</p>}
    />
  );
}

function ThemeContent({ theme, photo, newTab }: { theme: CommitmentTheme; photo?: ChapterPhoto; newTab: string }) {
  const sub = theme.subsection;
  return (
    <>
      <ChapterText
        paragraphs={theme.paragraphs}
        photo={photo}
        // Ambiente: its "Emissões" sub-heading and text, beside the paragraph
        side={
          sub && (
            <div>
              <h3 data-fade data-reveal className="text-[clamp(1.375rem,1.8vw,1.75rem)] font-medium leading-tight tracking-[-0.02em]">
                {sub.title}
              </h3>
              {sub.paragraphs.map((p, i) => (
                <p key={i} data-fade data-reveal className="mt-4 max-w-[56ch] text-[1.0625rem] leading-[1.6] text-pretty text-graphite">
                  {p}
                </p>
              ))}
            </div>
          )
        }
      />

      <Indicators theme={theme} />

      {theme.closing && (
        <div data-reveal-block className="mt-[clamp(2.5rem,5vw,4rem)] max-w-[60ch]">
          <p data-fade data-reveal className="text-[1.0625rem] leading-[1.6] text-pretty text-graphite">
            {theme.closing.paragraph}
          </p>
          <p data-fade data-reveal className="mt-6">
            <a
              href={theme.closing.link.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 text-[clamp(1.0625rem,1.2vw,1.25rem)] font-medium tracking-[-0.015em] text-coal"
            >
              <span className="link-line">{theme.closing.link.label}</span>
              <span className="sr-only">{newTab}</span>
              <ArrowUpRight
                aria-hidden="true"
                strokeWidth={1.75}
                className="size-4 shrink-0 transition-[translate] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
          </p>
        </div>
      )}
    </>
  );
}

function Indicators({ theme }: { theme: CommitmentTheme }) {
  const headId = `${theme.id}-indicadores`;
  return (
    <div className="mt-[clamp(3rem,6vw,5rem)]">
      {theme.indicatorsTitle && <BlockLabel id={headId}>{theme.indicatorsTitle}</BlockLabel>}
      <ol aria-labelledby={theme.indicatorsTitle ? headId : undefined} className={theme.indicatorsTitle ? "mt-5" : ""}>
        {theme.indicators.map((indicator, i) => (
          <IndicatorRow key={indicator.id} indicator={indicator} index={i} />
        ))}
      </ol>
    </div>
  );
}

function IndicatorRow({ indicator, index }: { indicator: Indicator; index: number }) {
  return (
    <li
      data-reveal-block
      // phones: the number and the name on one line, the lines under them; from md, the lines in a
      // column of their own beside the name
      className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 gap-y-5 py-7 md:grid-cols-[3rem_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-x-8"
    >
      <span data-rule data-reveal aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-line" />
      <span data-fade data-reveal aria-hidden="true" className="t-label pt-1.5 text-red-deep">
        {pad2(index)}
      </span>
      <h4 data-fade data-reveal className="text-[clamp(1.125rem,1.35vw,1.375rem)] font-medium leading-snug tracking-[-0.015em] text-pretty">
        {indicator.name}
      </h4>
      <dl data-fade data-reveal className="col-span-2 space-y-4 md:col-span-1">
        {indicator.lines.map((line, i) => (
          <Line key={i} line={line} />
        ))}
      </dl>
    </li>
  );
}

/** One line of an indicator: its label, then its value and, under it, the official note. */
function Line({ line }: { line: IndicatorLine }) {
  return (
    <div className="grid gap-x-5 gap-y-1 sm:grid-cols-[minmax(0,10.5rem)_minmax(0,1fr)]">
      <dt className={`t-label pt-1 leading-[1.45] ${line.kind === "objetivo" ? "text-red-deep" : "text-muted"}`}>{line.label}</dt>
      <dd>
        <span className="text-[1.0625rem] font-medium leading-snug tabular-nums text-coal">{line.value}</span>
        {line.note && <span className="mt-1 block max-w-[52ch] text-[0.9375rem] leading-[1.55] text-pretty text-graphite">{line.note}</span>}
      </dd>
    </div>
  );
}
