/**
 * Turns the paintings behind /cv (art/cv/raw/) into what the page ships.
 *
 *   pnpm seasons
 *
 * The landscape behind the field log is two paintings per season and time, 1536 × 1024 on flat magenta:
 * `grove-<season>-<theme>` (the meadow along the bottom and the edge of a larch wood on the right) and
 * `meadow-<season>-<theme>` (the same meadow alone, which the page repeats sideways to carry the ground to the
 * left edge of any screen). For each pair this script:
 *   1. keys the magenta out (scripts/flat-key.mjs) and drops the specks of paint floating loose in it;
 *   2. gives the night painting the DAY outline, growing the night's own colours into every pixel its painting
 *      left out: the two must match through the theme reveal, and the keyed colour where the night has no paint is
 *      noise amplified into neon;
 *   3. cleans the magenta the painter reflected into thin things: any pink left is pulled out, the wood's pink tufts
 *      (by day) and lilac ones (by night) take the season's own colour, winter's twigs lose the green and teal
 *      fringes a painter leaves beside magenta, and pink grass tips on the skyline take the grass inside them;
 *   4. dissolves the grove's open-meadow side into nothing, so it melts into the repeated meadow beneath it, and
 *      makes the meadow a seamless tile: its end is cross-faded into its start and the tile is that much narrower;
 *   5. fills the colour hidden under transparent pixels from the nearest paint and has WebP keep it: WebP stores
 *      colour at half resolution, and whatever hides there bleeds into thin twigs as green and purple fringes;
 *   6. names every file by a hash of its bytes (so public/seasons can be cached forever) and writes
 *      scene/seasons.json: the files, the meadow's share of the height and the tile's width.
 *
 * public/seasons/ belongs to this script: it is emptied first.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import sharp from 'sharp';
import { clampByte, key, smooth } from './flat-key.mjs';

/* a closed output pipe (`| head`) must not stop the run half way, before the manifest is written */
process.stdout.on('error', () => {});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'art/cv/raw');
const OUT_DIR = path.join(ROOT, 'public/seasons');
const MANIFEST = path.join(ROOT, 'scene/seasons.json');

const SEASONS = ['winter', 'spring', 'summer', 'autumn'];
const THEMES = ['day', 'night'];
const W = 1536;
const H = 1024;

/** Where the wood stands in the grove: right of `x0`, above `y1` (the meadow's top edge is just below). */
const TREE = { x0: 660, y1: 690 };
/** The grove's left share is open meadow; it dissolves to nothing over this share, into the repeated meadow. */
const GROVE_FADE = 0.35;
/** The meadow tile's cross-fade: its last BAND columns are blended into its first, and the tile loses them. */
const BAND = 192;
/** Islands of paint smaller than this, loose in the magenta, are specks. */
const SPECK = 48;
/** The width, in pixels from the outline, where a pink grass tip counts as the skyline's. */
const SKYLINE = 10;
/** Kept pixels at least this opaque, two pixels in from the edge, are trusted to lend their colour. */
const OPAQUE = 0.98;
const ENCODE = { quality: 80, alphaQuality: 85, effort: 6, smartSubsample: true, exact: true };

/**
 * The season's own colours, as [hue, the most saturation it may have], for the wood's tinted tufts: by day from the
 * painting brief's palette (a mid-green summer, lime spring, gold autumn, the bark of winter's bare twigs), by night
 * a moonlit version of the same. Lilac at night goes to the moon's blue, and lilac on winter's snow to its shade.
 */
const TARGET = {
  winter: { day: [28, 0.22], night: [222, 0.6] },
  spring: { day: [72, 0.55], night: [200, 0.45] },
  summer: { day: [80, 0.48], night: [205, 0.45] },
  autumn: { day: [40, 0.85], night: [38, 0.4] },
};
const MOONLIT = [222, 0.6];
const SNOW_SHADE = [215, 0.3];

async function load(file) {
  const image = sharp(file).removeAlpha();
  const { width, height } = await image.metadata();
  const sized = width === W && height === H ? image : image.resize(W, H, { fit: 'fill' });

  return (await sized.raw().toBuffer({ resolveWithObject: true })).data;
}

const neighbours = i => [i - 1, i + 1, i - W, i + W];

function copyColour(rgb, to, from) {
  rgb[to * 3] = rgb[from * 3];
  rgb[to * 3 + 1] = rgb[from * 3 + 1];
  rgb[to * 3 + 2] = rgb[from * 3 + 2];
}

/**
 * Every pixel `use` keeps takes the colour of the nearest trusted one (opaque in `use` and in the painting's `own`
 * alpha, two pixels in from the edge), grown inward until all are covered. The edge band is where the generator's
 * pink lives; for a night, `own` is its own alpha, so the fill also covers wherever it drifted off the day.
 */
function repair(rgb, use, own = use) {
  let trusted = Uint8Array.from(use, (a, i) => (a >= OPAQUE && own[i] >= OPAQUE ? 1 : 0));

  for (let pass = 0; pass < 2; pass++) {
    const next = new Uint8Array(trusted.length);

    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        next[i] = trusted[i] & trusted[i - 1] & trusted[i + 1] & trusted[i - W] & trusted[i + W];
      }
    }

    trusted = next;
  }

  const need = Uint8Array.from(use, (a, i) => (a > 0 && !trusted[i] ? 1 : 0));

  for (let pass = 0; pass < W; pass++) {
    const grow = [];

    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        if (!need[i]) continue;
        const from = neighbours(i).find(n => trusted[n]);
        if (from === undefined) continue;
        grow.push([i, from]);
      }
    }

    if (!grow.length) break;

    for (const [i, from] of grow) {
      copyColour(rgb, i, from);
      trusted[i] = 1;
      need[i] = 0;
    }
  }
}

/** Pixels within `reach` of the outline (alpha under a half), as a mask. */
function nearOutline(alpha, reach) {
  let near = Uint8Array.from(alpha, a => (a < 0.5 ? 1 : 0));

  for (let pass = 0; pass < reach; pass++) {
    const next = Uint8Array.from(near);

    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        if (!(near[i - 1] || near[i + 1] || near[i - W] || near[i + W])) continue;
        next[i] = 1;
      }
    }

    near = next;
  }

  return near;
}

/**
 * Any magenta tint left (red and blue both above green) is pulled out. Spring's meadow has real purple, its
 * crocuses, so there it is only done near the outline.
 */
function despill(rgb, alpha, everywhere) {
  const near = everywhere ? null : nearOutline(alpha, 4);

  for (let i = 0; i < W * H; i++) {
    if (alpha[i] <= 0 || (near && !near[i])) continue;
    const spill = Math.min(rgb[i * 3], rgb[i * 3 + 2]) - rgb[i * 3 + 1];
    if (spill <= 0) continue;
    rgb[i * 3] -= spill;
    rgb[i * 3 + 2] -= spill;
  }
}

/** Islands of paint under SPECK pixels, loose in the magenta, are dropped; returns how many. */
function dropSpecks(alpha) {
  const seen = new Uint8Array(W * H);
  let dropped = 0;

  for (let start = 0; start < W * H; start++) {
    if (seen[start] || alpha[start] <= 0.05) continue;
    const piece = [start];
    seen[start] = 1;

    for (let k = 0; k < piece.length; k++) {
      const x = piece[k] % W;
      const y = Math.floor(piece[k] / W);

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const j = ny * W + nx;
          if (seen[j] || alpha[j] <= 0.05) continue;
          seen[j] = 1;
          piece.push(j);
        }
      }
    }

    if (piece.length > SPECK) continue;

    for (const i of piece) {
      alpha[i] = 0;
    }

    dropped++;
  }

  return dropped;
}

function hsl(r, g, b) {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = (gg - bb) / d + (gg < bb ? 6 : 0);

  if (max === gg) {
    h = (bb - rr) / d + 2;
  } else if (max === bb) {
    h = (rr - gg) / d + 4;
  }

  return [h * 60, s, l];
}

function rgbOf(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const sector = Math.floor(h / 60) % 6;
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][sector];

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/**
 * The colour a tinted pixel in the wood should have instead, or null. Lilac (red and blue both above green, however
 * faint: the mauve-grey in shaded tufts) and salmon both come from the magenta; by day a salmon pixel only counts
 * when light or strong, so the trunk's reddish bark stays bark. In winter only bark, snow and blue shade belong on
 * the trees, so the green and teal fringes on thin twigs go grey by day and moon-blue by night.
 */
function retint(season, theme, [r, g, b]) {
  const [h, s, l] = hsl(r, g, b);
  const day = theme === 'day';
  const winter = season === 'winter';
  const lilac = b > g + 4 && r > g + 4;
  if (lilac && !day) return MOONLIT;
  if (lilac) return winter ? SNOW_SHADE : TARGET[season].day;
  const salmon = s >= 0.12 && h < (day ? 28 : 25) && (!day || l > 0.5 || s > 0.45);
  if (salmon) return TARGET[season][theme];
  const fringe = winter && s > 0.15 && h >= 60 && h < (day ? 200 : 185);
  if (!fringe) return null;

  return day ? [h, 0.08] : [215, 0.35];
}

/** Retints the wood (the grove's TREE box) pixel by pixel, keeping each one's lightness; returns how many. */
function fixWood(rgb, alpha, season, theme) {
  let fixed = 0;

  for (let y = 0; y < TREE.y1; y++) {
    for (let x = TREE.x0; x < W; x++) {
      const i = y * W + x;
      if (alpha[i] <= 0) continue;
      const colour = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];
      const to = retint(season, theme, colour);
      if (!to) continue;
      const [, s, l] = hsl(...colour);
      const [r, g, b] = rgbOf(to[0], Math.min(s, to[1]), l);
      rgb.set([r, g, b], i * 3);
      fixed++;
    }
  }

  return fixed;
}

/**
 * Outside the wood, within SKYLINE pixels of the outline, a clearly pink pixel (a grass tip) takes the colour of
 * the nearest grass inside it; returns how many.
 */
function healSkyline(rgb, alpha, hasWood) {
  const near = nearOutline(alpha, SKYLINE);
  const bad = new Uint8Array(W * H);
  let count = 0;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (alpha[i] <= 0 || !near[i] || (hasWood && x >= TREE.x0 && y < TREE.y1)) continue;
      const [h, s] = hsl(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);
      if (s <= 0.25 || (h < 300 && h >= 15)) continue;
      bad[i] = 1;
      count++;
    }
  }

  for (let pass = 0; pass < 16; pass++) {
    const grow = [];

    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        if (!bad[i]) continue;
        const from = [i + W, i - 1, i + 1, i - W].find(n => !bad[n] && alpha[n] >= 0.5);
        if (from === undefined) continue;
        grow.push([i, from]);
      }
    }

    for (const [i, from] of grow) {
      copyColour(rgb, i, from);
      bad[i] = 0;
    }
  }

  return count;
}

/** The grove's open-meadow side dissolves to nothing, so it melts into the repeated meadow beneath it. */
function fadeGrove(alpha) {
  const reach = W * GROVE_FADE;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < reach; x++) {
      alpha[y * W + x] *= smooth(x / reach);
    }
  }
}

/**
 * The meadow's tile: its last BAND columns are cross-faded into its first, so a tile BAND narrower continues into
 * itself. Colours blend premultiplied, so a grass tip fading out never darkens.
 */
function tile(rgb, alpha) {
  const width = W - BAND;
  const outRgb = new Float32Array(width * H * 3);
  const outAlpha = new Float32Array(width * H);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < width; x++) {
      const out = y * width + x;
      const here = y * W + x;
      const t = x < BAND ? smooth((x + 0.5) / BAND) : 1;
      const end = here + width;
      const a = t === 1 ? alpha[here] : alpha[end] * (1 - t) + alpha[here] * t;
      outAlpha[out] = a;

      for (let c = 0; c < 3; c++) {
        const mixed =
          t === 1
            ? rgb[here * 3 + c]
            : (rgb[end * 3 + c] * alpha[end] * (1 - t) + rgb[here * 3 + c] * alpha[here] * t) /
              (a || 1);
        outRgb[out * 3 + c] = mixed;
      }
    }
  }

  return { rgb: outRgb, alpha: outAlpha, width };
}

/**
 * The colour hidden under transparent pixels becomes the nearest painted one, grown outward a few pixels: WebP keeps
 * colour at half resolution, and whatever hides there would bleed into thin twigs.
 */
function bleed(rgb, alpha, width) {
  const height = alpha.length / width;
  const known = Uint8Array.from(alpha, a => (a > 0.02 ? 1 : 0));

  for (let pass = 0; pass < 12; pass++) {
    const grow = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        if (known[i]) continue;
        const sides = [
          x > 0 && i - 1,
          x < width - 1 && i + 1,
          y > 0 && i - width,
          y < height - 1 && i + width,
        ];
        const from = sides.find(n => n !== false && known[n]);
        if (from === undefined) continue;
        grow.push([i, from]);
      }
    }

    if (!grow.length) break;

    for (const [i, from] of grow) {
      rgb[i * 3] = rgb[from * 3];
      rgb[i * 3 + 1] = rgb[from * 3 + 1];
      rgb[i * 3 + 2] = rgb[from * 3 + 2];
      known[i] = 1;
    }
  }
}

async function encode({ rgb, alpha, width }, base) {
  bleed(rgb, alpha, width);
  const n = alpha.length;
  const data = Buffer.alloc(n * 4);

  for (let i = 0; i < n; i++) {
    data[i * 4] = clampByte(rgb[i * 3]);
    data[i * 4 + 1] = clampByte(rgb[i * 3 + 1]);
    data[i * 4 + 2] = clampByte(rgb[i * 3 + 2]);
    data[i * 4 + 3] = clampByte(alpha[i] * 255);
  }

  const bytes = await sharp(data, { raw: { width, height: H, channels: 4 } })
    .webp(ENCODE)
    .toBuffer();
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  const name = `${base}.${hash}.webp`;
  await fs.writeFile(path.join(OUT_DIR, name), bytes);
  console.log(
    `${name.padEnd(36)} ${String(width).padStart(4)} × ${H}  ${(bytes.length / 1000).toFixed(0)} KB`
  );

  return { name, size: bytes.length };
}

/** The meadow's top edge, as a share of the height from the bottom: the median of the grove's open side. */
function groundShare(alpha) {
  const tops = [];

  for (let x = 8; x < W * GROVE_FADE; x += 8) {
    let y = 0;

    while (y < H && alpha[y * W + x] < 0.5) {
      y++;
    }

    tops.push(y);
  }

  tops.sort((a, b) => a - b);

  return Number(((H - tops[tops.length >> 1]) / H).toFixed(3));
}

await fs.rm(OUT_DIR, { recursive: true, force: true });
await fs.mkdir(OUT_DIR, { recursive: true });

const art = {};
const bytes = { day: 0, night: 0 };
let ground = 0;

for (const season of SEASONS) {
  art[season] = { day: {}, night: {} };

  for (const kind of ['grove', 'meadow']) {
    const grove = kind === 'grove';
    const day = key(await load(path.join(RAW_DIR, `${kind}-${season}-day.png`)), { W, H });
    const night = key(await load(path.join(RAW_DIR, `${kind}-${season}-night.png`)), { W, H });
    const specks = dropSpecks(day.alpha);
    const notes = [`${specks} specks`];

    repair(day.rgb, day.alpha);
    repair(night.rgb, day.alpha, night.alpha);

    for (const [theme, painting] of [
      ['day', day],
      ['night', night],
    ]) {
      despill(painting.rgb, day.alpha, season !== 'spring');
      const wood = grove ? fixWood(painting.rgb, day.alpha, season, theme) : 0;
      const sky = healSkyline(painting.rgb, day.alpha, grove);
      notes.push(`${theme}: ${wood} tinted, ${sky} on the skyline`);
    }

    if (grove && season === 'summer') {
      ground = groundShare(day.alpha);
    }

    if (grove) {
      fadeGrove(day.alpha);
    }

    console.log(`${kind}-${season}: ${notes.join('; ')}`);

    for (const theme of THEMES) {
      const rgb = theme === 'day' ? day.rgb : night.rgb;
      const shaped = grove
        ? { rgb, alpha: Float32Array.from(day.alpha), width: W }
        : tile(rgb, day.alpha);
      const file = await encode(shaped, `${kind}-${season}-${theme}`);
      art[season][theme][kind] = file.name;
      bytes[theme] += file.size;
    }
  }
}

const manifest = { ground, tile: W - BAND, canvas: [W, H], art };
await fs.writeFile(
  MANIFEST,
  await format(JSON.stringify(manifest), { ...(await resolveConfig(MANIFEST)), parser: 'json' })
);

console.log(
  `\nmeadow line at ${(ground * 100).toFixed(1)}% · all four seasons: ` +
    `${(bytes.day / 1000).toFixed(0)} KB by day, ${(bytes.night / 1000).toFixed(0)} KB by night`
);
