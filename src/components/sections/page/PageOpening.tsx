// An inner page's opening: where the visitor is and what the page is about. The menu's place ("Sobre
// nós / A Patinter"), the official H1, the official lead, optionally an index of the page's own
// sections, and a photograph. Used by /a-patinter and /sustentabilidade/compromissos.
//
// It is the home hero's first chapter (Hero.tsx), smaller and unpinned: the same label, title, lead
// and photograph frame, the copy on the left and the photograph on the right from lg. No logo screen,
// no pin, no GSAP: a server component whose entrance is pure CSS (the [data-page-opening] block in
// globals.css), so the H1 and the photograph (the LCP) paint at once and never wait for hydration.
// The keyframes exist only with motion allowed: with reduced motion, or before that CSS has a say,
// everything is simply on the page, the photograph fully open.
//
// The header's island floats over the top of this section (it stays at RESTING_STAGE on inner pages,
// there being no hero): the copy and the photograph both start under it.
import Image, { type StaticImageData } from "next/image";

export type PageOpeningProps = {
  /** the section's id; the H1's is `${id}-title` */
  id: string;
  place: { group: string; page: string };
  /** said in full for screen readers */
  title: string;
  /** the same words on two lines (or three, for a long title), as shown */
  titleLines: string[];
  /** a long word in the title ("Sustentabilidade"): a size that keeps it inside the copy column */
  longTitle?: boolean;
  lead: string;
  /** the page's own sections (SmoothScroll glides hash links under the header and moves focus) */
  index?: { label: string; href: string }[];
  /** the index's name for screen readers ("Nesta página") */
  indexLabel?: string;
  /** e.g. "lg:hidden", where the page has another index on wide screens */
  indexClassName?: string;
  /** the photograph beside the copy */
  photo: {
    src: StaticImageData;
    /** what the photograph shows, and nothing more */
    alt: string;
    /** the width the photograph is drawn at (it is cropped with object-fit: cover — see the callers) */
    sizes: string;
    /** the framing, phones and lg: a value for the --opening-pos custom property, e.g.
     *  "[--opening-pos:66%_30%] lg:[--opening-pos:64%_40%]" */
    framing: string;
  };
};

/**
 * The opening's label and H1, on their own for a page whose opening is not this component's (Patrocínios
 * sets them at the top of its form's column). Inside an element carrying data-page-opening they come in
 * with the same CSS entrance.
 */
export function OpeningHead({
  titleId,
  place,
  title,
  titleLines,
  longTitle,
}: {
  titleId: string;
  place: { group: string; page: string };
  title: string;
  titleLines: string[];
  longTitle?: boolean;
}) {
  const titleSize = longTitle ? "text-[clamp(2.125rem,8.6vw,3.75rem)] lg:text-[clamp(3rem,4.3vw,5.25rem)]" : "text-[length:var(--title)]";
  return (
    <>
      {/* the official menu group and item, in the hero's '01 / Transporte' pattern */}
      <p data-opening-rise="label" className="t-label flex items-center gap-3 text-coal">
        <span aria-hidden="true" className="block h-[3px] w-7 bg-signal" />
        <span className="text-red-deep">{place.group}</span>
        <span aria-hidden="true" className="opacity-45">
          /
        </span>
        <span>{place.page}</span>
      </p>

      {/* The official H1, said in full for screen readers; on screen two lines, each rising out of its
          own mask (the padding keeps accents and descenders), and the red stop. */}
      <h1 id={titleId} className={`mt-6 font-medium leading-[0.9] tracking-[-0.05em] [font-stretch:88%] text-coal ${titleSize}`}>
        <span className="sr-only">{title}</span>
        <span aria-hidden="true" className="block">
          {titleLines.map((line, i) => (
            <span key={line} className="hero-line-mask block overflow-x-visible overflow-y-clip">
              {/* each line 0.07s after the one above (globals.css sets the first two the same way: this
                  only matters from a third line on, and only with motion allowed) */}
              <span data-opening-line={i + 1} className="block" style={{ animationDelay: `${0.25 + i * 0.07}s` }}>
                {line}
                {i === titleLines.length - 1 && <span className="text-signal">.</span>}
              </span>
            </span>
          ))}
        </span>
      </h1>
    </>
  );
}

export function PageOpening({ id, place, title, titleLines, longTitle, lead, index, indexLabel, indexClassName = "", photo }: PageOpeningProps) {
  const titleId = `${id}-title`;

  return (
    <section id={id} data-page-opening aria-labelledby={titleId} className="relative isolate bg-chalk">
      {/* the hero chapter's composition: one column on phones (copy, then photograph), from lg the
          copy beside the photograph's frame column, centred on it. The top padding at lg is the
          frame's own (one inset under the island), so even a copy taller than the photograph (a short
          window) starts clear of the island. */}
      <article className="flex flex-col pb-[var(--island-inset)] lg:flex-row lg:items-stretch lg:pt-[var(--frame-top)]">
        <div className="px-[var(--gutter)] pt-[calc(var(--header-h)+2.5rem)] lg:min-w-0 lg:flex-1 lg:self-center lg:py-[clamp(1.5rem,3vw,3rem)]">
          <OpeningHead titleId={titleId} place={place} title={title} titleLines={titleLines} longTitle={longTitle} />

          <p data-opening-rise="lead" className="t-lead mt-7 max-w-[34ch] text-graphite">
            {lead}
          </p>

          {index && index.length > 0 && (
            <nav data-opening-rise="index" aria-label={indexLabel} className={`mt-8 ${indexClassName}`}>
              <ul className="-my-3 flex flex-wrap gap-x-[clamp(1.5rem,2.5vw,2.25rem)]">
                {index.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="t-label inline-block py-3 text-coal">
                      <span className="link-line">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* The photograph in the hero's frame: the header island's inset and corner radius, so the
            two read as one system. No fill of its own (the blur placeholder covers loading: a fill
            would show as a rim along the rounded corners); `isolate` keeps those corners clipping the
            scaled picture inside (WebKit). Wide screens: the frame column, one inset under the island,
            not quite a screen tall so the next section shows under it; it grows with the copy if that
            is taller. Narrow: 4:3, after the copy. */}
        <figure
          data-opening-frame
          className="relative isolate mx-[var(--island-inset)] mt-10 aspect-[4/3] overflow-hidden rounded-[var(--island-radius)] lg:mt-0 lg:ml-0 lg:aspect-auto lg:min-h-[min(100svh_-_var(--frame-top)_-_4rem,40rem)] lg:w-[var(--frame-col)] lg:shrink-0"
        >
          <div data-opening-photo className="absolute inset-0">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={photo.sizes}
              quality={90}
              placeholder="blur"
              // the page's LCP and its only preloaded image
              preload
              loading="eager"
              // one variable feeds both the picture's object-position and its blur placeholder's
              // background-position (next/image copies style.objectPosition to it), so the two never
              // disagree
              className={`object-cover ${photo.framing}`}
              style={{ objectPosition: "var(--opening-pos)" }}
            />
          </div>
        </figure>
      </article>
    </section>
  );
}
