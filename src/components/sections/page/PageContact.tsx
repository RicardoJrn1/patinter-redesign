"use client";

// Contacte-nos: an inner page's closing call to action (the official pages' "Contacte-nos", under the
// official menu group's name), the quiet row just before the footer. Used by /a-patinter and
// /sustentabilidade/compromissos. On chalk, flowing straight into the footer's chalk. Compact on
// purpose: the footer's signature stays the page's last big line.
//
// A hairline across the page, then one row: the official menu group's name as a label with the
// logo's colours in miniature (as the news' and the values' labels have them), and the link, set in
// the footer's display type, smaller and without the red stop (a link, not a title). It goes to the
// official contact form, in a new tab, until this site has its own contact page; screen readers hear
// that it opens elsewhere, as with the news links.
//
// With motion, as the row scrolls into view (and back out, scrolling up): the hairline draws in from
// the left, the label fades up and the link rises out of its mask. On hover the brand's red-and-yellow
// line draws in under the words (globals.css .link-line) and the arrow drifts up and right. Reduced
// motion and no JS: all simply there.
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { MOTION, REDUCED } from "@/lib/motion-queries";


export type PageContactProps = { label: string; link: { label: string; href: string } };

/** `locale`: the page's language (what screen readers hear after the link). */
export function PageContact({ locale, label, link }: PageContactProps & { locale: Locale }) {
  const NEW_TAB = ui[locale].newTab;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      // both conditions: a conditions object only runs its function while one of them matches
      mm.add({ motion: MOTION, reduced: REDUCED }, (ctx) => {
        gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
        if ((ctx.conditions as Record<string, boolean>).reduced) return undefined;

        const row = q("[data-contact-row]")[0];
        const rule = q("[data-contact-rule]")[0];
        const label = q("[data-contact-label]")[0];
        const line = q("[data-contact-line]")[0];

        // triggered by the row's own box, which never moves (only its parts do; the link starts
        // pushed down inside its mask)
        gsap
          .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: row, start: "top 92%", toggleActions: "play none none reverse" } })
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0)
          .fromTo(label, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.1)
          .fromTo(line, { yPercent: 115 }, { yPercent: 0, duration: 1 }, 0.15);

        return () => gsap.set([rule, label, line], { clearProps: "transform,opacity,visibility" });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="contacto" aria-labelledby="contacto-title" className="bg-chalk px-[var(--gutter)] pt-[clamp(4rem,8vw,7rem)] text-coal">
      <div data-contact-row>
        <span data-contact-rule data-reveal aria-hidden="true" className="block h-px origin-left bg-line" />

        {/* phones: the label, then the link under it; from lg, the fleet's split (42% for the label) */}
        <div className="grid gap-y-5 pt-8 lg:grid-cols-[42%_minmax(0,1fr)] lg:items-center">
          <h2 id="contacto-title" data-contact-label data-reveal className="t-label flex items-center gap-3 text-coal">
            {/* the logo's colours in miniature, as the news' and the values' labels have them */}
            <span aria-hidden="true" className="relative block h-[3px] w-7 bg-signal">
              <span className="absolute inset-y-0 right-0 w-2 bg-comet" />
            </span>
            <span>{label}</span>
          </h2>

          {/* the footer's display type, smaller and without the stop; at least 44px tall to tap */}
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex min-h-11 max-w-full items-center justify-self-start text-[clamp(2rem,4.5vw,3.75rem)] font-medium leading-[0.95] tracking-[-0.04em] text-coal [font-stretch:88%]"
          >
            {/* the words and the arrow rise together out of one mask (its padding keeps the hover
                line and the arrow's drift inside it) */}
            <span className="hero-line-mask block overflow-x-visible overflow-y-clip">
              <span data-contact-line data-reveal className="flex items-center gap-x-[0.1em]">
                {/* a flex item, so its line sits at the bottom of the line box: the hover line's
                    padding is tightened to stay inside the mask at this size */}
                <span className="link-line mb-[-0.1em] pb-[0.1em]">{link.label}</span>
                <span className="sr-only">{NEW_TAB}</span>
                {/* 0.75em: lucide draws the arrow in the middle 10/24 of its box, so this is an arrow
                    of about 0.3em, at the scale of the lowercase letters */}
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-[0.75em] shrink-0 transition-[translate] duration-500 ease-out-expo group-hover:-translate-y-[0.07em] group-hover:translate-x-[0.07em] motion-reduce:transition-none"
                />
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
