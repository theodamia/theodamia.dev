/**
 * Turns the paintings behind /about (art/about/raw/) into what the page ships.
 *
 *   pnpm about
 *
 * /about ends at sunrise over the next range: one painting of that range, 1536 × 1024 on flat magenta, in three
 * lights with one outline (raw/ahead/land-{sunrise,day,night}.png: the light the page opens the finale on, the
 * morning it becomes, and the night). And the saucer of the page's one easter egg, the top-left piece of a sheet
 * (raw/ufo-{day,night}.png). For them this script:
 *   1. keys the magenta out (scripts/flat-key.mjs) and drops the specks of paint floating loose in it;
 *   2. gives the morning and the night the sunrise's outline, growing each one's own colours into every pixel its
 *      painting left out, so the page can fade one light into the next (and the theme reveal can swap them) with
 *      no shape moving; the saucer's night takes its day's outline the same way;
 *   3. pulls out the magenta the painter left along the edges;
 *   4. finds what the page places things by: where the range's highest summit stands (a share of the painting's
 *      height), and where the saucer's running lights are (shares of its box), so they can blink;
 *   5. fills the colour hidden under transparent pixels from the nearest paint and has WebP keep it, so nothing
 *      fringes the skyline; names every file by a hash of its bytes and writes scene/about.json.
 *
 * public/about/ belongs to this script: it is emptied first.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import sharp from 'sharp';
import { clampByte, key } from './flat-key.mjs';

/* a closed output pipe (`| head`) must not stop the run half way, before the manifest is written */
process.stdout.on('error', () => {});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'art/about/raw');
const OUT_DIR = path.join(ROOT, 'public/about');
const MANIFEST = path.join(ROOT, 'scene/about.json');

const W = 1536;
const H = 1024;
/** The range's lights: the first is the outline every other one takes. */
const LIGHTS = ['sunrise', 'day', 'night'];
/**
 * Where the far range meets the sea of clouds, as a share of the painting's height: the line the page stands the
 * range on. Read off the painting by eye; the summit above it is measured.
 */
const CLOUD_LINE = 0.37;
/** Islands of paint smaller than this, loose in the magenta, are specks. */
const SPECK = 48;
/** The saucer's sheet is a 2 × 2 grid; the saucer is the top-left piece. The rest of the sheet is not used. */
const SHEET = { columns: 2, rows: 2 };
/** Paint left around the saucer when its box is trimmed. */
const PAD = 4;
/** A running light: warm and bright. Pieces of one light closer than LIGHT_MERGE pixels are one light. */
const LIGHT = { r: 200, gMin: 80, gMax: 190, b: 110, min: 15 };
const LIGHT_MERGE = 22;
const ENCODE = { quality: 84, alphaQuality: 90, effort: 6, smartSubsample: true, exact: true };

async function load(file) {
  const image = sharp(file).removeAlpha();
  const { width, height } = await image.metadata();
  const sized = width === W && height === H ? image : image.resize(W, H, { fit: 'fill' });

  return (await sized.raw().toBuffer({ resolveWithObject: true })).data;
}

const neighbours = i => [i - 1, i + 1, i - W, i + W];

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
 * Repaints the pixels whose colour cannot be trusted, each from the nearest one that can: those near the outline that
 * still carry the magenta's cast, and every pixel the outline keeps (`use`) that this painting (`own`) left out.
 */
function repair(rgb, use, own = use) {
  const band = nearOutline(use, 2);
  const cast = i => Math.min(rgb[i * 3], rgb[i * 3 + 2]) - rgb[i * 3 + 1] > 4;
  const need = Uint8Array.from(use, (a, i) =>
    a > 0 && (own[i] < 0.5 || (band[i] && cast(i))) ? 1 : 0
  );
  const trusted = Uint8Array.from(use, (a, i) => (a >= 0.5 && !need[i] ? 1 : 0));

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
      rgb[i * 3] = rgb[from * 3];
      rgb[i * 3 + 1] = rgb[from * 3 + 1];
      rgb[i * 3 + 2] = rgb[from * 3 + 2];
      trusted[i] = 1;
      need[i] = 0;
    }
  }
}

/** Any magenta tint left (red and blue both above green) is pulled out. */
function despill(rgb, alpha) {
  for (let i = 0; i < W * H; i++) {
    if (alpha[i] <= 0) continue;
    const spill = Math.min(rgb[i * 3], rgb[i * 3 + 2]) - rgb[i * 3 + 1];
    if (spill <= 0) continue;
    rgb[i * 3] -= spill;
    rgb[i * 3 + 2] -= spill;
  }
}

/** The islands of a mask (8-connected), each with its pixels and centre. */
function islands(mask, width, height) {
  const seen = new Uint8Array(width * height);
  const found = [];

  for (let start = 0; start < width * height; start++) {
    if (seen[start] || !mask[start]) continue;
    const pixels = [start];
    seen[start] = 1;

    for (let k = 0; k < pixels.length; k++) {
      const x = pixels[k] % width;
      const y = Math.floor(pixels[k] / width);

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const j = ny * width + nx;
          if (seen[j] || !mask[j]) continue;
          seen[j] = 1;
          pixels.push(j);
        }
      }
    }

    let sx = 0;
    let sy = 0;

    for (const i of pixels) {
      sx += i % width;
      sy += Math.floor(i / width);
    }

    found.push({ pixels, cx: sx / pixels.length, cy: sy / pixels.length });
  }

  return found;
}

/** Islands of paint under SPECK pixels, loose in the magenta, are dropped. */
function dropSpecks(alpha) {
  const paint = Uint8Array.from(alpha, a => (a > 0.05 ? 1 : 0));

  for (const island of islands(paint, W, H)) {
    if (island.pixels.length > SPECK) continue;

    for (const i of island.pixels) {
      alpha[i] = 0;
    }
  }
}

/** The colour under transparent pixels, grown from the nearest paint, so WebP cannot fringe the edges with it. */
function bleed(rgb, alpha, width, height) {
  const known = Uint8Array.from(alpha, a => (a > 0.02 ? 1 : 0));

  for (let pass = 0; pass < 24; pass++) {
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

async function encode({ rgb, alpha, width, height }, base) {
  bleed(rgb, alpha, width, height);
  const data = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    data[i * 4] = clampByte(rgb[i * 3]);
    data[i * 4 + 1] = clampByte(rgb[i * 3 + 1]);
    data[i * 4 + 2] = clampByte(rgb[i * 3 + 2]);
    data[i * 4 + 3] = clampByte(alpha[i] * 255);
  }

  const bytes = await sharp(data, { raw: { width, height, channels: 4 } })
    .webp(ENCODE)
    .toBuffer();
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  const name = `${base}.${hash}.webp`;
  await fs.writeFile(path.join(OUT_DIR, name), bytes);
  console.log(
    `${name.padEnd(30)} ${String(width).padStart(4)} × ${height}  ${(bytes.length / 1000).toFixed(0)} KB`
  );

  return name;
}

/** The highest paint of the range, as a share of the painting's height: where its tallest summit's tip is. */
function summitShare(alpha) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (alpha[y * W + x] >= 0.5) return y / H;
    }
  }

  return CLOUD_LINE;
}

/** A box of the canvas, cut out of a painting's colours and an alpha. */
function crop(rgb, alpha, box) {
  const out = {
    rgb: new Float32Array(box.width * box.height * 3),
    alpha: new Float32Array(box.width * box.height),
  };

  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) {
      const from = (box.top + y) * W + box.left + x;
      const to = y * box.width + x;
      out.alpha[to] = alpha[from];
      out.rgb[to * 3] = rgb[from * 3];
      out.rgb[to * 3 + 1] = rgb[from * 3 + 1];
      out.rgb[to * 3 + 2] = rgb[from * 3 + 2];
    }
  }

  return out;
}

/** The saucer's running lights, as shares of its box: the warm, bright islands on its rim, a light's pieces merged. */
function runningLights({ rgb, alpha }, width, height) {
  const warm = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const [r, g, b] = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];
    if (alpha[i] < 0.8 || r <= LIGHT.r || g <= LIGHT.gMin || g >= LIGHT.gMax || b >= LIGHT.b)
      continue;
    warm[i] = 1;
  }

  const lights = [];

  for (const piece of islands(warm, width, height)) {
    if (piece.pixels.length < LIGHT.min) continue;
    const near = lights.find(
      light => Math.hypot(light.x - piece.cx, light.y - piece.cy) < LIGHT_MERGE
    );

    if (near) {
      const n = near.n + piece.pixels.length;
      near.x = (near.x * near.n + piece.cx * piece.pixels.length) / n;
      near.y = (near.y * near.n + piece.cy * piece.pixels.length) / n;
      near.n = n;
    } else {
      lights.push({ x: piece.cx, y: piece.cy, n: piece.pixels.length });
    }
  }

  return lights
    .sort((a, b) => a.x - b.x)
    .map(light => [+(light.x / width).toFixed(4), +(light.y / height).toFixed(4)]);
}

await fs.rm(OUT_DIR, { recursive: true, force: true });
await fs.mkdir(OUT_DIR, { recursive: true });

/* the range, in its three lights, all with the sunrise's outline */
const range = {};
let outline = null;

for (const light of LIGHTS) {
  const painting = key(await load(path.join(RAW_DIR, `ahead/land-${light}.png`)), { W, H });

  if (!outline) {
    dropSpecks(painting.alpha);
    outline = painting.alpha;
  }

  repair(painting.rgb, outline, painting.alpha);
  despill(painting.rgb, outline);
  range[light] = await encode(
    { rgb: painting.rgb, alpha: Float32Array.from(outline), width: W, height: H },
    `range-${light}`
  );
}

/* the saucer: the biggest piece in the sheet's top-left cell, its night given its day's outline */
const sheet = {};

for (const theme of ['day', 'night']) {
  sheet[theme] = key(await load(path.join(RAW_DIR, `ufo-${theme}.png`)), { W, H });
}

const cellW = W / SHEET.columns;
const cellH = H / SHEET.rows;
const paint = Uint8Array.from(sheet.day.alpha, a => (a > 0.06 ? 1 : 0));
const inCell = islands(paint, W, H).filter(island => island.cx < cellW && island.cy < cellH);
const saucerPiece = inCell.sort((a, b) => b.pixels.length - a.pixels.length)[0];
const saucerAlpha = new Float32Array(W * H);
let [x0, y0, x1, y1] = [W, H, 0, 0];

for (const i of saucerPiece.pixels) {
  saucerAlpha[i] = sheet.day.alpha[i];
  x0 = Math.min(x0, i % W);
  x1 = Math.max(x1, i % W);
  y0 = Math.min(y0, Math.floor(i / W));
  y1 = Math.max(y1, Math.floor(i / W));
}

const box = {
  left: x0 - PAD,
  top: y0 - PAD,
  width: x1 - x0 + 1 + 2 * PAD,
  height: y1 - y0 + 1 + 2 * PAD,
};
const saucer = { size: [box.width, box.height] };

for (const theme of ['day', 'night']) {
  const { rgb, alpha: own } = sheet[theme];
  repair(rgb, saucerAlpha, own);
  despill(rgb, saucerAlpha);
  const piece = crop(rgb, saucerAlpha, box);
  saucer[theme] = await encode(
    { ...piece, width: box.width, height: box.height },
    `saucer-${theme}`
  );

  if (theme === 'day') {
    saucer.lights = runningLights(piece, box.width, box.height);
  }
}

const manifest = {
  canvas: [W, H],
  cloudLine: CLOUD_LINE,
  summit: +summitShare(outline).toFixed(4),
  range,
  saucer,
};
await fs.writeFile(
  MANIFEST,
  await format(JSON.stringify(manifest), { ...(await resolveConfig(MANIFEST)), parser: 'json' })
);

console.log(
  `\nsummit at ${(manifest.summit * 100).toFixed(1)}% · cloud line at ${CLOUD_LINE * 100}% · ` +
    `saucer ${saucer.size.join(' × ')} with ${saucer.lights.length} lights`
);
