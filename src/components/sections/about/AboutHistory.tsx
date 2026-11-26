"use client";

// História (/a-patinter): the official "HISTÓRIA" block (content/a-patinter.ts) — its title and lead,
// then its four chapters set for reading at the visitor's own pace, on chalk. Beside them, from lg,
// the official archive photograph stays in view with CSS position: sticky (no pin, no JS): the page
// turns to the past while the chapters are read. On narrow screens the photograph follows the lead
// and simply scrolls with the page.
//
// The four-digit years inside the paragraphs are set a little heavier, so the eye can scan the dates
// down the text (1964 · 1967 · 1968 · 1974 · 1966 · 1986 · 1994). The stored strings are unchanged:
// the years are found when rendering. The chapter numbers (01–04) are presentation only.
//
// With motion, the title rises out of its mask and the lead fades up as the section scrolls in, the
// photograph opens through a mask (the hero's narrow-screen card reveal), and each chapter comes in
// as News's rows do: its hairline draws in, then its number, title and paragraphs fade up (and back
// out, scrolling up). Reduced motion and no JS: all simply there — the photograph stays sticky on
// wide screens, which is layout, not motion.
//
// Sticky needs every ancestor free of overflow hidden/auto (they would become its scroll container):
// html and body only clip (overflow-x: clip), which creates no scroll container. Keep it that way.
import Image from "next/image";
import { Fragment, useRef } from "react";
// The official archive photograph, copied unchanged:
// https://www.patinter.com/fotos/gca/historia-patinter_180143672574ddea2a419a_5445248259a007b108125.jpg (983×642)
import archivePhoto from "@/assets/images/historia-arquivo.jpg";
import { PHOTO_OPEN, photoMask } from "@/components/sections/hero-chapters";
import { aboutCopy } from "@/content/locales/about";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION, REDUCED } from "@/lib/motion-queries";


/** A four-digit year (1900–2099). One capturing group, so String.split keeps the years. */
const YEAR = /(\b(?:19|20)\d{2}\b)/;

/** The paragraph as written, its years set apart (split with a capturing group: odd parts are years). */
function withYears(text: string) {
  return text.split(YEAR).map((part, i) =>
    i % 2 === 1 ? (
      <time key={i} dateTime={part} className="font-medium tabular-nums text-coal">
        {part}
      </time>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

const pad = (i: number) => String(i + 1).padStart(2, "0");

export function AboutHistory({ locale }: { locale: Locale }) {
  const { aboutHistory } = aboutCopy[locale];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reveal = q("[data-reveal]");
      const mm = gsap.matchMedia();
      // both conditions: a conditions object only runs its function while one of them matches
      mm.add({ motion: MOTION, reduced: REDUCED }, (ctx) => {
        gsap.set(reveal, { autoAlpha: 1 });
        if ((ctx.conditions as Record<string, boolean>).reduced) return undefined;

        const line = q("[data-history-line]")[0];
        const lead = q("[data-history-lead]")[0];
        const photo = q("[data-history-photo]")[0];
        const zoom = q("[data-history-zoom]")[0];
        const chapters = q("[data-history-chapter]");
        const enter = (trigger: Element, start: string) =>
          gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

        // triggered by boxes that never move: the title's mask, and the grid the photograph sits in
        // (the photograph itself is sticky on wide screens, so its own box travels)
        enter(q("[data-history-head]")[0], "top 85%")
          .fromTo(line, { yPercent: 115 }, { yPercent: 0, duration: 1 }, 0)
          .fromTo(lead, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.15);
        enter(q("[data-history-body]")[0], "top 85%")
          .fromTo(photo, { clipPath: photoMask("10% 0% 10% 0%") }, { clipPath: PHOTO_OPEN, duration: 1.1, ease: "power3.inOut" }, 0)
          .fromTo(zoom, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: "power2.out" }, 0);
        // one timeline per chapter, triggered by the chapter's own box (which never moves)
        const parts = chapters.map((chapter) => {
          const rule = chapter.querySelector<HTMLElement>("[data-history-rule]");
          const content = Array.from(chapter.querySelectorAll<HTMLElement>("[data-history-content]"));
          enter(chapter, "top 88%")
            .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0)
            .fromTo(content, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07 }, 0.1);
          return [rule, ...content];
        });

        return () =>
          gsap.set([line, lead, photo, zoom, ...parts.flat()], { clearProps: "transform,opacity,visibility,clipPath" });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const { title, lead, chapters } = aboutHistory;

  return (
    // tabIndex -1: the in-page index (AboutOpening, through SmoothScroll) moves focus here once it has
    // glided under the header; no ring around the whole section
    <section
      ref={root}
      id="historia"
      aria-labelledby="historia-title"
      tabIndex={-1}
      // the bottom padding: the held photograph lets go with the last chapter, some room before the road
      className="bg-chalk pb-[clamp(1.5rem,4vw,4rem)] pt-[clamp(5rem,10vw,8rem)] outline-none"
    >
      <div data-history-head className="px-[var(--gutter)]">
        <h2
          id="historia-title"
          className="text-[length:var(--title)] font-medium leading-[0.9] tracking-[-0.05em] text-coal [font-stretch:88%]"
        >
          <span className="hero-line-mask block overflow-x-visible overflow-y-clip">
            <span data-history-line data-reveal className="block">
              {title}
              <span className="text-signal">.</span>
            </span>
          </span>
        </h2>
        <p data-history-lead data-reveal className="t-lead mt-7 max-w-[40ch] text-graphite">
          {lead}
        </p>
      </div>

      {/* Wide screens: the chapters in the copy column (the fleet's 42%), the photograph held beside
          them. Narrow screens: the photograph first (after the lead), then the chapters. The grid
          clips nothing — overflow on any ancestor would stop the photograph sticking. */}
      <div
        data-history-body
        className="mt-[clamp(3rem,6vw,5rem)] lg:grid lg:grid-cols-[42%_minmax(0,1fr)] lg:items-start"
      >
        {/* The hero's frame: the island's inset and corner radius, no background of its own (the blur
            placeholder covers loading), `isolate` so the rounded corners keep clipping the scaled
            picture. From lg it sits in the second column against the right inset, capped at 44rem
            (the source is 983px wide), and stays under the island while the chapters scroll by. */}
        <figure
          data-history-photo
          data-reveal
          className="relative isolate mx-[var(--island-inset)] aspect-[983/642] overflow-hidden rounded-[var(--island-radius)] lg:sticky lg:top-[var(--frame-top)] lg:col-start-2 lg:row-start-1 lg:ml-auto lg:w-[calc(100%-var(--island-inset))] lg:max-w-[44rem] lg:self-start"
        >
          <div data-history-zoom className="absolute inset-0">
            <Image
              src={archivePhoto}
              alt={ui[locale].alt.archiveLorry}
              fill
              sizes="(min-width: 64rem) 44rem, 100vw"
              quality={90}
              placeholder="blur"
              loading="lazy"
              className="object-cover"
            />
          </div>
        </figure>

        <div className="mt-10 lg:col-start-1 lg:row-start-1 lg:mt-0">
          {chapters.map((chapter, i) => (
            <article
              key={chapter.id}
              data-history-chapter
              aria-labelledby={`historia-${chapter.id}`}
              className="relative px-[var(--gutter)] pb-12 pt-6"
            >
              {/* its own hairline, aligned with the text (the gutters stay clear) */}
              <span
                data-history-rule
                data-reveal
                aria-hidden="true"
                className="absolute inset-x-[var(--gutter)] top-0 block h-px origin-left bg-line"
              />
              {/* the number is presentation: the official text has none */}
              <p data-history-content data-reveal aria-hidden="true" className="t-label text-red-deep">
                {pad(i)}
              </p>
              <h3
                id={`historia-${chapter.id}`}
                data-history-content
                data-reveal
                className="mt-4 text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-coal"
              >
                {chapter.title}
              </h3>
              <div
                data-history-content
                data-reveal
                className="mt-4 max-w-[52ch] space-y-4 text-[1.0625rem] leading-[1.65] text-graphite"
              >
                {chapter.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{withYears(paragraph)}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
