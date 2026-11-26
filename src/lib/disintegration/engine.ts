// Particle engine for the disintegrating Patinter symbol.
//
// Pure maths — no DOM, no React, no GSAP. It turns a bitmap of the symbol into a particle field and
// answers one question: where is particle i at progress p? Every particle is a pure function of
// progress, so the effect plays, pauses and scrubs backwards for free, and the same field can be
// driven by a GSAP timeline today and a ScrollTrigger tomorrow without any change here.
//
// (Kept free of imports and of TypeScript-only runtime syntax on purpose: it also runs directly in
// Node, which is how the frames of the effect are previewed without a browser.)

/** RGBA bytes, row-major — an ImageData, or raw pixels from an image library. */
export type PixelSource = { data: ArrayLike<number>; width: number; height: number };

/**
 * The particles, stored as parallel typed arrays and grouped by colour (bucket b owns the slice
 * bucketStart[b] … bucketStart[b + 1]), so a renderer sets each colour once per frame.
 * Positions are in sampling-grid cells; a Layout maps them to pixels.
 */
export type Field = {
  count: number;
  cols: number;
  rows: number;
  /** home position (cell centre) */
  hx: Float32Array;
  hy: Float32Array;
  /** opacity at rest, from the source pixel (anti-aliased edges stay soft) */
  alpha: Float32Array;
  /** progress at which the particle lets go, and how much progress its flight lasts */
  t0: Float32Array;
  life: Float32Array;
  /** unit direction of flight */
  ux: Float32Array;
  uy: Float32Array;
  speed: Float32Array;
  /** sideways sway, so paths drift instead of running in straight lines */
  swayAmp: Float32Array;
  swayPhase: Float32Array;
  swayFreq: Float32Array;
  /** size in flight, as a multiple of a cell (at rest every particle is exactly one cell) */
  size: Float32Array;
  /** fraction of its flight after which the particle starts to fade */
  fade: Float32Array;
  bucketStart: Uint32Array;
  /** one CSS colour per bucket, and the same as RGB triplets */
  palette: string[];
  paletteRGB: Uint8Array;
};

/** Where the grid sits on screen and how far things fly, in pixels. */
export type Layout = {
  /** top-left of the grid */
  x: number;
  y: number;
  /** pixels per cell */
  cell: number;
  /** distance a full-speed particle covers over its flight */
  travel: number;
  /** largest sideways sway */
  sway: number;
};

export type ParticleState = { x: number; y: number; size: number; alpha: number };

/**
 * Pacing of the whole effect, in units of progress (0 → 1).
 * - lead: the symbol holds, intact, for this long before anything lets go
 * - life: how long a particle's flight lasts (± lifeJitter / 2)
 * - hold: > 0 and ≤ 1. The share of the symbol released by a given moment grows as
 *   elapsed^(1 / hold): below 1 the release starts sparse — only the extremities fray — and gathers
 *   pace, which keeps the silhouette readable for longer without a sudden collapse at the end.
 */
export const PACING = { lead: 0.06, life: 0.27, lifeJitter: 0.4, hold: 0.7 } as const;

/** Release order: how much each factor brings a particle's release forward. Sums to 1. */
const WEIGHT = { radius: 0.56, cluster: 0.16, stripeEnd: 0.18, jitter: 0.1 } as const;

/** Intact cells are drawn this much (px) larger, so neighbouring squares never show seams. */
const SEAM = 0.5;

const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------ helpers

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(ix: number, iy: number, seed: number) {
  let h = Math.imul(ix | 0, 0x27d4eb2d) ^ Math.imul(iy | 0, 0x165667b1) ^ Math.imul(seed | 0, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth 2D value noise in [0, 1]: neighbours get similar values, so fragments leave in clusters. */
function valueNoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ------------------------------------------------------------------------------------ building

/**
 * Sampling grid that yields roughly `target` particles: the particle count grows with the square of
 * the sampling scale, so measure how many pixels the symbol covers at native size and scale from it.
 */
export function gridFor(native: PixelSource, target: number, alphaThreshold = 0.2) {
  const thr = alphaThreshold * 255;
  let covered = 0;
  for (let i = 3; i < native.width * native.height * 4; i += 4) if (native.data[i] > thr) covered++;
  const k = Math.sqrt(target / Math.max(1, covered));
  return { cols: Math.max(8, Math.round(native.width * k)), rows: Math.max(8, Math.round(native.height * k)) };
}

export function buildField(src: PixelSource, { seed = 7, alphaThreshold = 0.2 } = {}): Field {
  const { width: cols, height: rows, data } = src;
  const thr = alphaThreshold * 255;
  const at = (x: number, y: number) => data[(y * cols + x) * 4 + 3];

  // every covered pixel becomes a particle; its alpha-weighted centre is the symbol's centre
  const pix: number[] = [];
  let sx = 0;
  let sy = 0;
  let sw = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const a = at(x, y);
      if (a <= thr) continue;
      pix.push(y * cols + x);
      const w = a / 255;
      sx += (x + 0.5) * w;
      sy += (y + 0.5) * w;
      sw += w;
    }
  }
  const n = pix.length;
  const cx = sx / Math.max(sw, 1e-6);
  const cy = sy / Math.max(sw, 1e-6);
  let rmax = 1e-6;
  for (const p of pix) rmax = Math.max(rmax, Math.hypot((p % cols) + 0.5 - cx, Math.floor(p / cols) + 0.5 - cy));

  // The symbol is a stack of horizontal stripes. Measure how close each pixel is to an end of its
  // stripe: ends let go a little earlier, so each stripe frays from its tips instead of the whole
  // shape being wiped by a perfect circle.
  const stripeEnd = new Float32Array(cols * rows);
  const fray = Math.max(1, cols * 0.05);
  for (let y = 0; y < rows; y++) {
    let x = 0;
    while (x < cols) {
      if (at(x, y) <= thr) {
        x++;
        continue;
      }
      const start = x;
      while (x < cols && at(x, y) > thr) x++;
      const end = x - 1;
      for (let k = start; k <= end; k++) stripeEnd[y * cols + k] = Math.exp(-Math.min(k - start, end - k) / fray);
    }
  }

  // release priority: extremities first (far from the centre), in clusters, fraying from stripe ends
  const rand = mulberry32(seed);
  const noiseScale = 1 / (Math.max(cols, rows) * 0.075);
  const priority = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = pix[i];
    const x = (p % cols) + 0.5;
    const y = Math.floor(p / cols) + 0.5;
    const radius = Math.hypot(x - cx, y - cy) / rmax;
    const cluster =
      0.65 * valueNoise(x * noiseScale, y * noiseScale, seed) +
      0.35 * valueNoise(x * noiseScale * 2.3, y * noiseScale * 2.3, seed + 31);
    priority[i] =
      WEIGHT.radius * radius + WEIGHT.cluster * cluster + WEIGHT.stripeEnd * stripeEnd[p] + WEIGHT.jitter * rand();
  }
  // Rank, not min–max: priorities bunch up wherever the symbol has the most pixels at one radius, and a
  // min–max scale turns that bunch into everything letting go at once. Ranks spread the release evenly,
  // so its pace is set by PACING.hold alone.
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => priority[a] - priority[b]);
  const rank = new Float32Array(n);
  for (let k = 0; k < n; k++) rank[order[k]] = n > 1 ? k / (n - 1) : 1;

  // colour buckets: quantise to 4 bits per channel, colour each bucket with its members' mean
  const bucketOf = new Int32Array(n);
  const keyToBucket = new Map<number, number>();
  const sums: number[] = [];
  for (let i = 0; i < n; i++) {
    const o = pix[i] * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    let bucket = keyToBucket.get(key);
    if (bucket === undefined) {
      bucket = keyToBucket.size;
      keyToBucket.set(key, bucket);
      sums.push(0, 0, 0, 0);
    }
    bucketOf[i] = bucket;
    sums[bucket * 4] += r;
    sums[bucket * 4 + 1] += g;
    sums[bucket * 4 + 2] += b;
    sums[bucket * 4 + 3] += 1;
  }
  const buckets = keyToBucket.size;
  const bucketStart = new Uint32Array(buckets + 1);
  for (let b = 0; b < buckets; b++) bucketStart[b + 1] = bucketStart[b] + sums[b * 4 + 3];
  const palette: string[] = [];
  const paletteRGB = new Uint8Array(buckets * 3);
  for (let b = 0; b < buckets; b++) {
    const c = sums[b * 4 + 3];
    const r = Math.round(sums[b * 4] / c);
    const g = Math.round(sums[b * 4 + 1] / c);
    const bl = Math.round(sums[b * 4 + 2] / c);
    palette.push(`rgb(${r} ${g} ${bl})`);
    paletteRGB.set([r, g, bl], b * 3);
  }

  const field: Field = {
    count: n,
    cols,
    rows,
    hx: new Float32Array(n),
    hy: new Float32Array(n),
    alpha: new Float32Array(n),
    t0: new Float32Array(n),
    life: new Float32Array(n),
    ux: new Float32Array(n),
    uy: new Float32Array(n),
    speed: new Float32Array(n),
    swayAmp: new Float32Array(n),
    swayPhase: new Float32Array(n),
    swayFreq: new Float32Array(n),
    size: new Float32Array(n),
    fade: new Float32Array(n),
    bucketStart,
    palette,
    paletteRGB,
  };

  const { lead, life, lifeJitter, hold } = PACING;
  // the latest release still leaves the longest flight room to finish before progress 1: no residue
  const latest = 1 - life * (1 + lifeJitter / 2) - 0.004;
  const cursor = bucketStart.slice(0, buckets);

  for (let i = 0; i < n; i++) {
    const p = pix[i];
    const x = (p % cols) + 0.5;
    const y = Math.floor(p / cols) + 0.5;
    const j = cursor[bucketOf[i]]++;

    field.hx[j] = x;
    field.hy[j] = y;
    field.alpha[j] = data[p * 4 + 3] / 255;

    const t0 = lead + (latest - lead) * Math.pow(1 - rank[i], hold);
    field.t0[j] = t0;
    field.life[j] = Math.min(life * (1 + (rand() - 0.5) * lifeJitter), 0.996 - t0);

    // Outwards towards the side of the screen the particle is on — mostly horizontal, along the
    // stripes, fanning slightly up above the centre and down below it. The horizontal pull grows
    // smoothly with the distance from the centre line instead of flipping sign at it: a hard flip sends
    // neighbours on either side of the line in opposite directions and tears the symbol in two.
    const dx = x - cx;
    const pull = Math.max(-1, Math.min(1, dx / (cols * 0.22)));
    const fan = Math.max(-1, Math.min(1, (y - cy) / (rows * 0.5)));
    const angle = fan * 0.28 + (rand() * 2 - 1) * 0.34;
    field.ux[j] = pull * Math.cos(angle);
    field.uy[j] = Math.sin(angle);
    field.speed[j] = (0.25 + 0.75 * Math.abs(pull)) * (0.55 + 0.9 * rand());

    field.swayAmp[j] = 0.3 + 0.7 * rand();
    field.swayPhase[j] = rand() * TAU;
    field.swayFreq[j] = TAU * (0.5 + 0.9 * rand());

    // mostly small fragments, with the odd larger one
    field.size[j] = rand() < 0.07 ? 1.25 + 0.5 * rand() : 0.42 + 0.6 * Math.pow(rand(), 1.6);
    // some fragments thin out almost as soon as they leave, others carry further before fading
    field.fade[j] = 0.06 + 0.32 * rand();
  }

  return field;
}

// ------------------------------------------------------------------------------------ frames

/**
 * Centred framing for a viewport. `intensity` scales how far and how loosely the fragments travel.
 * The symbol keeps the same on-screen size whatever the particle count (more particles = smaller ones).
 */
export function fitLayout(
  field: Field,
  width: number,
  height: number,
  intensity: number,
  { maxHeight = 340, centerY = 0.46 } = {}
): Layout {
  const cell = Math.min(Math.min(height * 0.42, maxHeight) / field.rows, (width * 0.62) / field.cols);
  return {
    x: width / 2 - (field.cols * cell) / 2,
    y: height * centerY - (field.rows * cell) / 2,
    cell,
    travel: width * 0.36 * intensity,
    sway: field.rows * cell * 0.07 * intensity,
  };
}

/**
 * Particle i at `progress`, written into `out` (centre, size and opacity in pixels).
 * Returns false when there is nothing to draw: the particle has finished its flight.
 */
export function particleAt(f: Field, i: number, progress: number, L: Layout, out: ParticleState): boolean {
  const hx = L.x + f.hx[i] * L.cell;
  const hy = L.y + f.hy[i] * L.cell;
  const local = (progress - f.t0[i]) / f.life[i];

  if (local <= 0) {
    out.x = hx;
    out.y = hy;
    out.size = L.cell + SEAM;
    out.alpha = f.alpha[i];
    return true;
  }
  if (local >= 1) return false;

  // eases in: a fragment loosens slowly, then the drift carries it away
  const travel = L.travel * f.speed[i] * Math.pow(local, 1.45);
  const sway = L.sway * f.swayAmp[i] * Math.sin(f.swayPhase[i] + f.swayFreq[i] * local) * local;
  out.x = hx + f.ux[i] * travel - f.uy[i] * sway;
  out.y = hy + f.uy[i] * travel + f.ux[i] * sway;

  // from a seamless cell to its own fragment size, without a jump at the moment it lets go
  const shrink = smoothstep(0, 0.35, local);
  out.size = (L.cell + SEAM * (1 - shrink)) * (1 + (f.size[i] - 1) * shrink);
  out.alpha = f.alpha[i] * (1 - smoothstep(f.fade[i], 1, local));
  return out.alpha > 0.004;
}
