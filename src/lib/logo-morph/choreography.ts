// Where every component of the logo is at any moment of the morph. Pure geometry: no DOM, no GSAP.
//
// The timeline (timeline.ts) decides *when* each part moves and with which ease, as a progress from
// 0 to 1 per part; this file turns those progresses into positions. Three compositions:
//
//   start — the symbol alone, large, centred
//   form  — the full logo (symbol + name), smaller, centred: where the parts come back together
//   end   — the full logo at its final size and place (the header's logo slot)
//
// A stripe goes  start ──split──▶ stack opened up ──travel (curved)──▶ its place in `form`, and the
// name slides out from behind the re-formed symbol. Then the finished logo docks: form ──dock──▶ end.
// The re-forming happens at a size where it can be seen; the header logo is only 30 px high.
//
// Positions are "placements" of the whole logo frame (its top-left corner on screen and a scale, in
// screen px per logo px), so the same maths works at any viewport and for any destination.
import { LOGO } from "./logo-paths";

export type Placement = { x: number; y: number; scale: number };
/** The three compositions (see above). With no separate destination, `end` is `form`. */
export type MorphLayout = { start: Placement; form: Placement; end: Placement };
export type MorphParams = {
  /** How far apart the components move while separating (0 keeps them together). */
  distance: number;
  /** How much the movements curve and vary from one component to the next (0 is straight and uniform). */
  intensity: number;
};
/** A component's transform: screen = (x, y) + logo px × scale. */
export type Transform = { x: number; y: number; scale: number };

export const STRIPE_COUNT = LOGO.stripes.length;
export const LETTER_COUNT = LOGO.letters.length;
/** The name is hidden left of this line (the P's left edge) while it slides out from behind the symbol. */
export const NAME_EDGE = LOGO.letters[0].box[0];
const NAME_END = LOGO.letters[LETTER_COUNT - 1].box[2];

const SYMBOL_CX = LOGO.symbolWidth / 2;
const SYMBOL_CY = LOGO.height / 2;

/** Deterministic 0–1 noise per index: the variations are designed once, not rolled on every play. */
function noise(i: number) {
  let t = Math.imul(i + 1, 0x9e3779b9);
  t = Math.imul(t ^ (t >>> 16), 0x85ebca6b);
  t = Math.imul(t ^ (t >>> 13), 0xc2b2ae35);
  return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
}

const stripes = LOGO.stripes.map((s, i) => ({
  cx: (s.box[0] + s.box[2]) / 2,
  cy: (s.box[1] + s.box[3]) / 2,
  /** 0 for the top stripe, 1 for the bottom one. */
  k: i / (STRIPE_COUNT - 1),
  jitter: noise(i) * 2 - 1,
}));
const MEAN_CX = stripes.reduce((sum, s) => sum + s.cx, 0) / STRIPE_COUNT;

/** The symbol centred in a `width × height` viewport, at most `maxHeight` px tall. */
export function centredSymbol(width: number, height: number, maxHeight = 300): Placement {
  const h = Math.min(maxHeight, height * 0.42, width * 0.5 * (LOGO.height / LOGO.symbolWidth));
  const scale = h / LOGO.height;
  return { x: width / 2 - SYMBOL_CX * scale, y: height / 2 - SYMBOL_CY * scale, scale };
}

/** The full logo centred where the symbol was, smaller than the symbol alone was. */
export function formedLogo(width: number, height: number, start: Placement): Placement {
  const scale = Math.min(start.scale * 0.45, (width * 0.8) / LOGO.width);
  return { x: width / 2 - (LOGO.width / 2) * scale, y: height / 2 - SYMBOL_CY * scale, scale };
}

/** The full logo filling a box (e.g. the header's logo slot), by its height. */
export function logoInBox(box: { left: number; top: number; height: number }): Placement {
  return { x: box.left, y: box.top, scale: box.height / LOGO.height };
}

/**
 * The finished logo on its way from `form` to `end` (dock 0–1): its centre moves in a straight line
 * while its size changes geometrically, so the move reads as one even glide and zoom.
 */
function docked({ form, end }: MorphLayout, dock: number, out: Placement): Placement {
  const scale = form.scale * Math.pow(end.scale / form.scale, dock);
  const cx = form.x + (LOGO.width / 2) * form.scale;
  const cy = form.y + (LOGO.height / 2) * form.scale;
  const ex = end.x + (LOGO.width / 2) * end.scale;
  const ey = end.y + (LOGO.height / 2) * end.scale;
  out.x = cx + (ex - cx) * dock - (LOGO.width / 2) * scale;
  out.y = cy + (ey - cy) * dock - (LOGO.height / 2) * scale;
  out.scale = scale;
  return out;
}
const place: Placement = { x: 0, y: 0, scale: 1 };

/**
 * Stripe `i` at separation `split`, travel `travel` and dock `dock` (each 0–1, already eased by the
 * timeline). Writes into `out`, so a frame allocates nothing.
 */
export function stripeTransform(
  i: number,
  split: number,
  travel: number,
  dock: number,
  layout: MorphLayout,
  { distance, intensity }: MorphParams,
  out: Transform
): Transform {
  const s = stripes[i];
  const { start } = layout;
  // where this stripe is heading: its place in the re-formed logo (which may itself be docking)
  const end = docked(layout, dock, place);

  // 1 · Separation, in logo px at the starting size. The gaps between the stripes open up, and each
  // stripe slides along its own length — they are speed lines, so that is the axis they move on. The
  // whole stack is drawn back to the right (an anticipation of the flight to the left), more at the
  // waist than at the ends, and the arc relaxes a little so the stack reads as separate parts.
  const openY = (s.cy - SYMBOL_CY) * 0.42 * distance;
  const slideX =
    distance *
    ((MEAN_CX - s.cx) * 0.3 + intensity * (8 + 9 * Math.sin(s.k * Math.PI) + 4 * Math.sin(s.k * Math.PI * 3) + 3 * s.jitter));
  const bx = start.x + (s.cx + slideX * split) * start.scale;
  const by = start.y + (s.cy + openY * split) * start.scale;

  // 2 · Travel to its place in the re-formed logo, along a curve. The top stripes bow out more than
  // the bottom ones, so the stack fans out in flight and closes up as it lands.
  const ex = end.x + s.cx * end.scale;
  const ey = end.y + s.cy * end.scale;
  const bulge = intensity * (0.15 + 0.07 * (0.5 - s.k) + 0.025 * s.jitter);
  // control point: off the straight line, to its left as seen from the start (up and over, for a
  // destination up and to the left)
  const qx = (bx + ex) / 2 - (ey - by) * bulge;
  const qy = (by + ey) / 2 + (ex - bx) * bulge;
  const u = travel;
  const a = (1 - u) * (1 - u);
  const b = 2 * u * (1 - u);
  const c = u * u;
  const px = a * bx + b * qx + c * ex;
  const py = a * by + b * qy + c * ey;
  // size changes geometrically: equal steps of travel read as equal steps of zoom
  const scale = start.scale * Math.pow(end.scale / start.scale, u);

  out.x = px - s.cx * scale;
  out.y = py - s.cy * scale;
  out.scale = scale;
  return out;
}

/**
 * Letter `j` at reveal `reveal` (0–1, eased). The name sits at its final size and place; the letters
 * slide out to the right from behind the symbol, so they are only ever seen right of NAME_EDGE (the
 * stage clips them there). They travel the same distance, the last letter leading, so the gaps open
 * a little on the way and close as they arrive: the letters never cross each other.
 */
export function letterTransform(reveal: number, dock: number, layout: MorphLayout, out: Transform): Transform {
  const at = docked(layout, dock, place);
  const shift = (NAME_END - NAME_EDGE) * (1 - reveal);
  out.x = at.x - shift * at.scale;
  out.y = at.y;
  out.scale = at.scale;
  return out;
}

/** Screen x of the line the name comes out from, while the logo is at dock `dock`. */
export function nameEdge(dock: number, layout: MorphLayout) {
  const at = docked(layout, dock, place);
  return at.x + NAME_EDGE * at.scale;
}
