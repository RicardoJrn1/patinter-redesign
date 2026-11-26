// The hero's opening act (the big logo flying into the header) tells the header to stay flat and
// transparent until the logo has landed: the frosted island would otherwise blur the logo as it
// slides under the glass. The hero dispatches this on window; the header listens.
export const HERO_OPENING_EVENT = "patinter:hero-opening";

/** `detail`: true while the opening act is under way (scrolled, but the logo has not landed yet). */
export type HeroOpeningEvent = CustomEvent<boolean>;

export function announceHeroOpening(opening: boolean) {
  window.dispatchEvent(new CustomEvent(HERO_OPENING_EVENT, { detail: opening }));
}
