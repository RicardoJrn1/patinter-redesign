// The choreography in time: one GSAP timeline holding a tween per component. Each tween moves a
// plain 0–1 value (a stripe's separation, its travel, a letter's reveal); choreography.ts turns those
// values into positions, and the stage draws them.
//
// Nothing here knows about the DOM, so the timeline can be played (the prototype), scrubbed by a
// ScrollTrigger (the site intro: `scrollTrigger: { animation: timeline, scrub: true }`), or stepped in
// tests — and it runs backwards for free, because every frame is a function of the playhead.
import { gsap } from "@/lib/gsap";
import { LETTER_COUNT, STRIPE_COUNT } from "./choreography";

export type MorphValues = {
  split: { v: number }[];
  travel: { v: number }[];
  reveal: { v: number }[];
  /** The finished logo gliding to its destination, as one piece. */
  dock: { v: number };
};

/**
 * Timing, in seconds at 1×. The stripes leave one after the other from the top (the head of the comet
 * leads), the first ones landing while the last are still in the air; the name starts to come out as
 * the symbol closes up. Once the name is out, the finished logo glides to its destination as one piece:
 * the parts have done their moving, and any stagger here would pull the letters apart in flight.
 */
const TIMING = {
  hold: 0.35,
  split: { duration: 1.1, stagger: 0.02, ease: "power2.inOut" },
  travel: { at: 1.25, duration: 1.45, stagger: 0.045, ease: "power3.inOut" },
  reveal: { at: 2.6, duration: 1.15, stagger: 0.03, ease: "expo.out" },
  dock: { at: 4.05, duration: 1.25, ease: "power3.inOut" },
  rest: 0.25,
} as const;

/**
 * Where the dock starts and where the logo lands, as fractions of the whole timeline — for an owner
 * that maps the morph onto something else (the site intro maps it onto the scroll). The dock is the
 * last thing that moves, so it ends the timeline but for the closing rest.
 */
const TOTAL = TIMING.dock.at + TIMING.dock.duration + TIMING.rest;
export const MORPH_MARKS = {
  dock: TIMING.dock.at / TOTAL,
  landed: (TIMING.dock.at + TIMING.dock.duration) / TOTAL,
} as const;

export function createMorphTimeline(onUpdate: (values: MorphValues) => void) {
  const values: MorphValues = {
    split: Array.from({ length: STRIPE_COUNT }, () => ({ v: 0 })),
    travel: Array.from({ length: STRIPE_COUNT }, () => ({ v: 0 })),
    reveal: Array.from({ length: LETTER_COUNT }, () => ({ v: 0 })),
    dock: { v: 0 },
  };

  const timeline = gsap.timeline({ paused: true, onUpdate: () => onUpdate(values) });
  const { hold, split, travel, reveal, dock } = TIMING;

  values.split.forEach((target, i) => {
    timeline.fromTo(target, { v: 0 }, { v: 1, duration: split.duration, ease: split.ease }, hold + i * split.stagger);
  });
  values.travel.forEach((target, i) => {
    timeline.fromTo(target, { v: 0 }, { v: 1, duration: travel.duration, ease: travel.ease }, travel.at + i * travel.stagger);
  });
  // the last letter leads: the name comes out like a train from a tunnel, front first
  values.reveal.forEach((target, j) => {
    const order = LETTER_COUNT - 1 - j;
    timeline.fromTo(target, { v: 0 }, { v: 1, duration: reveal.duration, ease: reveal.ease }, reveal.at + order * reveal.stagger);
  });
  timeline.fromTo(values.dock, { v: 0 }, { v: 1, duration: dock.duration, ease: dock.ease }, dock.at);
  // a beat on the finished logo before the timeline reports complete
  timeline.to({}, { duration: TIMING.rest });

  return { timeline, values };
}
