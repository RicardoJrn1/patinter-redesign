// The 1999 — 2020 road's pinned choreography (desktop). AboutTimeline.tsx owns the pin and the
// timelines; this only adds tweens, in screens of scroll, so everything plays in both directions.
//
// The milestones stand in one row along a road, on the coal panel. A short beat on 1999, then the
// scroll drives: the row slides left along the road, one entry width per milestone, and the road
// fills behind a fixed reading pin, so the comet stretch is always the road already travelled. As an
// entry's dot reaches the pin, the entry lights (its year full strength, its words readable in full,
// its dot comet) and the one before it steps back. The band of years under the panel lights each
// year as it is reached, and keeps it lit — the home's ledger. A still hold on 2020, and the pin
// lets go on chalk.
//
// Every length comes from the viewport or from the number of milestones: the distance is measured
// from the entries' layout (their width is in viewport units), the crossings follow from the count.
// Nothing here knows there are twelve.
import { MARK_IDLE } from "@/components/sections/hero-chapters";
import { gsap } from "@/lib/gsap";

export type TimelineEntry = {
  /** the year's mask: dimmed while the entry is not at the pin */
  year: HTMLElement;
  /** the title and the facts (dimmed less than the year: they must stay legible on coal) */
  text: HTMLElement;
  /** the dot's comet layer, lit once the road reaches it (and lit for good) */
  lit: HTMLElement;
};

export type TimelineParts = {
  /** the row (the entries and the road's fill), moved along x */
  track: HTMLElement;
  /** the comet stretch of road, from the first dot to the last, drawn in step with the row */
  fill: HTMLElement;
  entries: TimelineEntry[];
  /** the band's years, one per entry */
  marks: HTMLElement[];
  /** the band's line, keeping pace with the whole pin */
  progress: HTMLElement;
};

/** How strong an entry's words are while it is not at the pin: dimmed, never out of reach (ash on
 *  coal at 0.7 is about 4.7:1, still AA for the 15px facts). */
export const TEXT_IDLE = 0.7;

/** The beat on 1999 before the road moves, the scroll spent per milestone, and the hold on the last. */
const HOLD = 0.15;
const STEP = 0.285;
const END_HOLD = 0.2;

/** Screens of scroll the pin holds for `n` milestones (twelve: about three and a half). */
export const timelineLength = (n: number) => HOLD + Math.max(n - 1, 0) * STEP + END_HOLD;

/** When the `k`th entry's dot (from 0) reaches the pin. */
export const crossingAt = (k: number) => HOLD + k * STEP;

/** How long an entry takes to light, centred on its crossing; the dot turns in the last moment. */
const LIGHT = STEP * 0.36;
const DOT = STEP * 0.08;

/**
 * The road, from `seq` time 0. `distance` is how far the row travels, in px: from the first entry to
 * the last (read lazily, so a refresh measures the layout again).
 */
export function addTimelineActs(seq: gsap.core.Timeline, parts: TimelineParts, distance: () => number) {
  const { track, fill, entries, marks, progress } = parts;
  const n = entries.length;
  const span = crossingAt(n - 1) - HOLD;
  const step = { immediateRender: false };

  // the row drives along the road, and the fill keeps pace with it: the same span, both linear, so
  // the fill's tip never leaves the pin (it runs from the first dot to the last)
  seq.fromTo(track, { x: 0 }, { x: () => -distance(), duration: span, ease: "none", ...step }, HOLD);
  seq.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: span, ease: "none", ...step }, HOLD);

  // one tween per entry and per change — never a stagger: on refresh a stagger inside a scrubbed
  // timeline renders only its first targets back to their start
  for (let k = 1; k < n; k++) {
    const at = crossingAt(k);
    const from = entries[k - 1];
    const to = entries[k];
    const ease = { ease: "power1.inOut", ...step };
    // the entry that was at the pin steps back…
    seq.fromTo(from.year, { opacity: 1 }, { opacity: MARK_IDLE, duration: LIGHT, ...ease }, at - LIGHT / 2);
    seq.fromTo(from.text, { opacity: 1 }, { opacity: TEXT_IDLE, duration: LIGHT, ...ease }, at - LIGHT / 2);
    // …as this one arrives: its year and words come up, and its dot turns as the fill reaches it
    seq.fromTo(to.year, { opacity: MARK_IDLE }, { opacity: 1, duration: LIGHT, ...ease }, at - LIGHT / 2);
    seq.fromTo(to.text, { opacity: TEXT_IDLE }, { opacity: 1, duration: LIGHT, ...ease }, at - LIGHT / 2);
    seq.fromTo(to.lit, { opacity: 0 }, { opacity: 1, duration: DOT, ease: "none", ...step }, at - DOT);
    // the band lights the year once it is reached, and keeps it lit
    if (marks[k]) seq.fromTo(marks[k], { opacity: MARK_IDLE }, { opacity: 1, duration: DOT, ease: "none", ...step }, at - DOT);
  }

  // the band's line keeps pace with the scroll until the pin lets go
  seq.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: timelineLength(n), ease: "none", ...step }, 0);
}

/**
 * The state before the first scroll — 1999 at the pin, lit, the rest waiting — set after the
 * timeline is built (its tweens never render their start on creation); ScrollTrigger renders the
 * timeline at the real scroll position on refresh.
 */
export function setTimelineRest(parts: TimelineParts) {
  const { track, fill, entries, marks, progress } = parts;
  gsap.set(track, { x: 0 });
  gsap.set([fill, progress], { scaleX: 0 });
  entries.forEach((entry, k) => {
    gsap.set(entry.year, { opacity: k === 0 ? 1 : MARK_IDLE });
    gsap.set(entry.text, { opacity: k === 0 ? 1 : TEXT_IDLE });
    gsap.set(entry.lit, { opacity: k === 0 ? 1 : 0 });
  });
  gsap.set(marks, { opacity: (i: number) => (i === 0 ? 1 : MARK_IDLE) });
}
