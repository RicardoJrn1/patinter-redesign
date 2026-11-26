"use client";

// Valores: the official six values (content/a-patinter.ts), in the official order, between the
// Missão/Visão panel and the history. A breath on chalk between the page's two coal moments, set as
// calmly as the home's news index (News.tsx): a label with the logo's colours in miniature, then one
// row per value between hairlines — its number, its name, its paragraph. No icons, cards or accordion:
// all six read at once. The numbers (01–06) are presentation, like the hero's; the <ol> already gives
// screen readers the order, so they are hidden from them.
//
// With motion, the label comes up and its rule draws in, then each row as it scrolls into view (and
// back out, scrolling up): its hairline draws in from the left, the name rises out of its mask, and
// the number and paragraph fade up. Not links, so no hover. Reduced motion and no JS: all simply there.
import { useRef } from "react";
import { aboutCopy } from "@/content/locales/about";
import type { Locale } from "@/lib/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION, REDUCED } from "@/lib/motion-queries";

/** 0 → '01' */
const pad = (i: number) => String(i + 1).padStart(2, "0");

export function AboutValues({ locale }: { locale: Locale }) {
  const { aboutValues } = aboutCopy[locale];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      // both conditions: a conditions object only runs its function while one of them matches
      mm.add({ motion: MOTION, reduced: REDUCED }, (ctx) => {
        gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
        if ((ctx.conditions as Record<string, boolean>).reduced) return undefined;

        const head = q("[data-values-head]")[0];
        const topRule = q("[data-values-top]")[0];
        const rows = q("[data-values-row]");
        const enter = (trigger: Element, start: string) =>
          gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

        enter(head, "top 90%")
          .fromTo(head, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0)
          .fromTo(topRule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.1);
        // one timeline per row, triggered by the row's own box (which never moves: only its parts do)
        const parts = rows.map((row) => {
          const rule = row.querySelector<HTMLElement>("[data-values-rule]");
          const number = row.querySelector<HTMLElement>("[data-values-number]");
          const name = row.querySelector<HTMLElement>("[data-values-name]");
          const text = row.querySelector<HTMLElement>("[data-values-text]");
          enter(row, "top 92%")
            .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0)
            .fromTo(name, { yPercent: 115 }, { yPercent: 0, duration: 0.9 }, 0.05)
            .fromTo(number, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
            .fromTo(text, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.16);
          return [rule, number, name, text];
        });

        return () => gsap.set([head, topRule, ...parts.flat()], { clearProps: "transform,opacity,visibility" });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="valores"
      aria-labelledby="valores-titulo"
      // the in-page index moves focus here: no ring around the whole section
      tabIndex={-1}
      className="bg-chalk px-[var(--gutter)] py-[clamp(5rem,10vw,9rem)] text-coal outline-none"
    >
      <h2 id="valores-titulo" data-values-head data-reveal className="t-label flex items-center gap-3 text-coal">
        {/* the logo's colours in miniature, as the news' and the fleet's labels have them */}
        <span aria-hidden="true" className="relative block h-[3px] w-7 bg-signal">
          <span className="absolute inset-y-0 right-0 w-2 bg-comet" />
        </span>
        <span>{aboutValues.label}</span>
      </h2>

      <span data-values-top data-reveal aria-hidden="true" className="mt-5 block h-px origin-left bg-line" />
      <ol>
        {aboutValues.items.map((value, i) => (
          <li
            key={value.id}
            data-values-row
            // phones: the number and the name on one line, the paragraph under them; from md, three
            // columns, the number and the name centred on the paragraph's height
            className="relative grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-3 py-6 md:items-center md:grid-cols-[4rem_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-x-8 md:py-8"
          >
            <span data-values-number data-reveal aria-hidden="true" className="t-label text-red-deep">
              {pad(i)}
            </span>
            <h3 className="text-[clamp(1.75rem,2.6vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-coal [font-stretch:88%]">
              {/* the name rises out of its own mask (the padding keeps accents and descenders) */}
              <span className="hero-line-mask block overflow-x-visible overflow-y-clip">
                <span data-values-name data-reveal className="block text-balance">
                  {value.name}
                </span>
              </span>
            </h3>
            <p data-values-text data-reveal className="col-span-2 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-pretty text-graphite md:col-span-1">
              {value.text}
            </p>
            <span data-values-rule data-reveal aria-hidden="true" className="absolute inset-x-0 bottom-0 block h-px origin-left bg-line" />
          </li>
        ))}
      </ol>
    </section>
  );
}
