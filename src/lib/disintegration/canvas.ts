// Browser side of the disintegration: loads the symbol, samples its pixels, draws frames on a 2D
// canvas. The particle maths lives in engine.ts and knows nothing about any of this.
import logo from "@/assets/brand/patinter-logo.png";
import { particleAt, type Field, type Layout, type ParticleState } from "./engine";

/**
 * The symbol's box inside the official logo file (230 × 85). Measured from the pixels: the symbol fills
 * columns 0–102, and column 103 is the first column of the wordmark's "P" (its stem, rows 41–71). So
 * this crop takes the whole symbol and none of the wordmark.
 *
 * The file is a small raster, which caps how sharp the symbol can be on screen. When a vector (or a
 * large) version of the symbol exists, point loadSymbol and this crop at it — nothing else changes.
 */
export const SYMBOL_CROP = { x: 0, y: 0, width: 103, height: 85 } as const;

export function loadSymbol(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar o símbolo da Patinter."));
    img.src = logo.src;
  });
}

/** The symbol's pixels resampled to `width × height` (the crop's own size gives native resolution). */
export function readSymbolPixels(img: HTMLImageElement, width: number, height: number): ImageData {
  const c = SYMBOL_CROP;
  // Crop first, at 1:1, onto a canvas of its own — and only then scale. Scaling a sub-rectangle of the
  // logo directly lets the smoothing filter sample just outside it, which pulls the stem of the
  // wordmark's "P" (the very next column) into the symbol as a faint red line down its right edge.
  const crop = document.createElement("canvas");
  crop.width = c.width;
  crop.height = c.height;
  const cropCtx = crop.getContext("2d");
  if (!cropCtx) throw new Error("Canvas 2D indisponível.");
  cropCtx.drawImage(img, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D indisponível.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(crop, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

const particle: ParticleState = { x: 0, y: 0, size: 0, alpha: 0 };

/**
 * Clears the canvas and draws the field at `progress`, in the context's current transform (the caller
 * sets the device-pixel ratio). Particles come grouped by colour, so the fill colour changes once per
 * group rather than once per particle.
 */
export function drawField(ctx: CanvasRenderingContext2D, field: Field, progress: number, layout: Layout) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
  if (progress >= 1) return;

  let alpha = -1;
  for (let b = 0; b < field.palette.length; b++) {
    ctx.fillStyle = field.palette[b];
    for (let i = field.bucketStart[b]; i < field.bucketStart[b + 1]; i++) {
      if (!particleAt(field, i, progress, layout, particle)) continue;
      if (particle.alpha !== alpha) {
        alpha = particle.alpha;
        ctx.globalAlpha = alpha;
      }
      const half = particle.size / 2;
      ctx.fillRect(particle.x - half, particle.y - half, particle.size, particle.size);
    }
  }
  ctx.globalAlpha = 1;
}
