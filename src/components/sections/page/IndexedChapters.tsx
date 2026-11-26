"use client";

// An inner page's body as numbered chapters beside an index (the Sustentabilidade pages: Compromissos,
// Responsabilidade Social). From lg the chapters are listed in a column held at the left while the page
// scrolls (CSS sticky), the chapter under way marked with the red-and-yellow link line; on narrow
// screens the page's opening carries the same index at the top (PageOpening). Each chapter opens with
// its number, a hairline and its official heading (display type, red stop); its content is the page's.
//
// Motion, for everything inside (the chapters' content included), through a few attributes:
// [data-reveal-block] is a trigger box that never moves; inside it [data-rise] rises out of its mask,
// [data-fade] fades up, [data-rule] draws in from the left, [data-photo] opens through the hero's mask
// and [data-zoom] settles. Each block plays as it scrolls into view and back out, scrolling up. Every
// element animated carries data-reveal (hidden before hydration, shown by the 4.5s safety net if the
// app never runs). Reduced motion and no JS: all simply there — the index still follows the reading.
//
// Sticky needs every ancestor free of overflow hidden/auto (html and body only clip, which is safe).
import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import { PHOTO_OPEN, photoMask } from "@/components/sections/hero-chapters";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MOTION, REDUCED } from "@/lib/motion-queries";

export type IndexedChapter = {
  /** the chapter's id (the indexes link to it) */
  id: string;
  /** its official heading */
  title: string;
  /** a shorter form for the index column, if the heading is long */
  navTitle?: string;
  content: ReactNode;
};

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** The link line held drawn (globals.css .link-line runs on these two custom properties). */
const DRAWN = { "--link-from": "0%", "--link-to": "100%" } as CSSProperties;

/**
 * `navLabel`: the index's name, shown over it and given to screen readers · `intro`: what opens the body
 * beside the index, before the first chapter · `after`: what closes it (e.g. the last update's date) ·
 * `labelledBy`: the id of a heading inside `intro` that names the section, if any.
 */
export function IndexedChapters({
  navLabel,
  intro,
  chapters,
  after,
  labelledBy,
}: {
  navLabel: string;
  intro?: ReactNode;
  chapters: IndexedChapter[];
  after?: ReactNode;
  labelledBy?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(chapters[0]?.id);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // the index follows the reading — with or without motion: the chapter whose box crosses the
      // middle of the screen is the one under way
      const spies = q("[data-chapter]").map((chapter) =>
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setCurrent(chapter.id);
          },
        })
      );

      const mm = gsap.matchMedia();
      // both conditions: a conditions object only runs its function while one of them matches
      mm.add({ motion: MOTION, reduced: REDUCED }, (ctx) => {
        gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
        if ((ctx.conditions as Record<string, boolean>).reduced) return undefined;

        const animated: Element[] = [];
        for (const block of q("[data-reveal-block]")) {
          const pick = (attr: string) => Array.from(block.querySelectorAll<HTMLElement>(`[${attr}]`));
          const lines = pick("data-rise");
          const fades = pick("data-fade");
          const rules = pick("data-rule");
          const frames = pick("data-photo");
          const zooms = pick("data-zoom");
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: block, start: "top 88%", toggleActions: "play none none reverse" },
          });
          if (rules.length) tl.fromTo(rules, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0);
          if (lines.length) tl.fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1 }, 0.05);
          if (fades.length) tl.fromTo(fades, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.12);
          if (frames.length)
            tl.fromTo(frames, { clipPath: photoMask("10% 0% 10% 0%") }, { clipPath: PHOTO_OPEN, duration: 1.1, ease: "power3.inOut" }, 0.1);
          if (zooms.length) tl.fromTo(zooms, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: "power2.out" }, 0.1);
          animated.push(...lines, ...fades, ...rules, ...frames, ...zooms);
        }

        return () => gsap.set(animated, { clearProps: "transform,opacity,visibility,clipPath" });
      });

      return () => {
        spies.forEach((s) => s.kill());
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : navLabel}
      className="bg-chalk px-[var(--gutter)] pb-[clamp(2rem,5vw,4rem)] text-coal"
    >
      {/* from lg: the index column, then the content; the grid clips nothing (sticky) */}
      <div className="lg:grid lg:grid-cols-[minmax(11rem,15rem)_minmax(0,1fr)] lg:gap-x-[clamp(3rem,6vw,6.5rem)]">
        {/* the index, held under the island while the chapters scroll past (its column stretches the
            grid's whole height; the nav inside it sticks) */}
        <aside className="hidden pt-[clamp(5rem,10vw,9rem)] lg:block">
          <nav aria-label={navLabel} className="sticky top-[calc(var(--frame-top)+1.5rem)]">
            <p aria-hidden="true" className="t-label flex items-start gap-3 leading-[1.5] text-coal">
              <span className="relative mt-[0.55em] block h-[3px] w-7 shrink-0 bg-signal">
                <span className="absolute inset-y-0 right-0 w-2 bg-comet" />
              </span>
              {navLabel}
            </p>
            <ol className="mt-6 space-y-1 border-t border-line pt-4">
              {chapters.map((chapter, i) => {
                const on = chapter.id === current;
                return (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      aria-current={on ? "true" : undefined}
                      className={`grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline py-2 text-[0.9375rem] leading-snug tracking-[-0.01em] transition-colors duration-300 hover:text-coal ${
                        on ? "text-coal" : "text-coal/55"
                      }`}
                    >
                      <span aria-hidden="true" className={`t-label ${on ? "text-red-deep" : "text-muted"}`}>
                        {pad(i)}
                      </span>
                      <span>
                        <span className="link-line" style={on ? DRAWN : undefined}>
                          {chapter.navTitle ?? chapter.title}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div>
          {intro && <div className="pt-[clamp(5rem,10vw,9rem)]">{intro}</div>}

          {chapters.map((chapter, i) => (
            // tabIndex -1: the indexes move focus here once they have glided under the header; no ring
            <article
              key={chapter.id}
              id={chapter.id}
              data-chapter
              aria-labelledby={`${chapter.id}-title`}
              tabIndex={-1}
              className="pt-[clamp(5rem,10vw,8rem)] outline-none"
            >
              <header data-reveal-block>
                <span data-rule data-reveal aria-hidden="true" className="block h-px origin-left bg-line" />
                <p data-fade data-reveal aria-hidden="true" className="t-label mt-6 text-red-deep">
                  {pad(i)}
                </p>
                <h2
                  id={`${chapter.id}-title`}
                  className="mt-4 text-[clamp(2.125rem,3.8vw,4rem)] font-medium leading-[0.95] tracking-[-0.045em] text-balance [font-stretch:88%]"
                >
                  <span className="hero-line-mask block overflow-x-visible overflow-y-clip">
                    <span data-rise data-reveal className="block">
                      {chapter.title}
                      <span className="text-signal">.</span>
                    </span>
                  </span>
                </h2>
              </header>
              {chapter.content}
            </article>
          ))}

          {after}
        </div>
      </div>
    </section>
  );
}
