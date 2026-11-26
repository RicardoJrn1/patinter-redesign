"use client";

// Footer: the official footer's content (content/site.ts — logo, signature, the menu's four groups,
// the social profiles, the newsletter, the copyright) in the redesign's language. It closes the page on
// chalk, after the coal panel above it:
//
// - the signature, large: the page opens on the logo and closes on its promise, "Quanto mais longe
//   vamos, mais perto estamos de si.", with the titles' red stop;
// - the logo and the head office, then the four groups (links to the pages this site has, inert
//   buttons for the others, as in the menu);
// - the logo's two colours as one rule across the page, red then yellow, as the official footer has it;
// - the copyright, the social profiles and the newsletter.
//
// With motion, the signature's lines rise out of their masks, the groups come up and the rule draws
// in as each scrolls into view (and back out, scrolling up). Reduced motion and no JS: all simply
// there. The official footer's credit to the agency that built that site is not carried over.
import { useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { Disclosure } from "@/components/ui/Disclosure";
import { PageLink } from "@/components/ui/PageLink";
import { RollText } from "@/components/ui/RollText";
import { siteCopy } from "@/content/locales/site";
import type { MenuLink } from "@/content/site";
import { ui } from "@/content/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { type Locale, type PageKey, pages } from "@/lib/i18n";
import { MOTION, REDUCED } from "@/lib/motion-queries";

/** A group's entry type (without a display, for the Disclosure's button, which lays itself out). */
const GROUP_TEXT =
  "text-[0.9375rem] leading-snug tracking-[-0.01em] text-coal/80 transition-colors duration-300 hover:text-coal focus-visible:text-coal aria-[current=page]:text-coal";
/** A group's entry, whether it is a link to its page or (no page yet) an inert button. */
const GROUP_ITEM = `block text-left ${GROUP_TEXT}`;

/** An entry under a heading entry (Sustentabilidade's pages): a step smaller and quieter. */
const GROUP_SUB =
  "block text-left text-[0.875rem] leading-snug tracking-[-0.01em] text-coal/65 transition-colors duration-300 hover:text-coal focus-visible:text-coal aria-[current=page]:text-coal";

/** One entry: a link to its page, or (no page yet) an inert button, as in the menu (Header.tsx). Hover
 *  draws the bar below in miniature under it (globals.css); on the current page's entry it stays drawn. */
function groupEntry(link: MenuLink, className: string, current?: string) {
  return link.href ? (
    <PageLink href={link.href} current={current} className={className}>
      <span className="link-line">{link.label}</span>
    </PageLink>
  ) : (
    <button type="button" className={className}>
      <span className="link-line">{link.label}</span>
    </button>
  );
}

/** `locale`: the page's language. `page`: the page it closes (marks that page's entry, off the home). */
export function Footer({ locale, page }: { locale: Locale; page: PageKey }) {
  const { footer, headOffice, menuGroups, signature, social } = siteCopy[locale];
  const t = ui[locale];
  const current = page === "home" ? undefined : pages[page][locale];
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

        const lines = q("[data-footer-line]");
        const groups = q("[data-footer-group]");
        const bar = q("[data-footer-bar]")[0];
        const enter = (trigger: Element, start: string) =>
          gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });

        // triggered by boxes that never move (the lines start pushed down inside their masks)
        enter(q("[data-footer-statement]")[0], "top 85%").fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.09 });
        enter(q("[data-footer-nav]")[0], "top 90%").fromTo(groups, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 });
        enter(bar, "top 98%").fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" });

        return () => gsap.set([...lines, ...groups, bar], { clearProps: "transform,opacity,visibility" });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const last = signature.length - 1;

  return (
    <footer ref={root} className="bg-chalk px-[var(--gutter)] pb-8 pt-[clamp(5rem,12vw,10rem)] text-coal">
      {/* the official signature, as the page's last words */}
      <p
        data-footer-statement
        className="text-[clamp(2.5rem,6.4vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] [font-stretch:88%]"
      >
        {/* one official line per line where they fit; where they do not (phones), each breaks into
            balanced halves rather than leaving 'vamos,' or 'si.' alone */}
        {signature.map((line, i) => (
          <span key={line} className="hero-line-mask block overflow-x-visible overflow-y-clip">
            <span data-footer-line data-reveal className="block text-balance">
              {i === last && line.endsWith(".") ? (
                <>
                  {line.slice(0, -1)}
                  <span className="text-signal">.</span>
                </>
              ) : (
                line
              )}
            </span>
          </span>
        ))}
      </p>

      <div className="mt-[clamp(4rem,8vw,7rem)] grid gap-x-10 gap-y-12 border-t border-line pt-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,4fr)]">
        <div>
          <Logo height={40} />
          <p className="t-label mt-5 text-muted">
            {headOffice.city}, {headOffice.country}
          </p>
        </div>

        <nav data-footer-nav aria-label={t.footerNav} className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {menuGroups.map((group) => (
            <div key={group.title} data-footer-group data-reveal>
              <h2 className="t-label text-red-deep">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.links ? (
                      // a heading over its own pages (Sustentabilidade), as in the menu: not a page
                      // itself; its pages stay folded away until it is clicked
                      <Disclosure label={link.label} className={GROUP_TEXT}>
                        <ul className="space-y-2 border-l border-line pb-2 pl-3 pr-1.5 pt-2">
                          {link.links.map((sub) => (
                            <li key={sub.label}>{groupEntry(sub, GROUP_SUB, current)}</li>
                          ))}
                        </ul>
                      </Disclosure>
                    ) : (
                      groupEntry(link, GROUP_ITEM, current)
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* the logo's two colours, red then yellow, as the official footer draws them */}
      <div data-footer-bar data-reveal aria-hidden="true" className="mt-[clamp(3.5rem,7vw,6rem)] flex h-1 origin-left">
        <span className="block w-1/5 bg-signal" />
        <span className="block flex-1 bg-comet" />
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
          <p className="t-label text-muted">{footer.copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="t-label text-coal">
                  <span className="link-line">{s.label}</span>
                  <span className="sr-only">{t.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* inert until the newsletter page exists */}
        <button
          type="button"
          className="group inline-flex h-11 items-center self-start rounded-full border border-coal/20 px-5 text-[0.8125rem] font-medium tracking-[-0.01em] text-coal transition-colors duration-300 hover:border-coal hover:bg-coal hover:text-chalk lg:self-auto"
        >
          <RollText>{footer.newsletter}</RollText>
        </button>
      </div>
    </footer>
  );
}
