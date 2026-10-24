/**
 * Joins painted edits into the flats' raw paintings, so a painter's edit can only change what it was asked to.
 *
 *   pnpm flats:compose seam-guide far day      the backdrop rolled by half, its two ends meeting in the middle
 *   pnpm flats:compose seam-join far day       the painted seam band back in, unrolled: a seamless tile
 *   pnpm flats:compose bleed-guide village day the village's outer strips, with grey where new meadow goes
 *   pnpm flats:compose bleed-join village day  the painted strips back in, on a wider canvas
 *
 * Night follows day each time: its guide comes with the joined day as the reference for what to paint.
 *
 * Why it exists: an image model never returns a painting untouched. It drifts by a few pixels, returns its own size
 * and repaints details outside the area it was given. So every edit here is resized to the guide, registered on the
 * part that was meant to stay (searching a few pixels each way), keyed off its own magenta and joined in keyed
 * colour over a narrow feather; outside the band the original pixels are copied, never re-encoded. The originals
 * are kept once in raw/originals/ and every join starts from them, so running a join twice gives the same result.
 * Guides and edits live in art/scene/flats/edits/ (not committed); check images go to art/scene/flats/check/.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import sharp from 'sharp';
import { clampByte, key, smooth } from './flat-key.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FLATS_DIR = path.join(ROOT, 'art/scene/flats');
const RAW_DIR = path.join(FLATS_DIR, 'raw');
const ORIGINALS = path.join(RAW_DIR, 'originals');
const EDITS = path.join(FLATS_DIR, 'edits');
const CHECK = path.join(FLATS_DIR, 'check');
const GUIDES = path.join(FLATS_DIR, 'guides/guides.json');

/** The seam band's half width and the feather at its edges, in canvas pixels. */
const SEAM = { HALF: 100, FEATHER: 24 };
/** New canvas pixels on each side of a bled painting, and the edit strips' size (the model's native square). */
const BLEED = { LEFT: 333, RIGHT: 139, STRIP: 936, FEATHER: 40 };
/** Registration: how far an edit may have drifted, and the residual (mean grey levels) past which it is refused. */
const REGISTER = { REACH: 8, STEP: 3, LIMIT: 18 };
/** The area the painter is asked to fill: flat grey, which no painting here uses as a flat colour. */
const FILL = [127, 127, 127];

const [job, raw, theme = 'day', ...flags] = process.argv.slice(2);
const force = flags.includes('--force');
const guides = JSON.parse(await fs.readFile(GUIDES, 'utf8'));

/** A painting as raw RGB at a given size: an edit the model returned at its own size is scaled to the guide's. */
async function readRgb(file, W, H) {
  const { data } = await sharp(file)
    .removeAlpha()
    .resize(W, H, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  return data;
}

const writeRgb = (file, rgb, W, H) =>
  sharp(Buffer.from(rgb), { raw: { width: W, height: H, channels: 3 } })
    .png()
    .toFile(file);

/**
 * The approved painting: from originals/ once one is kept there, so joins always start from the same pixels. Read
 * at the guides' common canvas, as the processing reads it: a generator that returned a few pixels more (the
 * village came back at 1672 × 941) is scaled back, never cropped.
 */
async function original(name) {
  const kept = path.join(ORIGINALS, `${name}.png`);
  const live = path.join(RAW_DIR, `${name}.png`);

  try {
    await fs.access(kept);
  } catch {
    await fs.mkdir(ORIGINALS, { recursive: true });
    await fs.copyFile(live, kept);
  }

  const [W, H] = guides.canvas;

  return { rgb: await readRgb(kept, W, H), W, H };
}

/** A circular horizontal shift: the backdrop's right end comes round to meet its left. */
function roll(rgb, W, H, dx) {
  const out = Buffer.alloc(rgb.length);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const from = (y * W + x) * 3;
      const to = (y * W + ((((x + dx) % W) + W) % W)) * 3;
      out[to] = rgb[from];
      out[to + 1] = rgb[from + 1];
      out[to + 2] = rgb[from + 2];
    }
  }

  return out;
}

const grey = (rgb, i) => 0.3 * rgb[i * 3] + 0.59 * rgb[i * 3 + 1] + 0.11 * rgb[i * 3 + 2];

/**
 * The shift that best lays `edit` over `base` on the pixels `trusted` names (every STEP-th one), and the mean
 * difference left there. A model's edit is often a few pixels off; joining it unregistered doubles every edge.
 */
function register(base, edit, W, H, trusted) {
  let best = { dx: 0, dy: 0, residual: Infinity };

  for (let dy = -REGISTER.REACH; dy <= REGISTER.REACH; dy++) {
    for (let dx = -REGISTER.REACH; dx <= REGISTER.REACH; dx++) {
      let sum = 0;
      let count = 0;

      for (let y = REGISTER.REACH; y < H - REGISTER.REACH; y += REGISTER.STEP) {
        for (let x = REGISTER.REACH; x < W - REGISTER.REACH; x += REGISTER.STEP) {
          if (!trusted(x, y)) continue;
          sum += Math.abs(grey(base, y * W + x) - grey(edit, (y + dy) * W + x + dx));
          count++;
        }
      }

      if (count && sum / count < best.residual) {
        best = { dx, dy, residual: sum / count };
      }
    }
  }

  return best;
}

/** `rgb` moved by (dx, dy), its edges held: the registered edit. */
function shift(rgb, W, H, dx, dy) {
  const out = Buffer.alloc(rgb.length);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = Math.min(W - 1, Math.max(0, x + dx));
      const sy = Math.min(H - 1, Math.max(0, y + dy));
      out.set(rgb.subarray((sy * W + sx) * 3, (sy * W + sx) * 3 + 3), (y * W + x) * 3);
    }
  }

  return out;
}

/**
 * The join itself. `weight(x, y)` is how much of the edit a pixel takes: 0 copies the base pixel exactly, 1 takes
 * the edit, and between, the two are blended keyed (premultiplied colour and alpha), then laid back over the base's
 * own key colour, so the processing keys the result exactly as it keys the original.
 */
function join(base, edit, W, H, weight) {
  const canvas = { W, H };
  const keyedBase = key(base, canvas);
  const keyedEdit = key(edit, canvas);
  const matte = keyedBase.keyColour;
  const out = Buffer.from(base);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const w = weight(x, y);
      if (w <= 0) continue;
      const i = y * W + x;
      const ab = keyedBase.alpha[i];
      const ae = keyedEdit.alpha[i];
      const a = w * ae + (1 - w) * ab;

      for (let c = 0; c < 3; c++) {
        const colour =
          a > 0
            ? (w * ae * keyedEdit.rgb[i * 3 + c] + (1 - w) * ab * keyedBase.rgb[i * 3 + c]) / a
            : 0;
        out[i * 3 + c] = clampByte(colour * a + matte[c] * (1 - a));
      }
    }
  }

  return out;
}

/** The largest difference from the base where the weight is 0: it must be 0, or the join touched approved paint. */
function untouched(base, out, W, H, weight) {
  let worst = 0;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (weight(x, y) > 0) continue;
      const i = (y * W + x) * 3;
      worst = Math.max(worst, Math.abs(base[i] - out[i]), Math.abs(base[i + 1] - out[i + 1]));
      worst = Math.max(worst, Math.abs(base[i + 2] - out[i + 2]));
    }
  }

  return worst;
}

/** Mean difference between neighbouring columns: at column `x` against the painting's own typical step. */
function columnStep(rgb, W, H, x) {
  const step = (a, b) => {
    let sum = 0;

    for (let y = 0; y < H; y++) {
      sum += Math.abs(grey(rgb, y * W + a) - grey(rgb, y * W + b));
    }

    return sum / H;
  };

  const typical = [];

  for (let at = 1; at < W; at += 37) {
    typical.push(step(at - 1, at));
  }

  typical.sort((a, b) => a - b);

  return { here: step((x - 1 + W) % W, x % W), median: typical[typical.length >> 1] };
}

function refuse(message) {
  if (!force) {
    throw new Error(`${message} (pass --force to join it anyway)`);
  }

  console.warn(`WARNING: ${message}`);
}

/** A check image: the painting over a sky-ish grey, small, with three tiles side by side for a seamless tile. */
async function check(name, rgb, W, H, tiles = 1) {
  const keyed = key(rgb, { W, H });
  const rgba = Buffer.alloc(W * H * 4);

  for (let i = 0; i < W * H; i++) {
    for (let c = 0; c < 3; c++) {
      rgba[i * 4 + c] = clampByte(keyed.rgb[i * 3 + c]);
    }

    rgba[i * 4 + 3] = clampByte(keyed.alpha[i] * 255);
  }

  const one = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .resize(Math.round(W / 2))
    .png()
    .toBuffer();
  const width = Math.round(W / 2);
  const height = Math.round((H * width) / W);
  await sharp({
    create: { width: width * tiles, height, channels: 4, background: '#c8d6ec' },
  })
    .composite(Array.from({ length: tiles }, (_, k) => ({ input: one, left: k * width, top: 0 })))
    .png()
    .toFile(path.join(CHECK, `${name}.png`));
}

async function seamGuide() {
  const { rgb, W, H } = await original(`${raw}-${theme}`);
  await fs.mkdir(EDITS, { recursive: true });
  await writeRgb(path.join(EDITS, `${raw}-seam-${theme}-guide.png`), roll(rgb, W, H, W / 2), W, H);
  console.log(`${raw}-seam-${theme}-guide.png: ${W}×${H}, the ends meet at x = ${W / 2}`);
  console.log(
    `paint only x ${W / 2 - SEAM.HALF}–${W / 2 + SEAM.HALF}; everything else stays as it is`
  );
}

async function seamJoin() {
  const { rgb, W, H } = await original(`${raw}-${theme}`);
  const base = roll(rgb, W, H, W / 2);
  const edit = await readRgb(path.join(EDITS, `${raw}-seam-${theme}.png`), W, H);
  const centre = W / 2;
  const reg = register(base, edit, W, H, x => Math.abs(x - centre) > SEAM.HALF + 40);
  console.log(`registered ${reg.dx}, ${reg.dy} px, residual ${reg.residual.toFixed(1)}`);

  if (reg.residual > REGISTER.LIMIT) {
    refuse(
      `the edit drifted from the painting outside the band (residual ${reg.residual.toFixed(1)})`
    );
  }

  const weight = x => {
    const d = Math.abs(x + 0.5 - centre);

    return 1 - smooth((d - (SEAM.HALF - SEAM.FEATHER)) / SEAM.FEATHER);
  };

  const joined = join(base, shift(edit, W, H, reg.dx, reg.dy), W, H, weight);
  const worst = untouched(base, joined, W, H, weight);
  const tile = roll(joined, W, H, -W / 2);
  const wrap = columnStep(tile, W, H, 0);
  console.log(`outside the band: max difference ${worst} (must be 0)`);
  console.log(
    `wrap: ${wrap.here.toFixed(1)} grey levels across the tile's edge, against ${wrap.median.toFixed(1)} between ordinary columns`
  );

  if (worst !== 0) {
    throw new Error('the join changed approved pixels outside the band');
  }

  await writeRgb(path.join(EDITS, `${raw}-seam-${theme}-joined.png`), joined, W, H);
  await writeRgb(path.join(RAW_DIR, `${raw}-${theme}.png`), tile, W, H);
  await check(`${raw}-tile-${theme}`, tile, W, H, 3);
  console.log(`wrote raw/${raw}-${theme}.png and check/${raw}-tile-${theme}.png`);
}

/** Where a bled painting's original pixels and its new ones sit, for one side's edit strip. */
function strip(side, W) {
  const S = BLEED.STRIP;

  return side === 'left'
    ? { fresh: BLEED.LEFT, kept: S - BLEED.LEFT, from: 0, keptAt: BLEED.LEFT }
    : { fresh: BLEED.RIGHT, kept: S - BLEED.RIGHT, from: W - (S - BLEED.RIGHT), keptAt: 0 };
}

async function bleedGuide() {
  const { rgb, W, H } = await original(`${raw}-${theme}`);
  const S = BLEED.STRIP;
  await fs.mkdir(EDITS, { recursive: true });

  if (H !== S) {
    throw new Error(`${raw}: the strips are ${S} px square, the painting is ${H} px tall`);
  }

  for (const side of ['left', 'right']) {
    const { kept, from, keptAt } = strip(side, W);
    const out = Buffer.alloc(S * S * 3);

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const k = x - keptAt;
        const pixel =
          k >= 0 && k < kept
            ? rgb.subarray((y * W + from + k) * 3, (y * W + from + k) * 3 + 3)
            : FILL;
        out.set(pixel, (y * S + x) * 3);
      }
    }

    await writeRgb(path.join(EDITS, `${raw}-${side}-${theme}-guide.png`), out, S, S);
  }

  console.log(
    `${raw}-{left,right}-${theme}-guide.png: ${S}×${S}, grey is where the new paint goes`
  );
}

async function bleedJoin() {
  const { rgb, W, H } = await original(`${raw}-${theme}`);
  const S = BLEED.STRIP;
  const wide = W + BLEED.LEFT + BLEED.RIGHT;
  const out = Buffer.alloc(wide * H * 3);

  /* the approved painting, pixel for pixel, in the middle of the wider canvas */
  for (let y = 0; y < H; y++) {
    out.set(rgb.subarray(y * W * 3, (y + 1) * W * 3), (y * wide + BLEED.LEFT) * 3);
  }

  for (const side of ['left', 'right']) {
    const { kept, from, keptAt } = strip(side, W);
    const base = await readRgb(path.join(EDITS, `${raw}-${side}-${theme}-guide.png`), S, S);
    const edit = await readRgb(path.join(EDITS, `${raw}-${side}-${theme}.png`), S, S);
    const inKept = x => x - keptAt >= 0 && x - keptAt < kept;
    const reg = register(
      base,
      edit,
      S,
      S,
      x => inKept(x) && Math.abs(x - (side === 'left' ? keptAt : kept)) > 40
    );
    console.log(`${side}: registered ${reg.dx}, ${reg.dy} px, residual ${reg.residual.toFixed(1)}`);

    if (reg.residual > REGISTER.LIMIT) {
      refuse(`the ${side} edit drifted from the painting (residual ${reg.residual.toFixed(1)})`);
    }

    /* all of the new area, fading out over FEATHER px into the kept painting */
    const weight = x => {
      if (!inKept(x)) return 1;
      const into = side === 'left' ? x - keptAt : kept - 1 - x;

      return 1 - smooth((into + 0.5) / BLEED.FEATHER);
    };

    const joined = join(base, shift(edit, S, S, reg.dx, reg.dy), S, S, weight);
    await writeRgb(path.join(EDITS, `${raw}-${side}-${theme}-joined.png`), joined, S, S);

    /* only the new area and the feather go into the wide canvas */
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < S; x++) {
        if (weight(x) <= 0) continue;
        const at = side === 'left' ? x : BLEED.LEFT + from + x;
        out.set(joined.subarray((y * S + x) * 3, (y * S + x) * 3 + 3), (y * wide + at) * 3);
      }
    }
  }

  await writeRgb(path.join(RAW_DIR, `${raw}-${theme}.png`), out, wide, H);
  await check(`${raw}-bleed-${theme}`, out, wide, H);

  /* the guide grows by whole pixels at the same pixels per unit, so no approved pixel is resampled */
  const guide = guides.flats[raw];
  const ppu = W / (guide.originalRect ?? guide.rect)[2];
  guide.originalRect ??= guide.rect;
  const [x0, y0, , h0] = guide.originalRect;
  guide.canvas = [wide, H];
  guide.rect = [+(x0 - BLEED.LEFT / ppu).toFixed(4), y0, +(wide / ppu).toFixed(4), h0];
  await fs.writeFile(GUIDES, await format(JSON.stringify(guides), { parser: 'json' }));
  console.log(`wrote raw/${raw}-${theme}.png (${wide}×${H}); guide rect ${guide.rect.join(', ')}`);
}

const JOBS = {
  'seam-guide': seamGuide,
  'seam-join': seamJoin,
  'bleed-guide': bleedGuide,
  'bleed-join': bleedJoin,
};

if (!JOBS[job] || !raw) {
  throw new Error(
    `usage: compose-flats.mjs <${Object.keys(JOBS).join('|')}> <raw> [day|night] [--force]`
  );
}

await fs.mkdir(CHECK, { recursive: true });
await JOBS[job]();
