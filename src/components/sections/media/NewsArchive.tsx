"use client";

// Media (/noticias): the official news archive (content/media.ts) — the whole page under the header.
// The menu's place and the official H1 ("Notícias"), the official category filters (Todas, Destaques,
// Geral, Clipping, each with its count), then the filter's newest item set large (its photograph, date,
// title, summary) and the rest as cards in a grid (photograph, date, title), twelve at a time with the
// official "Ver mais" to show more. Every item opens its full article on the official site, in a new tab.
// The official listing's thumbnails are small (mostly 480×222): no frame here draws them much wider.
//
// The label and the title come in with the inner pages' CSS entrance (data-page-opening); with motion,
// the featured item and the cards fade up as they come into view — again after a filter change, and for
// each batch "Ver mais" adds (focus then moves to the first new card). Reduced motion: all simply there.
import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import { useId, useMemo, useRef, useState } from "react";
import { OpeningHead } from "@/components/sections/page/PageOpening";
import { mediaCopy } from "@/content/locales/media";
import type { NewsArchiveItem, NewsCategory } from "@/content/media";
import { ui } from "@/content/ui";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";
import { MOTION, REDUCED } from "@/lib/motion-queries";

/** What an item's link says beside its own text: the official "Ver mais", and (for screen readers)
 *  that it opens in a new tab. */
type ItemLabels = { more: string; newTab: string };
/** How many cards each step shows (besides the featured item). */
const STEP = 12;
/** '2026-06-15' → '15/06/2026' (the official dd / mm / yyyy, tightened); no Date object, so the same
 *  everywhere. */
const formatDate = (iso: string) => iso.split("-").reverse().join("/");

/** For the search: lower case, without accents ('Certificação' and 'certificacao' match). */
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export function NewsArchive({ locale }: { locale: Locale }) {
  const { mediaPlace, mediaTitle, newsArchive, newsEmpty, newsFilters, newsMoreLabel, newsSearchLabel } = mediaCopy[locale];
  const t = ui[locale];
  const labels: ItemLabels = { more: newsMoreLabel, newTab: t.newTab };
  /** Each item's searchable text (title and summary), folded once. */
  const haystack = useMemo(() => new Map(newsArchive.map((item) => [item.slug, fold(`${item.title} ${item.summary}`)])), [newsArchive]);
  const root = useRef<HTMLElement>(null);
  const searchId = useId();
  const [filter, setFilter] = useState<NewsCategory | "todas">("todas");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(STEP);
  // the first card of the last batch "Ver mais" added: focus goes there once it is on the page
  const focusFrom = useRef<number | null>(null);

  const words = useMemo(() => fold(query).split(/\s+/).filter(Boolean), [query]);
  const list = useMemo(
    () =>
      newsArchive.filter(
        (item) =>
          (filter === "todas" || item.categories.includes(filter)) && words.every((word) => haystack.get(item.slug)?.includes(word)),
      ),
    [newsArchive, haystack, filter, words],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { todas: newsArchive.length };
    for (const item of newsArchive) for (const cat of item.categories) c[cat] = (c[cat] ?? 0) + 1;
    return c;
  }, [newsArchive]);
  // searching, every result is a card (none set apart as the newest)
  const searching = words.length > 0;
  const featured = searching ? undefined : list[0];
  const rest = searching ? list : list.slice(1);
  const cards = rest.slice(0, shown);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (focusFrom.current !== null) {
        q("[data-news-card] a")[focusFrom.current]?.focus({ preventScroll: true });
        focusFrom.current = null;
      }
      const mm = gsap.matchMedia();
      // both conditions: a conditions object only runs its function while one of them matches
      mm.add({ motion: MOTION, reduced: REDUCED }, (ctx) => {
        const items = q("[data-news-card], [data-news-featured]");
        gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
        if ((ctx.conditions as Record<string, boolean>).reduced) return undefined;
        // opacity, not visibility: a card waiting to fade in must still take focus ("Ver mais" moves it)
        gsap.set(items, { opacity: 0, y: 16 });
        const batch = ScrollTrigger.batch(items, {
          start: "top 94%",
          once: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06, overwrite: true }),
        });
        return () => {
          batch.forEach((t) => t.kill());
          gsap.set(items, { clearProps: "transform,opacity,visibility" });
        };
      });
      return () => mm.revert();
    },
    // rebuilt when the filter, the search or the number of cards changes (the cards on screen fade in again)
    { scope: root, dependencies: [filter, words.join(" "), shown], revertOnUpdate: true },
  );

  const choose = (id: NewsCategory | "todas") => {
    setFilter(id);
    setShown(STEP);
  };
  const search = (value: string) => {
    setQuery(value);
    setShown(STEP);
  };
  const more = () => {
    focusFrom.current = cards.length;
    setShown((n) => n + STEP);
  };

  return (
    // the page's opening and its body in one (no photograph band, as on Patrocínios): data-page-opening
    // gives the label and the title the inner pages' CSS entrance
    <section
      ref={root}
      id="noticias"
      data-page-opening
      aria-labelledby="noticias-title"
      className="bg-chalk px-[var(--gutter)] pb-[clamp(5rem,10vw,8rem)] pt-[calc(var(--header-h)+2.5rem)] text-coal lg:pt-[calc(var(--frame-top)+clamp(1.5rem,3vw,3rem))]"
    >
      <OpeningHead titleId="noticias-title" place={mediaPlace} title={mediaTitle} titleLines={[mediaTitle]} />

      {/* the official categories (each a toggle) and the search; the list follows both */}
      <div
        data-opening-rise="index"
        className="mt-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between"
      >
        <div role="group" aria-label={t.newsByCategory} className="flex flex-wrap gap-2">
          {newsFilters.map((f) => {
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => choose(f.id)}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.875rem] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                  on ? "border-coal bg-coal text-chalk" : "border-coal/15 text-coal/80 hover:border-coal hover:text-coal"
                }`}
              >
                {f.label}
                <span className={`t-label tabular-nums ${on ? "text-chalk/60" : "text-muted"}`}>{counts[f.id] ?? 0}</span>
              </button>
            );
          })}
        </div>

        {/* the search: titles and summaries, as you type (the header menu's search field, in its look) */}
        <form role="search" onSubmit={(event) => event.preventDefault()} className="relative md:w-[min(22rem,40%)]">
          <label htmlFor={searchId} className="sr-only">
            {newsSearchLabel}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => search(event.target.value)}
            placeholder={newsSearchLabel}
            autoComplete="off"
            className="h-11 w-full rounded-full border border-line bg-paper/60 pl-11 pr-4 text-[0.875rem] tracking-[-0.01em] text-ink transition-colors duration-300 placeholder:text-muted hover:border-line-strong focus:border-ink focus:outline-none"
          />
        </form>
      </div>

      {/* nothing matches: said once, and announced */}
      <p role="status" className="empty:hidden mt-[clamp(2.5rem,5vw,4rem)] text-[1.0625rem] text-graphite">
        {list.length === 0 ? newsEmpty : ""}
      </p>

      {featured && <Featured item={featured} labels={labels} />}

      {cards.length > 0 && (
        <ul className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-[clamp(1.5rem,2.5vw,2.5rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((item) => (
            <li key={item.slug} data-news-card data-reveal>
              <Card item={item} labels={labels} />
            </li>
          ))}
        </ul>
      )}

      {rest.length > shown && (
        <div className="mt-[clamp(3rem,6vw,4.5rem)] flex justify-center">
          <button
            type="button"
            onClick={more}
            className="inline-flex h-12 items-center rounded-full border border-coal/20 px-7 text-[0.9375rem] font-medium tracking-[-0.01em] text-coal transition-colors duration-300 hover:border-coal hover:bg-coal hover:text-chalk"
          >
            {newsMoreLabel}
          </button>
        </div>
      )}
    </section>
  );
}

/** The filter's newest item: photograph beside date, title, summary and the official "Ver mais". */
function Featured({ item, labels }: { item: NewsArchiveItem; labels: ItemLabels }) {
  return (
    <article data-news-featured data-reveal className="mt-[clamp(2.5rem,5vw,4rem)]">
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className="group grid items-center gap-x-[clamp(2rem,4vw,4rem)] gap-y-6 md:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]"
      >
        <span className="relative block aspect-[480/222] overflow-hidden rounded-[var(--island-radius)] bg-coal/5">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 48rem) 30rem, 100vw"
            quality={82}
            // the page's LCP and its only preloaded image
            preload
            loading="eager"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </span>
        <span className="block">
          {item.date && (
            <time dateTime={item.date} className="t-label block text-muted">
              {formatDate(item.date)}
            </time>
          )}
          {/* display type over several lines: a touch more leading than the titles, and the hover line
              tucked close under the letters (its default 0.25em drop would sit on the next line) */}
          <span className="mt-4 block text-[clamp(1.625rem,2.6vw,2.75rem)] font-medium leading-[1.2] tracking-[-0.035em] text-balance [font-stretch:88%]">
            <span className="link-line mb-[-0.04em] pb-[0.04em]">{item.title}</span>
          </span>
          <span className="mt-5 block max-w-[60ch] text-[1.0625rem] leading-[1.6] text-pretty text-graphite">{item.summary}</span>
          <span className="t-label mt-6 inline-flex items-center gap-1.5 text-coal">
            {labels.more}
            <ArrowUpRight
              aria-hidden="true"
              strokeWidth={1.75}
              className="size-3.5 transition-[translate] duration-500 ease-out-expo group-hover:-translate-y-px group-hover:translate-x-px motion-reduce:transition-none"
            />
          </span>
          <span className="sr-only">{labels.newTab}</span>
        </span>
      </a>
    </article>
  );
}

/** One item: its photograph, date and title (the summary is the article's). */
function Card({ item, labels }: { item: NewsArchiveItem; labels: ItemLabels }) {
  return (
    <a href={item.href} target="_blank" rel="noreferrer" className="group block">
      <span className="relative block aspect-[480/222] overflow-hidden rounded-xl bg-coal/5">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 46vw, 100vw"
          quality={82}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </span>
      <span className="mt-4 flex items-center justify-between gap-4">
        {item.date ? (
          <time dateTime={item.date} className="t-label text-muted">
            {formatDate(item.date)}
          </time>
        ) : (
          <span />
        )}
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="size-4 shrink-0 text-coal/45 transition-[translate,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coal motion-reduce:transition-none"
        />
      </span>
      <span className="mt-2.5 block text-[clamp(1.0625rem,1.2vw,1.25rem)] font-medium leading-snug tracking-[-0.015em] text-pretty">
        <span className="link-line">{item.title}</span>
      </span>
      <span className="sr-only">{labels.newTab}</span>
    </a>
  );
}
