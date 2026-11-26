"use client";

// Fleet: the official fleet figures (content/site.ts) as the section that follows the hero, in the
// hero's own language. Two acts carry what the official block does with a yellow and a green area:
// the fleet on coal (+1200 vehicles, 3 years of average age), the environment on chalk (99% Euro 5 /
// Euro 6, 1,2 litres saved per 100 km).
//
// Desktop (pinned): as the hero lets go, this section comes up on the same chalk with no seam, and a
// coal panel arrives exactly where the hero's last photograph was — the same column, inset and
// corners — while the heading and the first figure rise in (the approach, scrubbed). Then the section
// pins and fleet-acts.ts plays the acts. The band at the bottom lists the four figures; each stays
// lit once read.
// Narrow and short screens: the same blocks in normal flow, each revealed as it scrolls in (vertical
// movement only). Reduced motion (and no JS): everything simply on the page.
//
// Screen readers get the four official statements as a list under the heading; every visual copy of
// a figure is decorative (aria-hidden).
//
// FLEET_PINNED (lib/motion-queries.ts) and the [data-fleet] block in globals.css are the same
// condition. Change one and you must change both.
import { useRef } from "react";
import {
  addFleetActs,
  FIGURE_OUT,
  FLEET_LENGTH,
  drawRuler,
  riseReading,
  type FleetParts,
  type FleetReadingParts,
} from "@/components/sections/fleet-acts";
import { MARK_IDLE, PHOTO_OPEN, photoMask } from "@/components/sections/hero-chapters";
import { siteCopy } from "@/content/locales/site";
import type { FleetReading } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";
import { FLEET_NARROW, FLEET_PINNED, FLEET_SHORT, REDUCED } from "@/lib/motion-queries";

/**
 * The figures that count up with the scroll (the client's choice: all four). A figure left out of
 * this set simply rises whole. How a count stays honest when the scroll stops mid-way is in
 * fleet-acts.ts (addCount).
 */
const COUNTED: ReadonlySet<FleetReading["id"]> = new Set(["veiculos", "idade", "ambiente", "conducao"]);
/** The figure drawn as well as written: 99% of the fleet, a ruler of 99 ticks out of 100. */
const RULED: ReadonlySet<FleetReading["id"]> = new Set(["ambiente"]);

/** The figure as text runs, with its accent sign (+ or %) set apart. */
function figureRuns(figure: string, accent?: string) {
  const at = accent ? figure.indexOf(accent) : -1;
  if (!accent || at < 0) return [{ text: figure, accent: false }];
  return [
    { text: figure.slice(0, at), accent: false },
    { text: accent, accent: true },
    { text: figure.slice(at + accent.length), accent: false },
  ].filter((run) => run.text);
}

/** The label and the title. Rendered twice: the heading itself, and its chalk echo inside the panel. */
function Heading({ fleet, echo = false }: { fleet: { label: string; titleLines: string[] }; echo?: boolean }) {
  // the echo must not be a second heading
  const Title = echo ? "p" : "h2";
  return (
    <>
      <p data-fleet-label className={`t-label flex items-center gap-3 ${echo ? "text-chalk" : "text-coal"}`}>
        {/* the logo's colours in miniature: red with a yellow tip on chalk, yellow on coal */}
        <span aria-hidden="true" className={`relative block h-[3px] w-7 ${echo ? "bg-comet" : "bg-signal"}`}>
          {!echo && <span className="absolute inset-y-0 right-0 w-2 bg-comet" />}
        </span>
        <span>{fleet.label}</span>
      </p>
      <Title
        id={echo ? undefined : "frota-title"}
        className={`mt-6 text-[length:var(--title)] font-medium leading-[0.9] tracking-[-0.05em] [font-stretch:88%] ${
          echo ? "text-chalk" : "text-coal"
        }`}
      >
        {fleet.titleLines.map((line, i) => (
          <span key={line} className="hero-line-mask block overflow-x-visible overflow-y-clip">
            <span data-fleet-line className="block">
              {line}
              {i === fleet.titleLines.length - 1 && <span className={echo ? "text-comet" : "text-signal"}>.</span>}
            </span>
          </span>
        ))}
      </Title>
    </>
  );
}

/** One figure with its words. Decorative: the statement is read from the list under the heading. */
function Reading({ reading, dark = false }: { reading: FleetReading; dark?: boolean }) {
  const counted = COUNTED.has(reading.id);
  return (
    <div data-fleet-reading data-reveal aria-hidden="true">
      <p data-fleet-tab className={`t-label max-w-[46ch] leading-[1.5] ${dark ? "text-ash" : "text-muted"}`}>
        {reading.tab}
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
        {/* the mask is sized in the figure's own em, with room below for the comma of '1,2' */}
        <span className="-mb-[0.14em] block overflow-x-visible overflow-y-clip pb-[0.14em] pt-[0.06em] text-[length:var(--fleet-figure)] leading-[0.82]">
          <span data-fleet-figure className="block">
            <span
              data-fleet-rise
              className={`block whitespace-nowrap font-medium tracking-[-0.05em] tabular-nums [font-stretch:88%] ${
                dark ? "text-chalk" : "text-coal"
              }`}
            >
              {figureRuns(reading.figure, reading.accent).map((run, i) =>
                run.accent ? (
                  <span key={i} data-fleet-accent className={dark ? "text-comet" : "text-signal"}>
                    {run.text}
                  </span>
                ) : counted ? (
                  // the final number, invisible, holds the width: the words beside it never move as
                  // digits are added; the running digits sit over it, right-aligned
                  <span key={i} className="relative inline-block">
                    <span className="invisible">{run.text}</span>
                    <span data-fleet-count data-target={run.text} className="absolute inset-y-0 right-0">
                      {run.text}
                    </span>
                  </span>
                ) : (
                  run.text
                )
              )}
            </span>
          </span>
        </span>
        <span data-fleet-unit className={`block pb-[0.1em] ${dark ? "text-chalk" : "text-coal"}`}>
          {reading.qualifier && (
            // one item per line, as the official block sets them ('Euro 5' over 'Euro 6')
            <span className={`t-label mb-2.5 block leading-[1.5] ${dark ? "text-ash" : "text-muted"}`}>
              {reading.qualifier.split(" · ").map((item) => (
                <span key={item} className="block">
                  {item}
                </span>
              ))}
            </span>
          )}
          {/* measured in its own size: 'litros por cada / 100 kms' on two lines — a number never
              parts from its unit (no-break space) */}
          <span className="block max-w-[15ch] text-[clamp(1.75rem,2.4vw,2.5rem)] leading-none tracking-[-0.03em]">
            {reading.unit.replace(/(\d) /g, "$1 ")}
          </span>
        </span>
      </div>
      {RULED.has(reading.id) && (
        // 99 of 100: faint ticks, and a fill clipped to 99 of them (globals.css, .fleet-ticks). The
        // widths are multiples of 100px, so every tick falls on a whole pixel.
        <span data-fleet-ruler aria-hidden="true" className="relative mt-7 block h-2.5 w-[12.5rem] sm:w-[18.75rem] lg:w-[25rem]">
          <span
            data-fleet-ruler-base
            className={`fleet-ticks absolute inset-0 origin-left ${dark ? "text-chalk/20" : "text-coal/15"}`}
          />
          <span
            data-fleet-ruler-fill
            className={`fleet-ticks absolute inset-0 [clip-path:inset(0%_1%_0%_0%)] ${dark ? "text-chalk" : "text-coal"}`}
          />
        </span>
      )}
    </div>
  );
}

export function Fleet({ locale }: { locale: Locale }) {
  const { fleet } = siteCopy[locale];
  const root = useRef<HTMLElement>(null);
  const [r1, r2, r3, r4] = fleet.readings;

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(root);
      const reveal = q("[data-reveal]");
      const mm = gsap.matchMedia();
      // the pinned layout outlives the 4.5s safety net only once this has run (globals.css): if
      // the app never hydrates, the section falls back to the flow layout, every figure visible
      section.setAttribute("data-fleet-ready", "");

      mm.add({ pinned: FLEET_PINNED, narrow: FLEET_NARROW, short: FLEET_SHORT, reduced: REDUCED }, (ctx) => {
        const { pinned, reduced } = ctx.conditions as Record<string, boolean>;
        // every block is visible as a whole; the motion below starts their parts from hidden
        gsap.set(reveal, { autoAlpha: 1 });
        if (reduced) return undefined;

        const panel = q("[data-fleet-panel]")[0];
        const frame = q("[data-fleet-frame]")[0];
        const labels = q("[data-fleet-label]");
        const lines = q("[data-fleet-copy] [data-fleet-line]");
        const echoLines = q("[data-fleet-echo] [data-fleet-line]");
        const readings: FleetReadingParts[] = q("[data-fleet-reading]").map((box) => {
          const count = box.querySelector<HTMLElement>("[data-fleet-count]");
          // the figure as written ('1,2'), and its value in units of its last digit (12 tenths)
          const final = count?.dataset.target ?? "";
          const decimals = final.includes(",") ? final.split(",")[1].length : 0;
          const base = box.querySelector<HTMLElement>("[data-fleet-ruler-base]");
          const fill = box.querySelector<HTMLElement>("[data-fleet-ruler-fill]");
          return {
            box,
            tab: box.querySelector("[data-fleet-tab]") as HTMLElement,
            figure: box.querySelector("[data-fleet-figure]") as HTMLElement,
            rise: box.querySelector("[data-fleet-rise]") as HTMLElement,
            unit: box.querySelector("[data-fleet-unit]") as HTMLElement,
            count,
            accent: count ? box.querySelector<HTMLElement>("[data-fleet-accent]") : null,
            target: count ? Number(final.replace(",", "")) : 0,
            decimals,
            final,
            ruler: base && fill ? { base, fill } : null,
          };
        });
        const counters = readings.filter((r) => r.count);
        const rulers = readings.flatMap((r) => (r.ruler ? [r.ruler.base, r.ruler.fill] : []));
        const dividers = q("[data-fleet-divider]");
        const marksBox = q("[data-fleet-marks]")[0];
        const marks = q("[data-fleet-mark]");
        const progress = q("[data-fleet-progress]")[0];
        const parts: FleetParts = { panel, readings, dividers, marks, progress };

        if (pinned) {
          // The frame column, px within the section. Fractional rects, not offset* (those round, and
          // at 1440 with a scrollbar the panel came out 1px off the island's inset); neither element
          // is ever transformed, so the differences are pure layout. The island's inset is the
          // frame's own gap to the right edge, so no CSS has to be parsed.
          const geometry = () => {
            const s = section.getBoundingClientRect();
            const f = frame.getBoundingClientRect();
            const right = s.right - f.right;
            return {
              width: s.width,
              top: f.top - s.top,
              right,
              bottom: s.bottom - f.bottom,
              left: f.left - s.left,
              inset: right,
            };
          };

          // ----------------------------------------------- the approach (not pinned)
          // From the section's top at 80% of the screen to 15%: the heading and the first figure rise
          // in as the section comes up. Both copies of the title move in one tween (light line, then
          // its echo, by pairs), so they can never drift apart. This timeline owns only these leaves;
          // the pinned one owns the readings' containers — no property has two owners.
          const approach = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 15%", scrub: true, invalidateOnRefresh: true },
          });
          approach.fromTo(labels, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0);
          // One tween per line (the line and its echo), at its own position — not one staggered
          // tween: on refresh ScrollTrigger renders only a stagger's first targets back to their
          // start, which left the second line standing in place until the playhead reached it.
          lines.forEach((line, i) =>
            approach.fromTo(
              [line, echoLines[i]].filter(Boolean),
              { yPercent: 115 },
              { yPercent: 0, duration: 0.45, ease: "power3.out" },
              0.05 + i * 0.08
            )
          );
          // the first figure: +1200 vehicles, counted as the section comes up (it lands at 0.79)
          riseReading(approach, readings[0], 0.25, 0.6);
          approach.fromTo(marksBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.6);
          approach.to({}, { duration: 0.05 }, 0.95);

          // ----------------------------------------------- the pinned acts
          // Created synchronously, never gated on fonts (see Hero.tsx). The length is viewport-derived.
          // No refreshPriority: the hero's (1) refreshes first, so this pin is measured with the
          // hero's spacer already in place; a section after this one must be created after it.
          const seq = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              pin: true,
              pinSpacing: true,
              start: "top top",
              end: `+=${FLEET_LENGTH * 100}%`,
              // `true`: Lenis already eases the scroll (see Hero.tsx)
              scrub: true,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
          });
          addFleetActs(seq, parts, geometry);

          // the state before the first scroll, set after the timelines (their start values render as
          // they are created); ScrollTrigger re-renders both at the real scroll position on refresh
          gsap.set(marks, { opacity: (i: number) => (i === 0 ? 1 : MARK_IDLE) });
          gsap.set(dividers[0], { scaleX: 0 });
        } else {
          // ----------------------------------------------- flow: revealed as they scroll in
          // vertical movement only, the hero's mobile vocabulary
          const enter = (trigger: Element, start = "top 85%") =>
            gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

          enter(lines[0], "top 88%")
            .fromTo(labels[0], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
            .fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.05);
          [panel, frame].forEach((block) =>
            enter(block).fromTo(block, { clipPath: photoMask("10% 0% 10% 0%") }, { clipPath: PHOTO_OPEN, duration: 1.1, ease: "power3.inOut" }, 0)
          );
          readings.forEach((r) => {
            if (r.count) {
              // a counted figure follows the scroll here too: it runs up as its reading travels from
              // near the bottom of the screen to above the middle, and back down the other way
              riseReading(
                gsap.timeline({
                  defaults: { ease: "none" },
                  scrollTrigger: { trigger: r.box, start: "top 88%", end: "top 40%", scrub: true, invalidateOnRefresh: true },
                }),
                r,
                0,
                1
              );
              return;
            }
            const tl = enter(r.box, "top 82%")
              .fromTo(r.tab, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
              .fromTo(r.rise, { yPercent: FIGURE_OUT }, { yPercent: 0, duration: 0.9 }, 0.08)
              .fromTo(r.unit, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.45);
            // the ruler draws in once its figure is up
            if (r.ruler) drawRuler(tl, r.ruler, 0.6, 1.4);
          });
          dividers.forEach((divider) => enter(divider, "top 85%").fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0));
        }

        return () => {
          // custom inline transforms and clips are what a context restores least reliably; clearing
          // them lets a remount (Strict Mode, a hot update, a resize across the breakpoints) start
          // clean — in the flow layout the panel must be a plain rounded block again
          gsap.set([panel, frame, ...labels, ...lines, ...echoLines, ...dividers, marksBox, ...marks, progress], {
            clearProps: "transform,opacity,visibility,clipPath",
          });
          gsap.set(
            readings.flatMap((r) => [r.box, r.tab, r.figure, r.rise, r.unit]),
            { clearProps: "transform,opacity,visibility" }
          );
          // a counter can be left mid-way: the static layouts must show the official figure
          counters.forEach((r) => {
            if (r.count) r.count.textContent = r.final;
            gsap.set([r.count, r.accent], { clearProps: "opacity,visibility" });
          });
          // the ruler's fill falls back to its class (99 of 100), never to an unclipped 100
          if (rulers.length) gsap.set(rulers, { clearProps: "transform,clipPath,opacity" });
        };
      });

      return () => {
        mm.revert();
        section.removeAttribute("data-fleet-ready");
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="frota"
      data-fleet
      aria-labelledby="frota-title"
      className="relative isolate bg-chalk py-14 [--fleet-figure:clamp(4.75rem,24vw,7.5rem)] [--fleet-pad:clamp(2rem,3.2vw,3.5rem)] lg:grid lg:grid-cols-[42%_minmax(0,1fr)] lg:items-start lg:py-24 lg:[--fleet-figure:clamp(5rem,min(10.5vw,17svh),13rem)]"
    >
      <div data-fleet-copy data-reveal className="px-[var(--gutter)] lg:row-span-2">
        <Heading fleet={fleet} />
        <ol className="sr-only">
          {fleet.readings.map((reading) => (
            <li key={reading.id}>{reading.statement}</li>
          ))}
        </ol>
      </div>

      {/* Act A, the fleet: a coal block. Pinned, it becomes a full-screen layer whose clip-path draws
          the block (globals.css sets its first shape: the hero photograph's frame), with the heading's
          chalk echo in the copy column, revealed as the block widens across it. */}
      <div
        data-fleet-panel
        className="mx-[var(--island-inset)] mt-10 rounded-[var(--island-radius)] bg-coal lg:col-start-2 lg:ml-0 lg:mt-0"
      >
        <div data-fleet-echo data-reveal aria-hidden="true" className="hidden">
          <Heading fleet={fleet} echo />
        </div>
        <div data-fleet-slot className="flex flex-col justify-between gap-10 px-6 py-10 sm:px-10">
          <Reading reading={r1} dark />
          {/* shrink-0: an empty flex item, a hairline would otherwise be the first thing squeezed out */}
          <span data-fleet-divider data-reveal aria-hidden="true" className="block h-px shrink-0 origin-left bg-chalk/12" />
          <Reading reading={r2} dark />
        </div>
      </div>

      {/* Act B, the environment: an outlined frame on chalk, in the same column. */}
      <div
        data-fleet-frame
        data-fleet-slot
        className="mx-[var(--island-inset)] mt-3 flex flex-col justify-between gap-10 rounded-[var(--island-radius)] border border-coal/12 px-6 py-10 sm:px-10 lg:col-start-2 lg:ml-0"
      >
        <Reading reading={r3} />
        <span data-fleet-divider data-reveal aria-hidden="true" className="block h-px shrink-0 origin-left bg-line" />
        <Reading reading={r4} />
      </div>

      {/* the band (pinned only): the four figures, each lit once read, and the progress line */}
      <div
        data-fleet-marks
        data-reveal
        aria-hidden="true"
        className="absolute bottom-0 left-[var(--gutter)] z-[2] hidden h-[var(--stage-band)] flex-col justify-center"
      >
        <ol className="flex gap-[clamp(1.5rem,3vw,3rem)]">
          {fleet.readings.map((reading) => (
            <li key={reading.id} data-fleet-mark className="t-label text-coal">
              <span className="text-red-deep">{reading.mark[0]}</span> — {reading.mark[1]}
            </li>
          ))}
        </ol>
        <span className="mt-3 block h-px bg-coal/15">
          <span data-fleet-progress className="block h-full origin-left bg-signal" />
        </span>
      </div>
    </section>
  );
}
