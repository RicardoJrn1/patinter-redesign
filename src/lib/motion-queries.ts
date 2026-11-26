// The media conditions the scroll-driven sections choose their behaviour by (gsap.matchMedia). Each
// one pinned layout has a twin in globals.css (the [data-hero], [data-fleet] and [data-presence]
// blocks) that must stay the exact same condition, or the markup and the animation disagree about
// the layout.

/** Hero: pinned chapters with the photograph crossing the screen. */
export const DESKTOP = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";
/** Hero: only the opening is pinned; the chapters follow in normal flow. */
export const MOBILE = "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)";
/** Everywhere: no pin, no scrubbing, everything simply on the page. */
export const REDUCED = "(prefers-reduced-motion: reduce)";
/** Motion allowed, at any size (the plain reveals: news, footer). REDUCED's other half. */
export const MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Fleet: pinned. Also needs some height — on a short screen (a landscape tablet, a small laptop
 * window) the figures would be squeezed, so it falls back to the flow layout there.
 */
export const FLEET_PINNED = "(min-width: 64rem) and (min-height: 36rem) and (prefers-reduced-motion: no-preference)";
/** Fleet: flow layout, each block revealed as it scrolls in (narrow screens). */
export const FLEET_NARROW = "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)";
/** Fleet: flow layout on a wide but short screen (two columns, revealed as they scroll in). */
export const FLEET_SHORT = "(min-width: 64rem) and (max-height: 35.99rem) and (prefers-reduced-motion: no-preference)";

/** Presence (history and countries): pinned, on the same stage as the fleet. */
export const PRESENCE_PINNED = "(min-width: 64rem) and (min-height: 36rem) and (prefers-reduced-motion: no-preference)";
/** Presence: flow layout, the flags still piling up with the scroll (narrow screens with some height). */
export const PRESENCE_PILE = "(max-width: 63.99rem) and (min-height: 36rem) and (prefers-reduced-motion: no-preference)";
/**
 * Presence: any screen under 36rem tall — a phone on its side, a short window, a zoomed-in browser.
 * The pile, its caption and the header island cannot share the screen there, so there is no pile: the
 * four flags sit side by side, as with reduced motion, and the copy is simply revealed.
 */
export const PRESENCE_STILL = "(max-height: 35.99rem) and (prefers-reduced-motion: no-preference)";

/**
 * About page (/a-patinter), the 1999 — 2020 milestones: pinned, the scroll driving along a horizontal
 * road. The fleet's condition (wide and tall enough); everywhere else the vertical list
 * (FLEET_NARROW, FLEET_SHORT, REDUCED). Twin: the [data-timeline] block in globals.css.
 */
export const TIMELINE_PINNED = "(min-width: 64rem) and (min-height: 36rem) and (prefers-reduced-motion: no-preference)";
