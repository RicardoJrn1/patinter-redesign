"use client";

// Minimal header: the original logo and a menu trigger, nothing else. Transparent at the top of the
// page; once scrolled it detaches into a floating, frosted island with rounded corners. Over the hero
// the island takes the colour of the chapter on screen — off-white on the light ones, translucent
// graphite on the dark one — and between chapters it is wiped by the same edge that sweeps the new
// colour across the stage (lib/hero-stage.ts); after the hero it goes back to off-white. Opening the
// menu grows that same island downwards into one continuous card, over a dimmed page (dialog
// semantics, focus trap, Esc and backdrop to close, scroll locked through Lenis).
//
// The hero's opening lands its logo exactly on this one (IntroLogo.tsx, headerLogoBox): it reads
// data-solid to know the island sits 0.75rem lower. Keep the logo's place as it is — the outer
// padding, its compensation on the inner one, and the card's 1px ring are all part of it.
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Search } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Disclosure } from "@/components/ui/Disclosure";
import { PageLink } from "@/components/ui/PageLink";
import { useLenis } from "@/components/motion/SmoothScroll";
import { siteCopy } from "@/content/locales/site";
import type { MenuLink } from "@/content/site";
import { ui } from "@/content/ui";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HERO_OPENING_EVENT, type HeroOpeningEvent } from "@/lib/hero-opening";
import { currentHeroStage, HERO_SPLIT_VAR, RESTING_STAGE, subscribeHeroStage, type Tone } from "@/lib/hero-stage";
import { htmlLang, type Locale, type PageKey, pages } from "@/lib/i18n";

/** A menu entry's type (without a display, for the Disclosure's button, which lays itself out, and
 *  without a colour: the panel is light or dark, see `ink` below). */
const MENU_TEXT = "text-[clamp(1rem,0.4vw+0.9rem,1.125rem)] font-medium tracking-[-0.02em]";
/** A menu entry, whether it is a link to its page or (no page yet) an inert button. */
const MENU_ITEM = `block text-left ${MENU_TEXT}`;
/** An entry under a heading entry (Sustentabilidade's pages): a step smaller and quieter. */
const MENU_SUB = "block text-left text-[0.9375rem] leading-snug tracking-[-0.01em] transition-colors duration-300";
const MENU_SUB_LIGHT = "text-ink/70 hover:text-ink focus-visible:text-ink aria-[current=page]:text-ink";
const MENU_SUB_DARK = "text-chalk/65 hover:text-chalk focus-visible:text-chalk aria-[current=page]:text-chalk";

/**
 * `locale`: the page's language (the menu's words, and the language switch). `page`: the page it heads
 * (lib/i18n.ts). On pages other than the home the logo links back to the home, and the menu marks that
 * page's entry as the current one; on the home everything stays exactly as the opening expects it. The
 * language switch links to the same page in the other language.
 */
export function Header({ locale, page }: { locale: Locale; page: PageKey }) {
  const { headOffice, languages, menuGroups, signature, social } = siteCopy[locale];
  const t = ui[locale];
  // the route of the page it heads, on pages other than the home (e.g. "/a-patinter")
  const current = page === "home" ? undefined : pages[page][locale];
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const firstRun = useRef(true);
  const [scrolled, setScrolled] = useState(false);
  // the hero's opening act: stay transparent while its big logo flies in here (lib/hero-opening.ts)
  const [heroOpening, setHeroOpening] = useState(false);
  // the hero holding the screen, and the colour of its stage under the header (lib/hero-stage.ts)
  const heroStage = useSyncExternalStore(subscribeHeroStage, currentHeroStage, () => RESTING_STAGE);
  const [open, setOpen] = useState(false);
  // the panel still folding away after a close
  const [folding, setFolding] = useState(false);
  const lenisRef = useLenis();
  const panelId = useId();

  // the bar detaches into an island once the page leaves the top
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onOpening = (event: Event) => setHeroOpening((event as HeroOpeningEvent).detail);
    window.addEventListener(HERO_OPENING_EVENT, onOpening);
    return () => window.removeEventListener(HERO_OPENING_EVENT, onOpening);
  }, []);


  // entrance: items drop in once, after the hero title starts
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-header-item]");
      if (prefersReducedMotion()) {
        gsap.set(items, { autoAlpha: 1 });
        return;
      }
      gsap.fromTo(items, { autoAlpha: 0, yPercent: -80 }, { autoAlpha: 1, yPercent: 0, duration: 1.2, stagger: 0.07, delay: 0.35 });
    },
    { scope: root }
  );

  // menu open / close: the card grows to fit the panel, then the columns rise into place
  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      const items = el.querySelectorAll("[data-menu-item]");
      const reduce = prefersReducedMotion();
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      // a close still folding must not clear `folding` during a later one
      gsap.killTweensOf(el);
      if (open) {
        if (reduce) {
          gsap.set(el, { height: "auto" });
          gsap.set(items, { autoAlpha: 1, y: 0 });
          return;
        }
        gsap.to(el, { height: "auto", duration: 0.75, ease: "expo.out" });
        gsap.fromTo(items, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.045, delay: 0.12, ease: "expo.out" });
      } else if (reduce) {
        setFolding(false);
        gsap.set(el, { height: 0 });
      } else {
        // until the panel is shut the card keeps the menu's one surface (see `card` below); set in this
        // layout effect, so React re-renders before paint and the island's two halves never flash
        setFolding(true);
        gsap.to(el, { height: 0, duration: 0.55, ease: "expo.inOut", onComplete: () => setFolding(false) });
      }
    },
    { dependencies: [open], scope: root }
  );

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggle.current?.focus();
  }, []);

  /** One menu entry: a link to its page, or (no page yet) a button that stays keyboard-reachable until
   *  its route exists. Hover draws the brand's red-and-yellow line under it (globals.css); on the
   *  current page's entry it stays drawn, and following it only closes the menu. */
  const menuEntry = (link: MenuLink, className: string) =>
    link.href ? (
      <PageLink
        href={link.href}
        current={current}
        onClick={(event) => {
          if (current !== link.href) return;
          event.preventDefault();
          close();
        }}
        className={className}
      >
        <span className="link-line">{link.label}</span>
      </PageLink>
    ) : (
      <button type="button" className={className}>
        <span className="link-line">{link.label}</span>
      </button>
    );

  // A page the browser restores from its back/forward cache comes back exactly as it was left — with
  // the menu open, and the scroll it locked, if a menu link was followed. Close it, with focus back on
  // the Menu button (the link that had it is inside the panel, which goes inert).
  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) close();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, [close]);

  // scroll lock + Esc + focus trap while the menu is open
  useEffect(() => {
    if (!open) return undefined;
    const lenis = lenisRef.current;
    lenis?.stop();
    // what Tab cycles through: the toggle and the panel's controls, less any folded away (an inert
    // Disclosure's entries cannot take focus, and the cycle would stall on them)
    const focusables = () =>
      [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLElement>("a[href], button, input") ?? [])].filter(
        (el): el is HTMLElement => !!el && !el.closest("[inert]")
      );
    const first = panel.current?.querySelector<HTMLElement>("button, a[href]");
    const t = window.setTimeout(() => first?.focus(), 300);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusables();
      const index = list.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (index <= 0 ? list.length - 1 : index - 1) : index === list.length - 1 ? 0 : index + 1;
      event.preventDefault();
      list[next]?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      // lenis.stop() clips <html> overflow while the menu is open, which can leave a pinned
      // section's measurements stale. Re-measure once the clip is actually gone.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [open, lenisRef, close]);

  // The island reads as solid while the menu is open, so the trigger keeps its contrast; during the
  // hero's opening act it waits for the flying logo to land.
  const solid = (scrolled && !heroOpening) || open;
  // Over the pinned hero the island takes the stage's colours — one, or two either side of a sweeping
  // edge — and the menu trigger the colour under it. Opened, the menu is one card in the colour under
  // the trigger: dark over the hero's dark chapter, light everywhere else (the scroll is locked while
  // it is open, so that colour holds until it closes).
  const tone: Tone = heroStage.pinned ? heroStage.controls : "light";
  // open, or still folding away after a close: one card in the menu's colour (were the island's two
  // halves back while the panel still shows, half its words would sit on their own colour)
  const card = open || folding;
  const over = !card && heroStage.pinned;
  const left: Tone = over ? heroStage.left : tone;
  const right: Tone = over ? heroStage.right : tone;
  const dark = tone === "dark";
  const wiped = left !== right;
  // a surface's fill and hairline (drawn inside, so each half of a wiped island carries its own).
  // Open, the card carries the whole menu, so it is nearly opaque.
  const surface = (t: Tone) =>
    t === "dark"
      ? `${card ? "bg-coal/96" : "bg-coal/72"} shadow-[inset_0_0_0_1px_rgb(244_241_235/0.1)]`
      : `${card ? "bg-chalk/96" : "bg-chalk/82"} shadow-[inset_0_0_0_1px_rgb(20_20_20/0.12)]`;
  // the open panel's colours, light or dark (the home's dark-stage pairs: coal → chalk, red-deep →
  // comet for the small labels, muted → ash, hairlines in chalk)
  const ink = dark ? "text-chalk" : "text-ink";
  const rule = dark ? "border-chalk/12" : "border-line";
  const quiet = dark ? "text-ash" : "text-muted";

  return (
    // data-solid: the hero reads it to know where the docking logo must land (the island sits 0.75rem lower)
    <header
      ref={root}
      data-solid={solid ? "" : undefined}
      data-tone={tone}
      className="fixed inset-x-0 top-0 z-50 text-coal transition-colors duration-300 data-[tone=dark]:text-chalk"
    >
      {/* dimmed page behind the card */}
      <div
        aria-hidden={!open}
        onClick={() => close(false)}
        className={`fixed inset-0 -z-10 bg-coal/30 backdrop-blur-[2px] transition-opacity duration-500 ease-out-expo ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* outer padding animates the bar away from the edges: this is what turns it into an island */}
      <div className={`transition-[padding] duration-700 ease-out-expo ${solid ? "px-[var(--island-inset)] pt-[var(--island-inset)]" : "px-0 pt-0"}`}>
        {/* One continuous card: the bar on top, the menu panel growing underneath it. Its 1px padding
            ring is where the island's hairline is drawn (and part of the logo's place). The shadow
            stays short and faint: it must not pool in the gap between the island and the hero's
            photograph, which reads as clean background or not at all. */}
        <div
          className={`relative isolate overflow-hidden p-px transition-[border-radius,box-shadow] duration-700 ease-out-expo ${
            solid
              ? "rounded-[var(--island-radius)] shadow-[0_1px_2px_rgb(23_23_23/0.05),0_10px_24px_-14px_rgb(23_23_23/0.16)] backdrop-blur-xl backdrop-saturate-150"
              : "rounded-none"
          }`}
        >
          {/* The island's surface: one colour, or — while a chapter's colour sweeps across the hero —
              two, cut at the sweep's edge, which the hero moves every frame (--hero-split, px from the
              left of the screen; the card starts --island-inset in). Colours change instantly: they
              only ever swap where both halves already look the same. Open, the card carries the
              whole menu, so it is nearly opaque: a dark chapter or a photograph never greys it. */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] transition-opacity duration-700 ease-out-expo ${surface(left)} ${
              solid ? "opacity-100" : "opacity-0"
            }`}
            style={wiped ? { clipPath: `inset(0 max(0px, calc(100% - var(${HERO_SPLIT_VAR}, 100vw) + var(--island-inset))) 0 0)` } : undefined}
          />
          {wiped && (
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ${surface(right)} ${solid ? "opacity-100" : "opacity-0"}`}
              style={{ clipPath: `inset(0 0 0 max(0px, calc(var(${HERO_SPLIT_VAR}, 100vw) - var(--island-inset))))` }}
            />
          )}
          {/* inner padding compensates the outer one, so the logo never shifts sideways */}
          <div
            className={`flex h-[var(--header-h)] items-center justify-between gap-6 transition-[padding] duration-700 ease-out-expo ${
              solid ? "px-[calc(var(--gutter)-var(--island-inset))]" : "px-[var(--gutter)]"
            }`}
          >
            {/* on the home it goes back to the top; elsewhere, to the home (the markup is otherwise
                identical: the home's opening measures this box) */}
            <a href={current ? pages.home[locale] : "#inicio"} data-header-item data-reveal className="-m-1 rounded-sm p-1" aria-label={t.homeLink}>
              {/* the hero fades this in as its big opening logo docks here (opacity only: the
                  entrance above animates the link itself, so the two never fight) */}
              <span data-header-logo className="block">
                <Logo height={30} />
              </span>
            </a>

            <button
              ref={toggle}
              type="button"
              data-header-item
              data-reveal
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
              // text and two strokes, no pill: the shorter stroke completes on hover
              className="group -mr-2 flex h-10 items-center gap-3 rounded-sm px-2 text-[0.8125rem] font-medium tracking-[0.01em]"
            >
              <span className="w-11 text-right">{open ? t.close : t.menu}</span>
              <span aria-hidden="true" className="relative block h-2.5 w-5">
                <span
                  className={`absolute right-0 h-px w-full bg-current transition-[top,transform] duration-500 ease-out-expo ${open ? "top-[5px] rotate-45" : "top-0.5"}`}
                />
                <span
                  className={`absolute right-0 h-px bg-current transition-[top,transform,width] duration-500 ease-out-expo ${
                    open ? "top-[5px] w-full -rotate-45" : "top-2 w-3 group-hover:w-full"
                  }`}
                />
              </span>
            </button>
          </div>

          {/* menu panel — height is driven by GSAP; inert keeps it out of the tab order while shut */}
          <div
            ref={panel}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={t.menu}
            inert={!open}
            style={{ height: 0 }}
            className="overflow-hidden"
          >
            <div
              // without this Lenis swallows the wheel here and this panel cannot be scrolled
              data-lenis-prevent
              // scheme-dark: on the dark card, the browser draws its scrollbar (short windows) dark too
              className={`max-h-[calc(100svh-var(--header-h)-3.5rem)] overflow-y-auto pb-9 pt-2 transition-[padding] duration-700 ease-out-expo ${
                dark ? "scheme-dark" : ""
              } ${solid ? "px-[calc(var(--gutter)-var(--island-inset))]" : "px-[var(--gutter)]"}`}
            >
              <nav aria-label={t.mainMenu}>
                <ul className={`grid gap-x-10 gap-y-9 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4 ${rule}`}>
                  {menuGroups.map((group) => (
                    <li key={group.title} data-menu-item>
                      <h2 className={`t-label ${dark ? "text-comet" : "text-red-deep"}`}>{group.title}</h2>
                      <ul className="mt-4 space-y-3">
                        {group.links.map((link) => (
                          <li key={link.label}>
                            {link.links ? (
                              // a heading over its own pages (the official menu's "Sustentabilidade"):
                              // not a page itself; its pages stay folded away until it is clicked
                              <Disclosure label={link.label} className={`${MENU_TEXT} ${ink}`}>
                                <ul className={`space-y-2 border-l pb-2 pl-4 pr-1.5 pt-2.5 ${dark ? "border-chalk/15" : "border-line"}`}>
                                  {link.links.map((sub) => (
                                    <li key={sub.label}>{menuEntry(sub, `${MENU_SUB} ${dark ? MENU_SUB_DARK : MENU_SUB_LIGHT}`)}</li>
                                  ))}
                                </ul>
                              </Disclosure>
                            ) : (
                              menuEntry(link, `${MENU_ITEM} ${ink}`)
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>

              <div
                data-menu-item
                className={`mt-10 flex flex-col gap-6 border-t pt-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 ${rule}`}
              >
                <p className={`text-[0.875rem] leading-snug tracking-[-0.01em] ${quiet}`}>
                  {signature.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <span className="t-label mt-2 block">
                    {headOffice.city}, {headOffice.country}
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                  {/* visual only for now: there is no search backend yet */}
                  <form role="search" onSubmit={(event) => event.preventDefault()} className="relative">
                    <label htmlFor={`${panelId}-search`} className="sr-only">
                      {t.search}
                    </label>
                    <Search
                      aria-hidden="true"
                      className={`pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 ${quiet}`}
                      strokeWidth={1.75}
                    />
                    <input
                      id={`${panelId}-search`}
                      type="search"
                      placeholder={t.search}
                      className={`h-11 w-full min-w-52 rounded-full border pl-11 pr-4 text-[0.875rem] tracking-[-0.01em] transition-colors duration-300 focus:outline-none ${
                        dark
                          ? "border-chalk/15 bg-chalk/5 text-chalk placeholder:text-ash hover:border-chalk/30 focus:border-chalk"
                          : "border-line bg-paper/60 text-ink placeholder:text-muted hover:border-line-strong focus:border-ink"
                      }`}
                    />
                  </form>

                  {/* the same page in each language: a full page load (each language is its own document) */}
                  <div className="flex items-center gap-1" role="group" aria-label={t.language}>
                    {languages.map((item) => {
                      const to = item.code.toLowerCase() as Locale;
                      const here = to === locale;
                      return (
                        <a
                          key={item.code}
                          href={pages[page][to]}
                          hrefLang={htmlLang[to]}
                          lang={htmlLang[to]}
                          aria-label={item.label}
                          aria-current={here ? "true" : undefined}
                          onClick={(event) => {
                            if (!here) return;
                            event.preventDefault();
                            close();
                          }}
                          className={`grid size-10 place-items-center rounded-full border text-[0.75rem] font-medium tracking-[0.04em] transition-colors duration-300 ${
                            here
                              ? dark
                                ? "border-chalk text-chalk"
                                : "border-ink text-ink"
                              : dark
                                ? "border-transparent text-ash hover:text-chalk"
                                : "border-transparent text-muted hover:text-ink"
                          }`}
                        >
                          {item.code}
                        </a>
                      );
                    })}
                  </div>

                  <ul className="flex flex-wrap gap-5">
                    {social.map((s) => (
                      <li key={s.href}>
                        <a href={s.href} target="_blank" rel="noreferrer" className={`t-label ${ink}`}>
                          <span className="link-line">{s.label}</span>
                          <span className="sr-only">{t.newTab}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* editorial hairline inside the gutters while the header lies flat over the page */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-[var(--gutter)] top-[var(--header-h)] h-px transition-opacity duration-500 ${
          dark ? "bg-chalk/15" : "bg-line"
        } ${solid ? "opacity-0" : "opacity-100"}`}
      />
    </header>
  );
}
