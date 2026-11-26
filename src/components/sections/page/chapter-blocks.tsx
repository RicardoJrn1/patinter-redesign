// Building blocks for an IndexedChapters chapter's content: the text beside a photograph (or beside a
// second column of text), a label over a list, and the photograph's frame. They only lay out and tag
// elements for the chapters' reveals (IndexedChapters.tsx: data-reveal-block, data-fade, data-photo,
// data-zoom); no state of their own.
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

export type ChapterPhoto = {
  src: StaticImageData;
  /** what the photograph shows, and nothing more */
  alt: string;
  /** object-position, to keep the subject in the 4:3 frame */
  position?: string;
};

// the photograph's column: about a third of the screen from lg, half from md, the full width below
const PHOTO_SIZES = "(min-width: 64rem) 34vw, (min-width: 48rem) 48vw, 100vw";

/**
 * A chapter's text, its first paragraph a step larger, beside its photograph or a second column (`side`),
 * from md; one column on phones. With neither, one column, at a reading measure.
 */
export function ChapterText({ paragraphs, side, photo }: { paragraphs: string[]; side?: ReactNode; photo?: ChapterPhoto }) {
  const twoColumns = Boolean(side || photo);
  if (paragraphs.length === 0 && !twoColumns) return null;
  return (
    <div data-reveal-block className={`mt-[clamp(2rem,4vw,3.5rem)] ${twoColumns ? "grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-10 md:grid-cols-2" : ""}`}>
      {paragraphs.length > 0 && (
        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              data-fade
              data-reveal
              className={`max-w-[56ch] text-pretty ${
                i === 0 ? "text-[clamp(1.125rem,1.25vw,1.3125rem)] leading-[1.5] text-coal" : "text-[1.0625rem] leading-[1.6] text-graphite"
              }`}
            >
              {p}
            </p>
          ))}
        </div>
      )}
      {side}
      {photo && <PhotoFrame photo={photo} />}
    </div>
  );
}

/**
 * The hero's frame: the island's corner radius, no fill of its own (the blur placeholder covers
 * loading), `isolate` so the corners keep clipping the scaled picture. 4:3, never wider than the file
 * itself (some official photographs are small: better smaller than blurred).
 */
export function PhotoFrame({ photo }: { photo: ChapterPhoto }) {
  return (
    <figure
      data-photo
      className="relative isolate aspect-[4/3] w-full overflow-hidden rounded-[var(--island-radius)] md:self-start"
      style={{ maxWidth: photo.src.width }}
    >
      <div data-zoom className="absolute inset-0">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={PHOTO_SIZES}
          quality={90}
          placeholder="blur"
          className="object-cover"
          style={{ objectPosition: photo.position ?? "50% 50%" }}
        />
      </div>
    </figure>
  );
}

/**
 * A small label with the logo's colours in miniature (as the news' and the values' labels have them).
 * `reveal`: fades up with its block (IndexedChapters).
 */
export function BlockLabel({
  id,
  children,
  as: Tag = "h3",
  className = "",
  reveal = false,
}: {
  id?: string;
  children: ReactNode;
  as?: "h2" | "h3" | "p";
  className?: string;
  reveal?: boolean;
}) {
  return (
    <Tag
      id={id}
      data-fade={reveal || undefined}
      data-reveal={reveal || undefined}
      className={`t-label flex items-center gap-3 text-coal ${className}`}
    >
      <span aria-hidden="true" className="relative block h-[3px] w-7 shrink-0 bg-signal">
        <span className="absolute inset-y-0 right-0 w-2 bg-comet" />
      </span>
      <span>{children}</span>
    </Tag>
  );
}

/** 0 → '01' */
export const pad2 = (i: number) => String(i + 1).padStart(2, "0");
