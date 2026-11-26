// AboutFigure: one figure of the "Hoje" ledger (AboutToday.tsx) — its small words, the figure, then
// its unit with what qualifies it. A slim copy of the home fleet's counter markup (Fleet.tsx keeps its
// own Reading private), so the figures here count exactly as the home's do: fleet-acts.ts drives them,
// unchanged, through the FleetReadingParts that aboutReadingParts() reads back out of this markup.
//
// The final number is written in the markup (it is what reduced motion, no JS and the cleanup show),
// invisible, holding the width: the words beside it never move as digits are added. The running
// digits sit over it, right-aligned. While they run they are dimmed and stand alone; the unit only
// joins the figure once it has landed on the official value (fleet-acts.ts, addCount and riseReading).
//
// Laid out on two rows of its row in the ledger (a subgrid: the small words, then the figure), so
// every figure of a row stands on the same line however many lines its words take. From xl the unit
// sits beside the figure, its qualifier over it, as on the home (the qualifier wraps to the room the
// figure leaves); narrower, where a four-digit figure and its unit no longer fit side by side in
// every column, the unit goes under the figure in all of them, and the qualifier after it, so the
// column reads as the sentence does ('59 / anos / de experiência').
//
// Decorative: the official paragraphs say all of this, and they are what screen readers get.
import type { ReactNode } from "react";
import type { FleetReadingParts } from "@/components/sections/fleet-acts";
import type { AboutReading } from "@/content/a-patinter";

/**
 * A figure's mask, sized in the figure's own em (--about-figure, set by the section). It never
 * shrinks: beside the unit, the unit's words wrap instead (a clipped box's minimum width is 0).
 */
const MASK =
  "-mb-[0.14em] block shrink-0 overflow-x-visible overflow-y-clip pb-[0.14em] pt-[0.06em] text-[length:var(--about-figure)] leading-[0.82]";

/** `children`: decoration laid over the reading (absolutely positioned), such as a hairline. */
export function AboutFigure({ reading, className = "", children }: { reading: AboutReading; className?: string; children?: ReactNode }) {
  return (
    <div data-about-reading data-reveal aria-hidden="true" className={`relative row-span-2 grid grid-rows-subgrid gap-y-3 ${className}`}>
      {children}
      <p data-about-tab className="t-label max-w-[34ch] self-end text-balance leading-[1.5] text-muted">
        {reading.tab}
      </p>
      <div className="flex flex-col items-start gap-y-2.5 xl:flex-row xl:items-end xl:gap-x-[0.875rem]">
        <span className={MASK}>
          <span data-about-figure className="block">
            <span
              data-about-rise
              className="block whitespace-nowrap font-medium tracking-[-0.05em] text-coal tabular-nums [font-stretch:88%]"
            >
              <span className="relative inline-block">
                <span className="invisible">{reading.figure}</span>
                <span data-about-count data-target={reading.figure} className="absolute inset-y-0 right-0">
                  {reading.figure}
                </span>
              </span>
            </span>
          </span>
        </span>
        <span data-about-unit className="flex min-w-0 flex-col pb-[0.1em] text-coal">
          {reading.qualifier && (
            <span className="t-label order-last mt-2 block max-w-[11rem] leading-[1.5] text-muted xl:order-none xl:mb-2 xl:mt-0">
              {reading.qualifier}
            </span>
          )}
          <span className="block text-[length:var(--about-unit)] leading-none tracking-[-0.03em]">{reading.unit}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * The parts fleet-acts.ts animates, read out of one AboutFigure (its root). Complete, as the home's
 * readings are: no accent sign and no ruler here, and whole numbers only — written plain in Portuguese
 * ('5000'), grouped in English ('5,000'): the count runs in the figure's own writing.
 */
export function aboutReadingParts(box: HTMLElement): FleetReadingParts {
  const count = box.querySelector<HTMLElement>("[data-about-count]");
  const final = count?.dataset.target ?? "";
  return {
    box,
    tab: box.querySelector("[data-about-tab]") as HTMLElement,
    figure: box.querySelector("[data-about-figure]") as HTMLElement,
    rise: box.querySelector("[data-about-rise]") as HTMLElement,
    unit: box.querySelector("[data-about-unit]") as HTMLElement,
    count,
    accent: null,
    target: Number(final.replace(/\D/g, "")),
    decimals: 0,
    group: /\d,\d{3}$/.test(final) ? "," : undefined,
    final,
    ruler: null,
  };
}
