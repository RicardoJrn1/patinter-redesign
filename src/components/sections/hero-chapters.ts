// The hero's changes of chapter (desktop): what happens on screen as the scroll carries one chapter
// into the next. Hero.tsx owns the pin and the timeline; this only adds tweens to it, so everything
// here plays in both directions with the scroll.
//
// Each change is one stretch of scroll, in four movements that overlap:
//   1. the copy leaves: the title backs up into its line masks, label and text with it
//   2. the photograph crosses to the other side of the screen, the next one unfolding inside it
//   3. the next chapter's colour sweeps the whole stage behind the photograph, from the side the
//      photograph leaves and on the same curve — for a moment the screen is divided, light |
//      photograph | dark — so the background, the picture and the copy change as one
//   4. the next copy rises on the side the photograph has left; the indicator hands over
import { gsap } from "@/lib/gsap";
import type { Tone } from "@/lib/hero-stage";

export type Chapter = {
  copy: HTMLElement;
  label: HTMLElement;
  lines: HTMLElement[];
  text: HTMLElement;
  card: HTMLElement;
  photo: HTMLElement;
  /** the photograph's resting scale (its art direction) */
  zoom: number;
  tone: Tone;
  /** this chapter's colour of the stage, swept in as it arrives; none for the first (the stage itself) */
  layer: HTMLElement | null;
};

/** The photographs' corner radius: --island-radius in globals.css (clip-paths cannot read it). */
export const PHOTO_RADIUS = "1.5rem";
/** A photograph's mask, `top right bottom left` in %, with the photographs' rounded corners. */
export const photoMask = (inset: string) => `inset(${inset} round ${PHOTO_RADIUS})`;
export const PHOTO_OPEN = photoMask("0% 0% 0% 0%");
/**
 * A square clip, fully open. For a stage layer swept in (it is the whole background of the screen),
 * and for the photograph unfolding inside the travelling frame: there the seam between the two
 * pictures must stay one straight cut — a rounded window would notch it at the top and bottom — while
 * the frame's own rounded corners come from its border-radius.
 */
const SQUARE_OPEN = "inset(0% 0% 0% 0%)";
/** Indicator: how far the chapters that are not on screen recede. */
export const MARK_IDLE = 0.38;

/** The photograph's crossing; the colour sweeps on exactly this curve, so the two stay locked. */
export const CROSS = { at: 0.08, duration: 0.78, ease: "power2.inOut" } as const;

type Sweep = { tone: Tone; progress: { v: number }; fromRight: boolean; leftward: () => boolean };

export type Stage = {
  /** The colour of the stage at `x` (px from the hero's left edge), the hero being `width` px wide. */
  toneAt: (x: number, width: number) => Tone;
  /**
   * The edge a sweep is drawing across the stage right now, if one is (the changes of chapter never
   * overlap, so there is at most one): its `x` and the colour on each side of it.
   */
  edge: (width: number) => { x: number; left: Tone; right: Tone } | null;
  /** Reads the layout again (which way each sweep runs). For the trigger's onRefresh. */
  measure: () => void;
};

/**
 * Adds every change of chapter to `seq`, the first one at `start`, each `span` long (timeline units).
 * Returns the stage, for whatever must take its colour as the sweeps cross it (the indicator, the
 * header).
 */
export function addChapterChanges(
  seq: gsap.core.Timeline,
  chapters: Chapter[],
  marks: HTMLElement[],
  { start, span }: { start: number; span: number }
): Stage {
  const sweeps: Sweep[] = [];

  chapters.forEach((out, i) => {
    const inc = chapters[i + 1];
    if (!inc) return;
    // positions and durations as fractions of this change of chapter
    const t = (u: number) => start + i * span + u * span;
    const d = (u: number) => u * span;
    // offsetLeft is a layout value, unaffected by the x we animate. Both frames travel together, from
    // the outgoing spot to the incoming one, so the change reads as one photograph crossing the screen.
    const delta = () => inc.card.offsetLeft - out.card.offsetLeft;
    const leftward = () => delta() < 0;

    // 1 · the copy leaves. Far enough to take the descenders along: the masks leave room under each
    //     line for them (globals.css), so at -110% the tails of a «ç» or a «g» would stay behind.
    seq.fromTo(out.lines, { yPercent: 0 }, { yPercent: -135, duration: d(0.26), stagger: d(0.04), ease: "power2.in" }, t(0));
    seq.fromTo([out.label, out.text], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -14, duration: d(0.22), ease: "power2.in" }, t(0.02));
    seq.fromTo(out.copy, { autoAlpha: 1 }, { autoAlpha: 0, duration: d(0.01) }, t(0.3));

    // 2 · the photograph crosses to the other side…
    const cross = { duration: d(CROSS.duration), ease: CROSS.ease };
    seq.fromTo(out.card, { x: 0 }, { x: delta, ...cross }, t(CROSS.at));
    seq.fromTo(inc.card, { x: () => -delta() }, { x: 0, ...cross }, t(CROSS.at));
    //    …and the next one unfolds inside the moving frame from its leading edge, settling from a
    //    closer framing while the outgoing picture pushes in
    seq.fromTo(
      inc.card,
      { autoAlpha: 1, clipPath: () => (leftward() ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)") },
      { clipPath: SQUARE_OPEN, duration: d(0.62), ease: "power3.inOut" },
      t(0.14)
    );
    seq.fromTo(out.photo, { scale: out.zoom }, { scale: out.zoom * 1.08, duration: d(0.78), ease: "power1.in" }, t(0.08));
    seq.fromTo(
      inc.photo,
      { scale: inc.zoom * 1.16, xPercent: () => (leftward() ? 5 : -5) },
      { scale: inc.zoom, xPercent: 0, duration: d(0.86), ease: "power2.out" },
      t(0.14)
    );
    seq.fromTo(out.card, { autoAlpha: 1 }, { autoAlpha: 0, duration: d(0.02) }, t(0.8));

    // 3 · the next colour sweeps the whole stage, entering from the side the photograph leaves. It
    //     covers the full width in the time the photograph crosses less than half of it, so it runs
    //     ahead of it: in the body of the screen it stays hidden behind the moving picture (whatever
    //     the picture uncovers is already the new colour), and it is seen only above and below it,
    //     where the header and the indicator live. A clip-path percentage and the photograph's x are
    //     both linear in the eased progress, so with the same curve they cannot drift apart.
    if (inc.layer) {
      const sweep: Sweep = { tone: inc.tone, progress: { v: 0 }, fromRight: true, leftward };
      sweeps.push(sweep);
      seq.fromTo(
        inc.layer,
        { clipPath: () => (leftward() ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)") },
        { clipPath: SQUARE_OPEN, ...cross },
        t(CROSS.at)
      );
      // the same progress as a number, for toneAt
      seq.fromTo(sweep.progress, { v: 0 }, { v: 1, ...cross }, t(CROSS.at));
    }

    // 4 · the next copy rises on the side the photograph has left — on its own colour by then
    seq.fromTo(inc.copy, { autoAlpha: 0 }, { autoAlpha: 1, duration: d(0.01) }, t(0.62));
    seq.fromTo(inc.label, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: d(0.22), ease: "power2.out" }, t(0.64));
    seq.fromTo(inc.lines, { yPercent: 115 }, { yPercent: 0, duration: d(0.26), stagger: d(0.05), ease: "power3.out" }, t(0.66));
    seq.fromTo(inc.text, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: d(0.22), ease: "power2.out" }, t(0.74));

    //    the indicator hands over half-way through the change
    seq.fromTo(marks[i], { opacity: 1 }, { opacity: MARK_IDLE, duration: d(0.14) }, t(0.44));
    seq.fromTo(marks[i + 1], { opacity: MARK_IDLE }, { opacity: 1, duration: d(0.14) }, t(0.44));
  });

  const base = chapters[0]?.tone ?? "light";
  const toneAt: Stage["toneAt"] = (x, width) => {
    // the later sweeps lie on top of the earlier ones
    for (let k = sweeps.length - 1; k >= 0; k--) {
      const { progress, fromRight, tone } = sweeps[k];
      if (progress.v <= 0) continue;
      if (fromRight ? x >= width * (1 - progress.v) : x <= width * progress.v) return tone;
    }
    return base;
  };
  return {
    toneAt,
    edge(width) {
      const moving = sweeps.find(({ progress }) => progress.v > 0 && progress.v < 1);
      if (!moving) return null;
      const x = moving.fromRight ? width * (1 - moving.progress.v) : width * moving.progress.v;
      return { x, left: toneAt(x - 1, width), right: toneAt(x + 1, width) };
    },
    measure() {
      sweeps.forEach((sweep) => (sweep.fromRight = sweep.leftward()));
    },
  };
}
