"use client";

// About page, Missão and Visão (content/a-patinter.ts, aboutPurpose): the page's first coal panel,
// the chalk-coal-chalk beat the fleet and the presence panels give the home. The panel is Presence's
// (inset from the screen's edges with the island's radius); the two official statements sit in it
// side by side on wide screens, a hairline between them, and one under the other on narrow ones. Each
// statement's own full stop is set in the logo's yellow, as the hero's dark chapter sets its titles':
// no punctuation is added.
//
// Wide screens: Presence's approach, not pinned. From the section's top at 80% of the screen to 15%,
// the panel unfolds, the labels rise, each statement fades up as one block and the hairline draws
// down (scrubbed).
// Narrow screens: the panel opens as it scrolls in, then each block and the hairline are revealed.
// Reduced motion and no JS: all simply there, the hairline drawn.
//
// Each statement block carries the id the opening's in-page index points at (#missao, #visao), and is
// focusable so the in-page links (SmoothScroll.tsx) can move focus to it.
import { Fragment, useRef } from "react";
import { PHOTO_OPEN, photoMask } from "@/components/sections/hero-chapters";
import type { AboutStatement } from "@/content/a-patinter";
import { aboutCopy } from "@/content/locales/about";
import type { Locale } from "@/lib/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { DESKTOP, MOBILE, REDUCED } from "@/lib/motion-queries";

/** The statement without its final full stop, and that stop (set apart to take the accent). */
function splitStop(text: AboutStatement["text"]) {
  return text.endsWith(".") ? { body: text.slice(0, -1), stop: "." } : { body: text, stop: "" };
}

export function AboutPurpose({ locale }: { locale: Locale }) {
  const { aboutPurpose } = aboutCopy[locale];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(root);
      const reveal = q("[data-reveal]");
      const mm = gsap.matchMedia();

      // all three conditions: a conditions object only runs its function while one of them matches
      mm.add({ wide: DESKTOP, narrow: MOBILE, reduced: REDUCED }, (ctx) => {
        const { wide, reduced } = ctx.conditions as Record<string, boolean>;
        gsap.set(reveal, { autoAlpha: 1 });
        if (reduced) return undefined;

        const panel = q("[data-purpose-panel]")[0];
        const blocks = q("[data-purpose-block]");
        const labels = q("[data-purpose-label]");
        const statements = q("[data-purpose-statement]");
        const divider = q("[data-purpose-divider]")[0];

        if (wide) {
          // ----------------------------------------------- the approach (scrubbed, not pinned)
          // Presence's values. No stagger: each item has its own place on the timeline. Built with
          // immediateRender off, then the state before the first scroll is set below; the timeline's
          // first refresh comes a tick later and renders it at the real scroll position.
          const approach = gsap.timeline({
            defaults: { ease: "none", immediateRender: false },
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 15%", scrub: true, invalidateOnRefresh: true },
          });
          approach.fromTo(panel, { clipPath: photoMask("10% 4% 0% 4%") }, { clipPath: PHOTO_OPEN, duration: 0.55, ease: "power2.out" }, 0);
          labels.forEach((label, i) =>
            approach.fromTo(label, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.18 + i * 0.06)
          );
          approach.fromTo(divider, { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power2.inOut" }, 0.22);
          statements.forEach((statement, i) =>
            approach.fromTo(statement, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.3 + i * 0.08)
          );
          // the timeline runs to 1, so the statements have landed while the section still has a
          // fifth of its approach to go (they are read from the lower half of the screen)
          approach.set({}, {}, 1);

          gsap.set(panel, { clipPath: photoMask("10% 4% 0% 4%") });
          gsap.set([...labels, ...statements], { autoAlpha: 0, y: 16 });
          gsap.set(divider, { scaleY: 0 });
        } else {
          // ----------------------------------------------- flow: revealed as they scroll in
          const enter = (trigger: Element, start = "top 88%") =>
            gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

          enter(panel, "top 90%").fromTo(panel, { clipPath: photoMask("10% 0% 10% 0%") }, { clipPath: PHOTO_OPEN, duration: 1.1, ease: "power3.inOut" }, 0);
          // triggered by each block's box, which never moves (only what is inside it does)
          blocks.forEach((block, i) =>
            enter(block)
              .fromTo(labels[i], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.1)
              .fromTo(statements[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.18)
          );
          enter(divider, "top 90%").fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0);
        }

        return () => {
          gsap.set([panel, ...labels, ...statements, divider], { clearProps: "transform,opacity,visibility,clipPath" });
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="missao-visao" className="bg-chalk py-14 lg:py-24">
      <div
        data-purpose-panel
        className="mx-[var(--island-inset)] overflow-hidden rounded-[var(--island-radius)] bg-coal px-6 py-12 sm:px-10 sm:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:items-start lg:gap-x-[clamp(1.5rem,3vw,3rem)] lg:px-[calc(var(--gutter)-var(--island-inset))] lg:py-[clamp(4rem,8vw,7rem)]"
      >
        {aboutPurpose.map((statement, i) => {
          const { body, stop } = splitStop(statement.text);
          return (
            <Fragment key={statement.id}>
              {/* between the two blocks: across on narrow screens, down the grid's middle column on wide ones */}
              {i > 0 && (
                <span
                  data-purpose-divider
                  data-reveal
                  aria-hidden="true"
                  className="my-10 block h-px origin-left bg-chalk/12 lg:my-0 lg:h-auto lg:w-px lg:origin-top lg:self-stretch"
                />
              )}
              <div id={statement.id} tabIndex={-1} data-purpose-block className="outline-none">
                <h2 data-purpose-label data-reveal className="t-label flex items-center gap-3 text-chalk">
                  {/* the logo's yellow, as on the presence's coal panel */}
                  <span aria-hidden="true" className="block h-[3px] w-7 bg-comet" />
                  <span>{statement.label}</span>
                </h2>
                <p
                  data-purpose-statement
                  data-reveal
                  className="mt-6 max-w-[30ch] text-pretty text-[clamp(1.5rem,2.3vw,2.25rem)] font-medium leading-[1.22] tracking-[-0.025em] text-chalk [font-stretch:88%]"
                >
                  {body}
                  {stop && <span className="text-comet">{stop}</span>}
                </p>
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
