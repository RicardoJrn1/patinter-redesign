// The presence section's flags (Presence.tsx owns the pin and the timelines; this only adds tweens, so
// everything plays in both directions with the scroll).
//
// One flag per country, in the official order — Portugal, Espanha, França, Alemanha: west to east, the
// way the road goes. Each flies in from the coal panel's right edge (the east) and lands, straight, on
// top of the pile; the ones under it step back, up and to the left (the way the road came), a little
// smaller and darker, so only their edges show and the top one is always the current one. Its name
// and its places come up under the pile as the previous ones leave.
//
// Pinned (desktop), the count beside the pile follows it: 01 with one flag down, 02 with two… Each
// value is the number of flags actually on the pile, rolling in like an odometer as a flag lands. Like
// the fleet's running figures it stays dimmed and wordless while on its way, and only on the official
// value — 04 — does it turn full strength and take its word, 'países'. In the flow layout (phones) the
// count sits above the pile, too far from it for both to be on screen as the flags land, so there it
// simply reads 04 países and the pile runs alone (no counter is passed).
import { COUNT_DIM } from "@/components/sections/fleet-acts";
import { MARK_IDLE } from "@/components/sections/hero-chapters";
import { gsap } from "@/lib/gsap";

/** The count: its whole figure (dimmed until it lands), its fixed '0', the strip of last digits, and
 *  'países', which only joins it on its official value. */
export type PresenceCounter = { count: HTMLElement; zero: HTMLElement; digits: HTMLElement; unit: HTMLElement };

export type PresenceParts = {
  /** the flags, bottom of the pile first (DOM order: each one paints over the ones before it) */
  flags: HTMLElement[];
  /** each flag's darkening layer */
  shades: HTMLElement[];
  /** each country's name (rises out of its mask) and its places */
  names: HTMLElement[];
  places: HTMLElement[];
  /** the count, when it follows the pile (pinned only) */
  counter: PresenceCounter | null;
  /** the band's marks, one per country (empty when the band is not shown) */
  marks: HTMLElement[];
};

/** Screens of scroll the pin holds: four flags, then a still hold. */
export const PRESENCE_LENGTH = 2;

/** When the first flag sets off, the gap between two flags, and how long each one flies. */
const FIRST = 0.06;
const GAP = 0.42;
const FLY = 0.34;
/** A flag is about 95% in (power3.out) seven tenths into its flight: that is when it has landed. */
const LANDS = 0.7;

/**
 * A flag `d` places down the pile: stepped back up and to the left by 4% of its width per place (the
 * flags are 3:2, so 6% of their height is the same distance), shrunk towards its top-left corner. In
 * % of the flag's own size, so the stair scales with it and needs no measuring. globals.css leaves
 * room for three places of it (12% of the width, above and to the left of the pile).
 */
const STEP = 4;
const SHRINK = 0.03;
export const pileDepth = (d: number) => ({ xPercent: -STEP * d, yPercent: -STEP * 1.5 * d, scale: 1 - SHRINK * d });
/** How dark a flag is `d` places down. */
const SHADE = [0, 0.32, 0.52, 0.66];

/** The digit strip ('1' to '4', bottom-aligned): the % it sits down from showing '4', for `n` flags down. */
const digitsAt = (n: number, total: number) => ((total - n) / total) * 100;

/** When the `k`th flag (from 0) lands, the pile starting at `at`. */
export const flagLandsAt = (k: number, at = FIRST) => at + k * GAP + FLY * LANDS;

/**
 * The four flags, from `at`. `entry` is the distance, in px, from where a flag rests to just past the
 * panel's right edge (read lazily, so a refresh measures the layout again).
 */
export function addPresenceActs(seq: gsap.core.Timeline, parts: PresenceParts, entry: () => number, at = FIRST) {
  const { flags, shades, names, places, counter, marks } = parts;
  const total = flags.length;

  flags.forEach((flag, k) => {
    const start = at + k * GAP;
    const land = flagLandsAt(k, at);

    // the flag flies in from beyond the panel's right edge, which hides it until it crosses
    seq.fromTo(flag, { x: entry }, { x: 0, duration: FLY, ease: "power3.out" }, start);

    // the ones under it make room as it comes: one place further down each (one tween per flag and
    // per landing, each from where the last one left it — never a stagger: on refresh a stagger
    // renders only its first targets back to their start)
    for (let j = 0; j < k; j++) {
      const from = k - 1 - j;
      const to = k - j;
      const step = { duration: FLY * 0.6, immediateRender: false };
      seq.fromTo(flags[j], pileDepth(from), { ...pileDepth(to), ...step, ease: "power2.inOut" }, start + FLY * 0.25);
      seq.fromTo(shades[j], { opacity: SHADE[from] }, { opacity: SHADE[to], ...step, ease: "none" }, start + FLY * 0.25);
    }

    // its name and places replace the last country's under the pile: the last caption stays until
    // this flag is most of the way over the pile, so each one is readable for about half the scroll
    // between two flags (on a phone that is the difference between a glimpse and a read)
    if (k > 0) {
      const leave = { immediateRender: false, ease: "power2.in" };
      seq.fromTo(names[k - 1], { yPercent: 0 }, { yPercent: -115, duration: FLY * 0.3, ...leave }, start + FLY * 0.4);
      seq.fromTo(places[k - 1], { autoAlpha: 1 }, { autoAlpha: 0, duration: FLY * 0.25, ...leave }, start + FLY * 0.4);
    }
    seq.fromTo(names[k], { yPercent: 115 }, { yPercent: 0, duration: FLY * 0.4, ease: "power3.out" }, start + FLY * 0.62);
    seq.fromTo(places[k], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: FLY * 0.35, ease: "power2.out" }, start + FLY * 0.7);

    // the count rolls to the number of flags now down, as this one lands: the first flag brings the
    // '0' up with the '1'; then only the last digit rolls
    if (counter) {
      const roll = { duration: FLY * 0.3, ease: "power2.inOut" };
      if (k === 0) seq.fromTo(counter.zero, { yPercent: 100 }, { yPercent: 0, ...roll }, land - roll.duration);
      seq.fromTo(
        counter.digits,
        { yPercent: digitsAt(k, total) },
        { yPercent: digitsAt(k + 1, total), ...roll, immediateRender: k === 0 },
        land - roll.duration
      );
    }

    // the band lights the country once its flag is down, and it stays lit
    if (marks[k]) seq.fromTo(marks[k], { opacity: MARK_IDLE }, { opacity: 1, duration: 0.08 }, land);
  });

  // on the official value the count turns full strength and takes its word
  if (counter) {
    const last = flagLandsAt(total - 1, at);
    seq.fromTo(counter.count, { opacity: COUNT_DIM }, { opacity: 1, duration: FLY * 0.15 }, last);
    seq.fromTo(counter.unit, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: FLY * 0.4, ease: "power2.out" }, last);
  }
}
