/**
 * What every painting goes through after its magenta is keyed out (scripts/flat-key.mjs), shared by the scripts
 * that turn art/ into what the pages ship (process-flats, process-seasons, process-about):
 *
 *   - load a painting at its canvas size;
 *   - find its islands of paint, and drop the specks floating loose in the magenta;
 *   - repaint the pixels whose colour cannot be trusted (the magenta's cast along the outline, and, for a second
 *     light of the same painting, every pixel its own painting left out of the shared outline);
 *   - pull any magenta tint left out of the paint;
 *   - fill the colour hidden under transparent pixels before WebP encodes it;
 *   - write a file named by a hash of its bytes, and a manifest formatted like the rest of the repo.
 *
 * A canvas is `{ W, H }`; colours are `rgb` (3 floats a pixel) and `alpha` (1 float, 0 to 1), as `key()` returns.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import sharp from 'sharp';
import { clampByte } from './flat-key.mjs';

/** Red and blue both above green by more than this: a pixel with the magenta's cast. */
const CAST = 4;
/** Paint fainter than this does not count as paint when looking for islands and specks. */
const PAINT = 0.05;
/**
 * How far the colour under transparent pixels is grown from the paint. WebP keeps colour at half resolution, so a
 * colour hidden within a few pixels of an edge bleeds into it; a dozen is plenty.
 */
const BLEED_REACH = 12;

/** A painting's RGB bytes at its canvas size (a painter that returned another size is stretched to fit). */
export async function loadPainting(file, { W, H }) {
  const image = sharp(file).removeAlpha();
  const { width, height } = await image.metadata();
  const sized = width === W && height === H ? image : image.resize(W, H, { fit: 'fill' });

  return (await sized.raw().toBuffer({ resolveWithObject: true })).data;
}

/** Pixels within `reach` of the outline (alpha under a half), as a mask. */
export function nearOutline(alpha, { W, H }, reach) {
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
 * Repaints the pixels whose colour cannot be trusted, each from the nearest one that can, grown inward until all are
 * covered: those within two pixels of the outline that still carry the magenta's cast (the generator anti-aliases
 * its edge with pinks too faint to key), and every pixel the outline keeps (`use`) that this painting (`own`) left
 * out, where a second light of a painting drifted off the first. Everything else keeps its own colour: a twig two or
 * three pixels thin is all edge, and repainting all of it smears colour along it from wherever paint is solid.
 */
export function repair(rgb, use, own, canvas) {
  const { W, H } = canvas;
  const band = nearOutline(use, canvas, 2);
  const cast = i => Math.min(rgb[i * 3], rgb[i * 3 + 2]) - rgb[i * 3 + 1] > CAST;
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
        const from = [i - 1, i + 1, i - W, i + W].find(n => trusted[n]);
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

export function copyColour(rgb, to, from) {
  rgb[to * 3] = rgb[from * 3];
  rgb[to * 3 + 1] = rgb[from * 3 + 1];
  rgb[to * 3 + 2] = rgb[from * 3 + 2];
}

/**
 * Any magenta tint left (red and blue both above green) is pulled out, from pixel `from` on. With `nearEdgeOnly`,
 * only near the outline: for paint that has real purple in it (spring's crocuses).
 */
export function despill(rgb, alpha, canvas, { nearEdgeOnly = false, from = 0 } = {}) {
  const near = nearEdgeOnly ? nearOutline(alpha, canvas, 4) : null;

  for (let i = from; i < alpha.length; i++) {
    if (alpha[i] <= 0 || (near && !near[i])) continue;
    const spill = Math.min(rgb[i * 3], rgb[i * 3 + 2]) - rgb[i * 3 + 1];
    if (spill <= 0) continue;
    rgb[i * 3] -= spill;
    rgb[i * 3 + 2] -= spill;
  }
}

/** The islands of a mask (8-connected), each with its pixels and its centre. */
export function islands(mask, width, height) {
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

/** Islands of paint of `speck` pixels or fewer, loose in the magenta, are dropped; returns how many. */
export function dropSpecks(alpha, { W, H }, speck) {
  const paint = Uint8Array.from(alpha, a => (a > PAINT ? 1 : 0));
  let dropped = 0;

  for (const island of islands(paint, W, H)) {
    if (island.pixels.length > speck) continue;

    for (const i of island.pixels) {
      alpha[i] = 0;
    }

    dropped++;
  }

  return dropped;
}

/**
 * The smallest box around the pixels `keep(i)` keeps, within columns `[from, to)`, as sharp's `extract()` wants it:
 * `{ left, top, width, height }`, or null when it keeps none.
 */
export function bounds(width, height, keep, [from, to] = [0, width]) {
  let [x0, y0, x1, y1] = [width, height, -1, -1];

  for (let y = 0; y < height; y++) {
    for (let x = from; x < to; x++) {
      if (!keep(y * width + x)) continue;
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
  }

  return x1 < 0 ? null : { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

/** The colour under transparent pixels, grown from the nearest paint, so WebP cannot fringe the edges with it. */
function bleed(rgb, alpha, width, height) {
  const known = Uint8Array.from(alpha, a => (a > 0.02 ? 1 : 0));

  for (let pass = 0; pass < BLEED_REACH; pass++) {
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
      copyColour(rgb, i, from);
      known[i] = 1;
    }
  }
}

/** A keyed picture as WebP bytes: its hidden colour bled first, and kept (`exact`) so the bleed survives. */
export async function encodeWebp({ rgb, alpha, width, height }, options) {
  bleed(rgb, alpha, width, height);
  const data = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    data[i * 4] = clampByte(rgb[i * 3]);
    data[i * 4 + 1] = clampByte(rgb[i * 3 + 1]);
    data[i * 4 + 2] = clampByte(rgb[i * 3 + 2]);
    data[i * 4 + 3] = clampByte(alpha[i] * 255);
  }

  return sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ ...options, exact: true })
    .toBuffer();
}

/**
 * Writes `bytes` to `dir` as `<base>.<hash>.webp` and returns that name: a file named by its content can be cached
 * forever, and a changed painting gets a new name.
 */
export async function writeHashed(bytes, dir, base) {
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  const name = `${base}.${hash}.webp`;
  await fs.writeFile(path.join(dir, name), bytes);

  return name;
}

/** A manifest, formatted by the repo's own Prettier config, so the build never leaves it to lint-staged. */
export async function writeJson(file, data) {
  const options = { ...(await resolveConfig(file)), parser: 'json' };
  await fs.writeFile(file, await format(JSON.stringify(data), options));
}
