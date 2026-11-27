"use client";

// Cinematic opening: a black screen with the Patinter mark, which scrolling turns into the site. The
// hero adds its own content to the same timeline, so it is all one scrub, in both directions.
//
// Three openings are wired, chosen by INTRO_MODE:
// - "morph": the symbol comes apart into its 15 stripes, which re-form as the full logo (symbol and
//   name) smaller in the centre; the finished logo then glides into the header, lifting the black
//   away behind it, and hands over to the header's own logo. The effect is the one tuned at
//   /prototipos/morphing (src/lib/logo-morph); here the scroll moves its progress.
// - "disintegrate": the symbol alone comes apart into particles that drift away to the sides, while
//   the black gives way to the off-white page and the header fades in (/prototipos/desintegracao).
// - "flight": the full logo shrinks and travels from the centre into its place in the header, the black
//   lifts away from the top, and the header fades in around the landing logo.
//
// This file owns the markup and the act-0 tweens; Hero.tsx owns the pin and the timeline. With
// reduced motion (or no JS) the opening is not shown at all: globals.css keeps [data-intro] at
// display:none and the page starts directly on the content.
import { ChevronDown } from "lucide-react";
import { type CSSProperties, type RefObject, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { DisintegrationCanvas, type DisintegrationHandle } from "@/components/prototypes/disintegration/DisintegrationCanvas";
import { LogoMorph, type LogoMorphHandle, type StageBox } from "@/components/prototypes/logo-morph/LogoMorph";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { announceHeroOpening } from "@/lib/hero-opening";
import { MORPH_MARKS } from "@/lib/logo-morph/timeline";

/** Which opening plays. Switching is this one line; all three stay wired. */
export const INTRO_MODE = "morph" as "morph" | "disintegrate" | "flight";

/**
 * Height of the opening logo (flight). The official artwork is a 230 × 85 raster, so this stays close
 * to its native size to keep it sharp. With a larger (or vector) logo file, raise it here — the flight
 * into the header measures both ends, so nothing else changes.
 */
export const INTRO_LOGO_HEIGHT = 88;
/** Timeline time at which the logo has landed in the header (flight). */
const LOGO_LANDED = 0.63;

/**
 * Morph: the opening has more to tell (separate, re-form, the name, the glide to the header), so the
 * page's own entrance waits this much longer than in the other openings, and act 0 grows by as much.
 * Hero.tsx adds it to every act-0 position of its content.
 */
export const PAGE_DELAY = INTRO_MODE === "morph" ? 0.62 : 0;
/** Screens of scroll the opening takes (act 0 of the hero timeline). */
export const INTRO_ACT = 1 + PAGE_DELAY;

/** Morph: timeline time over which the whole morph plays (one screen of scroll is 1). */
const MORPH_SPAN = 1.25;
/** Morph: when the finished logo starts gliding to the header, and when it lands there. */
const MORPH_DOCK = MORPH_SPAN * MORPH_MARKS.dock;
const MORPH_LANDED = MORPH_SPAN * MORPH_MARKS.landed;

/** Disintegrate: particles in the symbol (fewer than the lab's default — this one redraws on every scroll frame). */
const INTRO_PARTICLES = 11000;
/** Disintegrate: timeline time by which the last fragment has gone (still flying as the page opens). */
const DISSOLVED = 0.7;

/**
 * Disintegrate: the black opens from the centre — where the symbol was — as a soft-edged iris that
 * grows outwards behind the departing fragments. (A plain cross-fade from black to the off-white page
 * passes through a flat, muddy grey over the whole screen; the iris never does.) --iris is the radius
 * of the clear centre: below minus the feather it is fully black, and 75vmax clears even the corners
 * of a wide screen. A narrow feather reads as an opening; a wide one turns into a glowing orb.
 */
const IRIS_CLOSED = "-11vmax";
const IRIS_OPEN = "75vmax";
const IRIS_MASK = "radial-gradient(circle at 50% 50%, transparent var(--iris), #000 calc(var(--iris) + 9vmax))";
const IRIS_STYLE = {
  "--iris": IRIS_CLOSED,
  maskImage: IRIS_MASK,
  WebkitMaskImage: IRIS_MASK,
} as CSSProperties;

/**
 * Where an element sits from its layout boxes alone (offsetLeft/offsetTop up the offsetParent chain,
 * stopping at `until`). Transforms never count, so the values stay right while GSAP is moving things.
 */
function layoutOffset(el: HTMLElement, until?: HTMLElement | null) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== until) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    // offsets start inside the parent's border; add it back (the header card has a 1px one)
    if (parent && parent !== until) {
      x += parent.clientLeft;
      y += parent.clientTop;
    }
    node = parent;
  }
  return { x, y };
}

/**
 * The header's logo, in viewport coordinates, as it sits in the FLAT header — the opening keeps the
 * header flat until its logo has landed (see tellHeader). Measured while the header is the floating
 * island, the logo sits 0.75rem lower (pt-3 in Header.tsx): that is taken out. Layout boxes only: the
 * header is mid-entrance whenever this runs, and transforms would skew the numbers.
 */
function headerLogoBox(): StageBox | null {
  const img = document.querySelector<HTMLElement>("[data-header-logo] img");
  if (!img) return null;
  const at = layoutOffset(img);
  if (document.querySelector("header")?.hasAttribute("data-solid")) {
    at.y -= parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.75;
  }
  return { left: at.x, top: at.y, height: img.offsetHeight };
}

/** How long the opening waits, still on its first frame, before it hints that the page scrolls. */
const HINT_AFTER = 4000;
/** Scrolled less than this (px), the page is still on the opening's first frame. */
const AT_TOP = 4;

/**
 * For a visitor who stays on the black screen without scrolling (the client's choice: a small arrow,
 * no words, after 4 seconds): a thin chevron at the bottom of the screen, bobbing gently. It fades in
 * only while the page is still at its very top and the opening is on (data-intro-ready, which reduced
 * motion never sets), and fades out as soon as the page moves; back at the top and still again, it
 * returns. Decorative, like the whole opening: the skip button is the keyboard's way on.
 */
function IdleHint() {
  const [shown, setShown] = useState(false);
  const arrow = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let timer = 0;
    const atStart = () => window.scrollY < AT_TOP && document.documentElement.hasAttribute("data-intro-ready");
    const wait = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setShown(atStart()), HINT_AFTER);
    };
    const onScroll = () => {
      setShown(false);
      if (window.scrollY < AT_TOP) wait();
      else window.clearTimeout(timer);
    };
    wait();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // the bob: down a few pixels and back, on a slow sine (it keeps going while the arrow fades out)
  useGSAP(() => {
    if (!arrow.current || prefersReducedMotion()) return;
    gsap.fromTo(arrow.current, { y: 0 }, { y: 7, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
  });

  return (
    <div
      data-intro-hint
      className={`absolute inset-x-0 bottom-[calc(1.75rem+env(safe-area-inset-bottom))] flex justify-center transition-opacity ease-out ${
        shown ? "opacity-100 duration-1000" : "opacity-0 duration-300"
      }`}
    >
      <span ref={arrow} className="block text-chalk/70">
        <ChevronDown strokeWidth={1.5} className="size-7" />
      </span>
    </div>
  );
}

/** Decorative: the page's h1 lives in the hero as screen-reader text. */
export function IntroLogo({
  symbol,
  morph,
}: {
  symbol?: RefObject<DisintegrationHandle | null>;
  morph?: RefObject<LogoMorphHandle | null>;
}) {
  return (
    <div data-intro aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-svh">
      {/* the black screen; it gives way to the page underneath. As tall as the LARGEST viewport (lvh),
          not the box (svh): on phones the first swipe hides the browser's toolbars and the screen
          grows taller, and a curtain of the small height would let the page show under it while the
          logo is still on its way. The box, and so the logo's place, stays the small height;
          min-h-full keeps the curtain whole where lvh is not understood. */}
      <div
        data-intro-curtain
        className="absolute inset-x-0 top-0 h-lvh min-h-full bg-ink"
        style={INTRO_MODE === "disintegrate" ? IRIS_STYLE : undefined}
      />

      {INTRO_MODE === "morph" ? (
        // outer: hands over to the header's logo on landing · inner: the entrance when the page loads.
        // The stage sits above the curtain, so the logo stays seen as the black lifts away under it.
        // The stage's coordinates are the viewport's while the hero is pinned (it is the hero's top-left
        // corner), so the header's box is passed as it is.
        <div data-intro-morph className="absolute inset-0">
          <div data-intro-symbol data-reveal className="absolute inset-0">
            <LogoMorph ref={morph} end={headerLogoBox} distance={1} intensity={1} />
          </div>
        </div>
      ) : INTRO_MODE === "disintegrate" ? (
        // the canvas sits above the curtain, so the last fragments are still seen over the page
        <div data-intro-symbol data-reveal className="absolute inset-0">
          <DisintegrationCanvas ref={symbol} particles={INTRO_PARTICLES} intensity={1} maxHeight={300} centerY={0.5} />
        </div>
      ) : (
        <div className="relative flex h-full items-center justify-center">
          {/* outer: flies into the header with the scroll · inner: the entrance when the page loads */}
          <span data-intro-logo className="block will-change-transform">
            <span data-intro-logo-art data-reveal className="block">
              <Logo height={INTRO_LOGO_HEIGHT} decorative preload className="block" />
            </span>
          </span>
        </div>
      )}

      {/* above the black and the logo: the hint for a visitor who has not scrolled yet */}
      <IdleHint />
    </div>
  );
}

/**
 * Wires the opening into the hero's timeline. `scope` is the hero section (the pinned element);
 * `symbol` is the disintegrating canvas, `morph` the morphing logo (each only in its own mode).
 */
export function createIntro(
  scope: HTMLElement,
  {
    symbol,
    morph,
  }: { symbol?: RefObject<DisintegrationHandle | null>; morph?: RefObject<LogoMorphHandle | null> } = {}
) {
  const curtain = scope.querySelector<HTMLElement>("[data-intro-curtain]");
  const symbolBox = scope.querySelector<HTMLElement>("[data-intro-symbol]");
  const morphBox = scope.querySelector<HTMLElement>("[data-intro-morph]");
  const logoDock = scope.querySelector<HTMLElement>("[data-intro-logo]");
  const logoArt = scope.querySelector<HTMLElement>("[data-intro-logo-art]");
  const header = document.querySelector<HTMLElement>("header");
  const headerLogo = document.querySelector<HTMLElement>("[data-header-logo]");

  // Flight: the big logo onto the small one in the header. Both ends from layout boxes (see
  // headerLogoBox); while the hero is pinned it sits at the top of the viewport, so its coordinates
  // are viewport coordinates.
  const dock = () => {
    if (!logoDock) return { x: 0, y: 0, scale: 1 };
    const from = layoutOffset(logoDock, scope);
    const to = headerLogoBox();
    if (!to) return { x: -from.x, y: -from.y - logoDock.offsetHeight, scale: 0.35 };
    return { x: to.left - from.x, y: to.top - from.y, scale: to.height / logoDock.offsetHeight };
  };

  // Flight and morph: the header keeps flat (no frosted glass) while the logo comes in, so it never
  // slides under the blur; it turns into the floating island once the logo has landed. Reads the
  // duration through the trigger, not the timeline variable: a trigger created after load refreshes
  // inside the timeline's constructor, before that variable is assigned. (Disintegrate: nothing lands
  // in the header, so it behaves as on any other scroll.)
  const landed = INTRO_MODE === "flight" ? LOGO_LANDED : INTRO_MODE === "morph" ? MORPH_LANDED : null;
  let opening: boolean | null = null;
  const tellHeader = (self: ScrollTrigger) => {
    if (landed === null) return;
    const length = self.animation?.duration() ?? 0;
    const now = self.progress > 0 && self.progress * length < landed;
    if (now === opening) return;
    opening = now;
    announceHeroOpening(now);
  };

  return {
    tellHeader,

    /** For the trigger's onRefresh: the layout may have moved (fonts, resize), so measure again. */
    refresh(self: ScrollTrigger) {
      morph?.current?.measure();
      tellHeader(self);
    },

    /** Act 0, from timeline time 0 to INTRO_ACT. The hero lays its own content over the same span. */
    addTo(seq: gsap.core.Timeline) {
      if (!curtain) return;

      if (INTRO_MODE === "morph") {
        // 1–5: the whole morph — separation, re-forming, the name, the glide into the header — is one
        // timeline (src/lib/logo-morph), moved by the scroll like any other progress
        const state = { progress: 0 };
        seq.fromTo(
          state,
          { progress: 0 },
          { progress: 1, duration: MORPH_SPAN, ease: "none", onUpdate: () => morph?.current?.setProgress(state.progress) },
          0
        );
        // 6: as the finished logo rises to the header, the black rises with it — its edge always a
        // little below the logo, passing it just before it lands, so the logo arrives on the page
        seq.fromTo(
          curtain,
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 100% 0%)", duration: MORPH_LANDED - MORPH_DOCK + 0.02, ease: "power2.inOut" },
          MORPH_DOCK - 0.02
        );
        // 7: the header comes in around the landing logo…
        if (header) seq.fromTo(header, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: "power1.out" }, MORPH_LANDED - 0.14);
        // 8: …and the header's own logo takes over: same artwork, same size, same place
        if (morphBox) seq.fromTo(morphBox, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.02 }, MORPH_LANDED);
        if (headerLogo) seq.fromTo(headerLogo, { opacity: 0 }, { opacity: 1, duration: 0.02 }, MORPH_LANDED);
        return;
      }

      if (INTRO_MODE === "disintegrate") {
        // 1–2: the symbol frays from its extremities and drifts apart to the sides. The whole effect is
        // one number from 0 to 1, so scrubbing it backwards puts every fragment back where it was.
        const state = { progress: 0 };
        seq.fromTo(
          state,
          { progress: 0 },
          { progress: 1, duration: DISSOLVED, ease: "none", onUpdate: () => symbol?.current?.setProgress(state.progress) },
          0
        );
        // 3: as the core of the symbol comes apart, the black opens from the centre outwards — slowly
        // at first, then sweeping to the edges behind the fragments that are still flying out
        seq.fromTo(curtain, { "--iris": IRIS_CLOSED }, { "--iris": IRIS_OPEN, duration: 0.34, ease: "power2.in" }, 0.26);
        // 4: the header comes in once the page is uncovered (its own logo with it)
        if (header) seq.fromTo(header, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: "power1.out" }, 0.58);
        return;
      }

      if (!logoDock) return;
      gsap.set(logoDock, { transformOrigin: "0 0" });
      // 1–2: the logo shrinks and travels to the top-left, keeping its proportions (one scale)
      seq.fromTo(
        logoDock,
        { x: 0, y: 0, scale: 1 },
        { x: () => dock().x, y: () => dock().y, scale: () => dock().scale, duration: 0.6, ease: "power3.inOut" },
        0
      );
      // 3: the black lifts away from the top, uncovering the off-white page under it
      seq.fromTo(
        curtain,
        { clipPath: "inset(0% 0% 0% 0%)" },
        { clipPath: "inset(100% 0% 0% 0%)", duration: 0.46, ease: "power2.inOut" },
        0.12
      );
      // 4: the header comes in progressively (Menu and the hairline; its logo waits for the landing)
      if (header) seq.fromTo(header, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power1.out" }, 0.32);
      // 5: same artwork at the same size and place — the hand-over to the header is invisible
      seq.fromTo(logoDock, { autoAlpha: 1 }, { autoAlpha: 0, duration: LOGO_LANDED - 0.6 }, 0.6);
      if (headerLogo) seq.fromTo(headerLogo, { opacity: 0 }, { opacity: 1, duration: LOGO_LANDED - 0.6 }, 0.6);
    },

    /** The frame before the first scroll. Call after the whole timeline is built (see Hero.tsx). */
    setStart() {
      if (header) gsap.set(header, { autoAlpha: 0 });
      if (INTRO_MODE !== "disintegrate" && headerLogo) gsap.set(headerLogo, { opacity: 0 });
    },

    /** Load-time entrance: opacity and a touch of scale, only at the very top of the page. */
    playEntrance() {
      const art = INTRO_MODE === "flight" ? logoArt : symbolBox;
      if (!art) return;
      if (window.scrollY > 4) {
        gsap.set(art, { autoAlpha: 1, scale: 1 });
        return;
      }
      // explicit end values: Strict Mode re-runs effects in development and a plain from() would
      // capture the half-animated state as its destination
      gsap.fromTo(
        art,
        { autoAlpha: 0, scale: INTRO_MODE === "flight" ? 0.92 : 0.96 },
        { autoAlpha: 1, scale: 1, duration: 1.8, delay: 0.2, ease: "expo.out" }
      );
    },

    revert() {
      gsap.set([logoDock, curtain, logoArt, symbolBox, morphBox].filter(Boolean), {
        clearProps: "transform,opacity,visibility,clipPath",
      });
      if (header) gsap.set(header, { clearProps: "opacity,visibility" });
      if (headerLogo) gsap.set(headerLogo, { clearProps: "opacity" });
      symbol?.current?.setProgress(0);
      morph?.current?.setProgress(0);
      announceHeroOpening(false);
    },
  };
}
