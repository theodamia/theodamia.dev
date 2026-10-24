/**
 * Turns the forward climb's paintings in art/scene/flats/raw/ into what the climb ships.
 *
 *   pnpm flats
 *
 * Every flat is one whole painting on flat magenta, made over a guide whose canvas covers a known rectangle of
 * design units (art/scene/flats/guides/guides.json). For each flat this script:
 *   1. keys the magenta out (the key colour is measured, generators drift from #FF00FF), removes its spill and
 *      repaints the silhouette's outermost pixels from just inside it, where the generator's pink edge lives;
 *   2. applies the design fades, in units, so the ends and the foot dissolve and no edge is ever straight;
 *   3. gives the night painting the DAY alpha, so the two silhouettes match exactly through the theme reveal, and
 *      grows the night colours inward wherever the night painting drifted off its silhouette;
 *   4. hazes the far ranges toward --color-scene-haze, evenly, so the backdrop repeats without a step;
 *   5. trims, and writes WebP at desktop size and as a phone set, plus each ridge's far version: smaller,
 *      softened and 38% hazed, which is both the level of detail and the atmospheric perspective;
 *   6. names every file by a hash of its bytes (so public/scene can be cached forever) and writes
 *      scene/flats.json with each flat's box in design units, and the part of it that is solid paint.
 * The backdrop is a seamless tile (`tile`): the page repeats it side by side, so no screen is ever wider than it.
 * It is never trimmed sideways (its width is the period), its edge repair wraps round, and its files carry a few
 * columns of its own start after the end (the bleed), so the copies overlap on identical paint instead of
 * meeting on a hairline. Its phone file is the whole tile, smaller, since a tile cannot be cut.
 * The shared flag (raw/flag-parts-{day,night}.png) is split into its pole and its pennant the same way, and the
 * sky's clouds (raw/clouds-{day,night}.png, a row of separate clouds) into one picture each, and the cairn by
 * today's camp (raw/cairn-{day,night}.png) is trimmed to its stones. The night's aurora (raw/aurora-<n>.png) is
 * painted on black instead: its brightness becomes its opacity.
 *
 * public/scene/ belongs to this script: it is emptied first. Check PNGs go to art/scene/flats/check/.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import sharp from 'sharp';
import { clampByte, key, smooth } from './flat-key.mjs';
import { sceneTokenRgb } from './scene-token-rgb.mjs';

/* a closed output pipe (`| head`) must not stop the run half way, before the manifest is written */
process.stdout.on('error', () => {});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'art/scene/flats/raw');
const GUIDES = path.join(ROOT, 'art/scene/flats/guides/guides.json');
const CHECK_DIR = path.join(ROOT, 'art/scene/flats/check');
const OUT_DIR = path.join(ROOT, 'public/scene');
const MANIFEST = path.join(ROOT, 'scene/flats.json');

/**
 * A phone only ever sees the middle of a near painting: the story column, the camera's lean and a margin. So its
 * near version is cut to this half-width (units, around the focus line), dissolved over FADE units where the cut
 * falls inside the painting, and kept at SCALE of the desktop sharpness: sharper and smaller than shrinking the
 * whole painting. Its far version is the desktop one at FAR_SCALE (far versions are only ever shown small).
 */
const PHONE = { HALF_WIDTH: 520, FADE: 80, SCALE: 0.85, FAR_SCALE: 0.5 };
/**
 * A tile's bleed (its first columns again after its end) and its phone file's scale. The scale keeps every
 * length whole: the 1664 px period becomes 1456, the 8 px bleed 7 and the PAD columns of wrapped paint, added
 * on each side before resizing so the kernel never sees an edge, 14. Periods stay multiples of 16 for WebP.
 */
const TILE = { BLEED: 8, PHONE_SCALE: 0.875, PAD: 16 };
/** A ridge's far version: its size against the full painting, its softening and how far it is hazed. */
const FAR = { SCALE: 0.55, BLUR: 1.2, HAZE: 0.38 };
/** Pixels fainter than this do not count when trimming. */
const TRIM_ALPHA = 3;
/** Passes of the inward fill that covers a night painting's drift off the day silhouette. */
const FILL_PASSES = 10;
/**
 * The silhouette's edge band, in canvas pixels. Generators anti-alias the edge against the magenta with pinks too
 * faint to key (min(red, blue) barely above green) at full opacity, which drew a pink hairline along every
 * skyline. The band keeps its alpha and takes its colour from the paint just inside it instead.
 */
const EDGE = { BAND: 2, OPAQUE: 0.98 };
const ENCODE = {
  NEAR: { quality: 76, alphaQuality: 80, effort: 6, smartSubsample: true },
  NEAR_PHONE: { quality: 72, alphaQuality: 80, effort: 6, smartSubsample: true },
  FAR: { quality: 80, alphaQuality: 85, effort: 6, smartSubsample: true },
  FLAG: { quality: 86, alphaQuality: 90, effort: 6 },
  CLOUD: { quality: 74, alphaQuality: 78, effort: 6, smartSubsample: true },
  AURORA: { quality: 78, effort: 6, smartSubsample: true },
  CAIRN: { quality: 80, alphaQuality: 88, effort: 6 },
};
const BUDGET = { DESKTOP: 1_500_000, PHONE: 800_000 };
/** The flag's cloth hangs this many pole pixels below the widest row of the cap. */
const FLAG_HANG_PX = 6;
/**
 * The cloud sheet: a column counts as empty below this alpha, a run of this many empty columns parts two clouds,
 * and each cloud ships at this share of its painted size (painted large, so it stays crisp on a dense screen).
 */
const CLOUDS = { EMPTY: 0.02, GAP: 24, SCALE: 0.75 };
/**
 * The aurora: how many paintings, the black that still counts as black (generators leave a little noise in it),
 * the faintest glow kept when trimming, and the widest each ships. It is only ever seen on a screen with a
 * pointer, so it has no phone file.
 */
const AURORA = { COUNT: 2, FLOOR: 6, TRIM: 0.02, WIDTH: 1400 };
/**
 * The cairn: how tall it ships (it is drawn about 56 px tall at 1440 × 900 and 90 px at 2560 × 1440, so this
 * covers a dense screen at either, near enough), and where its stones stand on the snow, as a share of the
 * picture's height from the top (the patch of snow it is built on spreads below that line, in front of it).
 * Measured on the painting.
 */
const CAIRN = { HEIGHT: 150, GROUND: 0.93 };

/** Camp depths below the focus at each stop, in units (guides.json `OY`); the ridges' fades are measured from them. */
const guides = JSON.parse(await fs.readFile(GUIDES, 'utf8'));
const OY = guides.OY;

/**
 * The canvas a painting is made on, in pixels: the guides' common size unless its guide names its own (a painting
 * widened for bleed keeps its pixels per unit and grows by whole pixels instead).
 */
function canvasOf(raw) {
  const guide = guides.flats[raw];
  const [W, H] = guide?.canvas ?? guides.canvas;

  if (guide && Math.abs(W / guide.rect[2] - guide.pxPerUnit) > 1e-3) {
    throw new Error(
      `${raw}: canvas ${W} px over ${guide.rect[2]} units is not ${guide.pxPerUnit} px per unit`
    );
  }

  return { W, H };
}

/**
 * One entry per flat, back to front. `raw` names the paintings, `camp` is the camp index (0 is the trailhead),
 * `side` the side its camp stands on (+1 right), `flagDx` where its flag stands from the trail point (units,
 * measured on the paintings: the Lead's pole stands left of its wide bell tent), and `label` the top centre of
 * the camp itself, the tent, cabin or chalets, as [x, y] units from the trail point: its name stands just above
 * it. Measured on the paintings too, from the camp kit's colours, then centred on the structure by eye where a
 * prop (a fire ring, a chest) pulled the measure aside. Fades: [axis, alpha 1, alpha 0]. The ids follow the
 * camps' start years, so adding a job never shifts another camp's art.
 */
const ridge = (raw, camp, year, side, flagDx, label) => ({
  id: `camp-${year}`,
  raw,
  kind: 'camp',
  camp,
  side,
  flagDx,
  label,
  lod: true,
  fades: [
    ['x', side * 700, side * 1050],
    ['x', side * -450, side * -850],
    ['y', OY[camp] + 600, OY[camp] + 806],
  ],
});
const FLATS = [
  /* the backdrop repeats sideways; its foot dissolves into the haze fill the page lays under it (`foot`) */
  {
    id: 'far',
    raw: 'far',
    kind: 'back',
    tile: true,
    foot: 760,
    fades: [['y', 760, 907]],
    haze: 0.3,
  },
  {
    id: 'peak',
    raw: 'peak',
    kind: 'peak',
    fades: [
      ['y', 40, 230],
      ['x', 400, 560],
      ['x', -400, -560],
    ],
  },
  /*
   * the dome's frame stands a little above its canvas. Today's camp also has a cairn by its path, where the
   * closing card is kept while it is set aside (components/scene/cairn.tsx): `at` is where its stones stand on the
   * snow, in units from the trail point (at the bend where the path leaves the camp and climbs on), and `height`
   * how tall it is drawn, in units (a little over half the tent).
   */
  {
    ...ridge('deepsea', 5, 2026, -1, 34, [-42, -74]),
    cairn: { at: [160, -22], height: 56 },
  },
  /* the bell tent's peak */
  ridge('lead', 4, 2022, 1, -122, [72, -147]),
  ridge('geekbot', 3, 2018, -1, 34, [-86, -101]),
  ridge('ordereze', 2, 2016, 1, -34, [59, -78]),
  /* the cabin's chimney, over the middle of its roof */
  ridge('fedenet', 1, 2015, -1, 34, [-93, -113]),
  {
    id: 'camp-2014',
    raw: 'village',
    kind: 'camp',
    camp: 0,
    side: 0,
    /* the two chalets together: the trailhead's name stands over the village */
    label: [-152, -105],
    /* no far version: the camera starts at the trailhead, so the village is never further than its stop */
    lod: false,
    /* painted wide, with bleed (compose-flats.mjs): the meadow reaches both edges at the hero up to 2.4:1 */
    fades: [
      ['x', -1390, -1460],
      ['x', 780, 850],
    ],
  },
];

for (const flat of FLATS) {
  if (flat.tile && flat.fades.some(([axis]) => axis === 'x')) {
    throw new Error(`${flat.id}: a tile repeats sideways, so it cannot fade sideways`);
  }
}

/** A painting as raw RGB at its canvas size: a generator that returns a few pixels more is scaled back, never cropped. */
async function load(file, canvas) {
  const image = sharp(file).removeAlpha();
  const { width, height } = await image.metadata();
  const sized =
    width === canvas.W && height === canvas.H
      ? image
      : image.resize(canvas.W, canvas.H, { fit: 'fill' });

  return (await sized.raw().toBuffer({ resolveWithObject: true })).data;
}

/** Grows trusted colours into the pixels that need one: a night painting's drift off the day silhouette. */
function fillInward(rgb, trusted, needed, canvas, wrap = false) {
  const { W, H } = canvas;
  const known = Uint8Array.from(trusted);
  const [x0, x1] = wrap ? [0, W] : [1, W - 1];

  for (let pass = 0; pass < FILL_PASSES; pass++) {
    const grown = [];

    for (let y = 1; y < H - 1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = y * W + x;
        if (known[i] || !needed[i]) continue;
        const sum = [0, 0, 0];
        let count = 0;
        /* a tile's first and last columns are neighbours */
        const row = y * W;

        for (const j of [row + ((x + W - 1) % W), row + ((x + 1) % W), i - W, i + W]) {
          if (!known[j]) continue;
          count++;

          for (let c = 0; c < 3; c++) {
            sum[c] += rgb[j * 3 + c];
          }
        }

        if (count) {
          rgb.set(
            sum.map(v => v / count),
            i * 3
          );
          grown.push(i);
        }
      }
    }

    if (!grown.length) break;

    for (const i of grown) {
      known[i] = 1;
    }
  }
}

/** The day alpha with the design fades applied, and the box (in canvas pixels) that holds what survives. */
function fadedAlpha(alpha, flat, rect, canvas) {
  const { W, H } = canvas;
  const [rx, ry, rw] = rect;
  const pxPerUnit = W / rw;
  const faded = new Float32Array(W * H);
  const box = { x0: W, y0: H, x1: 0, y1: 0 };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const ux = rx + x / pxPerUnit;
      const uy = ry + y / pxPerUnit;
      let a = alpha[i];

      for (const [axis, from, to] of flat.fades) {
        a *= 1 - smooth(((axis === 'x' ? ux : uy) - from) / (to - from));
      }

      faded[i] = a;
      if (a * 255 <= TRIM_ALPHA) continue;
      box.x0 = Math.min(box.x0, x);
      box.y0 = Math.min(box.y0, y);
      box.x1 = Math.max(box.x1, x);
      box.y1 = Math.max(box.y1, y);
    }
  }

  return { faded, box, pxPerUnit };
}

/** RGBA for one theme, hazed where the flat asks for it. */
function compose(rgb, alpha, flat, haze, canvas) {
  const { W, H } = canvas;
  const out = Buffer.alloc(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      let [r, g, b] = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];

      if (flat.haze) {
        r += (haze[0] - r) * flat.haze;
        g += (haze[1] - g) * flat.haze;
        b += (haze[2] - b) * flat.haze;
      }

      out[i * 4] = clampByte(r);
      out[i * 4 + 1] = clampByte(g);
      out[i * 4 + 2] = clampByte(b);
      out[i * 4 + 3] = clampByte(alpha[i] * 255);
    }
  }

  return out;
}

/** Where the phone's near version is cut, in canvas pixels, and whether each cut falls inside the painting. */
function phoneCut(trim, rect, pxPerUnit) {
  const at = units => Math.round((units - rect[0]) * pxPerUnit);
  const left = Math.max(trim.left, at(-PHONE.HALF_WIDTH));
  const right = Math.min(trim.left + trim.width - 1, at(PHONE.HALF_WIDTH));

  return {
    left,
    width: right - left + 1,
    fadePx: PHONE.FADE * pxPerUnit,
    cutsLeft: left > trim.left,
    cutsRight: right < trim.left + trim.width - 1,
  };
}

/** A copy of the RGBA whose alpha dissolves toward each cut that falls inside the painting. */
function dissolveCut(rgba, cut, canvas) {
  const { W, H } = canvas;
  const out = Buffer.from(rgba);
  const right = cut.left + cut.width - 1;

  for (let x = cut.left; x <= right; x++) {
    let keep = 1;

    if (cut.cutsLeft) {
      keep *= smooth((x - cut.left) / cut.fadePx);
    }

    if (cut.cutsRight) {
      keep *= smooth((right - x) / cut.fadePx);
    }

    if (keep === 1) continue;

    for (let y = 0; y < H; y++) {
      const i = (y * W + x) * 4 + 3;
      out[i] = clampByte(out[i] * keep);
    }
  }

  return out;
}

/** A far version: smaller, softer and mixed toward the haze, with its alpha untouched. */
async function farVersion(png, width, haze) {
  const { data, info } = await sharp(png)
    .resize(Math.round(width * FAR.SCALE))
    .blur(FAR.BLUR)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < info.width * info.height; i++) {
    for (let c = 0; c < 3; c++) {
      data[i * 4 + c] = clampByte(data[i * 4 + c] + (haze[c] - data[i * 4 + c]) * FAR.HAZE);
    }
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

const written = [];

/** Encodes, names by content and writes one file; returns its public name. */
async function emit(png, base, options, width) {
  const image = width ? sharp(png).resize(width) : sharp(png);
  const bytes = await image.webp(options).toBuffer();
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  const name = `${base}.${hash}.webp`;
  await fs.writeFile(path.join(OUT_DIR, name), bytes);
  written.push({ name, bytes: bytes.length });

  return name;
}

/** The opaque pixels at least EDGE.BAND pixels inside the silhouette: the colours that can be trusted. */
function inside(alpha, canvas, wrap = false) {
  const { W, H } = canvas;
  let mask = Uint8Array.from(alpha, a => (a >= EDGE.OPAQUE ? 1 : 0));
  const [x0, x1] = wrap ? [0, W] : [1, W - 1];

  for (let pass = 0; pass < EDGE.BAND; pass++) {
    const next = new Uint8Array(mask.length);

    for (let y = 1; y < H - 1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = y * W + x;
        const row = y * W;
        next[i] =
          mask[i] &
          mask[row + ((x + W - 1) % W)] &
          mask[row + ((x + 1) % W)] &
          mask[i - W] &
          mask[i + W];
      }
    }

    mask = next;
  }

  return mask;
}

/**
 * Key a day/night pair: the day sets the silhouette for both, and the night's drift off it is painted inward
 * from the night's own colours. A flat's edge band is repainted from inside too; the flag's is not (`edges:
 * false`), because its pole is narrower than two bands and would take its colour from the stones.
 */
async function keyPair(raw, { edges = true, wrap = false } = {}) {
  const canvas = canvasOf(raw);
  const day = key(await load(path.join(RAW_DIR, `${raw}-day.png`), canvas), canvas);
  const night = key(await load(path.join(RAW_DIR, `${raw}-night.png`), canvas), canvas);
  const needed = Uint8Array.from(day.alpha, a => (a > 0 ? 1 : 0));

  if (edges) {
    fillInward(day.rgb, inside(day.alpha, canvas, wrap), needed, canvas, wrap);
  }

  const trusted = edges
    ? inside(night.alpha, canvas, wrap)
    : Uint8Array.from(night.alpha, a => (a > 0.9 ? 1 : 0));
  fillInward(night.rgb, trusted, needed, canvas, wrap);

  return { day, night, canvas };
}

/** RGBA rows with `left` columns from the end before them and `right` columns from the start after them. */
function wrapPad(rgba, W, H, left, right) {
  const wide = left + W + right;
  const out = Buffer.alloc(wide * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < wide; x++) {
      const from = (y * W + ((((x - left) % W) + W) % W)) * 4;
      rgba.copy(out, (y * wide + x) * 4, from, from + 4);
    }
  }

  return out;
}

/**
 * A tile's two files: the period plus its bleed, and the phone's, made from the period padded with wrapped paint
 * on both sides (so resizing never meets an edge) and cut back to the phone period plus its bleed.
 */
async function tileFiles(rgba, W, H, flat, theme) {
  const raw = (width, height) => ({ raw: { width, height, channels: 4 } });
  const desktop = await sharp(wrapPad(rgba, W, H, 0, TILE.BLEED), raw(W + TILE.BLEED, H))
    .png()
    .toBuffer();
  const scaled = [W, TILE.BLEED, TILE.PAD].map(px => px * TILE.PHONE_SCALE);

  if (!scaled.every(Number.isInteger)) {
    throw new Error(`${flat.id}: ${TILE.PHONE_SCALE} does not keep the tile's lengths whole`);
  }

  const [period, bleed, pad] = scaled;
  const padded = W + 2 * TILE.PAD + TILE.BLEED;
  const phone = await sharp(wrapPad(rgba, W, H, TILE.PAD, TILE.PAD + TILE.BLEED), raw(padded, H))
    .resize(padded * TILE.PHONE_SCALE, Math.round(H * TILE.PHONE_SCALE), { fit: 'fill' })
    .extract({ left: pad, top: 0, width: period + bleed, height: Math.round(H * TILE.PHONE_SCALE) })
    .png()
    .toBuffer();

  /* the review: three periods side by side, and the join between two of them at three times */
  const three = await sharp(wrapPad(rgba, W, H, W, W), raw(3 * W, H))
    .resize(Math.round((3 * W) / 2))
    .png()
    .toBuffer();
  await fs.writeFile(path.join(CHECK_DIR, `${flat.id}-tile-${theme}.png`), three);
  await sharp(wrapPad(rgba, W, H, 60, 60), raw(W + 120, H))
    .extract({ left: W, top: 0, width: 120, height: H })
    .resize(360, H * 3, { kernel: 'nearest' })
    .png()
    .toFile(path.join(CHECK_DIR, `${flat.id}-seam-${theme}.png`));

  return {
    near: await emit(desktop, `${flat.id}-near-${theme}`, ENCODE.NEAR),
    nearPhone: await emit(phone, `${flat.id}-near-${theme}-phone`, ENCODE.NEAR_PHONE),
  };
}

/**
 * The span (units) a flat paints solid: its box, less whatever its sideways fades take, and on a phone less the
 * dissolve where its phone file is cut. The camera tests read it to prove the trailhead's meadow reaches both edges
 * of every screen the design promises; a tile has none, it never ends.
 */
function solidSpan(flat, [x0, x1], cut) {
  let [left, right] = [x0, x1];

  for (const [axis, from, to] of flat.fades) {
    if (axis !== 'x') continue;

    if (to < from) {
      left = Math.max(left, from);
    } else {
      right = Math.min(right, from);
    }
  }

  if (cut?.cutsLeft) {
    left = Math.max(left, cut.x0 + PHONE.FADE);
  }

  if (cut?.cutsRight) {
    right = Math.min(right, cut.x1 - PHONE.FADE);
  }

  return [+left.toFixed(2), +right.toFixed(2)];
}

async function processFlat(flat) {
  const rect = guides.flats[flat.raw].rect;
  const pair = await keyPair(flat.raw, { wrap: Boolean(flat.tile) });
  const { canvas } = pair;
  const { faded, box, pxPerUnit } = fadedAlpha(pair.day.alpha, flat, rect, canvas);
  /* a tile keeps its whole width: that width is its period */
  const trim = {
    left: flat.tile ? 0 : box.x0,
    top: box.y0,
    width: flat.tile ? canvas.W : box.x1 - box.x0 + 1,
    height: box.y1 - box.y0 + 1,
  };
  const phone = flat.tile ? null : phoneCut(trim, rect, pxPerUnit);
  const art = {};

  for (const theme of ['day', 'night']) {
    const haze = sceneTokenRgb('scene-haze', theme === 'night');
    const rgba = compose(pair[theme].rgb, faded, flat, haze, canvas);
    const sheet = () => sharp(rgba, { raw: { width: canvas.W, height: canvas.H, channels: 4 } });
    const png = await sheet().extract(trim).png().toBuffer();
    await fs.writeFile(path.join(CHECK_DIR, `${flat.id}-${theme}.png`), png);

    if (flat.tile) {
      const trimmed = await sheet().extract(trim).raw().toBuffer();
      art[theme] = await tileFiles(trimmed, trim.width, trim.height, flat, theme);
      continue;
    }

    const phonePng = await sharp(dissolveCut(rgba, phone, canvas), {
      raw: { width: canvas.W, height: canvas.H, channels: 4 },
    })
      .extract({ left: phone.left, top: trim.top, width: phone.width, height: trim.height })
      .png()
      .toBuffer();
    const files = {
      near: await emit(png, `${flat.id}-near-${theme}`, ENCODE.NEAR),
      nearPhone: await emit(
        phonePng,
        `${flat.id}-near-${theme}-phone`,
        ENCODE.NEAR_PHONE,
        Math.round(phone.width * PHONE.SCALE)
      ),
    };

    if (flat.lod) {
      const far = await farVersion(png, trim.width, haze);
      files.far = await emit(far, `${flat.id}-far-${theme}`, ENCODE.FAR);
      files.farPhone = await emit(
        far,
        `${flat.id}-far-${theme}-phone`,
        ENCODE.FAR,
        Math.round(trim.width * FAR.SCALE * PHONE.FAR_SCALE)
      );
    }

    art[theme] = files;
  }

  const units = px => rect[0] + px / pxPerUnit;
  const x = [units(trim.left), units(trim.left + trim.width)];
  const phoneX = phone ? [units(phone.left), units(phone.left + phone.width)] : x;
  const entry = {
    kind: flat.kind,
    box: [
      +x[0].toFixed(2),
      +(rect[1] + trim.top / pxPerUnit).toFixed(2),
      +(x[1] - x[0]).toFixed(2),
      +(trim.height / pxPerUnit).toFixed(2),
    ],
    /* the phone's near version covers less: only its x and width differ */
    boxPhone: [
      +phoneX[0].toFixed(2),
      +(rect[1] + trim.top / pxPerUnit).toFixed(2),
      +(phoneX[1] - phoneX[0]).toFixed(2),
      +(trim.height / pxPerUnit).toFixed(2),
    ],
    px: [trim.width, trim.height],
    art,
  };

  if (flat.tile) {
    /* the files hold the period plus the bleed; the page lays copies a period apart, each over the last's bleed */
    Object.assign(entry, { tile: { period: trim.width, bleed: TILE.BLEED }, foot: flat.foot });
  } else {
    Object.assign(entry, {
      solid: solidSpan(flat, x),
      solidPhone: solidSpan(flat, phoneX, phone && { ...phone, x0: phoneX[0], x1: phoneX[1] }),
    });
  }

  if (flat.kind === 'camp') {
    Object.assign(entry, { camp: flat.camp, side: flat.side });
  }

  if (flat.flagDx !== undefined) {
    entry.flagDx = flat.flagDx;
  }

  if (flat.label) {
    entry.label = flat.label;
  }

  if (flat.cairn) {
    entry.cairn = flat.cairn;
  }

  console.log(`${flat.id.padEnd(10)} ${trim.width}×${trim.height}  box ${entry.box.join(', ')}`);

  return entry;
}

/** The flag sheet: the pole on the left half, the pennant on the right, each trimmed on its own. */
async function processFlag() {
  const pair = await keyPair('flag-parts', { edges: false });
  const { W, H } = pair.canvas;
  const split = Math.round(W * 0.42);

  const bounds = (x0, x1) => {
    const box = { x0: W, y0: H, x1: 0, y1: 0 };

    for (let y = 0; y < H; y++) {
      for (let x = x0; x < x1; x++) {
        if (pair.day.alpha[y * W + x] * 255 <= 20) continue;
        box.x0 = Math.min(box.x0, x);
        box.y0 = Math.min(box.y0, y);
        box.x1 = Math.max(box.x1, x);
        box.y1 = Math.max(box.y1, y);
      }
    }

    return { left: box.x0, top: box.y0, width: box.x1 - box.x0 + 1, height: box.y1 - box.y0 + 1 };
  };

  const pole = bounds(0, split);
  const cloth = bounds(split, W);

  const opaqueRun = y => {
    const xs = [];

    for (let x = pole.left; x < pole.left + pole.width; x++) {
      if (pair.day.alpha[y * W + x] > 0.5) {
        xs.push(x);
      }
    }

    return xs;
  };

  /* the shaft's centre, 40% down the pole; the cap is the widest row in its top sixth */
  const shaft = opaqueRun(pole.top + Math.round(pole.height * 0.4));
  let capRow = pole.top;
  let capWidth = 0;

  for (let y = pole.top; y < pole.top + pole.height / 6; y++) {
    const width = opaqueRun(y).length;

    if (width > capWidth) {
      capWidth = width;
      capRow = y;
    }
  }

  const art = {};

  for (const theme of ['day', 'night']) {
    const rgba = compose(pair[theme].rgb, pair.day.alpha, { fades: [] }, null, pair.canvas);
    const sheet = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
    art[theme] = {
      pole: await emit(
        await sheet.clone().extract(pole).png().toBuffer(),
        `flag-pole-${theme}`,
        ENCODE.FLAG
      ),
      cloth: await emit(
        await sheet.clone().extract(cloth).png().toBuffer(),
        `flag-cloth-${theme}`,
        ENCODE.FLAG
      ),
    };
  }

  return {
    pole: {
      w: pole.width,
      h: pole.height,
      ax: +((shaft[0] + shaft.at(-1)) / 2 - pole.left).toFixed(1),
      ay: capRow - pole.top + FLAG_HANG_PX,
    },
    cloth: { w: cloth.width, h: cloth.height, hx: 6, hy: 4 },
    art,
  };
}

/**
 * The sky's clouds: one sheet, cut into one picture per cloud where a run of empty columns parts them, left to
 * right. Night uses the day alpha, like every painting, so a cloud keeps its outline through the theme reveal.
 */
async function processClouds() {
  const pair = await keyPair('clouds');
  const { W, H } = pair.canvas;
  const alpha = pair.day.alpha;
  const filled = Array.from({ length: W }, (_, x) => {
    for (let y = 0; y < H; y++) {
      if (alpha[y * W + x] > CLOUDS.EMPTY) return true;
    }

    return false;
  });
  const runs = [];
  let start = -1;
  let gap = 0;

  for (let x = 0; x <= W; x++) {
    if (x < W && filled[x]) {
      if (start < 0) {
        start = x;
      }

      gap = 0;
      continue;
    }

    gap++;

    if (start >= 0 && (gap >= CLOUDS.GAP || x === W)) {
      runs.push([start, x - gap + 1]);
      start = -1;
    }
  }

  const clouds = [];

  for (const [x0, x1] of runs) {
    let [y0, y1] = [H, 0];

    for (let y = 0; y < H; y++) {
      for (let x = x0; x < x1; x++) {
        if (alpha[y * W + x] <= CLOUDS.EMPTY) continue;
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
    }

    const box = { left: x0, top: y0, width: x1 - x0, height: y1 - y0 + 1 };
    const index = clouds.length + 1;
    const art = {};

    for (const theme of ['day', 'night']) {
      const rgba = compose(pair[theme].rgb, alpha, { fades: [] }, null, pair.canvas);
      const png = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
        .extract(box)
        .png()
        .toBuffer();
      await fs.writeFile(path.join(CHECK_DIR, `cloud-${index}-${theme}.png`), png);
      art[theme] = await emit(
        png,
        `cloud-${index}-${theme}`,
        ENCODE.CLOUD,
        Math.round(box.width * CLOUDS.SCALE)
      );
    }

    clouds.push({ w: box.width, h: box.height, art });
    console.log(`cloud-${index}    ${box.width}×${box.height}`);
  }

  return clouds;
}

/**
 * The aurora, painted on black. A glow is light added to the sky, so it ships as it was painted, black and all,
 * and the page blends it as light (`mix-blend-mode: screen`), where black adds nothing. With no transparency to
 * encode it is a tenth of the size, and its soft gradients do not band. The generator's near-black noise is taken
 * down to black first, or it would faintly brighten the whole sky; each painting is trimmed to its glow.
 */
async function processAurora() {
  const layers = [];

  for (let n = 1; n <= AURORA.COUNT; n++) {
    const file = path.join(RAW_DIR, `aurora-${n}.png`);
    const { data, info } = await sharp(file)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: W, height: H } = info;
    const rgb = Buffer.alloc(W * H * 3);
    const box = { x0: W, y0: H, x1: 0, y1: 0 };

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        let brightest = 0;

        for (let c = 0; c < 3; c++) {
          const value = Math.max(0, data[i * 3 + c] - AURORA.FLOOR) * (255 / (255 - AURORA.FLOOR));
          rgb[i * 3 + c] = clampByte(value);
          brightest = Math.max(brightest, value / 255);
        }

        if (brightest <= AURORA.TRIM) continue;
        box.x0 = Math.min(box.x0, x);
        box.y0 = Math.min(box.y0, y);
        box.x1 = Math.max(box.x1, x);
        box.y1 = Math.max(box.y1, y);
      }
    }

    const trim = {
      left: box.x0,
      top: box.y0,
      width: box.x1 - box.x0 + 1,
      height: box.y1 - box.y0 + 1,
    };
    const png = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
      .extract(trim)
      .png()
      .toBuffer();
    await fs.writeFile(path.join(CHECK_DIR, `aurora-${n}.png`), png);
    const width = Math.min(AURORA.WIDTH, trim.width);
    layers.push({
      w: width,
      h: Math.round((trim.height * width) / trim.width),
      art: await emit(png, `aurora-${n}`, ENCODE.AURORA, width),
    });
    console.log(`aurora-${n}   ${trim.width}×${trim.height}`);
  }

  return layers;
}

/**
 * The cairn by today's camp: one small picture per theme, trimmed to its stones and their patch of snow, the night
 * with the day's outline like every painting. `ground` is where the stones stand, as a share of its height.
 */
async function processCairn() {
  const pair = await keyPair('cairn');
  const { W, H } = pair.canvas;
  const alpha = pair.day.alpha;
  const box = { x0: W, y0: H, x1: 0, y1: 0 };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (alpha[y * W + x] * 255 <= TRIM_ALPHA) continue;
      box.x0 = Math.min(box.x0, x);
      box.y0 = Math.min(box.y0, y);
      box.x1 = Math.max(box.x1, x);
      box.y1 = Math.max(box.y1, y);
    }
  }

  const trim = {
    left: box.x0,
    top: box.y0,
    width: box.x1 - box.x0 + 1,
    height: box.y1 - box.y0 + 1,
  };
  const width = Math.round((trim.width * CAIRN.HEIGHT) / trim.height);
  const art = {};

  for (const theme of ['day', 'night']) {
    const rgba = compose(pair[theme].rgb, alpha, { fades: [] }, null, pair.canvas);
    const png = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
      .extract(trim)
      .png()
      .toBuffer();
    await fs.writeFile(path.join(CHECK_DIR, `cairn-${theme}.png`), png);
    art[theme] = await emit(png, `cairn-${theme}`, ENCODE.CAIRN, width);
  }

  console.log(`cairn      ${trim.width}×${trim.height}`);

  return { w: width, h: CAIRN.HEIGHT, ground: CAIRN.GROUND, art };
}

await fs.rm(OUT_DIR, { recursive: true, force: true });
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(CHECK_DIR, { recursive: true });

const flats = {};

for (const flat of FLATS) {
  flats[flat.id] = await processFlat(flat);
}

const manifest = {
  note: 'Generated by scripts/process-flats.mjs. Boxes are [x, y, width, height] in design units, from the focus of expansion at scale 1.',
  /* the part of the painting a phone file keeps: the page picks those files only where they cover the screen */
  phone: { halfWidth: PHONE.HALF_WIDTH, fade: PHONE.FADE },
  order: FLATS.map(flat => flat.id),
  flats,
  flag: await processFlag(),
  clouds: await processClouds(),
  aurora: await processAurora(),
  cairn: await processCairn(),
};
await fs.writeFile(MANIFEST, await format(JSON.stringify(manifest), { parser: 'json' }));

/* what a visit costs, per theme and device: every flat's near and far versions, the flag, the clouds and the
   cairn (fetched once the closing card comes into view, so only by whoever reaches the end, but counted) */
const sizeOf = name => written.find(file => file.name === name)?.bytes ?? 0;

for (const theme of ['day', 'night']) {
  const flag = manifest.flag.art[theme];
  const flagBytes =
    sizeOf(flag.pole) +
    sizeOf(flag.cloth) +
    manifest.clouds.reduce((sum, cloud) => sum + sizeOf(cloud.art[theme]), 0) +
    sizeOf(manifest.cairn.art[theme]);
  let desktop = flagBytes;
  let phone = flagBytes;

  for (const entry of Object.values(flats)) {
    const art = entry.art[theme];
    desktop += sizeOf(art.near) + sizeOf(art.far);
    phone += sizeOf(art.nearPhone) + sizeOf(art.farPhone);
  }

  /* the aurora: night, and only where there is a pointer to call it */
  if (theme === 'night') {
    desktop += manifest.aurora.reduce((sum, layer) => sum + sizeOf(layer.art), 0);
  }

  const row = (label, bytes, budget) =>
    `${label} ${(bytes / 1000).toFixed(0).padStart(5)} KB of ${budget / 1000} KB${bytes > budget ? '  OVER' : ''}`;
  console.log(
    `${theme.padEnd(6)} ${row('desktop', desktop, BUDGET.DESKTOP)}   ${row('phone', phone, BUDGET.PHONE)}`
  );
}
