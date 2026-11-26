// Políticas e Sistemas de Gestão (/sustentabilidade/politicas): the official page's two parts
// (content/politicas.ts) — Sistemas de Gestão and Políticas — as numbered chapters beside a held index
// (IndexedChapters.tsx), as on the other Sustentabilidade pages: each with its official text beside its
// photograph, then its documents. Every document opens the official file in a new tab; the list is one
// row per document between hairlines — its name, the standard it answers to (certificates) in red-deep,
// an arrow — and hovering a row draws the brand's line under its name (globals.css .link-line).
import { ArrowUpRight } from "lucide-react";
// The official page's photographs, re-encoded to WebP (quality 92), from https://www.patinter.com/fotos/gca/:
// qld-politica-patinter_605526705748cdfad128c.jpg (449×300)
import qualidade from "@/assets/images/politicas-qualidade.webp";
// camiao_patinter_sunset__10972854056197edf62a035.jpg (449×300)
import camiao from "@/assets/images/politicas-camiao.webp";
import { BlockLabel, type ChapterPhoto, ChapterText } from "@/components/sections/page/chapter-blocks";
import { IndexedChapters } from "@/components/sections/page/IndexedChapters";
import { policiesCopy } from "@/content/locales/policies";
import type { PoliciesPart } from "@/content/politicas";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

/** Each part's photograph, described in the page's language. */
const photos = (locale: Locale): Record<PoliciesPart["id"], ChapterPhoto> => {
  const { alt } = ui[locale];
  return {
    "sistemas-de-gestao": { src: qualidade, alt: alt.qualityClipboard, position: "45% 40%" },
    politicas: { src: camiao, alt: alt.sunsetLorry, position: "60% 50%" },
  };
};

export function ManagementPolicies({ locale }: { locale: Locale }) {
  const { policiesOpening, policiesParts } = policiesCopy[locale];
  const PHOTOS = photos(locale);
  const NEW_TAB = ui[locale].newTab;
  return (
    <IndexedChapters
      navLabel={policiesOpening.title}
      chapters={policiesParts.map((part) => ({
        id: part.id,
        title: part.title,
        content: <PartContent part={part} photo={PHOTOS[part.id]} newTab={NEW_TAB} />,
      }))}
    />
  );
}

function PartContent({ part, photo, newTab }: { part: PoliciesPart; photo: ChapterPhoto; newTab: string }) {
  const listId = `${part.id}-documentos`;
  return (
    <>
      <ChapterText paragraphs={part.paragraphs} photo={photo} />

      <div className="mt-[clamp(3rem,6vw,4.5rem)]">
        <BlockLabel id={listId}>{part.listLabel}</BlockLabel>
        <ul aria-labelledby={listId} className="mt-5">
          {part.documents.map((doc) => (
            <li key={doc.href} data-reveal-block className="relative">
              <span data-rule data-reveal aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-line" />
              {/* phones: the name, the standard under it, the arrow at the side; from sm, one line */}
              <a
                href={doc.href}
                target="_blank"
                rel="noreferrer"
                data-fade
                data-reveal
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1.5 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
              >
                <span className="text-[1.0625rem] leading-snug tracking-[-0.01em] text-pretty text-coal/85 transition-colors duration-300 group-hover:text-coal">
                  <span className="link-line">{doc.label}</span>
                </span>
                {doc.code && (
                  <span className="t-label col-start-1 row-start-2 tabular-nums text-red-deep sm:col-start-2 sm:row-start-1">{doc.code}</span>
                )}
                <span className="sr-only">{newTab}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="col-start-2 row-span-2 row-start-1 size-4 self-center text-coal/45 transition-[translate,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coal motion-reduce:transition-none sm:col-start-3 sm:row-span-1"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
