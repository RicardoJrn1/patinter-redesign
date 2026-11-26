"use client";

// The stage of the logo morph: one full-size SVG with every component of the logo as its own group —
// the 15 stripes of the symbol and the 8 letters of the name. It owns the timeline (timeline.ts) and
// draws each frame from the choreography (choreography.ts); whoever uses it plays, pauses or scrubs
// that timeline through the handle.
//
// The SVG has no viewBox, so its units are CSS pixels: the start is the symbol centred in the stage,
// the parts re-form as the full logo in the centre, and the end is that logo filling `target` (the
// header's logo slot, in the prototype).
import { useCallback, useEffect, useId, useImperativeHandle, useRef, type Ref, type RefObject } from "react";
import {
  centredSymbol,
  formedLogo,
  letterTransform,
  logoInBox,
  nameEdge,
  stripeTransform,
  type MorphLayout,
  type MorphParams,
  type Transform,
} from "@/lib/logo-morph/choreography";
import { LOGO } from "@/lib/logo-morph/logo-paths";
import { createMorphTimeline, type MorphValues } from "@/lib/logo-morph/timeline";

export type LogoMorphHandle = {
  /** The morph's timeline (paused until played). Null before the stage has mounted. */
  timeline: () => gsap.core.Timeline | null;
  /**
   * Moves the morph to `progress` (0–1) — for a scroll-driven owner. Safe before the stage has
   * mounted: the value is kept and applied as soon as the timeline exists.
   */
  setProgress: (progress: number) => void;
  /** Re-reads the start and the destination (e.g. after a ScrollTrigger refresh). */
  measure: () => void;
};

/** A box in the stage's own coordinates (CSS px from its top-left corner). */
export type StageBox = { left: number; top: number; height: number };

type Props = MorphParams & {
  /**
   * The element whose box the finished logo docks into (by height; the width follows the logo).
   * Without one (and without `end`), the logo stays where it re-formed, centred.
   */
  target?: RefObject<HTMLElement | null> | null;
  /** Alternative to `target`: computes the destination box directly, in stage coordinates. */
  end?: () => StageBox | null;
  /** Called on every frame with the timeline's progress (0–1). */
  onProgress?: (progress: number) => void;
  className?: string;
  ref?: Ref<LogoMorphHandle>;
};

const matrix = (t: Transform) => `matrix(${t.scale} 0 0 ${t.scale} ${t.x} ${t.y})`;

export function LogoMorph({ target, end, distance, intensity, onProgress, className = "", ref }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const stripeEls = useRef<(SVGGElement | null)[]>([]);
  const letterEls = useRef<(SVGGElement | null)[]>([]);
  const clipEdge = useRef<SVGRectElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const valuesRef = useRef<MorphValues | null>(null);
  const layoutRef = useRef<MorphLayout | null>(null);
  const paramsRef = useRef<MorphParams>({ distance, intensity });
  const progressRef = useRef(0);
  const onProgressRef = useRef(onProgress);
  const destination = useRef({ target, end });
  const clipId = `morph-clip-${useId().replace(/[^\w-]/g, "")}`;

  useEffect(() => {
    onProgressRef.current = onProgress;
  });

  // Draws the current frame. Plain attribute writes: two dozen groups, no React render per frame.
  const draw = useCallback(() => {
    const layout = layoutRef.current;
    const values = valuesRef.current;
    if (!layout || !values) return;
    const params = paramsRef.current;
    const t: Transform = { x: 0, y: 0, scale: 1 };
    for (let i = 0; i < values.split.length; i++) {
      stripeTransform(i, values.split[i].v, values.travel[i].v, values.dock.v, layout, params, t);
      stripeEls.current[i]?.setAttribute("transform", matrix(t));
    }
    for (let j = 0; j < values.reveal.length; j++) {
      letterTransform(values.reveal[j].v, values.dock.v, layout, t);
      letterEls.current[j]?.setAttribute("transform", matrix(t));
    }
    // the name is cut at the symbol's edge while it slides out
    clipEdge.current?.setAttribute("x", String(nameEdge(values.dock.v, layout)));
    onProgressRef.current?.(timelineRef.current?.progress() ?? 0);
  }, []);

  // start and end come from the stage's size and the destination; both move with the viewport
  const measure = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const stage = svg.getBoundingClientRect();
    if (!stage.width || !stage.height) return;
    const { target: el, end: box } = destination.current;
    const rect = el?.current?.getBoundingClientRect();
    const dest = box ? box() : rect ? { left: rect.left - stage.left, top: rect.top - stage.top, height: rect.height } : null;
    const start = centredSymbol(stage.width, stage.height);
    const form = formedLogo(stage.width, stage.height, start);
    layoutRef.current = { start, form, end: dest ? logoInBox(dest) : form };
    draw();
    svg.style.removeProperty("visibility");
  }, [draw]);

  useImperativeHandle(
    ref,
    () => ({
      timeline: () => timelineRef.current,
      setProgress(progress) {
        progressRef.current = progress;
        timelineRef.current?.progress(progress);
      },
      measure,
    }),
    [measure]
  );

  useEffect(() => {
    const { timeline, values } = createMorphTimeline(draw);
    timelineRef.current = timeline;
    valuesRef.current = values;
    // a scroll owner may have set the progress before this effect ran (its layout effects run first)
    timeline.progress(progressRef.current);
    draw();
    return () => {
      timeline.kill();
      timelineRef.current = null;
      valuesRef.current = null;
    };
  }, [draw]);

  // the controls only change inputs: redraw the frame where the playhead is
  useEffect(() => {
    paramsRef.current = { distance, intensity };
    draw();
  }, [distance, intensity, draw]);

  useEffect(() => {
    destination.current = { target, end };
    const svg = svgRef.current;
    if (!svg) return undefined;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    if (target?.current) observer.observe(target.current);
    return () => observer.disconnect();
  }, [target, end, measure]);

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label="Logótipo da Patinter"
      className={`pointer-events-none block size-full overflow-visible ${className}`}
      style={{ visibility: "hidden" }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect ref={clipEdge} x={0} y={-50000} width={100000} height={100000} />
        </clipPath>
      </defs>

      {LOGO.stripes.map((stripe, i) => (
        <g
          key={`stripe-${i}`}
          ref={(el) => {
            stripeEls.current[i] = el;
          }}
        >
          {/* red underneath, yellow over it: no seam where the two colours meet */}
          <path d={stripe.base} fill={LOGO.red} fillRule="evenodd" />
          <path d={stripe.yellow} fill={LOGO.yellow} fillRule="evenodd" />
        </g>
      ))}

      <g clipPath={`url(#${clipId})`}>
        {LOGO.letters.map((letter, j) => (
          <g
            key={`letter-${j}`}
            ref={(el) => {
              letterEls.current[j] = el;
            }}
          >
            <path d={letter.path} fill={LOGO.red} fillRule="evenodd" />
          </g>
        ))}
      </g>
    </svg>
  );
}
