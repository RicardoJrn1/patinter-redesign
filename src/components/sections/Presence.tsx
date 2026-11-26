"use client";

// Presence: the official "59 anos de história · em 04 países" (content/site.ts), after the fleet. One
// coal panel, inset like the hero's photographs and the fleet's panel: the history and the count on
// the left, and on the right a pile of the four countries' flags, which presence-acts.ts deals one by
// one with the scroll, Portugal first and Alemanha on top.
//
// Desktop (pinned): as the fleet lets go on chalk, this section comes up with its panel unfolding and
// the history rising in (the approach, scrubbed); then it pins and the flags land. The band at the
// bottom names the four countries, each lit once its flag is down.
// Narrow screens (phones, tablets): the same panel in normal flow; the copy is revealed as it scrolls
// in and the flags still pile up with the scroll while the pile and its caption are in full view. The
// count reads 04 países there: it sits above the pile, too far from it to follow it on screen.
// Screens under 36rem tall (a phone on its side, a zoomed-in browser), reduced motion and no JS: no
// pile — the four flags side by side, each with its name and places.
//
// Screen readers get the statement as the heading and the countries as a list; every visual copy of a
// figure, and the flags (the names are right under them), is decorative.
//
// The PRESENCE_* conditions (lib/motion-queries.ts) and the two [data-presence] blocks in globals.css
// describe the same layouts. Change one and you must change the other.
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
// The flags: Wikimedia Commons, public domain (Flag_of_Portugal.svg, Flag_of_Spain.svg,
// Flag_of_France.svg), minified; Germany's redrawn at 3:2 (Flag_of_Germany.svg is 5:3), with its colours.
import alemanha from "@/assets/flags/alemanha.svg";
import espanha from "@/assets/flags/espanha.svg";
import franca from "@/assets/flags/franca.svg";
import portugal from "@/assets/flags/portugal.svg";
import { FIGURE_OUT } from "@/components/sections/fleet-acts";
import { MARK_IDLE, PHOTO_OPEN, photoMask } from "@/components/sections/hero-chapters";
import { addPresenceActs, PRESENCE_LENGTH, type PresenceCounter, type PresenceParts } from "@/components/sections/presence-acts";
import { siteCopy } from "@/content/locales/site";
import type { PresenceCountry } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";
import { PRESENCE_PILE, PRESENCE_PINNED, PRESENCE_STILL, REDUCED } from "@/lib/motion-queries";

const FLAGS: Record<PresenceCountry["id"], StaticImageData> = { portugal, espanha, franca, alemanha };


/**
 * Where the header island ends, in px from the top of the screen: inset + header + its 2px of border
 * (the --frame-top stage variable, less one inset). Read from the root's variables, so it follows the
 * header's height at every breakpoint.
 */
function islandBottom() {
  const css = getComputedStyle(document.documentElement);
  const rem = parseFloat(css.fontSize);
  const px = (name: string) => {
    const value = css.getPropertyValue(name).trim();
    return value.endsWith("rem") ? parseFloat(value) * rem : parseFloat(value);
  };
  return px("--island-inset") + px("--header-h") + 2;
}

/** A figure's mask: sized in the figure's own em, the line set tight. */
const MASK = "text-[length:var(--presence-figure)] leading-[0.82] font-medium tracking-[-0.05em] tabular-nums [font-stretch:88%]";

export function Presence({ locale }: { locale: Locale }) {
  const { presence } = siteCopy[locale];
  const root = useRef<HTMLElement>(null);
  const { history, reach, countries } = presence;
  /** The count's last digits, '1' up to the official figure's (04 → 1, 2, 3, 4). */
  const DIGITS = Array.from({ length: Number(reach.figure) }, (_, i) => String(i + 1));
  /** The count's fixed part: the official figure without its last digit ('0' of '04'). */
  const LEAD = reach.figure.slice(0, -1);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(root);
      const reveal = q("[data-reveal]");
      const mm = gsap.matchMedia();
      // the pile's layout outlives the 4.5s safety net only once this has run (globals.css)
      section.setAttribute("data-presence-ready", "");

      mm.add({ pinned: PRESENCE_PINNED, pile: PRESENCE_PILE, still: PRESENCE_STILL, reduced: REDUCED }, (ctx) => {
        const { pinned, pile: piled, reduced } = ctx.conditions as Record<string, boolean>;
        gsap.set(reveal, { autoAlpha: 1 });
        if (reduced) return undefined;

        const panel = q("[data-presence-panel]")[0];
        const pile = q("[data-presence-flags]")[0];
        const label = q("[data-presence-label]")[0];
        const rise = q("[data-presence-rise]")[0];
        const historyUnit = q("[data-presence-history-unit]")[0];
        const divider = q("[data-presence-divider]")[0];
        const tab = q("[data-presence-tab]")[0];
        const marksBox = q("[data-presence-marks]")[0];
        const progress = q("[data-presence-progress]")[0];
        const counter: PresenceCounter = {
          count: q("[data-presence-count]")[0],
          zero: q("[data-presence-zero]")[0],
          digits: q("[data-presence-digits]")[0],
          unit: q("[data-presence-unit]")[0],
        };
        const parts: PresenceParts = {
          flags: q("[data-presence-flag]"),
          shades: q("[data-presence-shade]"),
          names: q("[data-presence-name]"),
          places: q("[data-presence-places]"),
          // the count follows the pile only where both share the screen (pinned)
          counter: pinned ? counter : null,
          marks: pinned ? q("[data-presence-mark]") : [],
        };
        // from where a flag rests to just past the panel's right edge. Fractional rects: neither box
        // is ever transformed, so the difference is pure layout
        const entry = () => panel.getBoundingClientRect().right - pile.getBoundingClientRect().left + 8;

        if (pinned) {
          // ----------------------------------------------- the approach (not pinned)
          // From the section's top at 80% of the screen to 15%: the panel unfolds and the history
          // rises in as the section comes up. This timeline owns only these elements; the pinned one
          // owns the pile and the count — no property has two owners.
          const approach = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 15%", scrub: true, invalidateOnRefresh: true },
          });
          approach.fromTo(panel, { clipPath: photoMask("10% 4% 0% 4%") }, { clipPath: PHOTO_OPEN, duration: 0.55, ease: "power2.out" }, 0);
          approach.fromTo(label, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.15);
          approach.fromTo(rise, { yPercent: FIGURE_OUT }, { yPercent: 0, duration: 0.45, ease: "power3.out" }, 0.22);
          approach.fromTo(historyUnit, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.5);
          approach.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.inOut" }, 0.58);
          approach.fromTo(tab, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.68);
          approach.fromTo(marksBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.7);

          // ----------------------------------------------- the pinned pile
          // Created after the fleet's (sibling effects run in order), so it is measured with the hero's
          // and the fleet's spacers in place. `true`: Lenis already eases the scroll (see Hero.tsx).
          const seq = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              pin: true,
              pinSpacing: true,
              start: "top top",
              end: `+=${PRESENCE_LENGTH * 100}%`,
              scrub: true,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
          });
          addPresenceActs(seq, parts, entry);
          // the band's line keeps pace with the scroll until the pin lets go
          seq.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: PRESENCE_LENGTH }, 0);
        } else {
          // ----------------------------------------------- flow: revealed as they scroll in
          const enter = (trigger: Element, start = "top 85%") =>
            gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

          enter(panel, "top 90%").fromTo(panel, { clipPath: photoMask("10% 0% 10% 0%") }, { clipPath: PHOTO_OPEN, duration: 1.1, ease: "power3.inOut" }, 0);
          // triggered by the copy's box, which never moves (the figure inside it starts pushed down)
          enter(q("[data-presence-copy]")[0], "top 88%")
            .fromTo(label, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
            .fromTo(rise, { yPercent: FIGURE_OUT }, { yPercent: 0, duration: 0.9 }, 0.08)
            .fromTo(historyUnit, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.45);
          enter(divider).fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0);
          enter(tab).fromTo(tab, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0);

          if (piled) {
            // The pile follows the scroll here too, over the stretch where the pile and the caption
            // under it are both in full view: from the caption's bottom reaching the bottom of the
            // screen (so Portugal's places are read as it lands) to the stair's top reaching the
            // header island. Measured, in px of scroll, so it holds on any phone; never shorter than
            // 160px, so a very short screen still gets a usable (if cramped) scrub.
            const captionRoom = () => parseFloat(getComputedStyle(pile).marginBottom);
            const stair = () => parseFloat(getComputedStyle(pile).marginTop);
            const pileTop = () => pile.getBoundingClientRect().top + window.scrollY;
            addPresenceActs(
              gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: pile,
                  start: () => pileTop() + pile.offsetHeight + captionRoom() - window.innerHeight,
                  end: (self) => Math.max(pileTop() - stair() - islandBottom(), self.start + 160),
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }),
              parts,
              entry,
              0
            );
          }
        }

        // the state before the first scroll, set after the timelines (their start values render as
        // they are created); ScrollTrigger re-renders them at the real scroll position on refresh
        if (parts.marks.length) gsap.set(parts.marks, { opacity: MARK_IDLE });

        return () => {
          // custom inline transforms and clips are what a context restores least reliably; clearing
          // them lets a remount (Strict Mode, a hot update, a resize across the breakpoints) start clean
          gsap.set(
            [panel, label, rise, historyUnit, divider, tab, marksBox, progress, ...parts.marks, counter.count, counter.zero, counter.digits, counter.unit],
            { clearProps: "transform,opacity,visibility,clipPath" }
          );
          gsap.set([...parts.flags, ...parts.shades, ...parts.names, ...parts.places], { clearProps: "transform,opacity,visibility" });
        };
      });

      return () => {
        mm.revert();
        section.removeAttribute("data-presence-ready");
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="onde-estamos"
      data-presence
      aria-labelledby="presenca-title"
      className="relative isolate bg-chalk py-14 [--flag-w:min(calc(100vw-7.5rem),22rem)] [--presence-figure:clamp(4.75rem,24vw,7.5rem)] [--presence-gap:2.5rem] lg:py-24 lg:[--flag-w:clamp(14rem,min(30vw,48svh),34rem)] lg:[--presence-figure:clamp(4rem,min(9vw,15svh),11rem)] lg:[--presence-gap:clamp(1.25rem,4svh,2.5rem)] lg:[--presence-pad:clamp(1.5rem,4svh,3rem)]"
    >
      <div
        data-presence-panel
        className="relative mx-[var(--island-inset)] overflow-hidden rounded-[var(--island-radius)] bg-coal px-6 py-12 sm:px-10 lg:grid lg:grid-cols-[42%_minmax(0,1fr)] lg:items-center lg:px-[calc(var(--gutter)-var(--island-inset))] lg:py-16"
      >
        <div data-presence-copy>
          <p data-presence-label data-reveal className="t-label flex items-center gap-3 text-chalk">
            {/* the logo's yellow, as on the fleet's coal panel */}
            <span aria-hidden="true" className="block h-[3px] w-7 bg-comet" />
            <span>{presence.label}</span>
          </p>
          <h2 id="presenca-title" className="sr-only">
            {presence.statement}
          </h2>
          <ul className="sr-only">
            {countries.map((country) => (
              <li key={country.id}>
                {country.name}: {country.places.join(", ")}.
              </li>
            ))}
          </ul>

          {/* 59 years of history: rises whole (the count in this section is the countries') */}
          <div aria-hidden="true" className="mt-[calc(var(--presence-gap)*0.8)] flex flex-wrap items-end gap-x-6 gap-y-3">
            <span className={`-mb-[0.14em] block overflow-x-visible overflow-y-clip pb-[0.14em] pt-[0.06em] text-chalk ${MASK}`}>
              <span data-presence-rise data-reveal className="block whitespace-nowrap">
                {history.figure}
              </span>
            </span>
            <span data-presence-history-unit data-reveal className="block pb-[0.1em] text-chalk">
              <span className="t-label mb-2.5 block leading-[1.5] text-ash">{history.qualifier}</span>
              <span className="block text-[clamp(1.75rem,2.4vw,2.5rem)] leading-none tracking-[-0.03em]">{history.unit}</span>
            </span>
          </div>

          <span
            data-presence-divider
            data-reveal
            aria-hidden="true"
            className="my-[var(--presence-gap)] block h-px max-w-[26rem] origin-left bg-chalk/12"
          />

          {/* in 04 countries: the count follows the pile (presence-acts.ts) */}
          <div data-reveal aria-hidden="true">
            <p data-presence-tab data-reveal className="t-label text-ash">
              {reach.tab}
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
              {/* The mask's height is set: it shows one line and the room the figure's glyphs need,
                  never the next digit, which waits half an em further down. Every item below is one
                  line plus that half em, so one item is one step. At rest (and in the static layouts)
                  the strip, bottom-aligned, shows the official figure. */}
              {/* items-start: stretched to the mask's height, the strip's box would end above the
                  last item's half em, and the digits would sit that much too high */}
              <span className={`-mb-[0.14em] flex h-[1.02em] items-start overflow-x-visible overflow-y-clip pt-[0.06em] text-chalk ${MASK}`}>
                <span data-presence-count className="flex items-start">
                  <span data-presence-zero className="block pb-[0.5em]">
                    {LEAD}
                  </span>
                  <span className="relative block">
                    <span className="invisible block pb-[0.5em]">{DIGITS[DIGITS.length - 1]}</span>
                    <span data-presence-digits className="absolute inset-x-0 bottom-0 block">
                      {DIGITS.map((digit) => (
                        <span key={digit} className="block pb-[0.5em]">
                          {digit}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </span>
              <span
                data-presence-unit
                className="block pb-[0.1em] text-[clamp(1.75rem,2.4vw,2.5rem)] leading-none tracking-[-0.03em] text-chalk"
              >
                {reach.unit}
              </span>
            </div>
          </div>
        </div>

        {/* The flags. Static: side by side, each with its name. With motion: one pile (globals.css). */}
        <div data-presence-stage className="mt-14 lg:mt-0 lg:flex lg:justify-center">
          <ul data-presence-flags data-reveal aria-hidden="true" className="grid w-full max-w-[34rem] grid-cols-2 gap-x-5 gap-y-8">
            {countries.map((country) => (
              <li key={country.id} data-presence-country>
                <span
                  data-presence-flag
                  className="relative block aspect-[3/2] origin-top-left overflow-hidden rounded-lg shadow-[0_1.25rem_2.5rem_-1rem_rgb(0_0_0/0.6)]"
                >
                  <Image src={FLAGS[country.id]} alt="" unoptimized className="absolute inset-0 size-full object-cover" />
                  <span data-presence-shade className="absolute inset-0 bg-coal opacity-0" />
                  {/* a hairline, so France's white and Germany's black keep their edge on coal and on
                      the flag under them */}
                  <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]" />
                </span>
                <span data-presence-caption className="mt-4 block">
                  <span className="block overflow-hidden pb-[0.08em]">
                    <span
                      data-presence-name
                      className="block text-[clamp(1.5rem,2.2vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-chalk"
                    >
                      {country.name}
                    </span>
                  </span>
                  <span data-presence-places className="t-label mt-2 block leading-[1.5] text-ash">
                    {country.places.join(" · ")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* the band (pinned only): the four countries, each lit once its flag is down, and the progress line */}
      <div
        data-presence-marks
        data-reveal
        aria-hidden="true"
        className="absolute bottom-0 left-[var(--gutter)] z-[2] hidden h-[var(--stage-band)] flex-col justify-center"
      >
        <ol className="flex gap-[clamp(1.5rem,3vw,3rem)]">
          {countries.map((country, i) => (
            <li key={country.id} data-presence-mark className="t-label text-coal">
              <span className="text-red-deep">{String(i + 1).padStart(2, "0")}</span> — {country.name}
            </li>
          ))}
        </ol>
        <span className="mt-3 block h-px bg-coal/15">
          <span data-presence-progress className="block h-full origin-left bg-signal" />
        </span>
      </div>
    </section>
  );
}
