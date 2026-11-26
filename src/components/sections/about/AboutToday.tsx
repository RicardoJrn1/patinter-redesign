"use client";

// AboutToday ("Hoje"): the official page's three paragraphs (content/a-patinter.ts), read two ways.
// The paragraphs for readers, set beside the official bridge photograph, mirrored against the
// opening (its photograph on the right, this one on the left, as the hero alternates its sides). Then,
// for whoever scans, the facts again as a ledger in the home fleet's outlined frame on chalk: four
// figures that count with the scroll, as the home's do (59 · 5000 · 1200 · 15), and the six platforms
// by country, with their flags.
//
// With motion, on every size and with no pin: the paragraphs fade up as they scroll in; the
// photograph, then the frame, open like the fleet's and the presence's blocks in flow; the hairlines
// draw in; the figures count as the ledger travels up the screen (one scrubbed timeline per row of
// figures, so a row lands left to right), each dimmed and alone until it lands on its official value
// and takes its unit (fleet-acts.ts, unchanged); the flags and their places fade up after them.
// Reduced motion and no JS: all simply there, every figure on its official value.
//
// The ledger is decorative (aria-hidden): every fragment in it is a piece of the paragraphs, which
// are what screen readers get.
import Image, { type StaticImageData } from "next/image";
import { Fragment, useRef } from "react";
// the flags, as Presence.tsx has them (Wikimedia Commons, public domain; Germany's redrawn at 3:2)
import alemanha from "@/assets/flags/alemanha.svg";
import espanha from "@/assets/flags/espanha.svg";
import franca from "@/assets/flags/franca.svg";
import portugal from "@/assets/flags/portugal.svg";
// The official page's bridge photograph, unchanged (900×554): img_2152_12384287245d5fae751b332_
// 39361267560a63c7411318.jpg on https://www.patinter.com/pt/gca/index.php?id=9. At most ~600px wide
// here (42vw), so about 1.5× on 2× screens: ask Patinter for the original.
import ponte from "@/assets/images/sobre-ponte.jpg";
import { AboutFigure, aboutReadingParts } from "@/components/sections/about/AboutFigure";
import { riseReading } from "@/components/sections/fleet-acts";
import { PHOTO_OPEN, photoMask } from "@/components/sections/hero-chapters";
import type { AboutPlatform } from "@/content/a-patinter";
import { aboutCopy } from "@/content/locales/about";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { DESKTOP, MOBILE, REDUCED } from "@/lib/motion-queries";

const FLAGS: Record<AboutPlatform["id"], StaticImageData> = { portugal, franca, espanha, alemanha };


/** Where a block comes in as it scrolls into view (the fleet's and the presence's flow reveal). */
const PHOTO_CLOSED = photoMask("10% 0% 10% 0%");

export function AboutToday({ locale }: { locale: Locale }) {
  const { aboutToday } = aboutCopy[locale];
  const PHOTO_ALT = ui[locale].alt.bridgeLorry;
  const root = useRef<HTMLElement>(null);
  const { paragraphs, readings, platforms } = aboutToday;
  const [standfirst, ...body] = paragraphs;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reveal = q("[data-reveal]");
      const mm = gsap.matchMedia();

      // all three conditions: a conditions object only runs its function while one of them matches.
      // Wide and narrow differ only in how the figures fall into rows (one row of four, or two of two)
      mm.add({ wide: DESKTOP, narrow: MOBILE, reduced: REDUCED }, (ctx) => {
        const { wide, reduced } = ctx.conditions as Record<string, boolean>;
        gsap.set(reveal, { autoAlpha: 1 });
        if (reduced) return undefined;

        // what the layout shows at this size (the narrow grid's row hairline, the wide grid's posts)
        const shown = (el: HTMLElement) => el.getClientRects().length > 0;
        const paras = q("[data-today-para]");
        const photo = q("[data-today-photo]")[0];
        const frame = q("[data-today-frame]")[0];
        const figuresRow = q("[data-today-readings]")[0];
        const posts = q("[data-today-post]").filter(shown);
        const rules = q("[data-today-rule]").filter(shown);
        const platformsBox = q("[data-today-platforms]")[0];
        const platformsTab = q("[data-today-platforms-tab]")[0];
        const countries = q("[data-today-country]");
        const figures = q("[data-about-reading]").map(aboutReadingParts);

        const enter = (trigger: Element, start = "top 85%") =>
          gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

        // the paragraphs, each as it scrolls in (the news lines' fade)
        paras.forEach((para) => enter(para, "top 88%").fromTo(para, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0));
        // the photograph, then the frame: they open as the fleet's and the presence's blocks do in flow
        [photo, frame].forEach((block) =>
          enter(block).fromTo(block, { clipPath: PHOTO_CLOSED }, { clipPath: PHOTO_OPEN, duration: 1.1, ease: "power3.inOut" }, 0)
        );
        // the hairlines draw in: the posts between the figures downwards (one row of them, left to
        // right; on narrow screens each with its own row), the rules from the left
        const drawPost = { scaleY: 1, duration: 0.9, ease: "power2.inOut" };
        if (wide) enter(figuresRow).fromTo(posts, { scaleY: 0 }, { ...drawPost, stagger: 0.08 }, 0.35);
        else posts.forEach((post) => enter(post).fromTo(post, { scaleY: 0 }, drawPost, 0.35));
        rules.forEach((rule) => enter(rule).fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0));

        // The figures count with the scroll, as the home fleet's do in flow: one scrubbed timeline per
        // row, from the row's top at 85% of the screen to 35%, each figure a little after the one on
        // its left (no stagger: each figure has its own place on the timeline). Every property here
        // has exactly one tween, so each fromTo renders its own start value as it is created — the
        // state before the first scroll — and records the element's clean inline style for any
        // revert. (Writing that state with gsap.set after building instead left 'translate(0%, 140%)'
        // as the recorded style: a refresh restored it, GSAP re-read it as pixels, and the figures
        // landed short of their masks.)
        const rows = wide ? [figures] : [figures.slice(0, 2), figures.slice(2)];
        rows.forEach((row, i) => {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              // the frame's top for the first row (the frame never moves: only its clip does); the
              // narrow layout's second row by its first figure's box, which never moves either
              trigger: i === 0 ? frame : row[0].box,
              start: "top 85%",
              end: "top 35%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          row.forEach((figure, j) => riseReading(tl, figure, j * 0.08, 1));
        });

        // the platforms, once the figures have been passed (their row is about three quarters down
        // the screen as the figures above land): the tab, then the countries one by one
        enter(platformsBox, "top 75%")
          .fromTo(platformsTab, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
          .fromTo(countries, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0.08);

        return () => {
          // inline transforms and clips are what a context restores least reliably; clearing them lets
          // a remount (Strict Mode, a hot update, a resize across the breakpoint) start clean
          gsap.set([...paras, photo, frame, ...posts, ...rules, platformsTab, ...countries], {
            clearProps: "transform,opacity,visibility,clipPath",
          });
          gsap.set(
            figures.flatMap((f) => [f.tab, f.figure, f.rise, f.unit]),
            { clearProps: "transform,opacity,visibility" }
          );
          // a counter can be left mid-way: the static layouts must show the official figure
          figures.forEach((f) => {
            if (!f.count) return;
            f.count.textContent = f.final;
            gsap.set(f.count, { clearProps: "opacity,visibility" });
          });
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="hoje"
      // The figures' sizes. Narrow: two columns, so the unit (under the figure) is held to what a
      // 131px column takes at 360px ('nacionalidades'). From lg four columns; from xl the unit sits
      // beside the figure, sized so '5000' and its words fit one 1280px column side by side.
      className="bg-chalk py-[clamp(5rem,10vw,9rem)] [--about-figure:clamp(3rem,13vw,4.5rem)] [--about-unit:clamp(1rem,5.2vw,1.25rem)] [--today-gap:1.5rem] lg:[--about-figure:clamp(3.5rem,5vw,6rem)] lg:[--about-unit:clamp(1.25rem,1.5vw,1.75rem)] lg:[--today-gap:clamp(1.5rem,3vw,3rem)]"
    >
      {/* the paragraphs first (reading order); from lg the photograph takes the left column */}
      <div className="lg:grid lg:grid-cols-[42%_minmax(0,1fr)] lg:items-center">
        <div className="px-[var(--gutter)] lg:col-start-2 lg:row-start-1">
          <p
            data-today-para
            data-reveal
            className="max-w-[30ch] text-pretty text-[clamp(1.375rem,1.6vw,1.875rem)] font-medium leading-[1.25] tracking-[-0.02em] text-coal"
          >
            {standfirst}
          </p>
          <div className="mt-8 max-w-[56ch] space-y-5 text-[1.0625rem] leading-[1.6] text-graphite">
            {body.map((paragraph) => (
              <p key={paragraph} data-today-para data-reveal>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div
          data-today-photo
          data-reveal
          className="mx-[var(--island-inset)] mt-12 overflow-hidden rounded-[var(--island-radius)] lg:col-start-1 lg:row-start-1 lg:mr-0 lg:mt-0"
        >
          <Image
            src={ponte}
            alt={PHOTO_ALT}
            sizes="(min-width: 64rem) 42vw, 100vw"
            quality={90}
            placeholder="blur"
            className="block aspect-[900/554] h-auto w-full object-cover"
          />
        </div>
      </div>

      {/* The ledger: the fleet's outlined frame on chalk. Decorative — the paragraphs say it all. */}
      <div
        data-today-frame
        data-reveal
        aria-hidden="true"
        className="mx-[var(--island-inset)] mt-[clamp(3rem,6vw,5rem)] rounded-[var(--island-radius)] border border-coal/12 px-6 py-10 sm:px-10 lg:p-[clamp(2rem,3.2vw,3.5rem)]"
      >
        {/* each figure takes two rows of this grid (its words, then the figure: AboutFigure) */}
        <div data-today-readings className="grid grid-cols-2 gap-x-[var(--today-gap)] gap-y-10 lg:grid-cols-4">
          {readings.map((reading, i) => (
            <Fragment key={reading.id}>
              {/* narrow: the hairline between the two rows of two */}
              {i === 2 && <span data-today-rule data-reveal className="col-span-2 block h-px origin-left bg-line lg:hidden" />}
              <AboutFigure reading={reading}>
                {/* the post between two figures, in the middle of the gap: every column but the
                    first, so on narrow screens only the second column's */}
                {i > 0 && (
                  <span
                    data-today-post
                    data-reveal
                    className={`absolute inset-y-0 left-[calc(var(--today-gap)/-2)] block w-px origin-top bg-line ${
                      i === 2 ? "hidden lg:block" : ""
                    }`}
                  />
                )}
              </AboutFigure>
            </Fragment>
          ))}
        </div>

        <span data-today-rule data-reveal className="my-10 block h-px origin-left bg-line lg:my-[clamp(2rem,3.2vw,3rem)]" />

        {/* the six platforms, by country, in the paragraph's order */}
        <div data-today-platforms>
          <p data-today-platforms-tab data-reveal className="t-label text-muted">
            {platforms.tab}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-[var(--today-gap)] gap-y-8 lg:grid-cols-4">
            {platforms.countries.map((platform) => (
              <li key={platform.id} data-today-country data-reveal>
                <span className="relative block aspect-[3/2] w-10 overflow-hidden rounded-[3px]">
                  <Image src={FLAGS[platform.id]} alt="" unoptimized className="absolute inset-0 size-full object-cover" />
                  {/* Presence's hairline ring, in coal on chalk: France's white keeps its edge */}
                  <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(23_23_23/0.12)]" />
                </span>
                <span className="mt-3 block text-base font-medium leading-snug tracking-[-0.01em] text-coal">{platform.country}</span>
                {/* a dot stays after its place; from sm a place's name never breaks ('Alverca do
                    Ribatejo'), where a phone's half-width column is too narrow to hold it whole */}
                <span className="t-label mt-1.5 block leading-[1.5] text-muted">
                  {platform.places.map((place, i) => (
                    <Fragment key={place}>
                      {i > 0 && " · "}
                      <span className="sm:whitespace-nowrap">{place}</span>
                    </Fragment>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
