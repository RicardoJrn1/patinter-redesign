// While the hero is pinned, the header's island takes the colours of the stage under it (Hero.tsx).
// Between chapters the next colour sweeps across the stage, and the island is wiped by the same edge:
// light on one side of it, dark on the other. The hero announces the colours on each side (this
// event, which only fires when they change) and moves the edge itself every frame through the CSS
// variable --hero-split (px from the left of the screen) on <html>. Once the pin lets go everything
// goes back to light. The hero dispatches this on window; the header listens.
export const HERO_STAGE_EVENT = "patinter:hero-stage";

export type Tone = "light" | "dark";

/**
 * `pinned`: the hero holds the screen · `left` / `right`: the stage's colour on each side of the
 * sweeping edge (the same when no sweep is under way, and --hero-split is then meaningless) ·
 * `controls`: the colour under the header's controls (the menu trigger), for its text.
 */
export type HeroStage = { pinned: boolean; left: Tone; right: Tone; controls: Tone };

export type HeroStageEvent = CustomEvent<HeroStage>;

/** The CSS variable carrying the sweeping edge, in px from the left of the screen. */
export const HERO_SPLIT_VAR = "--hero-split";

/** No hero holding the screen (the server's value, and the page's before the hero sets up). */
export const RESTING_STAGE: HeroStage = { pinned: false, left: "light", right: "light", controls: "light" };
let last: HeroStage = RESTING_STAGE;

export function announceHeroStage(stage: HeroStage) {
  last = stage;
  window.dispatchEvent(new CustomEvent(HERO_STAGE_EVENT, { detail: stage }));
}

/**
 * For useSyncExternalStore: the stage as last announced, and a subscription to its changes. The hero
 * sets its stage up in a layout effect, before any listener the header could add in a passive one, so
 * the header reads the current value instead of waiting for the next change.
 */
export function currentHeroStage(): HeroStage {
  return last;
}

export function subscribeHeroStage(onChange: () => void) {
  window.addEventListener(HERO_STAGE_EVENT, onChange);
  return () => window.removeEventListener(HERO_STAGE_EVENT, onChange);
}
