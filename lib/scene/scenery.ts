import { ART, campGround, VILLAGE, VILLAGE_GROUND_Y } from '@/lib/scene/camp-layout';
import { rnd, rough } from '@/lib/scene/noise';
import { CAMP_ANCHORS } from '@/constants';
import {
  cameraKnot,
  campAnchor,
  CAMP_X,
  CAMP_Y,
  LEGS,
  type Point,
  SIDES,
  SUMMIT,
  SUMMIT_PITCH_D,
  WORLD,
} from '@/lib/scene/world';

/**
 * Scenery generator for the SVG stage. Everything is deterministic (integer-hash noise, no Math.random and
 * no trigonometry), so the server and the browser produce the same markup and the drawing is unit-testable.
 * Nothing here changes after it is painted: the stage moves whole layers with transforms and never touches
 * the SVG again, which is why scrolling costs no repaint. Each band's trees are a single path.
 */

const { CENTER_X: CX, VIEW, TRAVEL } = WORLD;

/**
 * The scene reads a few interface colours as tokens, so they follow the theme on their own: line work is ink (pale
 * moonlight at night), holes and doorways are shade (dark in both).
 */
const INK = 'var(--color-ink)';
const SHADE = 'var(--color-shade)';
const LABEL_FONT = 'var(--font-display)';
const LABEL_WEIGHT = 600;

/** Share of a band's reach that keeps its full colour before it fades out: a solid body, so layers behind it do not ghost through. */
const BODY_SHARE = 0.5;

/** Distance over which a ledge's level ground blends back into the rough crest. */
const LEDGE_BLEND = 90;

/** Horizontal extent painted for every band: wider than the world so wide screens never see an edge. */
const BAND_X0 = -260;
const BAND_X1 = 2660;
const BAND_STEP = 36;

export type Oklch = [l: number, c: number, h: number];

type Band = {
  seed: number;
  /** Crest height at the band's centre, in layer units. */
  y: number;
  cx: number;
  /** Half-width of the flat top before the shoulders fall away. */
  half: number;
  slope: number;
  rough: number;
  /** How far below the crest the fill fades out. */
  reach: number;
  tone?: Oklch;
  /** Crest line strength, 0 to 1. */
  ink?: number;
  /** Flatten the crest near `cx` so a camp can stand on it. */
  ledge?: boolean;
  /** Half-width around `cx` that is perfectly level; the roughness returns over LEDGE_BLEND beyond it. */
  flat?: number;
  n0?: number;
  solid?: boolean;
  /** Tree density tier; 0 for none. */
  pines?: number;
  /** X positions to keep clear of trees. */
  keep?: number[];
};

/** `trees`: this layer is near enough for its trees to be pictures rather than silhouettes. */
type LayerOptions = { fog: number; tone?: Oklch; fade?: boolean; ink?: number; trees?: boolean };

export type SceneLayer = {
  key: string;
  /** Parallax depth: 1 moves with the trail, less is further away, more is in front. */
  depth: number;
  /** Layer height in world units: one viewport plus the distance it travels. */
  height: number;
  markup: string;
};

function crestY(b: Band, x: number): number {
  const d = Math.abs(x - b.cx);
  const shoulder = d > b.half ? (d - b.half) * b.slope : 0;
  let n = rough(b.seed, x, b.rough);
  const beyond = Math.max(0, d - (b.flat ?? 0));
  if (b.ledge && b.n0 !== undefined) {
    const k = Math.min(1, beyond / LEDGE_BLEND);
    n = b.n0 + (n - b.n0) * (k * k * (3 - 2 * k));
  }
  return b.y + shoulder + beyond * 0.05 + n;
}

function smooth(points: [number, number][]): string {
  let d = '';
  for (let j = 1; j < points.length - 1; j++) {
    const [x, y] = points[j];
    const [nx, ny] = points[j + 1];
    d += ` Q${x},${y.toFixed(1)} ${((x + nx) / 2).toFixed(1)},${((y + ny) / 2).toFixed(1)}`;
  }
  return d;
}

function bandPath(b: Band, height: number): string {
  const floor = Math.min(height + 40, b.y + b.reach + 80);
  const points: [number, number][] = [];
  for (let x = BAND_X0; x <= BAND_X1; x += BAND_STEP) {
    points.push([x, Math.min(crestY(b, x), floor)]);
  }
  const first = points[0];
  const last = points[points.length - 1];
  return `M${BAND_X0},${floor + 20} L${first[0]},${first[1].toFixed(1)}${smooth(points)} L${last[0]},${last[1].toFixed(1)} L${BAND_X1},${floor + 20} Z`;
}

function crestLine(b: Band): { d: string; x0: number; x1: number } | null {
  const points: [number, number][] = [];
  for (let x = BAND_X0; x <= BAND_X1; x += BAND_STEP) {
    const y = crestY(b, x);
    if (b.solid || y - b.y < b.reach * 0.5) points.push([x, y]);
  }
  if (points.length < 3) return null;
  const first = points[0];
  const last = points[points.length - 1];
  return {
    d: `M${first[0]},${first[1].toFixed(1)}${smooth(points)} L${last[0]},${last[1].toFixed(1)}`,
    x0: first[0],
    x1: last[0],
  };
}

/** Height-based colour ramp: snow at the top, through rock, to forest green at the bottom. */
const RAMP: [at: number, l: number, c: number, h: number][] = [
  [0, 0.95, 0.018, 240],
  [0.16, 0.88, 0.024, 235],
  [0.38, 0.82, 0.022, 95],
  [0.64, 0.74, 0.04, 140],
  [1, 0.6, 0.055, 152],
];
const FOG: Oklch = [0.9, 0.022, 240];
const MIST: Oklch = [0.972, 0.01, 85];

function ramp(t: number): Oklch {
  const clamped = Math.min(1, Math.max(0, t));
  for (let i = 0; i < RAMP.length - 1; i++) {
    const a = RAMP[i];
    const b = RAMP[i + 1];
    if (clamped <= b[0]) {
      const k = (clamped - a[0]) / (b[0] - a[0]);
      return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k];
    }
  }
  const last = RAMP[RAMP.length - 1];
  return [last[1], last[2], last[3]];
}

function mix(a: Oklch, b: Oklch, t: number): Oklch {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function col(c: Oklch, alpha?: number): string {
  const a = alpha === undefined ? '' : ` / ${alpha}`;
  return `oklch(${c[0].toFixed(3)} ${c[1].toFixed(3)} ${c[2].toFixed(1)}${a})`;
}

/**
 * How a day colour looks by moonlight: darker, greyer and pulled toward blue. Lightness is compressed with a curve
 * (about l^1.6, from products only, so every engine rounds it the same) rather than scaled, so snow stays the
 * brightest thing on the mountain and the forest sinks furthest.
 */
const NIGHT = {
  L_FLOOR: 0.1,
  L_GAIN: 0.4,
  L_CURVE: 0.6,
  CHROMA: 0.5,
  CHROMA_FLOOR: 0.012,
  HUE: 255,
  HUE_PULL: 0.6,
};

export function moonlit([l, c, h]: Oklch): Oklch {
  return [
    NIGHT.L_FLOOR + NIGHT.L_GAIN * l * (1 - NIGHT.L_CURVE + NIGHT.L_CURVE * l),
    c * NIGHT.CHROMA + NIGHT.CHROMA_FLOOR,
    h + (NIGHT.HUE - h) * NIGHT.HUE_PULL,
  ];
}

/**
 * A generated colour by day and by moonlight, as an element's attributes. `light-dark()` picks by the page's
 * `color-scheme`, which the theme sets, so one drawing serves both and switching repaints it once. The plain
 * attribute holds the day colour for a browser without `light-dark()`: it drops the style and stays in daylight.
 */
function paint(prop: 'fill' | 'stop-color', c: Oklch, alpha?: number): string {
  const day = col(c, alpha);
  return `${prop}="${day}" style="${prop}:light-dark(${day},${col(moonlit(c), alpha)})"`;
}

/** A gradient stop in the scene's ink, at some strength. */
function inkStop(offset: number, alpha: number): string {
  return `<stop offset="${offset}" style="stop-color:${INK};stop-opacity:${alpha}"/>`;
}

/** Path data for one tree: two stacked triangles. */
function pineD(x: number, y: number, s: number): string {
  const f = (n: number) => n.toFixed(1);
  return (
    `M${f(x)},${f(y - 2.7 * s)} L${f(x - 0.55 * s)},${f(y - 1.15 * s)} L${f(x + 0.55 * s)},${f(y - 1.15 * s)} Z ` +
    `M${f(x)},${f(y - 1.9 * s)} L${f(x - 0.85 * s)},${f(y)} L${f(x + 0.85 * s)},${f(y)} Z `
  );
}

/** Where a band's trees stand: foot and size, and a number of their own to vary them by. */
type TreeSpot = { x: number; y: number; s: number; n: number };

function bandTreeSpots(b: Band): TreeSpot[] {
  let x = 300;
  let n = 0;
  const spots: TreeSpot[] = [];
  while (x < 2100 && n < 34) {
    const r = rnd(b.seed * 77 + n);
    const y = crestY(b, x);
    const clear = !b.keep || b.keep.every(kx => Math.abs(x - kx) > 80);
    if (clear && r > 0.3 && y < b.y + b.reach * 0.35) {
      spots.push({ x, y: y + 5, s: 18 + rnd(b.seed * 31 + n) * 20, n: b.seed * 101 + n });
    }
    x += 34 + r * 70;
    n++;
  }
  return spots;
}

/**
 * The trees near enough to see are pictures (art/camps/README.md, "The trees"): a tall spruce and a fuller fir, in
 * place of the silhouettes, at the same spots and sizes. `height` is how tall each is drawn, in units of the
 * silhouette's size. Every picture in the scene is lit from the left; the fir was drawn lit from the right, so it
 * is always mirrored, and nothing else ever is. Far slopes keep their silhouettes: haze suits flat shapes.
 */
const TREE_PICTURES = [
  { key: 'tree-1', height: 3, mirror: false },
  { key: 'tree-2', height: 2.5, mirror: true },
];
const HAS_TREE_PICTURES = TREE_PICTURES.every(tree => ART[tree.key]);
/** Share of the trees that are spruces; the rest are firs. */
const SPRUCE_SHARE = 0.6;
/**
 * A tree picture needs ground under it. A silhouette could stand on the corner of a steep flank and melt into the
 * slope; an outlined tree there hangs half over empty air and reads as floating. So on a slope (where, a little way
 * either side of its trunk, `LEVEL_REACH` of its size, the ground falls more steeply than `LEVEL_MAX_SLOPE`) the tree
 * steps down onto the face of the hill: its foot goes `FACE_SINK` below the ground on both sides, so the hill is
 * always behind its trunk, never the sky. Only where the hill's body is still (nearly) opaque: it fades out over its
 * reach, and by `SOLID_REACH` of it is still about three quarters there, mostly behind the next ridge anyway.
 */
const LEVEL_REACH = 0.45;
const LEVEL_MAX_SLOPE = 0.55;
const FACE_SINK = 8;
const SOLID_REACH = 0.58;

function planted(b: Band, spot: TreeSpot): TreeSpot | null {
  const reach = spot.s * LEVEL_REACH;
  const downhill = Math.max(crestY(b, spot.x - reach), crestY(b, spot.x + reach));
  const steep = downhill - crestY(b, spot.x) > reach * LEVEL_MAX_SLOPE;
  const y = steep ? Math.max(spot.y, downhill + FACE_SINK) : spot.y;
  return y < b.y + b.reach * SOLID_REACH ? { ...spot, y } : null;
}

/**
 * The early mountains (every near band with trees, above the trailhead's meadow) get a scatter of trees down their
 * faces too, below the ridge line: a candidate every `STEP` or so, standing `DEPTH` below the ground there, kept if
 * it lands on the solid body, clear of the camps, of the trail (which is drawn over this layer) and of other trees.
 */
const FACE_TREES = {
  STEP: 44,
  JITTER: 56,
  CHANCE: 0.78,
  DEPTH: [26, 160],
  /** Only on the upper part of a band, where its face shows above the nearer ridges. */
  FACE_REACH: 0.5,
  /** Clearance from the trail's points, sideways and above or below the tree. */
  TRAIL_CLEAR_X: 56,
  TRAIL_CLEAR_Y: 30,
};
const TRAIL_POINTS: Point[] = LEGS.flatMap(leg => leg.points);

function clearOfTrail(x: number, foot: number, height: number): boolean {
  return TRAIL_POINTS.every(
    ([px, py]) =>
      Math.abs(px - x) > FACE_TREES.TRAIL_CLEAR_X ||
      py < foot - height - FACE_TREES.TRAIL_CLEAR_Y ||
      py > foot + FACE_TREES.TRAIL_CLEAR_Y
  );
}

/** Every camp's flag, artwork and name, around the point where the trail arrives (the artwork stands to its right). */
const CAMP_CLEAR = { LEFT: 90, RIGHT: 280, ABOVE: 160, BELOW: 90 };

function clearOfCamps(x: number, foot: number): boolean {
  return CAMP_X.every(
    (cx, i) =>
      x < cx - CAMP_CLEAR.LEFT ||
      x > cx + CAMP_CLEAR.RIGHT ||
      foot < CAMP_Y[i] - CAMP_CLEAR.ABOVE ||
      foot > CAMP_Y[i] + CAMP_CLEAR.BELOW
  );
}

function crowded(spot: TreeSpot, others: TreeSpot[]): boolean {
  return others.some(
    other =>
      Math.abs(other.x - spot.x) < (other.s + spot.s) * 0.9 && Math.abs(other.y - spot.y) < 56
  );
}

function faceTreeSpots(b: Band, taken: TreeSpot[]): TreeSpot[] {
  const spots: TreeSpot[] = [];
  let x = 220;
  for (let k = 0; x < 2180; k++) {
    const r = (i: number) => rnd(b.seed * 191 + k * 7 + i);
    const crest = crestY(b, x);
    const s = 18 + r(1) * 18;
    const y = crest + FACE_TREES.DEPTH[0] + r(2) * (FACE_TREES.DEPTH[1] - FACE_TREES.DEPTH[0]);
    const spot = planted(b, { x, y, s, n: b.seed * 211 + k });
    const onFace = crest < b.y + b.reach * FACE_TREES.FACE_REACH;
    const clear = !b.keep || b.keep.every(kx => Math.abs(x - kx) > 80);
    if (
      spot &&
      onFace &&
      clear &&
      r(0) < FACE_TREES.CHANCE &&
      clearOfTrail(spot.x, spot.y, spot.s * 3) &&
      clearOfCamps(spot.x, spot.y) &&
      !crowded(spot, [...taken, ...spots])
    ) {
      spots.push(spot);
    }
    x += FACE_TREES.STEP + r(3) * FACE_TREES.JITTER;
  }
  return spots;
}
/** How much a tree may be stretched taller or squashed shorter than its picture, either way. */
const TREE_STRETCH = 0.12;

function treePicture({ x, y, s, n }: TreeSpot): string {
  const tree = TREE_PICTURES[rnd(n * 7 + 3) < SPRUCE_SHARE ? 0 : 1];
  const art = ART[tree.key];
  if (!art) return '';
  const height = s * tree.height * (1 + (rnd(n * 13 + 5) * 2 - 1) * TREE_STRETCH);
  const width = (s * tree.height * art.width) / art.height;
  const left = tree.mirror ? -(x + width / 2) : x - width / 2;
  const flip = tree.mirror ? ' transform="scale(-1 1)"' : '';
  return `<image href="/camps/${tree.key}.webp" class="scene-tree" x="${left.toFixed(1)}" y="${(y - height).toFixed(1)}" width="${width.toFixed(1)}" height="${height.toFixed(1)}" preserveAspectRatio="none"${flip}/>`;
}

/** One parallax layer: a stack of ridge bands, far (top) painted first. */
function genLayer(key: string, depth: number, bands: Band[], opts: LayerOptions): SceneLayer {
  const height = VIEW + TRAVEL * depth;
  let defs = '';
  let body = '';
  bands.forEach((b, k) => {
    const base = mix(b.tone ?? opts.tone ?? ramp(b.y / height), FOG, opts.fog);
    const gid = `${key}g${k}`;
    const ink = b.ink ?? opts.ink;
    const fades = Boolean(opts.fade) && !b.solid;
    const end = fades ? paint('stop-color', base, 0) : paint('stop-color', mix(base, MIST, 0.8));
    defs +=
      `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${(b.y - b.rough).toFixed(0)}" x2="0" y2="${(b.y + b.reach).toFixed(0)}">` +
      `<stop offset="0" ${paint('stop-color', base)}/><stop offset="${BODY_SHARE}" ${paint('stop-color', base)}/>` +
      `<stop offset="1" ${end}/></linearGradient>`;
    body += `<path d="${bandPath(fades ? b : { ...b, reach: 99999 }, height)}" fill="url(#${gid})"/>`;
    const line = ink ? crestLine(b) : null;
    if (ink && line) {
      defs +=
        `<linearGradient id="${gid}i" gradientUnits="userSpaceOnUse" x1="${line.x0}" y1="0" x2="${line.x1}" y2="0">` +
        `${inkStop(0, 0)}${inkStop(0.3, ink)}${inkStop(0.7, ink)}${inkStop(1, 0)}</linearGradient>`;
      body += `<path d="${line.d}" fill="none" stroke="url(#${gid}i)" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    const spots = b.pines ? bandTreeSpots(b) : [];
    if (spots.length && opts.trees && HAS_TREE_PICTURES) {
      const onRidge = spots.flatMap(spot => planted(b, spot) ?? []);
      const onFace = b.solid ? [] : faceTreeSpots(b, onRidge);
      /* the ones further up the hill are further away: drawn first, so nearer ones overlap them */
      body += [...onRidge, ...onFace]
        .sort((a, c) => a.y - c.y)
        .map(treePicture)
        .join('');
    } else if (spots.length) {
      const trees = spots.map(spot => pineD(spot.x, spot.y, spot.s)).join('');
      body += `<path d="${trees}" ${paint('fill', [0.47 + (b.pines ?? 0) * 0.05, 0.05, 152])}/>`;
    }
  });
  return { key, depth, height, markup: `<defs>${defs}</defs>${body}` };
}

/** Rolling foothills at the bottom of a slow layer: the horizon sinks as you climb. */
function foothills(seed: number, depth: number, crests: number[], amp: number): Band[] {
  const height = VIEW + TRAVEL * depth;
  return crests.map((off, k) => ({
    seed: seed + k,
    y: height - off,
    cx: CX + (k % 2 ? 1 : -1) * (260 + rnd(seed + k) * 520),
    half: 240,
    slope: 0.2,
    rough: amp,
    reach: 360,
  }));
}

/** The far giants: a wall of distant snow peaks either side of the route. */
function giants(depth: number): Band[] {
  const height = VIEW + TRAVEL * depth;
  const snow: Oklch = [0.945, 0.018, 245];
  return [
    {
      seed: 301,
      y: height - 760,
      cx: 1560,
      half: 14,
      slope: 0.62,
      rough: 46,
      reach: 520,
      tone: snow,
    },
    {
      seed: 302,
      y: height - 700,
      cx: 600,
      half: 18,
      slope: 0.7,
      rough: 44,
      reach: 520,
      tone: snow,
    },
    {
      seed: 303,
      y: height - 640,
      cx: 1900,
      half: 16,
      slope: 0.74,
      rough: 40,
      reach: 520,
      tone: [0.92, 0.022, 242],
    },
    {
      seed: 304,
      y: height - 560,
      cx: 260,
      half: 20,
      slope: 0.6,
      rough: 40,
      reach: 520,
      tone: [0.9, 0.024, 240],
    },
    {
      seed: 305,
      y: height - 430,
      cx: 1200,
      half: 900,
      slope: 0.1,
      rough: 50,
      reach: 400,
      tone: [0.84, 0.03, 225],
    },
  ];
}

/** Sister peaks beside the main massif. */
function sisterPeaks(seed: number, height: number, from: number, gap: number): Band[] {
  const count = Math.floor((height - from) / gap);
  const out: Band[] = [];
  for (let k = 0; k <= count; k++) {
    const t = count ? k / count : 0;
    const side = k % 2 ? 1 : -1;
    out.push({
      seed: seed + k,
      y: from + k * gap + rnd(seed + 90 + k) * 120,
      cx: CX + side * (430 + rnd(seed + k) * 360),
      half: 30 + 90 * t,
      slope: 1.7 - 0.5 * t,
      rough: 40,
      reach: 620,
    });
  }
  return out;
}

/** Shape of the ledge under each camp, trailhead first. Camps beyond the table reuse its last row. */
const LEDGES = [
  { half: 2600, slope: 0, amp: 20 },
  { half: 150, slope: 1.45, amp: 28 },
  { half: 145, slope: 1.55, amp: 32 },
  { half: 140, slope: 1.65, amp: 34 },
  { half: 135, slope: 1.8, amp: 32 },
  { half: 130, slope: 1.9, amp: 26 },
];
/** The village needs more level ground than any camp's artwork. */
const VILLAGE_FLAT = 220;
/** How far past the level ground the ridge runs before its shoulder starts to fall. */
const LEDGE_LIP = 14;
/** The trailhead village stands here, so its ledge keeps these spots free of trees. */
const VILLAGE_X = VILLAGE.map(house => house.x);

/** The mountain the trail is on: the summit, then one ledge per camp with a shoulder between each pair. */
function nearBands(): Band[] {
  const out: Band[] = [];
  const top: Band = {
    seed: 70,
    cx: SUMMIT.x,
    half: 22,
    slope: 1.95,
    rough: 22,
    reach: 1100,
    ledge: true,
    tone: [0.985, 0.006, 230],
    ink: 0.5,
    y: 0,
  };
  top.n0 = rough(top.seed, top.cx, top.rough);
  top.y = SUMMIT.y - top.n0;
  out.push(top);

  const highest = CAMP_X.length - 1;
  for (let i = highest; i >= 0; i--) {
    const ledge = LEDGES[Math.min(i, LEDGES.length - 1)];
    const ground = campGround(i);
    const b: Band = {
      seed: 50 + i,
      /* level ground sized to the camp's artwork, which stands to the right of where the trail arrives */
      cx: CAMP_X[i] + ground.center,
      half: Math.max(ledge.half, ground.flat + LEDGE_LIP),
      flat: i === 0 ? Math.max(VILLAGE_FLAT, ground.flat) : ground.flat,
      slope: ledge.slope,
      rough: ledge.amp,
      reach: 560,
      ledge: true,
      solid: i === 0,
      /* the early ledges are wooded; from the Lead camp up it is rock and snow */
      pines: i < 4 ? i + 1 : 0,
      keep: [
        ...(i === 0 ? VILLAGE_X : []),
        CAMP_X[i],
        CAMP_X[i] + 85,
        CAMP_X[i] + 170,
        CAMP_X[i] + ground.center + ground.flat,
      ],
      y: 0,
    };
    if (i === highest) {
      b.tone = [0.95, 0.014, 235];
      b.ink = 0.42;
    }
    if (i === highest - 1) {
      b.tone = [0.91, 0.02, 235];
      b.ink = 0.36;
    }
    b.n0 = rough(b.seed, b.cx, b.rough);
    b.y = CAMP_Y[i] - b.n0;
    out.push(b);
    if (i > 0) {
      out.push({
        seed: 80 + i,
        cx: CX - SIDES[i] * 300,
        half: 110,
        slope: 1.5,
        rough: ledge.amp + 16,
        reach: 480,
        pines: i < 4 ? i : 0,
        y: (CAMP_Y[i] + CAMP_Y[i - 1]) / 2 + 40,
      });
    }
  }
  return out;
}

function escapeText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function label(x: number, y: number, text: string, size = 30): string {
  if (!text) return '';
  return (
    `<text x="${x}" y="${y}" text-anchor="middle" style="font-family:${LABEL_FONT};font-weight:${LABEL_WEIGHT};font-size:${size}px;` +
    `fill:${INK};paint-order:stroke;stroke:var(--color-halo);stroke-width:7px;stroke-linejoin:round">${escapeText(text)}</text>`
  );
}

/** A village house until its artwork arrives: wall, roof, door and a lit window. */
function hut(x: number, y: number, w: number, roof: string): string {
  const h = w * 0.5;
  return (
    `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" style="fill:var(--color-hut-wall);stroke:${INK};stroke-width:3;stroke-linejoin:round"/>` +
    `<path d="M${x - w * 0.62},${y - h} L${x},${y - h - w * 0.36} L${x + w * 0.62},${y - h} Z" style="fill:${roof};stroke:${INK};stroke-width:3;stroke-linejoin:round"/>` +
    `<rect x="${x - 9}" y="${y - 28}" width="18" height="28" style="fill:${SHADE}"/>` +
    `<rect x="${x + w * 0.2}" y="${y - h + 10}" width="14" height="14" style="fill:var(--color-hut-window);stroke:${INK};stroke-width:2"/>`
  );
}

const FRAMING_PINES = 4;
/** Where on screen (0 top, 1 bottom) a mist wisp is when the camera is half way along its leg. */
const WISP_SCREEN_Y = 0.5;

/** Foreground: a few soft mist wisps and the tall pines framing the trailhead. Fastest layer, so nearly empty. */
function foreground(depth: number): SceneLayer {
  const height = VIEW + TRAVEL * depth;
  let markup =
    '<defs><radialGradient id="fgw"><stop offset="0" style="stop-color:var(--color-wisp);stop-opacity:0.6"/>' +
    '<stop offset="1" style="stop-color:var(--color-wisp);stop-opacity:0"/></radialGradient></defs>';
  /*
   * One wisp per leg, placed so it drifts across the middle of the screen while the camera is half way between
   * two camps. This layer moves faster than the mountain, so by the time a camp arrives its wisp is long gone:
   * mist never sits on a tent, its name or the climber at a stop.
   */
  for (let k = 0; k < CAMP_Y.length - 1; k++) {
    const between =
      (cameraKnot(k, campAnchor(k, CAMP_ANCHORS.WIDE)) +
        cameraKnot(k + 1, campAnchor(k + 1, CAMP_ANCHORS.WIDE))) /
      2;
    const cy = (between * depth + VIEW * WISP_SCREEN_Y).toFixed(0);
    const cx = (560 + rnd(900 + k) * 1280).toFixed(0);
    const rx = (520 + rnd(910 + k) * 300).toFixed(0);
    markup += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="70" fill="url(#fgw)"/>`;
  }
  const framing = Array.from({ length: FRAMING_PINES }, (_, p) => ({
    x: 300 + rnd(700 + p) * 260 - p * 45,
    y: height + 30,
    s: 92 + rnd(720 + p) * 48,
    n: 700 + p,
  }));
  if (HAS_TREE_PICTURES) {
    markup += framing.map(treePicture).join('');
  } else {
    const pines = framing.map(spot => pineD(spot.x, spot.y, spot.s)).join('');
    markup += `<path d="${pines}" style="fill:var(--color-pine-front)"/>`;
  }
  return { key: 'front', depth, height, markup };
}

/** The trail layer: the dotted route still to walk, the village and the summit label. Camps are drawn apart. */
function trailLayer(summitLabel: string): SceneLayer {
  const route = `${LEGS.map(leg => leg.d).join(' ')} ${SUMMIT_PITCH_D}`;
  let markup = `<path d="${route}" style="fill:none;stroke:${INK};stroke-opacity:0.36;stroke-width:4;stroke-linecap:round;stroke-dasharray:2 15"/>`;
  /* a house with artwork is a picture of its own (components/scene/village.tsx); the rest are still drawn here */
  markup += VILLAGE.filter(house => !ART[house.key])
    .map(house => hut(house.x, VILLAGE_GROUND_Y, house.hut.width, house.hut.roof))
    .join('');
  markup += label(SUMMIT.x, SUMMIT.y - 34, summitLabel, 26);
  return { key: 'trail', depth: 1, height: VIEW + TRAVEL, markup };
}

/** The walked path as one finished drawing. The stage reveals it by moving a clip window, never by redrawing. */
export function walkedPathMarkup(): string {
  return LEGS.map(
    leg =>
      `<path d="${leg.d}" style="fill:none;stroke:${INK};stroke-width:5;stroke-linecap:round;stroke-linejoin:round"/>`
  ).join('');
}

/** Every layer, back to front. The walked path is separate (see `walkedPathMarkup`) and sits above `near`. */
export function sceneLayers(summitLabel: string): SceneLayer[] {
  return [
    genLayer('giants', 0.05, giants(0.05), { fog: 0.15 }),
    genLayer('hills-far', 0.15, foothills(23, 0.15, [440, 360], 56), {
      fog: 0.55,
      tone: [0.72, 0.04, 170],
    }),
    genLayer('hills-mid', 0.35, foothills(37, 0.35, [380, 300], 46), {
      fog: 0.32,
      tone: [0.7, 0.045, 150],
    }),
    genLayer('peaks', 0.8, sisterPeaks(41, 5000, 900, 820), { fog: 0.46, fade: true }),
    genLayer('near', 1, nearBands(), { fog: 0, fade: true, ink: 0.3, trees: true }),
    trailLayer(summitLabel),
    foreground(1.35),
  ];
}
