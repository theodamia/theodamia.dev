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
 * The weather is painted too (raw/weather-{day,night}.png): a kit of small things on a grid, a row per season
 * (sakura petals, dandelion seeds, golden larch tufts and leaves, snowflakes). Each is cut from its cell, trimmed
 * and packed into one small atlas per theme, and the manifest says where each one is.
 *
 * public/seasons/ belongs to this script: it is emptied first.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { clampByte, key, smooth } from './flat-key.mjs';
import {
  copyColour,
  despill,
  dropSpecks,
  encodeWebp,
  loadPainting,
  nearOutline,
  repair,
  writeHashed,
  writeJson,
} from './paintings.mjs';

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
const CANVAS = { W, H };

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
  const near = nearOutline(alpha, CANVAS, SKYLINE);
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
/** A raw painting, loaded and keyed. */
const keyed = async file => key(await loadPainting(path.join(RAW_DIR, file), CANVAS), CANVAS);

async function encode({ rgb, alpha, width, height = H }, base) {
  const bytes = await encodeWebp({ rgb, alpha, width, height }, ENCODE);
  const name = await writeHashed(bytes, OUT_DIR, base);
  console.log(
    `${name.padEnd(36)} ${String(width).padStart(4)} × ${height}  ${(bytes.length / 1000).toFixed(0)} KB`
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
    const day = await keyed(`${kind}-${season}-day.png`);
    const night = await keyed(`${kind}-${season}-night.png`);
    const specks = dropSpecks(day.alpha, CANVAS, SPECK);
    const notes = [`${specks} specks`];

    repair(day.rgb, day.alpha, day.alpha, CANVAS);
    repair(night.rgb, day.alpha, night.alpha, CANVAS);

    for (const [theme, painting] of [
      ['day', day],
      ['night', night],
    ]) {
      despill(painting.rgb, day.alpha, CANVAS, { nearEdgeOnly: season === 'spring' });
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

/**
 * The weather kit's grid and its atlas: COLUMNS things per season, a row each in KIT_ROWS order, each trimmed
 * (with PAD pixels of air) and fitted into a SPRITE-pixel square, GAP pixels apart so no sprite bleeds into the next
 * when the page scales it.
 */
const KIT = { COLUMNS: 5, SPRITE: 64, GAP: 4, PAD: 3, FAINT: 0.04 };
const KIT_ROWS = ['spring', 'summer', 'autumn', 'winter'];

/** The box of everything at least FAINT opaque inside one cell of the kit, with PAD pixels of air. */
function trimmedCell(alpha, column, row) {
  const cellW = Math.floor(W / KIT.COLUMNS);
  const cellH = Math.floor(H / KIT_ROWS.length);
  let [left, top, right, bottom] = [cellW, cellH, -1, -1];

  for (let y = 0; y < cellH; y++) {
    for (let x = 0; x < cellW; x++) {
      if (alpha[(row * cellH + y) * W + column * cellW + x] < KIT.FAINT) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < 0) throw new Error(`weather kit: cell ${column + 1} of row ${row + 1} is empty`);
  const x0 = Math.max(0, left - KIT.PAD);
  const y0 = Math.max(0, top - KIT.PAD);

  return {
    left: column * cellW + x0,
    top: row * cellH + y0,
    width: Math.min(cellW, right + KIT.PAD + 1) - x0,
    height: Math.min(cellH, bottom + KIT.PAD + 1) - y0,
  };
}

/** Autumn's gold, as [hue, the most saturation it may have]: by day the larch gold, by night a muted moonlit one. */
const GOLD = { day: [40, 0.85], night: [38, 0.4] };

/** An autumn colour outside the golds (green or pink needles) as the gold it should be, or null. */
function goldOnly(theme, [r, g, b]) {
  const [h, s] = hsl(r, g, b);
  if (s < 0.12 || (h >= 18 && h <= 62)) return null;

  return GOLD[theme];
}

/**
 * Snow's colour, or null: winter's own rule for the wood (`retint`), and the blue-violet a painter shades crystals
 * with, which reads lavender at the size a flake is shown, goes to the snow's blue shade (the moon's by night).
 */
function snowOnly(theme, colour) {
  const wood = retint('winter', theme, colour);
  if (wood) return wood;
  const [h, s] = hsl(...colour);
  if (s <= 0.06 || h < 222 || h >= 330) return null;

  return theme === 'day' ? SNOW_SHADE : MOONLIT;
}

/** Retints one row of the kit pixel by pixel, keeping each one's lightness. */
function retintRow(rgb, alpha, row, recolour) {
  const rowH = H / KIT_ROWS.length;

  for (let i = row * rowH * W; i < (row + 1) * rowH * W; i++) {
    if (alpha[i] <= 0) continue;
    const colour = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];
    const to = recolour(colour);
    if (!to) continue;
    const [, s, l] = hsl(...colour);
    rgb.set(rgbOf(to[0], Math.min(s, to[1]), l), i * 3);
  }
}

/** One painting's crop as straight RGBA bytes, with the day's alpha. */
function cropRgba(rgb, alpha, box) {
  const out = Buffer.alloc(box.width * box.height * 4);

  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) {
      const from = (box.top + y) * W + box.left + x;
      const to = (y * box.width + x) * 4;
      out[to] = clampByte(rgb[from * 3]);
      out[to + 1] = clampByte(rgb[from * 3 + 1]);
      out[to + 2] = clampByte(rgb[from * 3 + 2]);
      out[to + 3] = clampByte(alpha[from] * 255);
    }
  }

  return out;
}

async function weatherKit() {
  const day = await keyed('weather-day.png');
  const night = await keyed('weather-night.png');
  dropSpecks(day.alpha, CANVAS, SPECK);
  repair(day.rgb, day.alpha, day.alpha, CANVAS);
  repair(night.rgb, day.alpha, night.alpha, CANVAS);
  /* the petals' soft pink is their own: only the rows below them lose any magenta tint */
  const petalRows = H / KIT_ROWS.length;

  for (const painting of [day, night]) {
    despill(painting.rgb, day.alpha, CANVAS, { from: petalRows * W });
  }

  /* the colours the painter let drift: autumn's tufts and leaves keep only gold (no green or pink needles), and
     winter's flakes lose their lilac as the winter wood does */
  const autumn = KIT_ROWS.indexOf('autumn');
  const winter = KIT_ROWS.indexOf('winter');

  for (const [theme, painting] of [
    ['day', day],
    ['night', night],
  ]) {
    retintRow(painting.rgb, day.alpha, autumn, colour => goldOnly(theme, colour));
    retintRow(painting.rgb, day.alpha, winter, colour => snowOnly(theme, colour));
  }

  const width = KIT.COLUMNS * (KIT.SPRITE + KIT.GAP) + KIT.GAP;
  const height = KIT_ROWS.length * (KIT.SPRITE + KIT.GAP) + KIT.GAP;
  const sprites = Object.fromEntries(KIT_ROWS.map(season => [season, []]));
  const layers = { day: [], night: [] };

  for (const [row, season] of KIT_ROWS.entries()) {
    for (let column = 0; column < KIT.COLUMNS; column++) {
      const box = trimmedCell(day.alpha, column, row);
      const x = KIT.GAP + column * (KIT.SPRITE + KIT.GAP);
      const y = KIT.GAP + row * (KIT.SPRITE + KIT.GAP);
      let size = null;

      for (const [theme, painting] of [
        ['day', day],
        ['night', night],
      ]) {
        const raw = { width: box.width, height: box.height, channels: 4 };
        const { data, info } = await sharp(cropRgba(painting.rgb, day.alpha, box), { raw })
          .resize({ width: KIT.SPRITE, height: KIT.SPRITE, fit: 'inside' })
          .raw()
          .toBuffer({ resolveWithObject: true });
        size = [info.width, info.height];
        layers[theme].push({ input: data, raw: { ...info, channels: 4 }, left: x, top: y });
      }

      sprites[season].push([x, y, ...size]);
    }
  }

  const atlas = {};

  for (const theme of THEMES) {
    const blank = { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } };
    const { data } = await sharp({ create: blank })
      .composite(layers[theme])
      .raw()
      .toBuffer({ resolveWithObject: true });
    const rgb = new Float32Array(width * height * 3);
    const alpha = new Float32Array(width * height);

    for (let i = 0; i < width * height; i++) {
      rgb.set([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]], i * 3);
      alpha[i] = data[i * 4 + 3] / 255;
    }

    atlas[theme] = (await encode({ rgb, alpha, width, height }, `weather-${theme}`)).name;
  }

  return { atlas, size: [width, height], sprite: KIT.SPRITE, sprites };
}

const weather = await weatherKit();
const manifest = { ground, tile: W - BAND, canvas: [W, H], art, weather };
await writeJson(MANIFEST, manifest);

console.log(
  `\nmeadow line at ${(ground * 100).toFixed(1)}% · all four seasons: ` +
    `${(bytes.day / 1000).toFixed(0)} KB by day, ${(bytes.night / 1000).toFixed(0)} KB by night`
);
