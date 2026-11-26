"use client";

// Full-size canvas that renders the disintegrating symbol at whatever progress it is told. It never
// animates by itself: a GSAP timeline (the lab) or a ScrollTrigger (the future site intro) moves the
// progress and calls setProgress — this component only draws.
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { drawField, loadSymbol, readSymbolPixels, SYMBOL_CROP } from "@/lib/disintegration/canvas";
import { buildField, fitLayout, gridFor, type Field } from "@/lib/disintegration/engine";

export type DisintegrationHandle = {
  /** Draws the frame at `progress`: 0 is the intact symbol, 1 is nothing left. */
  setProgress: (progress: number) => void;
};

type Props = {
  /** Roughly how many particles make up the symbol. More particles means smaller ones. */
  particles: number;
  /** How far and how loosely the fragments travel; 1 is the default. */
  intensity: number;
  /** Called once the field is built, with the exact particle count. */
  onBuilt?: (particles: number) => void;
  /** Framing: the symbol's largest height (px) and the height of its centre (0 top – 1 bottom). */
  maxHeight?: number;
  centerY?: number;
  className?: string;
  ref?: Ref<DisintegrationHandle>;
};

/** Device-pixel ratio is capped: beyond 2× the extra pixels cost far more than they show. */
const MAX_DPR = 2;

export function DisintegrationCanvas({ particles, intensity, onBuilt, maxHeight, centerY, className = "", ref }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fieldRef = useRef<Field | null>(null);
  const progressRef = useRef(0);
  const intensityRef = useRef(intensity);
  const fitRef = useRef({ maxHeight, centerY });
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const onBuiltRef = useRef(onBuilt);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    onBuiltRef.current = onBuilt;
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    const { width, height, dpr } = sizeRef.current;
    if (!canvas || !field || !width || !height) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawField(ctx, field, progressRef.current, fitLayout(field, width, height, intensityRef.current, fitRef.current));
  }, []);

  // Drawn synchronously, not on the next frame: when a timeline or ScrollTrigger calls this it is
  // already inside the animation frame, and deferring would lag the scroll by one frame.
  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress) {
        progressRef.current = Math.min(1, Math.max(0, progress));
        draw();
      },
    }),
    [draw]
  );

  useEffect(() => {
    let alive = true;
    loadSymbol()
      .then((image) => {
        if (!alive) return;
        imageRef.current = image;
        setImageReady(true);
      })
      .catch((error: unknown) => console.error(error));
    return () => {
      alive = false;
    };
  }, []);

  // (re)build the particles from the symbol whenever the requested count changes
  useEffect(() => {
    const image = imageRef.current;
    if (!imageReady || !image) return;
    const { cols, rows } = gridFor(readSymbolPixels(image, SYMBOL_CROP.width, SYMBOL_CROP.height), particles);
    fieldRef.current = buildField(readSymbolPixels(image, cols, rows));
    onBuiltRef.current?.(fieldRef.current.count);
    draw();
  }, [imageReady, particles, draw]);

  useEffect(() => {
    intensityRef.current = intensity;
    fitRef.current = { maxHeight, centerY };
    draw();
  }, [intensity, maxHeight, centerY, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      sizeRef.current = { width, height, dpr };
      draw();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  return <canvas ref={canvasRef} role="img" aria-label="Símbolo da Patinter" className={`block size-full ${className}`} />;
}
