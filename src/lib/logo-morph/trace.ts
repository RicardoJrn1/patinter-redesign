// Turns the official logo raster into vector components: each stripe of the symbol and each letter of
// the name becomes a path of its own, so they can move independently and stay sharp at any size.
//
// Nothing is redrawn. The outlines are traced from the artwork's own anti-aliased pixels (marching
// squares at half coverage), so they run between pixels exactly where the file's edges are, and the
// colours are averaged from the file's solid pixels. Rasterised back at the file's size, the result
// matches the original (scripts/trace-logo.mjs reports the difference).
//
// Pure: no DOM, no Node. The generator script reads the pixels and writes logo-paths.ts.

export type Box = readonly [x0: number, y0: number, x1: number, y1: number];

export type TracedStripe = {
  /** Bounding box in logo pixels (x1/y1 exclusive). */
  box: Box;
  /** The whole stripe, painted red; the yellow part is painted over it. */
  base: string;
  yellow: string;
};

export type TracedLetter = { box: Box; path: string };

export type TracedLogo = {
  width: number;
  height: number;
  /** First column of the name: the symbol fills the columns before it. */
  symbolWidth: number;
  red: string;
  yellow: string;
  /** Top to bottom. */
  stripes: TracedStripe[];
  /** Left to right ("i" keeps its dot). */
  letters: TracedLetter[];
};

type Pixels = { width: number; height: number; data: ArrayLike<number> };

/** Coverage at which a pixel counts as part of a shape when splitting the artwork into pieces. */
const SOLID = 0.1;
/** Outline simplification, in logo pixels: removes the staircase noise, never the shape. */
const TOLERANCE = 0.06;

export function traceLogo(src: Pixels): TracedLogo {
  const { width: W, height: H, data } = src;
  const n = W * H;
  const alpha = new Float32Array(n);
  for (let i = 0; i < n; i++) alpha[i] = data[i * 4 + 3] / 255;

  // the two inks, averaged from fully opaque pixels; yellow is the one with a strong green channel
  const sums = { red: [0, 0, 0, 0], yellow: [0, 0, 0, 0] };
  for (let i = 0; i < n; i++) {
    if (alpha[i] < 0.99) continue;
    const s = data[i * 4 + 1] > 128 ? sums.yellow : sums.red;
    s[0] += data[i * 4];
    s[1] += data[i * 4 + 1];
    s[2] += data[i * 4 + 2];
    s[3]++;
  }
  const ink = (s: number[]) => [s[0] / s[3], s[1] / s[3], s[2] / s[3]];
  const red = ink(sums.red);
  const yellow = ink(sums.yellow);
  // how yellow a pixel is, from 0 (red) to 1 (yellow): the green channel is what tells them apart
  const yellowness = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = (data[i * 4 + 1] - red[1]) / (yellow[1] - red[1]);
    yellowness[i] = Math.min(1, Math.max(0, t));
  }

  // split into connected pieces (8-connectivity)
  const label = new Int32Array(n).fill(-1);
  const pieces: { pixels: number[]; box: [number, number, number, number]; hasYellow: boolean }[] = [];
  for (let start = 0; start < n; start++) {
    if (label[start] !== -1 || alpha[start] <= SOLID) continue;
    const id = pieces.length;
    const piece = { pixels: [] as number[], box: [W, H, 0, 0] as [number, number, number, number], hasYellow: false };
    const stack = [start];
    label[start] = id;
    while (stack.length) {
      const p = stack.pop()!;
      piece.pixels.push(p);
      const x = p % W;
      const y = (p - x) / W;
      piece.box[0] = Math.min(piece.box[0], x);
      piece.box[1] = Math.min(piece.box[1], y);
      piece.box[2] = Math.max(piece.box[2], x + 1);
      piece.box[3] = Math.max(piece.box[3], y + 1);
      if (alpha[p] > 0.5 && yellowness[p] > 0.5) piece.hasYellow = true;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const q = ny * W + nx;
          if (label[q] === -1 && alpha[q] > SOLID) {
            label[q] = id;
            stack.push(q);
          }
        }
      }
    }
    pieces.push(piece);
  }

  // the symbol is the pieces with yellow in them (every stripe has some); the rest is the name
  const stripes = pieces.filter((p) => p.hasYellow).sort((a, b) => a.box[1] - b.box[1]);
  const symbolWidth = Math.max(...stripes.map((p) => p.box[2]));
  // letters: name pieces whose columns overlap belong together (the dot of the "i")
  const letters: (typeof pieces)[number][] = [];
  for (const p of pieces.filter((q) => !q.hasYellow && q.pixels.length >= 3).sort((a, b) => a.box[0] - b.box[0])) {
    const last = letters[letters.length - 1];
    if (last && p.box[0] < last.box[2]) {
      last.pixels.push(...p.pixels);
      last.box = [
        Math.min(last.box[0], p.box[0]),
        Math.min(last.box[1], p.box[1]),
        Math.max(last.box[2], p.box[2]),
        Math.max(last.box[3], p.box[3]),
      ];
    } else letters.push({ ...p, pixels: [...p.pixels] });
  }

  const outline = (pixels: number[], weight?: Float32Array) => {
    const field = new Float32Array(n);
    for (const p of pixels) field[p] = weight ? alpha[p] * weight[p] : alpha[p];
    return toPath(contours(field, W, H, 0.5));
  };

  return {
    width: W,
    height: H,
    symbolWidth,
    red: hex(red),
    yellow: hex(yellow),
    stripes: stripes.map((p) => ({ box: p.box, base: outline(p.pixels), yellow: outline(p.pixels, yellowness) })),
    letters: letters.map((p) => ({ box: p.box, path: outline(p.pixels) })),
  };
}

function hex([r, g, b]: number[]) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Closed outlines of `field ≥ iso` (marching squares). Samples sit at pixel centres; crossings are
 * interpolated along the cell edges, which is what puts the outline between pixels.
 */
function contours(field: Float32Array, W: number, H: number, iso: number): number[][] {
  // pad with a ring of zeros so every outline closes
  const GW = W + 2;
  const GH = H + 2;
  const v = (gx: number, gy: number) => (gx < 1 || gy < 1 || gx > W || gy > H ? 0 : field[(gy - 1) * W + (gx - 1)]);

  // edge ids: horizontal edge from (gx,gy) to (gx+1,gy) → even; vertical from (gx,gy) to (gx,gy+1) → odd
  const hEdge = (gx: number, gy: number) => (gy * GW + gx) * 2;
  const vEdge = (gx: number, gy: number) => (gy * GW + gx) * 2 + 1;
  const point = (id: number): [number, number] => {
    const k = id >> 1;
    const gx = k % GW;
    const gy = (k - gx) / GW;
    const v0 = v(gx, gy);
    const v1 = id & 1 ? v(gx, gy + 1) : v(gx + 1, gy);
    const t = (iso - v0) / (v1 - v0);
    // grid point g sits at the centre of pixel g - 1, i.e. at g - 0.5
    return id & 1 ? [gx - 0.5, gy + t - 0.5] : [gx + t - 0.5, gy - 0.5];
  };

  const links = new Map<number, number[]>();
  const link = (a: number, b: number) => {
    (links.get(a) ?? links.set(a, []).get(a)!).push(b);
    (links.get(b) ?? links.set(b, []).get(b)!).push(a);
  };

  for (let gy = 0; gy < GH - 1; gy++) {
    for (let gx = 0; gx < GW - 1; gx++) {
      const tl = v(gx, gy);
      const tr = v(gx + 1, gy);
      const br = v(gx + 1, gy + 1);
      const bl = v(gx, gy + 1);
      const c = (tl >= iso ? 8 : 0) | (tr >= iso ? 4 : 0) | (br >= iso ? 2 : 0) | (bl >= iso ? 1 : 0);
      if (c === 0 || c === 15) continue;
      const T = hEdge(gx, gy);
      const B = hEdge(gx, gy + 1);
      const L = vEdge(gx, gy);
      const R = vEdge(gx + 1, gy);
      const centre = (tl + tr + br + bl) / 4 >= iso;
      switch (c) {
        case 1: case 14: link(L, B); break;
        case 2: case 13: link(B, R); break;
        case 3: case 12: link(L, R); break;
        case 4: case 11: link(T, R); break;
        case 6: case 9: link(T, B); break;
        case 7: case 8: link(T, L); break;
        case 5: // TR and BL inside
          if (centre) { link(T, L); link(R, B); } else { link(T, R); link(L, B); }
          break;
        case 10: // TL and BR inside
          if (centre) { link(T, R); link(L, B); } else { link(T, L); link(R, B); }
          break;
      }
    }
  }

  // every crossing joins exactly two segments: walk them into loops
  const loops: number[][] = [];
  const seen = new Set<number>();
  for (const start of links.keys()) {
    if (seen.has(start)) continue;
    const loop: number[] = [];
    let prev = -1;
    let at = start;
    while (!seen.has(at)) {
      seen.add(at);
      const [x, y] = point(at);
      loop.push(x, y);
      const next = links.get(at)!;
      const to = next[0] !== prev ? next[0] : next[1];
      prev = at;
      at = to;
    }
    if (loop.length >= 6) loops.push(simplifyLoop(loop, TOLERANCE));
  }
  return loops;
}

/** Ramer–Douglas–Peucker on a closed loop (split at its two most distant points). */
function simplifyLoop(flat: number[], tolerance: number): number[] {
  const pts: [number, number][] = [];
  for (let i = 0; i < flat.length; i += 2) pts.push([flat[i], flat[i + 1]]);
  let far = 0;
  let best = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2;
    if (d > best) {
      best = d;
      far = i;
    }
  }
  const a = rdp(pts.slice(0, far + 1), tolerance);
  const b = rdp([...pts.slice(far), pts[0]], tolerance);
  return [...a.slice(0, -1), ...b.slice(0, -1)].flat();
}

function rdp(pts: [number, number][], tolerance: number): [number, number][] {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let worst = 0;
  let index = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
    if (d > worst) {
      worst = d;
      index = i;
    }
  }
  if (worst <= tolerance) return [pts[0], pts[pts.length - 1]];
  return [...rdp(pts.slice(0, index + 1), tolerance).slice(0, -1), ...rdp(pts.slice(index), tolerance)];
}

/** SVG path data; holes (the counters of P, a, e) are separate loops, filled with even-odd. */
function toPath(loops: number[][]): string {
  const f = (v: number) => String(Math.round(v * 100) / 100);
  return loops
    .map((loop) => {
      let d = `M${f(loop[0])} ${f(loop[1])}L`;
      for (let i = 2; i < loop.length; i += 2) d += `${f(loop[i])} ${f(loop[i + 1])} `;
      return `${d.trimEnd()}Z`;
    })
    .join("");
}
