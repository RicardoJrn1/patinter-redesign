"use client";

// Hero: a cinematic opening (IntroLogo — the Patinter logo on black, which scrolling turns into the
// page), then the services as three chapters — Transporte, Logística, Distribuição — on a stage that
// goes light, dark, light.
//
// The section pins and one scrubbed timeline plays everything, in both directions:
//   act 0       the opening (IntroLogo; nothing in it is changed here), then chapter 1 rises in
//               place — its photograph opening through a mask, its title out of line masks
//   chapters    (desktop) each change of chapter is one stretch of scroll: the photograph crosses
//               the screen while the next chapter's colour sweeps the stage behind it, the copy
//               changes sides (hero-chapters.ts). The indicator, the signature and the header take
//               the colour of whatever part of the stage lies under them.
//   end hold    a short beat on the last chapter, then the pin lets go and the page scrolls on
// On narrow screens only act 0 is pinned; the chapters then follow in normal flow, the dark one as a
// dark band, each revealed as it scrolls in (vertical movement only). With reduced motion there is no
// opening and no pin: the page starts on the content, every chapter simply on the page (as split
// bands on wide screens).
//
// Content lives in content/site.ts, art direction (photograph, framing, colour) in `chapterArt`
// below, the changes of chapter in hero-chapters.ts.
//
// DESKTOP (lib/motion-queries.ts), the `motion-safe:lg:` variants here (the pinned stage: `lg:` alone
// is the split composition, pinned or not), and the [data-hero] block in globals.css are all the same
// condition. Change one and you must change all three. The stage grid (--frame-top, --frame-col,
// --stage-band, --title) lives in globals.css, shared with the fleet section that follows.
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import photoDistribuicao from "@/assets/images/hero-distribuicao-operador.webp";
import photoTransporte from "@/assets/images/hero-frota-anoitecer.webp";
import photoLogistica from "@/assets/images/hero-logistica-armazem.webp";
import { useLenis } from "@/components/motion/SmoothScroll";
import type { DisintegrationHandle } from "@/components/prototypes/disintegration/DisintegrationCanvas";
import type { LogoMorphHandle } from "@/components/prototypes/logo-morph/LogoMorph";
import { addChapterChanges, MARK_IDLE, PHOTO_OPEN, photoMask, type Chapter, type Stage } from "@/components/sections/hero-chapters";
import { createIntro, INTRO_ACT, IntroLogo, PAGE_DELAY } from "@/components/sections/IntroLogo";
import { siteCopy } from "@/content/locales/site";
import type { HeroSlideId } from "@/content/site";
import { ui } from "@/content/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";
import { DESKTOP, MOBILE, REDUCED } from "@/lib/motion-queries";
import { announceHeroStage, HERO_SPLIT_VAR, RESTING_STAGE, type HeroStage, type Tone } from "@/lib/hero-stage";

/**
 * Art direction of a chapter: its photograph, which part of it the frame shows and how close, the
 * colour of the stage, and its small accent (the logo's red and yellow, never as large areas).
 */
type ChapterArt = {
  photo: StaticImageData;
  position: string;
  zoom: number;
  origin: string;
  tone: Tone;
  accent: "signal" | "comet" | "both";
};

/**
 * The photographs are the ones patinter.com's home slideshow pairs with each service.
 * TODO: re-frame here when the definitive per-service photographs arrive.
 */
const chapterArt: Record<HeroSlideId, ChapterArt> = {
  transporte: { photo: photoTransporte, position: "64% 50%", zoom: 1.06, origin: "58% 78%", tone: "light", accent: "signal" },
  logistica: { photo: photoLogistica, position: "47% 50%", zoom: 1.04, origin: "48% 40%", tone: "dark", accent: "comet" },
  distribuicao: { photo: photoDistribuicao, position: "58% 50%", zoom: 1, origin: "50% 45%", tone: "light", accent: "both" },
};

/** Screens of scroll each change of chapter takes (desktop). */
const CHAPTER = 0.9;
/** Screens of scroll spent on the last chapter before the pin lets go. */
const END_HOLD = 0.35;

/** The first photograph starts as a small window in the middle of its frame. */
const PHOTO_MASK_START = photoMask("16% 16% 16% 16%");
/** A stage layer before its chapter arrives (also its markup value, so it never shows without JS). */
const LAYER_HIDDEN = "inset(0% 0% 0% 100%)";
/** Where the header's menu trigger sits, in px in from the right gutter: its colour is sampled there. */
const HEADER_CONTROLS = 40;

const pad = (i: number) => String(i + 1).padStart(2, "0");

export function Hero({ locale }: { locale: Locale }) {
  const { heroIntro, heroSlides, heroTagline } = siteCopy[locale];
  const root = useRef<HTMLElement>(null);
  // the animated mark of the opening (IntroLogo: morph or disintegrate mode): the timeline drives it
  const symbolRef = useRef<DisintegrationHandle>(null);
  const morphRef = useRef<LogoMorphHandle>(null);
  const lenisRef = useLenis();
  // "Saltar introdução": set while the opening exists, jumps straight to the end of act 0
  const skipIntro = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(root);
      const reveal = q("[data-reveal]");
      const mm = gsap.matchMedia();

      mm.add({ desktop: DESKTOP, mobile: MOBILE, reduced: REDUCED }, (ctx) => {
        const { desktop, reduced } = ctx.conditions as { desktop: boolean; mobile: boolean; reduced: boolean };

        // ------------------------------------------------------------ reduced motion
        // No opening (globals.css keeps it hidden), no pin: every chapter simply on the page.
        if (reduced) {
          gsap.set(reveal, { autoAlpha: 1, x: 0, y: 0 });
          return undefined;
        }

        // from here on the opening is shown (globals.css reads this to keep it on screen)
        document.documentElement.setAttribute("data-intro-ready", "");
        if (!desktop) gsap.set(reveal, { autoAlpha: 1, x: 0, y: 0 });

        const intro = createIntro(section, { symbol: symbolRef, morph: morphRef });
        const layers = q("[data-hero-layer]");
        const chapters: Chapter[] = q("[data-hero-slide]").map((slide, i) => {
          const art = chapterArt[heroSlides[i].id];
          return {
            copy: slide.querySelector("[data-hero-copy]") as HTMLElement,
            label: slide.querySelector("[data-hero-label]") as HTMLElement,
            lines: Array.from(slide.querySelectorAll<HTMLElement>("[data-hero-line]")),
            text: slide.querySelector("[data-hero-text]") as HTMLElement,
            card: slide.querySelector("[data-hero-card]") as HTMLElement,
            photo: slide.querySelector("[data-hero-photo]") as HTMLElement,
            zoom: art.zoom,
            tone: art.tone,
            layer: i > 0 ? (layers[i - 1] ?? null) : null,
          };
        });
        const first = chapters[0];
        const copies = chapters.map((c) => c.copy);
        const cards = chapters.map((c) => c.card);

        const meta = q("[data-hero-meta]")[0];
        const marksBox = q("[data-hero-marks]")[0];
        const marks = q("[data-hero-mark]");
        const progress = q("[data-hero-progress]")[0];

        // ------------------------------------------------- the colour under the chrome
        // The indicator and the signature (here) sit over the stage, outside the chapters: as a sweep
        // crosses each of them it takes the colour now under it. The header's island (Header.tsx,
        // through lib/hero-stage.ts) is wiped by the sweep's edge itself, every frame; its menu
        // trigger changes colour as the edge passes it. Positions are layout, read on refresh only.
        const chrome = q("[data-hero-chrome]");
        const html = document.documentElement;
        let stage: Stage | null = null;
        let centres: number[] = [];
        let width = 0;
        let gutter = 0;
        let pinned = false;
        let told: HeroStage | null = null;
        let split = "";
        const measureChrome = () => {
          const box = section.getBoundingClientRect();
          width = section.clientWidth;
          gutter = marksBox?.offsetLeft ?? 0;
          centres = chrome.map((el) => {
            const r = el.getBoundingClientRect();
            return r.left - box.left + r.width / 2;
          });
        };
        const syncTone = () => {
          if (!width) measureChrome();
          const toneAt = (x: number) => (stage ? stage.toneAt(x, width) : first.tone);
          chrome.forEach((el, k) => {
            const tone = toneAt(centres[k]);
            if (el.dataset.tone !== tone) el.dataset.tone = tone;
          });
          // the sweeping edge for the header: moved before the colours are announced, so the island
          // never draws its two halves without it
          const edge = stage?.edge(width) ?? null;
          const px = edge ? `${Math.round(edge.x * 10) / 10}px` : "";
          if (px && px !== split) html.style.setProperty(HERO_SPLIT_VAR, px);
          split = px;
          const whole = toneAt(width / 2);
          const next: HeroStage = {
            pinned,
            left: edge?.left ?? whole,
            right: edge?.right ?? whole,
            controls: toneAt(width - gutter - HEADER_CONTROLS),
          };
          if (
            told?.pinned === next.pinned &&
            told.left === next.left &&
            told.right === next.right &&
            told.controls === next.controls
          )
            return;
          told = next;
          announceHeroStage(next);
        };

        // one screen of scroll per unit of timeline. Viewport-derived, never content-derived: a font
        // swap then re-measures to the same number, so the refresh is a geometric no-op, not a jump
        const length = desktop ? INTRO_ACT + (chapters.length - 1) * CHAPTER + END_HOLD : INTRO_ACT;

        // ------------------------------------------------- the timeline
        // Created synchronously, never gated on fonts: SmoothScroll refreshes ScrollTrigger once the
        // fonts land, and if this pin did not exist yet at that moment every trigger below it would be
        // measured without the pin spacer and fire at the wrong scroll position.
        const seq = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: syncTone,
          scrollTrigger: {
            trigger: section,
            pin: true,
            pinSpacing: true,
            start: "top top",
            end: `+=${length * 100}%`,
            // `true`, not a number: Lenis already eases the scroll position, and a numeric scrub would
            // stack a second lag on top — which is exactly what makes scrolling back up feel different
            // from scrolling down.
            scrub: true,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: (self) => {
              intro.tellHeader(self);
              syncTone();
            },
            onToggle: (self) => {
              pinned = self.isActive;
              syncTone();
            },
            onRefresh: (self) => {
              intro.refresh(self);
              stage?.measure();
              measureChrome();
              pinned = self.isActive;
              syncTone();
            },
          },
        });

        // ------------------------------------------------- act 0: the opening becomes the page
        intro.addTo(seq);
        // the page's entrance, timed from when the black starts to clear (later for a longer opening)
        const p = PAGE_DELAY;
        // 6: the first chapter rises in place as the black clears
        seq.fromTo(first.label, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, p + 0.5);
        seq.fromTo(first.lines, { yPercent: 115 }, { yPercent: 0, duration: 0.32, stagger: 0.07, ease: "power3.out" }, p + 0.54);
        seq.fromTo(first.text, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, p + 0.7);

        if (desktop) {
          // 7: the photograph opens through a mask, the picture settling a beat behind its frame
          seq.fromTo(first.card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, p + 0.36);
          seq.fromTo(first.card, { clipPath: PHOTO_MASK_START }, { clipPath: PHOTO_OPEN, duration: 0.6, ease: "power3.inOut" }, p + 0.36);
          seq.fromTo(first.photo, { scale: first.zoom * 1.2 }, { scale: first.zoom, duration: 0.64, ease: "power2.out" }, p + 0.36);
          seq.fromTo(first.copy, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, p + 0.48);
          seq.fromTo(meta, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 }, p + 0.7);
          seq.fromTo(marksBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, p + 0.8);
          seq.fromTo(progress, { scaleX: 0 }, { scaleX: 1 / chapters.length, duration: 0.2 }, p + 0.82);

          // --------------------------------------------- the chapters
          stage = addChapterChanges(seq, chapters, marks, { start: INTRO_ACT, span: CHAPTER });

          // the indicator's line keeps pace with the scroll until the pin lets go
          seq.fromTo(progress, { scaleX: 1 / chapters.length }, { scaleX: 1, duration: length - (p + 1.02) }, p + 1.02);

          // The state before the first scroll, set AFTER the timeline: fromTo renders its start values
          // as it is created, and the later ones (the chapter changes) would otherwise leave chapter 2
          // on screen behind the black. ScrollTrigger re-renders the timeline at the real scroll
          // position on refresh, so a reload half-way down still lands on the right frame.
          gsap.set([meta, marksBox, ...copies, ...cards], { autoAlpha: 0 });
          gsap.set(progress, { scaleX: 0 });
          gsap.set(marks, { opacity: (i: number) => (i === 0 ? 1 : MARK_IDLE) });
          gsap.set(first.card, { clipPath: PHOTO_MASK_START });
          gsap.set(layers, { clipPath: LAYER_HIDDEN });
          // the trigger may have refreshed inside the timeline's constructor, before the stage existed
          stage.measure();
        } else {
          // narrow screens: the chapters after the first are in the normal flow of the page; each one
          // rises in as it scrolls into view — vertical movement only, nothing crossing the screen
          chapters.slice(1).forEach((chapter) => {
            gsap
              .timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: chapter.copy, start: "top 82%", toggleActions: "play none none reverse" },
              })
              .fromTo(chapter.label, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
              .fromTo(chapter.lines, { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.05)
              .fromTo(chapter.text, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.2)
              .fromTo(chapter.card, { clipPath: photoMask("10% 0% 10% 0%") }, { clipPath: PHOTO_OPEN, duration: 1.1, ease: "power3.inOut" }, 0.25);
          });
        }
        intro.setStart();
        intro.playEntrance();
        measureChrome();
        pinned = seq.scrollTrigger?.isActive ?? false;
        syncTone();

        // jump past the opening (keyboard: the "Saltar introdução" button), focus on the first chapter
        skipIntro.current = () => {
          const st = seq.scrollTrigger;
          if (!st) return;
          const end = st.start + ((st.end - st.start) * INTRO_ACT) / seq.duration();
          const go = () => {
            if (!first.copy.hasAttribute("tabindex")) first.copy.setAttribute("tabindex", "-1");
            first.copy.focus({ preventScroll: true });
          };
          if (lenisRef.current) lenisRef.current.scrollTo(end, { immediate: true, force: true, onComplete: go });
          else {
            window.scrollTo(0, end);
            go();
          }
        };

        return () => {
          skipIntro.current = null;
          intro.revert();
          // custom inline transforms are the flakiest thing a context restores; clearing them makes a
          // half-reverted remount (Strict Mode, a hot update, a hydration retry) self-heal instead of
          // freezing a card off-screen or a title inside its mask. Every one of these gets explicit
          // start values again when the timeline is rebuilt.
          gsap.set([...cards, ...copies], { clearProps: "transform,opacity,visibility,clipPath" });
          gsap.set(
            chapters.flatMap((c) => [c.label, c.text, ...c.lines]),
            { clearProps: "transform,opacity,visibility" }
          );
          // the stage's layers go back to hidden (their markup value), never to no clip at all
          layers.forEach((layer) => (layer.style.clipPath = LAYER_HIDDEN));
          chrome.forEach((el) => delete el.dataset.tone);
          announceHeroStage(RESTING_STAGE);
          html.style.removeProperty(HERO_SPLIT_VAR);
          document.documentElement.removeAttribute("data-intro-ready");
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-hero
      id="inicio"
      aria-label={ui[locale].heroServices}
      className="relative isolate bg-chalk"
    >
      <h1 className="sr-only">{heroIntro.title}</h1>

      {/* for keyboard users who would rather skip the opening — invisible until focused, and gone
          with reduced motion (there is no opening then) */}
      <button
        type="button"
        onClick={() => skipIntro.current?.()}
        className="sr-only z-[60] rounded-md bg-paper px-4 py-3 text-sm text-ink motion-reduce:hidden focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        {heroIntro.skip}
      </button>

      <IntroLogo symbol={symbolRef} morph={morphRef} />

      {/* The stage's colour for each later chapter, swept across the whole screen as that chapter
          arrives (desktop only: globals.css shows them once JS drives the sequence). */}
      {heroSlides.slice(1).map((slide) => (
        <div
          key={slide.id}
          data-hero-layer
          aria-hidden="true"
          className={`absolute inset-0 -z-10 hidden ${chapterArt[slide.id].tone === "dark" ? "bg-coal" : "bg-chalk"}`}
          style={{ clipPath: LAYER_HIDDEN }}
        />
      ))}

      {heroSlides.map((slide, i) => {
        const art = chapterArt[slide.id];
        const dark = art.tone === "dark";
        // text left / photograph right, then mirrored, then back — flex order carries the alternation
        // so that no CSS transform competes with the x GSAP animates on the photograph
        const imageRight = i % 2 === 0;
        return (
          // Wide screens always get the split composition. Pinned (motion-safe), the chapters lie on
          // top of each other, each one screen tall with room for the indicator's band; with reduced
          // motion they are simply three bands down the page, the first one under the header.
          <article
            key={slide.id}
            data-hero-slide
            className={`flex flex-col gap-10 ${dark ? "bg-coal" : ""} ${
              // in normal flow the first chapter starts right under the fixed header
              i === 0
                ? "pb-14 pt-[calc(var(--header-h)+2.5rem)] motion-reduce:lg:pb-0 motion-reduce:lg:pt-[var(--header-h)]"
                : "py-14 motion-reduce:lg:py-0"
            } lg:flex-row lg:items-stretch lg:gap-0 lg:overflow-x-clip motion-safe:lg:min-h-svh motion-safe:lg:pb-[var(--stage-band)] motion-safe:lg:pt-[var(--header-h)] motion-reduce:lg:min-h-[min(100svh,50rem)] ${
              imageRight ? "" : "lg:flex-row-reverse"
            }`}
          >
            <div
              data-hero-copy
              data-reveal
              // pinned, the same top offset as the photograph, so the copy centres on it. min-w-0: a title
              // wider than the column ('preocupações.' at 1440) overflows into the gutter instead of
              // pushing the photograph off its frame column
              className="px-[var(--gutter)] outline-none lg:min-w-0 lg:flex-1 lg:self-center motion-safe:lg:mt-[calc(var(--island-inset)*2+2px)] motion-reduce:lg:py-20"
            >
              {/* 01 / TRANSPORTE — the accent is the logo's colours in miniature */}
              <p data-hero-label className={`t-label flex items-center gap-3 ${dark ? "text-chalk" : "text-coal"}`}>
                <span aria-hidden="true" className={`relative block h-[3px] w-7 ${art.accent === "comet" ? "bg-comet" : "bg-signal"}`}>
                  {art.accent === "both" && <span className="absolute inset-y-0 right-0 w-2 bg-comet" />}
                </span>
                <span className={dark ? "text-comet" : "text-red-deep"}>{pad(i)}</span>
                <span aria-hidden="true" className="opacity-45">
                  /
                </span>
                <span>{slide.label}</span>
              </p>
              {/* each line rises out of its own mask (the padding keeps accents and descenders) */}
              <h2
                className={`mt-6 text-[length:var(--title)] font-medium leading-[0.9] tracking-[-0.05em] [font-stretch:88%] ${
                  dark ? "text-chalk" : "text-coal"
                }`}
              >
                <span className="hero-line-mask block overflow-x-visible overflow-y-clip">
                  <span data-hero-line className="block">
                    {slide.titleLines[0]}
                  </span>
                </span>
                <span className="hero-line-mask block overflow-x-visible overflow-y-clip">
                  <span data-hero-line className="block">
                    {slide.titleLines[1]}
                    <span className={dark ? "text-comet" : "text-signal"}>.</span>
                  </span>
                </span>
              </h2>
              <p data-hero-text className={`t-lead mt-7 max-w-[34ch] ${dark ? "text-ash" : "text-graphite"}`}>
                {slide.description}
              </p>
            </div>

            {/* The photograph shares the header island's frame: the same inset from the screen's edge
                and the same corner radius, so island and photograph read as one system (and the
                photograph never runs under the island). No border, no shadow, nothing around the copy:
                a photograph with soft corners on the stage, not a card. On wide screens it is one side
                of the composition, from just under the island down to the indicator's band (pinned);
                in the reduced-motion bands it keeps the same inset above and below. */}
            <figure
              data-hero-card
              data-reveal
              // No background of its own (the blur placeholder covers loading): a light or dark fill
              // would show as a 1px rim along the rounded corners. `isolate` keeps those corners
              // clipping the scaled picture inside while the frame travels (WebKit).
              className={`relative isolate mx-[var(--island-inset)] aspect-[4/3] overflow-hidden rounded-[var(--island-radius)] will-change-transform lg:aspect-auto lg:w-[var(--frame-col)] lg:shrink-0 ${
                // only the outer side keeps the inset on wide screens: the inner one faces the copy
                imageRight ? "lg:ml-0" : "lg:mr-0"
              } motion-safe:lg:mt-[calc(var(--island-inset)*2+2px)] motion-reduce:lg:mb-[var(--island-inset)] ${
                // reduced-motion bands: the first one clears the island (inset + its 2px border + inset)
                i === 0 ? "motion-reduce:lg:mt-[calc(var(--island-inset)*2+2px)]" : "motion-reduce:lg:mt-[var(--island-inset)]"
              }`}
            >
              <div data-hero-photo className="absolute inset-0" style={{ transform: `scale(${art.zoom})`, transformOrigin: art.origin }}>
                <Image
                  src={art.photo}
                  alt={slide.image.alt}
                  fill
                  sizes="(min-width: 64rem) 58vw, 100vw"
                  quality={90}
                  placeholder="blur"
                  // the first photograph is masked until the scroll starts, but must already be there
                  loading={i === 0 ? "eager" : "lazy"}
                  className="object-cover"
                  style={{ objectPosition: art.position }}
                />
              </div>
            </figure>
          </article>
        );
      })}

      {/* The band under the chapters (desktop): where we are on the left, the signature on the right.
          Each piece takes the colour of the stage under it (data-tone, set by the timeline). */}
      <div
        data-hero-marks
        aria-hidden="true"
        className="hidden motion-safe:lg:absolute motion-safe:lg:bottom-0 motion-safe:lg:left-[var(--gutter)] motion-safe:lg:z-10 motion-safe:lg:flex motion-safe:lg:h-[var(--stage-band)] motion-safe:lg:flex-col motion-safe:lg:justify-center"
      >
        <ol className="flex gap-[clamp(1.5rem,3vw,3rem)]">
          {heroSlides.map((slide, i) => (
            <li
              key={slide.id}
              data-hero-mark
              data-hero-chrome
              className="group/chrome t-label text-coal transition-colors duration-300 data-[tone=dark]:text-chalk"
            >
              <span className="text-red-deep transition-colors duration-300 group-data-[tone=dark]/chrome:text-comet">{pad(i)}</span> —{" "}
              {slide.label}
            </li>
          ))}
        </ol>
        {/* fills with the scroll, from the first chapter to the moment the pin lets go */}
        <span
          data-hero-chrome
          className="group/chrome mt-3 block h-px bg-coal/15 transition-colors duration-300 data-[tone=dark]:bg-chalk/20"
        >
          <span
            data-hero-progress
            className="block h-full origin-left bg-signal transition-colors duration-300 group-data-[tone=dark]/chrome:bg-comet"
          />
        </span>
      </div>

      <p
        data-hero-meta
        data-hero-chrome
        data-reveal
        className="t-label hidden px-[var(--gutter)] text-right leading-[1.6] text-muted transition-colors duration-300 data-[tone=dark]:text-smoke motion-safe:lg:absolute motion-safe:lg:bottom-0 motion-safe:lg:right-0 motion-safe:lg:z-10 motion-safe:lg:flex motion-safe:lg:h-[var(--stage-band)] motion-safe:lg:flex-col motion-safe:lg:justify-center"
      >
        <span>{heroTagline[0]}</span>
        <span>{heroTagline[1]}</span>
      </p>
    </section>
  );
}
