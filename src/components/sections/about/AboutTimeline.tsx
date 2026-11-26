"use client";

// 1999 — 2020: the official page's twelve dated milestones (content/a-patinter.ts), after História,
// as a road travelled. The page's one held moment, on coal (the panel inset under the island, as on
// the home's presence section).
//
// Desktop (pinned, TIMELINE_PINNED): as the section comes up the panel unfolds, the road draws in
// and 1999 rises out of its mask (the approach, scrubbed). Then the section pins and the scroll
// drives along the road (timeline-acts.ts): the row of milestones slides left, the road fills
// behind a fixed reading pin, each milestone lights as its dot reaches the pin, and the band of
// years under the panel lights year by year, like the home's ledgers.
// Everywhere else (narrow or short screens): the same list runs down a rail in the coal panel; the
// rail fills with the scroll, each dot lights as the fill reaches it and each milestone comes up as it
// scrolls in. Reduced motion and no JS: the list, the rail drawn in full, every dot lit.
//
// One <ol> in chronological order for every layout, so it reads in order even while the row moves;
// the road, the pin, the dots and the band are decorative.
//
// TIMELINE_PINNED (lib/motion-queries.ts) and the [data-timeline] block in globals.css are the same
// condition. Change one and you must change both.
import { useRef } from "react";
import { addTimelineActs, setTimelineRest, timelineLength, type TimelineParts } from "@/components/sections/about/timeline-acts";
import { FIGURE_OUT } from "@/components/sections/fleet-acts";
import { PHOTO_OPEN, photoMask } from "@/components/sections/hero-chapters";
import { aboutCopy } from "@/content/locales/about";
import type { Locale } from "@/lib/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { FLEET_NARROW, FLEET_SHORT, REDUCED, TIMELINE_PINNED } from "@/lib/motion-queries";

/** A year's mask: sized in the year's own em, the line set tight (the presence figures' mask). */
const YEAR =
  "-mb-[0.14em] block overflow-x-visible overflow-y-clip pb-[0.14em] pt-[0.06em] text-[length:var(--tl-year)] font-medium leading-[0.82] tracking-[-0.05em] tabular-nums [font-stretch:88%] text-chalk";

export function AboutTimeline({ locale }: { locale: Locale }) {
  const { aboutMilestones, aboutMilestonesLabel } = aboutCopy[locale];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(root);
      const reveal = q("[data-reveal]");
      const mm = gsap.matchMedia();
      // the pinned layout outlives the 4.5s safety net only once this has run (globals.css): if the
      // app never hydrates, the section falls back to the list, every milestone visible
      section.setAttribute("data-timeline-ready", "");

      mm.add({ pinned: TIMELINE_PINNED, narrow: FLEET_NARROW, short: FLEET_SHORT, reduced: REDUCED }, (ctx) => {
        const { pinned, reduced } = ctx.conditions as Record<string, boolean>;
        gsap.set(reveal, { autoAlpha: 1 });
        if (reduced) return undefined;

        const panel = q("[data-timeline-panel]")[0];
        const label = q("[data-timeline-label]")[0];
        const track = q("[data-timeline-track]")[0];
        const list = q("[data-timeline-list]")[0];
        const items = q("[data-timeline-entry]");
        const rises = q("[data-timeline-rise]");
        const dots = q("[data-timeline-dot]");
        const entries = items.map((item) => ({
          year: item.querySelector("[data-timeline-year]") as HTMLElement,
          text: item.querySelector("[data-timeline-text]") as HTMLElement,
          lit: item.querySelector("[data-timeline-lit]") as HTMLElement,
        }));
        const years = entries.map((e) => e.year);
        const texts = entries.map((e) => e.text);
        const lits = entries.map((e) => e.lit);
        const road = q("[data-timeline-road]")[0];
        const pin = q("[data-timeline-pin]")[0];
        const fill = q("[data-timeline-fill]")[0];
        const rail = q("[data-timeline-rail]")[0];
        const railFill = q("[data-timeline-rail-fill]")[0];
        const marksBox = q("[data-timeline-marks]")[0];
        const marks = q("[data-timeline-mark]");
        const progress = q("[data-timeline-progress]")[0];

        if (pinned) {
          // ----------------------------------------------- the approach (not pinned)
          // From the section's top at 80% of the screen to 15%: the panel unfolds, the road draws in
          // and 1999 rises as the section comes up. This timeline owns only these elements (the
          // panel's clip, the road and the pin's scale, the list's and the band's visibility, the
          // first year's rise); the pinned one owns the row, the fill, the entries' strength and the
          // marks — no property has two owners.
          const approach = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 15%", scrub: true, invalidateOnRefresh: true },
          });
          approach.fromTo(panel, { clipPath: photoMask("10% 4% 0% 4%") }, { clipPath: PHOTO_OPEN, duration: 0.55, ease: "power2.out" }, 0);
          approach.fromTo(label, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.15);
          approach.fromTo(road, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 0.18);
          approach.fromTo(list, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, 0.3);
          approach.fromTo(rises[0], { yPercent: FIGURE_OUT }, { yPercent: 0, duration: 0.45, ease: "power3.out" }, 0.32);
          approach.fromTo(pin, { scaleY: 0 }, { scaleY: 1, duration: 0.25, ease: "power2.out" }, 0.55);
          approach.fromTo(marksBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.65);

          // ----------------------------------------------- the pinned road
          // Created synchronously, never gated on fonts (see Hero.tsx), and after every earlier
          // section's triggers (sibling effects run in order), so it is measured with their layout in
          // place. Its length follows the number of milestones; `true`: Lenis already eases the scroll.
          const parts: TimelineParts = { track, fill, entries, marks, progress };
          const first = items[0];
          const last = items[items.length - 1];
          // from the first entry to the last, px: fractional rects, both inside the moving row, so the
          // difference is pure layout (the entries' width is in viewport units, never the text's)
          const distance = () => last.getBoundingClientRect().left - first.getBoundingClientRect().left;
          const seq = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              pin: true,
              pinSpacing: true,
              start: "top top",
              end: `+=${timelineLength(items.length) * 100}%`,
              scrub: true,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
          });
          addTimelineActs(seq, parts, distance);
          // the state before the first scroll, set after the timelines; ScrollTrigger re-renders them
          // at the real scroll position on refresh
          setTimelineRest(parts);
        } else {
          // ----------------------------------------------- flow: down the rail
          // vertical movement only, the home's narrow-screen vocabulary; each reveal is triggered by
          // a box that never moves (the entry), its parts start pushed down inside it
          const enter = (trigger: Element, start = "top 85%") =>
            gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

          enter(panel, "top 90%").fromTo(panel, { clipPath: photoMask("10% 0% 10% 0%") }, { clipPath: PHOTO_OPEN, duration: 1.1, ease: "power3.inOut" }, 0);
          enter(panel, "top 85%").fromTo(label, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.1);

          // the rail fills with the scroll, its tip riding the 60% line of the screen…
          gsap.fromTo(
            railFill,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: rail, start: "top 60%", end: "bottom 60%", scrub: true, invalidateOnRefresh: true } }
          );
          items.forEach((item, k) => {
            enter(item)
              .fromTo(rises[k], { yPercent: FIGURE_OUT }, { yPercent: 0, duration: 0.9 }, 0)
              .fromTo(texts[k], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.15);
            // …and each dot lights as the tip reaches it
            gsap.fromTo(
              lits[k],
              { opacity: 0 },
              { opacity: 1, duration: 0.3, ease: "power2.out", scrollTrigger: { trigger: dots[k], start: "center 60%", toggleActions: "play none none reverse" } }
            );
          });
        }

        return () => {
          // custom inline transforms and clips are what a context restores least reliably; clearing
          // them lets a remount (Strict Mode, a hot update, a resize across the breakpoints) start
          // clean — in the list the panel must be a plain rounded block again, every dot lit
          gsap.set([panel, label, track, list, road, pin, fill, rail, railFill, marksBox, progress, ...marks, ...rises, ...years, ...texts, ...lits], {
            clearProps: "transform,opacity,visibility,clipPath",
          });
        };
      });

      return () => {
        mm.revert();
        section.removeAttribute("data-timeline-ready");
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="cronologia"
      data-timeline
      aria-labelledby="cronologia-titulo"
      className="relative isolate bg-chalk py-14 [--entry-gap:clamp(1.5rem,3vw,3rem)] [--entry-w:clamp(17rem,26vw,24rem)] [--road-h:2.5rem] [--tl-pad-x:1.5rem] [--tl-year:clamp(2.5rem,11vw,3.5rem)] sm:[--tl-pad-x:2.5rem] lg:py-24 lg:[--tl-pad-x:calc(var(--gutter)-var(--island-inset))] lg:[--tl-year:clamp(2.75rem,4.2vw,4.5rem)]"
    >
      <div
        data-timeline-panel
        className="relative mx-[var(--island-inset)] overflow-hidden rounded-[var(--island-radius)] bg-coal px-[var(--tl-pad-x)] py-12 lg:py-16"
      >
        <h3 id="cronologia-titulo" data-timeline-label data-reveal className="t-label flex items-center gap-3 text-chalk">
          {/* the logo's yellow, as on the home's coal panels */}
          <span aria-hidden="true" className="block h-[3px] w-7 bg-comet" />
          <span>{aboutMilestonesLabel}</span>
        </h3>

        {/* The window the row moves in (pinned) — the road and the reading pin stay put in it */}
        <div data-timeline-stage className="relative mt-10 lg:mt-14">
          <span data-timeline-road data-reveal aria-hidden="true" className="hidden h-px origin-left bg-chalk/12" />

          <div data-timeline-track className="relative">
            {/* the list's rail: from the first dot down, filled with the scroll (full at rest) */}
            <span
              data-timeline-rail
              aria-hidden="true"
              className="absolute bottom-0 left-[calc(0.25rem-0.5px)] top-[calc(var(--tl-year)*0.47)] w-px bg-chalk/12"
            >
              <span data-timeline-rail-fill data-reveal className="block size-full origin-top bg-comet" />
            </span>
            {/* the road's comet stretch (pinned): from the first dot to the last, drawn with the row */}
            <span data-timeline-fill data-reveal aria-hidden="true" className="hidden h-px origin-left bg-comet" />

            <ol data-timeline-list className="flex flex-col gap-12 lg:gap-14">
              {aboutMilestones.map((milestone) => (
                <li
                  key={milestone.year}
                  data-timeline-entry
                  data-reveal
                  className="relative pl-8 lg:grid lg:grid-cols-[clamp(9rem,14vw,13rem)_minmax(0,1fr)] lg:items-start lg:gap-x-10 lg:pl-12"
                >
                  {/* on the rail (list) or on the road (pinned): faint, lit by its comet layer */}
                  <span
                    data-timeline-dot
                    aria-hidden="true"
                    className="absolute left-0 top-[calc(var(--tl-year)*0.47-0.25rem)] block size-2 rounded-full bg-chalk/25"
                  >
                    <span data-timeline-lit data-reveal className="absolute inset-0 rounded-full bg-comet" />
                  </span>
                  <div data-timeline-year className={YEAR}>
                    <span data-timeline-rise className="block">
                      <time dateTime={milestone.year}>{milestone.year}</time>
                    </span>
                  </div>
                  <div data-timeline-text className="mt-4 lg:mt-[calc(var(--tl-year)*0.06)]">
                    <h4
                      data-timeline-title
                      className="max-w-[30ch] text-pretty text-[clamp(1.125rem,0.4vw+0.9rem,1.25rem)] font-medium leading-[1.2] tracking-[-0.015em] text-chalk lg:max-w-[40ch]"
                    >
                      {milestone.title}
                    </h4>
                    <div className="mt-3 space-y-2.5">
                      {milestone.lines.map((line, i) => (
                        <p
                          key={line}
                          data-timeline-line
                          className={`max-w-[40ch] text-pretty text-[0.9375rem] leading-[1.55] text-ash lg:max-w-[56ch] ${i > 0 ? "pl-5 -indent-5" : ""}`}
                        >
                          {/* a small comet dash marks a second fact, hanging in the margin */}
                          {i > 0 && <span aria-hidden="true" className="mr-2 inline-block h-px w-3 indent-0 bg-comet align-middle" />}
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* the reading pin (pinned): a short comet tick through the road, where each entry lights */}
          <span data-timeline-pin data-reveal aria-hidden="true" className="hidden w-0.5 rounded-full bg-comet" />
        </div>
      </div>

      {/* the band (pinned only): the years, each lit once reached, and the progress line */}
      <div
        data-timeline-marks
        data-reveal
        aria-hidden="true"
        className="absolute bottom-0 left-[var(--gutter)] z-[2] hidden h-[var(--stage-band)] flex-col justify-center"
      >
        <ol className="flex gap-[clamp(1rem,2vw,2.25rem)]">
          {aboutMilestones.map((milestone) => (
            <li key={milestone.year} data-timeline-mark className="t-label tabular-nums text-coal">
              {milestone.year}
            </li>
          ))}
        </ol>
        <span className="mt-3 block h-px bg-coal/15">
          <span data-timeline-progress className="block h-full origin-left bg-signal" />
        </span>
      </div>
    </section>
  );
}
