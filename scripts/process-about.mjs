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
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { key } from './flat-key.mjs';
import {
  bounds,
  despill,
  dropSpecks,
  encodeWebp,
  islands,
  loadPainting,
  repair,
  writeHashed,
  writeJson,
} from './paintings.mjs';

/* a closed output pipe (`| head`) must not stop the run half way, before the manifest is written */
process.stdout.on('error', () => {});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'art/about/raw');
const OUT_DIR = path.join(ROOT, 'public/about');
const MANIFEST = path.join(ROOT, 'scene/about.json');

const W = 1536;
const H = 1024;
const CANVAS = { W, H };
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
const ENCODE = { quality: 84, alphaQuality: 90, effort: 6, smartSubsample: true };

async function encode(picture, base) {
  const bytes = await encodeWebp(picture, ENCODE);
  const name = await writeHashed(bytes, OUT_DIR, base);
  console.log(
    `${name.padEnd(30)} ${String(picture.width).padStart(4)} × ${picture.height}  ${(bytes.length / 1000).toFixed(0)} KB`
  );

  return name;
}

/** A raw painting, loaded and keyed. */
const keyed = async file => key(await loadPainting(path.join(RAW_DIR, file), CANVAS), CANVAS);

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
  const painting = await keyed(`ahead/land-${light}.png`);

  if (!outline) {
    dropSpecks(painting.alpha, CANVAS, SPECK);
    outline = painting.alpha;
  }

  repair(painting.rgb, outline, painting.alpha, CANVAS);
  despill(painting.rgb, outline, CANVAS);
  range[light] = await encode(
    { rgb: painting.rgb, alpha: Float32Array.from(outline), width: W, height: H },
    `range-${light}`
  );
}

/* the saucer: the biggest piece in the sheet's top-left cell, its night given its day's outline */
const sheet = {};

for (const theme of ['day', 'night']) {
  sheet[theme] = await keyed(`ufo-${theme}.png`);
}

const cellW = W / SHEET.columns;
const cellH = H / SHEET.rows;
const paint = Uint8Array.from(sheet.day.alpha, a => (a > 0.06 ? 1 : 0));
const inCell = islands(paint, W, H).filter(island => island.cx < cellW && island.cy < cellH);
const saucerPiece = inCell.sort((a, b) => b.pixels.length - a.pixels.length)[0];
const saucerAlpha = new Float32Array(W * H);

for (const i of saucerPiece.pixels) {
  saucerAlpha[i] = sheet.day.alpha[i];
}

const tight = bounds(W, H, i => saucerAlpha[i] > 0);
const box = {
  left: tight.left - PAD,
  top: tight.top - PAD,
  width: tight.width + 2 * PAD,
  height: tight.height + 2 * PAD,
};
const saucer = { size: [box.width, box.height] };

for (const theme of ['day', 'night']) {
  const { rgb, alpha: own } = sheet[theme];
  repair(rgb, saucerAlpha, own, CANVAS);
  despill(rgb, saucerAlpha, CANVAS);
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
await writeJson(MANIFEST, manifest);

console.log(
  `\nsummit at ${(manifest.summit * 100).toFixed(1)}% · cloud line at ${CLOUD_LINE * 100}% · ` +
    `saucer ${saucer.size.join(' × ')} with ${saucer.lights.length} lights`
);
