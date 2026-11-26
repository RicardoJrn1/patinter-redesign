// The fleet section's pinned choreography (desktop). Fleet.tsx owns the pin and the timelines; this
// only adds tweens, in screens of scroll, so everything plays in both directions with the scroll.
//
// Act A, the fleet, on coal (0 → 1). The coal panel that came up in the place of the hero's last
// photograph widens across the whole stage — the hero's sweep, on the hero's curve — and the heading
// turns chalk under its edge (its chalk echo lives inside the panel, so the clip does it, frame by
// frame, with no script). The second figure arrives while the panel settles; then a still hold.
//
// Act B, the environment, on chalk (1 → 2.55). The fleet's figures back up into their masks; chalk
// sweeps back in from the right as the coal retreats off the left edge — the dark has crossed the
// stage once — uncovering the outlined frame that waited under it, and the heading turns coal again.
// In the frame: 99% of the fleet Euro 5 · Euro 6, with its ruler of 99 ticks out of 100, then the
// litres saved by economical driving. A still hold, and the pin lets go on chalk, as the page goes on.
//
// Each figure rises whole out of its mask (one block, never digit by digit), and COUNTS with the
// scroll, up going down and down going back (the client's choice). A scrubbed counter can stop on any
// value, so a paused frame must never pass for a fact: while it runs the number is dimmed and stands
// alone — no '+' or '%', no unit — and only when it lands on the official value does it turn full
// strength and take its sign and its words. 99% draws its ruler in step with the count (99 ticks of
// 100 when it lands), dimmed with it; 1,2 counts in tenths, written with the Portuguese comma.
import { CROSS, MARK_IDLE, PHOTO_RADIUS } from "@/components/sections/hero-chapters";
import { gsap } from "@/lib/gsap";

export type FleetReadingParts = {
  /** the reading's container: owned by the act changes (it leaves as a whole) */
  box: HTMLElement;
  tab: HTMLElement;
  /** the figure's outer wrapper: owned by the act changes (it backs up into its mask) */
  figure: HTMLElement;
  /** the figure's inner wrapper: owned by the entrances (it rises out of its mask) */
  rise: HTMLElement;
  /** the unit and qualifier */
  unit: HTMLElement;
  /** a counted figure's digits (null when the figure does not count) */
  count: HTMLElement | null;
  /** its sign (+ or %), which only joins it once it has landed */
  accent: HTMLElement | null;
  /** the official value it counts to, in units of its last digit (1,2 → 12 tenths) */
  target: number;
  /** digits after the decimal comma (1 for 1,2) */
  decimals: number;
  /** the thousands separator the figure is written with, if any (',' of the English '5,000') */
  group?: string;
  /** the figure as written, for the static layouts to fall back to */
  final: string;
  /** the reading's ruler, if it has one */
  ruler: FleetRuler | null;
};

/** The 99-of-100 ruler: its faint ticks (drawn in) and its fill (clipped to 99 of them). */
export type FleetRuler = { base: HTMLElement; fill: HTMLElement };

export type FleetParts = {
  panel: HTMLElement;
  readings: FleetReadingParts[];
  /** [coal panel's, outlined frame's] */
  dividers: HTMLElement[];
  marks: HTMLElement[];
  progress: HTMLElement;
};

/** Layout of the frame column, px within the section: read at refresh, never per frame. */
export type FleetGeometry = { width: number; top: number; right: number; bottom: number; left: number; inset: number };

/** Screens of scroll the pin holds: act A to 1, act B to 2.3, then a still hold. */
export const FLEET_LENGTH = 2.65;

/** Where a figure starts and ends, in % of its own height: far enough to clear its mask entirely. */
export const FIGURE_OUT = 140;

/** A running counter's strength: dimmed, so a number on its way never reads as the figure. */
export const COUNT_DIM = 0.4;

/** The ruler's fill at rest: 99 ticks of 100 (the last hundredth clipped off). */
export const RULER_FULL = "inset(0% 1% 0% 0%)";
export const RULER_EMPTY = "inset(0% 100% 0% 0%)";

/** The coal panel's shape: a rounded rectangle with these insets from the section's edges. */
export const panelClip = (top: number, right: number, bottom: number, left: number) =>
  `inset(${top}px ${right}px ${bottom}px ${left}px round ${PHOTO_RADIUS})`;

/** A count's value as written: whole units, or tenths with the Portuguese decimal comma; whole units
 *  grouped in thousands when the official figure is ('5,000'). */
export function formatCount(units: number, decimals: number, group?: string) {
  const whole = Math.round(units);
  if (decimals) return (whole / 10 ** decimals).toFixed(decimals).replace(".", ",");
  return group ? String(whole).replace(/\B(?=(\d{3})+$)/g, group) : String(whole);
}

/**
 * A counted figure runs from 0 to its official value over `duration`, then lands: full strength, and
 * its sign joins it. Its digits are the element's text, tweened as a property and written through a
 * modifier (so any refresh or jump renders the right number, with no callback to miss), rounded to
 * whole units of its last digit. A ruler fills in step with it. Returns when it has landed.
 */
export function addCount(tl: gsap.core.Timeline, r: FleetReadingParts, at: number, duration: number) {
  if (!r.count) return at;
  const land = at + duration;
  const settle = duration * 0.12;
  // A large count eases into its value (the last units come slowly, then it lands). A small one
  // ticks in equal steps (0, 1, 2, 3 — or 0,0 … 1,2), each value 0…n−1 held for 1/n of the count, so
  // the official value arrives exactly as it lands. Not GSAP's steps(n): it reaches n a step early.
  // (The epsilon keeps float error at the k/n boundaries from holding a step back.)
  const n = r.target;
  const ease = n <= 12 ? (p: number) => Math.floor(p * n + 1e-6) / n : "power2.out";
  tl.fromTo(
    r.count,
    { innerText: 0 },
    { innerText: r.target, duration, ease, modifiers: { innerText: (units: number) => formatCount(units, r.decimals, r.group) } },
    at
  );
  tl.fromTo(r.count, { opacity: COUNT_DIM }, { opacity: 1, duration: settle }, land);
  if (r.accent) tl.fromTo(r.accent, { autoAlpha: 0 }, { autoAlpha: 1, duration: settle }, land);
  if (r.ruler) {
    // the faint ticks are drawn just ahead of the fill, which keeps pace with the count (same curve,
    // same span) and lands with it
    tl.fromTo(r.ruler.base, { scaleX: 0 }, { scaleX: 1, duration: duration * 0.3, ease: "power2.inOut" }, at - duration * 0.15);
    tl.fromTo(r.ruler.fill, { clipPath: RULER_EMPTY }, { clipPath: RULER_FULL, duration, ease }, at);
    tl.fromTo(r.ruler.fill, { opacity: COUNT_DIM }, { opacity: 1, duration: settle }, land);
  }
  return land;
}

/**
 * A reading enters: its small words, then the figure rising whole, then its unit. A counted figure
 * runs while it rises and its words wait for it to land; any other figure's words start once it is
 * about 95% up (power3.out, two thirds into its rise). Returns when its words are in.
 */
export function riseReading(tl: gsap.core.Timeline, r: FleetReadingParts, at: number, span: number) {
  tl.fromTo(r.tab, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: span * 0.3, ease: "power2.out" }, at);
  tl.fromTo(r.rise, { yPercent: FIGURE_OUT }, { yPercent: 0, duration: span * 0.55, ease: "power3.out" }, at + span * 0.1);
  const words = r.count ? addCount(tl, r, at + span * 0.1, span * 0.8) : at + span * 0.45;
  if (!r.count && r.ruler) drawRuler(tl, r.ruler, words, span);
  tl.fromTo(r.unit, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: span * 0.3, ease: "power2.out" }, words);
  return words + span * 0.3;
}

/** When a reading entering at `at` over `span` (riseReading) lands on its official value. */
export const landsAt = (at: number, span: number) => at + span * 0.9;

/**
 * The ruler draws its faint ticks, then fills 99 of them — only once '99%' is up, so a ruler paused
 * half-way reads as being drawn next to a finished figure, never as a second, different figure.
 */
export function drawRuler(tl: gsap.core.Timeline, ruler: FleetRuler, at: number, span: number) {
  tl.fromTo(ruler.base, { scaleX: 0 }, { scaleX: 1, duration: span * 0.45, ease: "power2.inOut" }, at);
  tl.fromTo(ruler.fill, { clipPath: RULER_EMPTY }, { clipPath: RULER_FULL, duration: span * 0.6, ease: "power2.out" }, at + span * 0.3);
}

/** Both acts, from `seq` time 0. `geometry` is read lazily, so a refresh measures the layout again. */
export function addFleetActs(seq: gsap.core.Timeline, parts: FleetParts, geometry: () => FleetGeometry) {
  const [first, second, third, fourth] = parts.readings;
  const [panelDivider, frameDivider] = parts.dividers;
  const sweep = { ease: CROSS.ease };

  // ------------------------------------------------- act A: the fleet, on coal
  // the panel widens leftwards across the copy column, to the island's inset
  seq.fromTo(
    parts.panel,
    {
      clipPath: () => {
        const g = geometry();
        return panelClip(g.top, g.right, g.bottom, g.left);
      },
    },
    {
      clipPath: () => {
        const g = geometry();
        return panelClip(g.top, g.right, g.bottom, g.inset);
      },
      duration: 0.6,
      ...sweep,
    },
    0
  );
  // the second figure, while the panel settles: 3 years, counted (it lands at 0.66)
  seq.fromTo(panelDivider, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power2.inOut" }, 0.26);
  riseReading(seq, second, 0.3, 0.4);
  // the band: a figure lights once it has landed, and stays lit — it fills like a ledger
  seq.fromTo(parts.marks[1], { opacity: MARK_IDLE }, { opacity: 1, duration: 0.1 }, landsAt(0.3, 0.4));

  // ------------------------------------------------- act B: the environment, on chalk
  // 1 · the fleet's figures back up into their masks, their words with them (one tween each: a
  //     stagger inside a scrubbed timeline loses its later start values on refresh)
  [first, second].forEach((r, i) => {
    seq.fromTo(r.figure, { yPercent: 0 }, { yPercent: -FIGURE_OUT, duration: 0.22, ease: "power2.in" }, 1 + i * 0.03);
    seq.fromTo(r.box, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -14, duration: 0.2, ease: "power2.in" }, 1.02 + i * 0.03);
  });
  seq.fromTo(panelDivider, { scaleX: 1 }, { scaleX: 0, duration: 0.2, ease: "power2.in", immediateRender: false }, 1.02);

  // 2 · chalk sweeps back in from the right: the coal retreats off the left edge, on the hero's
  //     curve, uncovering the outlined frame and handing the heading back to coal as it passes
  seq.fromTo(
    parts.panel,
    {
      clipPath: () => {
        const g = geometry();
        return panelClip(g.top, g.right, g.bottom, g.inset);
      },
    },
    {
      clipPath: () => {
        const g = geometry();
        return panelClip(g.top, g.width - g.inset, g.bottom, g.inset);
      },
      duration: 0.66,
      ...sweep,
      // the expand above owns the start: rendering this one's start at creation would undo it
      immediateRender: false,
    },
    1.07
  );

  // 3 · 99% of the fleet, Euro 5 · Euro 6, its ruler filling with the count — the frame column is
  //     clear of coal from about 1.43
  riseReading(seq, third, 1.42, 0.4);
  seq.fromTo(parts.marks[2], { opacity: MARK_IDLE }, { opacity: 1, duration: 0.1 }, landsAt(1.42, 0.4));

  // 4 · 1,2 litres saved per 100 km, counted in tenths
  seq.fromTo(frameDivider, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power2.inOut" }, 1.78);
  riseReading(seq, fourth, 1.82, 0.4);
  seq.fromTo(parts.marks[3], { opacity: MARK_IDLE }, { opacity: 1, duration: 0.1 }, landsAt(1.82, 0.4));

  // the band's line keeps pace with the scroll until the pin lets go
  seq.fromTo(parts.progress, { scaleX: 0.25 }, { scaleX: 1, duration: FLEET_LENGTH }, 0);
}
