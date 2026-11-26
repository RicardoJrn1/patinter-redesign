"use client";

// News: the official home page's three highlighted news (content/site.ts), between the presence panel
// and the footer. Secondary content, so it is set as such: not cards with photographs, not display
// type, but a quiet index in the footer's and the menu's language — a label, then one line per news
// item (its date, its title, an arrow) between hairlines. Each line is one link to the official
// article, in a new tab; so is "Ver todas as notícias".
//
// With motion, each line comes in as it scrolls into view (and back out, scrolling up): its hairline
// draws in from the left, then its date, title and arrow fade up. On hover the title darkens and the
// brand's red-and-yellow line draws in under it (globals.css .link-line), and the arrow drifts.
// Reduced motion and no JS: all simply there.
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { siteCopy } from "@/content/locales/site";
import { ui } from "@/content/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";
import { MOTION, REDUCED } from "@/lib/motion-queries";

/** The official pages' date (dd / mm / yyyy), tightened: '2026-05-06' → '06/05/2026'. No Date object:
 *  the string is the same on the server and in every time zone. */
const formatDate = (iso: string) => iso.split("-").reverse().join("/");

export function News({ locale }: { locale: Locale }) {
  const { news } = siteCopy[locale];
  /** Said after an external link's text, for screen readers. */
  const NEW_TAB = ui[locale].newTab;
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

        const head = q("[data-news-head]")[0];
        const topRule = q("[data-news-top]")[0];
        const rows = q("[data-news-row]");
        const enter = (trigger: Element, start: string) =>
          gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

        enter(head, "top 90%")
          .fromTo(head, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0)
          .fromTo(topRule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.1);
        // one timeline per line, triggered by the line's own box (which never moves)
        const parts = rows.map((row) => {
          const rule = row.querySelector<HTMLElement>("[data-news-rule]");
          const content = row.querySelector<HTMLElement>("[data-news-content]");
          enter(row, "top 92%")
            .fromTo(content, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
            .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0);
          return [rule, content];
        });

        return () => gsap.set([head, topRule, ...parts.flat()], { clearProps: "transform,opacity,visibility" });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="noticias" aria-labelledby="noticias-title" className="bg-chalk px-[var(--gutter)] pt-[clamp(4rem,8vw,7rem)]">
      <div data-news-head data-reveal className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
        <h2 id="noticias-title" className="t-label flex items-center gap-3 text-coal">
          {/* the logo's colours in miniature, as the fleet's and the presence's labels have them */}
          <span aria-hidden="true" className="relative block h-[3px] w-7 bg-signal">
            <span className="absolute inset-y-0 right-0 w-2 bg-comet" />
          </span>
          <span>{news.label}</span>
        </h2>
        {/* set like the footer's social links */}
        <a href={news.all.href} target="_blank" rel="noreferrer" className="group t-label inline-flex items-center gap-1.5 text-coal">
          <span className="link-line">{news.all.label}</span>
          <span className="sr-only">{NEW_TAB}</span>
          <ArrowUpRight
            aria-hidden="true"
            strokeWidth={1.75}
            className="size-3.5 transition-[translate] duration-500 ease-out-expo group-hover:-translate-y-px group-hover:translate-x-px motion-reduce:transition-none"
          />
        </a>
      </div>

      <span data-news-top data-reveal aria-hidden="true" className="mt-5 block h-px origin-left bg-line" />
      <ul>
        {news.items.map((item) => (
          <li key={item.href} data-news-row className="relative">
            <a href={item.href} target="_blank" rel="noreferrer" className="group block py-4 sm:py-5">
              <span
                data-news-content
                data-reveal
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1.5 md:grid-cols-[8.5rem_minmax(0,1fr)_auto] md:items-baseline"
              >
                <time dateTime={item.date} className="t-label text-muted">
                  {formatDate(item.date)}
                </time>
                <span className="col-start-1 text-[clamp(1rem,0.35vw+0.9rem,1.125rem)] leading-snug tracking-[-0.01em] text-coal/85 transition-colors duration-300 group-hover:text-coal md:col-start-2 md:row-start-1">
                  <span className="link-line">{item.title}</span>
                  <span className="sr-only">{NEW_TAB}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="col-start-2 row-span-2 row-start-1 size-4 text-coal/45 transition-[translate,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coal motion-reduce:transition-none md:col-start-3 md:row-span-1 md:self-center"
                />
              </span>
            </a>
            <span data-news-rule data-reveal aria-hidden="true" className="absolute inset-x-0 bottom-0 block h-px origin-left bg-line" />
          </li>
        ))}
      </ul>
    </section>
  );
}
