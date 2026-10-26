/**
 * Turns the paintings of /ai (art/ai/raw/) into what the page ships.
 *
 *   pnpm ai
 *
 * Two scenes, each 1536 × 1024 on flat magenta, by day and by night (prompts and tries in art/ai/AI-README.md):
 * the header, the giant looking at a range that turns from a wireframe draft into paint, and the finale, the giant
 * waiting at a fork in the trail, not choosing. For each this script:
 *   1. keys the magenta out (scripts/flat-key.mjs) and drops the specks of paint floating loose in it;
 *   2. gives the night the day's outline, so the theme reveal swaps the two with nothing moving;
 *   3. pulls out the magenta the painter left along the edges, and gives the header's wireframe the site's orange:
 *      the painter mixed magenta into its thin lines, which read red;
 *   4. dissolves the header's left end, where its meadow ran off the canvas, so it fades into the sky toward the
 *      title rather than stopping on a straight edge (its right and bottom run off the screen);
 *   5. trims the magenta above the paint, fills the colour hidden under transparent pixels and has WebP keep it,
 *      names every file by a hash of its bytes and writes scene/ai.json.
 *
 * public/ai/ belongs to this script: it is emptied first.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { key, smooth } from './flat-key.mjs';
import {
  bounds,
  despill,
  dropSpecks,
  encodeWebp,
  loadPainting,
  repair,
  writeHashed,
  writeJson,
} from './paintings.mjs';

/* a closed output pipe (`| head`) must not stop the run half way, before the manifest is written */
process.stdout.on('error', () => {});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'art/ai/raw');
const OUT_DIR = path.join(ROOT, 'public/ai');
const MANIFEST = path.join(ROOT, 'scene/ai.json');

const W = 1536;
const H = 1024;
const CANVAS = { W, H };
const THEMES = ['day', 'night'];
/** Islands of paint smaller than this, loose in the magenta, are specks. */
const SPECK = 48;
/** Paint fainter than this does not count when the magenta above it is trimmed. */
const TRIM_ALPHA = 0.02;
/**
 * The header's wireframe: where it is (the left of the painting, clear of the pennant on the right), what a line
 * pixel looks like once keyed (red standing well above both green and blue), and the site's accent it takes, by
 * day and by night (`--color-accent`, and the night's muted orange the painter was asked for).
 */
const WIRE = { RIGHT: 0.6, RED_FROM: 50, RED_FULL: 110, LINE_RED: 224 };
const ACCENT = { day: [207, 67, 24], night: [194, 86, 46] };
/** The header's left end dissolves over this share of its width. */
const HEADER_FADE = 0.16;
const ENCODE = { quality: 84, alphaQuality: 90, effort: 6, smartSubsample: true };

/** A raw painting, loaded and keyed. */
const keyed = async file => key(await loadPainting(path.join(RAW_DIR, file), CANVAS), CANVAS);

/** Gives the wireframe's lines the accent, as strongly as each pixel reads as a line, keeping its brightness. */
function recolourWire(rgb, alpha, accent) {
  const right = Math.round(W * WIRE.RIGHT);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < right; x++) {
      const i = y * W + x;
      if (alpha[i] <= 0) continue;
      const [r, g, b] = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];
      const share = smooth((r - Math.max(g, b) - WIRE.RED_FROM) / (WIRE.RED_FULL - WIRE.RED_FROM));
      if (share <= 0) continue;
      const brightness = Math.min(1.15, r / WIRE.LINE_RED);

      for (let c = 0; c < 3; c++) {
        rgb[i * 3 + c] += (accent[c] * brightness - rgb[i * 3 + c]) * share;
      }
    }
  }
}

/** Dissolves the left end of a picture over `share` of its width. */
function fadeLeft(alpha, share) {
  const reach = W * share;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < reach; x++) {
      alpha[y * W + x] *= smooth(x / reach);
    }
  }
}

/** One scene in both themes: the night with the day's outline. Returns each theme's colours and the shared alpha. */
async function scene(name, finish) {
  const day = await keyed(`${name}-day.png`);
  dropSpecks(day.alpha, CANVAS, SPECK);
  const outline = day.alpha;
  const lights = { day };

  for (const theme of THEMES) {
    const painting = theme === 'day' ? day : await keyed(`${name}-${theme}.png`);
    repair(painting.rgb, outline, painting.alpha, CANVAS);
    despill(painting.rgb, outline, CANVAS);
    finish?.(painting.rgb, outline, theme);
    lights[theme] = painting;
  }

  return { lights, outline };
}

/**
 * Writes a scene's two pictures, trimmed of the magenta above the paint and, where the paint starts right of the
 * left edge, of the magenta beside it: the right and bottom edges are kept, since the scenes run off them.
 */
async function writeScene(name, { lights, outline }) {
  const paint = bounds(W, H, i => outline[i] > TRIM_ALPHA);
  const box = { left: paint.left, top: paint.top, width: W - paint.left, height: H - paint.top };
  const entry = { size: [box.width, box.height] };

  for (const theme of THEMES) {
    const rgb = new Float32Array(box.width * box.height * 3);
    const alpha = new Float32Array(box.width * box.height);

    for (let y = 0; y < box.height; y++) {
      for (let x = 0; x < box.width; x++) {
        const from = (box.top + y) * W + box.left + x;
        const to = y * box.width + x;
        alpha[to] = outline[from];
        rgb.set(lights[theme].rgb.subarray(from * 3, from * 3 + 3), to * 3);
      }
    }

    const bytes = await encodeWebp({ rgb, alpha, width: box.width, height: box.height }, ENCODE);
    entry[theme] = await writeHashed(bytes, OUT_DIR, `${name}-${theme}`);
    console.log(
      `${entry[theme].padEnd(28)} ${box.width} × ${box.height}  ${(bytes.length / 1000).toFixed(0)} KB`
    );
  }

  return entry;
}

await fs.rm(OUT_DIR, { recursive: true, force: true });
await fs.mkdir(OUT_DIR, { recursive: true });

const header = await scene('header', (rgb, alpha, theme) =>
  recolourWire(rgb, alpha, ACCENT[theme])
);
fadeLeft(header.outline, HEADER_FADE);
const finale = await scene('finale');

await writeJson(MANIFEST, {
  header: await writeScene('header', header),
  finale: await writeScene('finale', finale),
});
