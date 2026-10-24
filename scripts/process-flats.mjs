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
 *   4. hazes the far ranges toward --color-scene-haze, more at the left end, which sits behind the hero's title;
 *   5. trims, and writes WebP at desktop size and as a phone set, plus each ridge's far version: smaller,
 *      softened and 38% hazed, which is both the level of detail and the atmospheric perspective;
 *   6. names every file by a hash of its bytes (so public/scene can be cached forever) and writes
 *      scene/flats.json with each flat's box in design units.
 * The shared flag (raw/flag-parts-{day,night}.png) is split into its pole and its pennant the same way.
 *
 * public/scene/ belongs to this script: it is emptied first. Check PNGs go to art/scene/flats/check/.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import sharp from 'sharp';
import { sceneTokenRgb } from './scene-token-rgb.mjs';

/* a closed output pipe (`| head`) must not stop the run half way, before the manifest is written */
process.stdout.on('error', () => {});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'art/scene/flats/raw');
const GUIDES = path.join(ROOT, 'art/scene/flats/guides/guides.json');
const CHECK_DIR = path.join(ROOT, 'art/scene/flats/check');
const OUT_DIR = path.join(ROOT, 'public/scene');
const MANIFEST = path.join(ROOT, 'scene/flats.json');

/** Every painting is made on this canvas, the guides' size. */
const CANVAS = { W: 1664, H: 936 };
/**
 * A phone only ever sees the middle of a near painting: the story column, the camera's lean and a margin. So its
 * near version is cut to this half-width (units, around the focus line), dissolved over FADE units where the cut
 * falls inside the painting, and kept at SCALE of the desktop sharpness: sharper and smaller than shrinking the
 * whole painting. Its far version is the desktop one at FAR_SCALE (far versions are only ever shown small).
 */
const PHONE = { HALF_WIDTH: 520, FADE: 80, SCALE: 0.85, FAR_SCALE: 0.5 };
/** A ridge's far version: its size against the full painting, its softening and how far it is hazed. */
const FAR = { SCALE: 0.55, BLUR: 1.2, HAZE: 0.38 };
/** How magenta a pixel is: min(red, blue) - green, from where it starts to count to (a share of) the key's own. */
const KEY_FROM = 40;
const KEY_SHARE = 0.85;
/** Residual pink on opaque edge pixels: where min(red, blue) still stands this far above green. */
const SPILL_FROM = 20;
const SPILL_RANGE = 60;
const SPILL_PULL = 0.3;
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
};
const BUDGET = { DESKTOP: 1_500_000, PHONE: 800_000 };
/** The flag's cloth hangs this many pole pixels below the widest row of the cap. */
const FLAG_HANG_PX = 6;

/** Camp depths below the focus at each stop, in units (guides.json `OY`); the ridges' fades are measured from them. */
const guides = JSON.parse(await fs.readFile(GUIDES, 'utf8'));
const OY = guides.OY;

/**
 * One entry per flat, back to front. `raw` names the paintings, `camp` is the camp index (0 is the trailhead),
 * `side` the side its camp stands on (+1 right), `flagDx` where its flag stands from the trail point (units,
 * measured on the paintings: the Lead's pole stands left of its wide bell tent). Fades: [axis, alpha 1, alpha 0].
 * The ids follow the camps' start years, so adding a job never shifts another camp's art.
 */
const ridge = (raw, camp, year, side, flagDx) => ({
  id: `camp-${year}`,
  raw,
  kind: 'camp',
  camp,
  side,
  flagDx,
  lod: true,
  fades: [
    ['x', side * 700, side * 1050],
    ['x', side * -450, side * -850],
    ['y', OY[camp] + 600, OY[camp] + 806],
  ],
});
const FLATS = [
  /* the foot dissolves only where a tall phone screen sees it, between camps; wide screens never reach it */
  { id: 'far', raw: 'far', kind: 'back', fades: [['y', 760, 907]], haze: 0.3, hazeLeft: 0.3 },
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
  ridge('deepsea', 5, 2026, -1, 34),
  ridge('lead', 4, 2022, 1, -122),
  ridge('geekbot', 3, 2018, -1, 34),
  ridge('ordereze', 2, 2016, 1, -34),
  ridge('fedenet', 1, 2015, -1, 34),
  {
    id: 'camp-2014',
    raw: 'village',
    kind: 'camp',
    camp: 0,
    side: 0,
    lod: true,
    fades: [
      /* the meadow runs to the painting's left edge: at the hero that edge stands at the screen's own (the camera
         keeps the backdrop, which ends at the same -1100, just covering it), so only its last strip dissolves */
      ['x', -1030, -1100],
      ['x', 520, 700],
    ],
  },
];

const smooth = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  return t * t * (3 - 2 * t);
};

const clampByte = v => Math.max(0, Math.min(255, Math.round(v)));
const median = values => values.toSorted((a, b) => a - b)[values.length >> 1];

/** A painting as raw RGB at the canvas size: a generator that returns a few pixels more is scaled back, never cropped. */
async function load(file) {
  const image = sharp(file).removeAlpha();
  const { width, height } = await image.metadata();
  const sized =
    width === CANVAS.W && height === CANVAS.H
      ? image
      : image.resize(CANVAS.W, CANVAS.H, { fit: 'fill' });

  return (await sized.raw().toBuffer({ resolveWithObject: true })).data;
}

/**
 * The key's own alpha and the colours with the key's share taken out. The key colour is the median of the most
 * magenta pixels: generators paint a slightly different magenta every time.
 */
function key(data) {
  const pixels = CANVAS.W * CANVAS.H;
  const magentas = [];

  for (let i = 0; i < pixels; i += 7) {
    const [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    if (r < 180 || b < 180 || g > 90) continue;
    magentas.push([r, g, b]);
  }

  const keyColour = magentas.length
    ? [0, 1, 2].map(c => median(magentas.map(p => p[c])))
    : [255, 0, 255];
  const keyStrength = Math.min(keyColour[0], keyColour[2]) - keyColour[1];
  const rgb = new Float32Array(pixels * 3);
  const alpha = new Float32Array(pixels);

  for (let i = 0; i < pixels; i++) {
    let [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    const magenta = Math.min(r, b) - g;
    const a = 1 - smooth((magenta - KEY_FROM) / (keyStrength * KEY_SHARE - KEY_FROM));

    if (a > 0 && a < 1) {
      r = (r - (1 - a) * keyColour[0]) / a;
      g = (g - (1 - a) * keyColour[1]) / a;
      b = (b - (1 - a) * keyColour[2]) / a;
    }

    const spill = Math.min(r, b) - g;

    if (a > 0 && spill > SPILL_FROM && magenta > 25) {
      const pull = Math.min(1, (spill - SPILL_FROM) / SPILL_RANGE) * SPILL_PULL;
      r -= (r - g) * pull;
      b -= (b - g) * pull;
    }

    rgb.set([r, g, b], i * 3);
    alpha[i] = a;
  }

  return { rgb, alpha, keyColour };
}

/** Grows trusted colours into the pixels that need one: a night painting's drift off the day silhouette. */
function fillInward(rgb, trusted, needed) {
  const { W, H } = CANVAS;
  const known = Uint8Array.from(trusted);

  for (let pass = 0; pass < FILL_PASSES; pass++) {
    const grown = [];

    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        if (known[i] || !needed[i]) continue;
        const sum = [0, 0, 0];
        let count = 0;

        for (const j of [i - 1, i + 1, i - W, i + W]) {
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
function fadedAlpha(alpha, flat, rect) {
  const { W, H } = CANVAS;
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
function compose(rgb, alpha, flat, rect, pxPerUnit, haze) {
  const { W, H } = CANVAS;
  const out = Buffer.alloc(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      let [r, g, b] = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];

      if (flat.haze) {
        const ux = rect[0] + x / pxPerUnit;
        /* the far left sits behind the hero's title: it fades further into the haze */
        const amount = flat.haze + (flat.hazeLeft ?? 0) * smooth((-400 - ux) / 700);
        r += (haze[0] - r) * amount;
        g += (haze[1] - g) * amount;
        b += (haze[2] - b) * amount;
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
function dissolveCut(rgba, cut) {
  const { W, H } = CANVAS;
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
function inside(alpha) {
  const { W, H } = CANVAS;
  let mask = Uint8Array.from(alpha, a => (a >= EDGE.OPAQUE ? 1 : 0));

  for (let pass = 0; pass < EDGE.BAND; pass++) {
    const next = new Uint8Array(mask.length);

    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        next[i] = mask[i] & mask[i - 1] & mask[i + 1] & mask[i - W] & mask[i + W];
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
async function keyPair(raw, { edges = true } = {}) {
  const day = key(await load(path.join(RAW_DIR, `${raw}-day.png`)));
  const night = key(await load(path.join(RAW_DIR, `${raw}-night.png`)));
  const needed = Uint8Array.from(day.alpha, a => (a > 0 ? 1 : 0));

  if (edges) {
    fillInward(day.rgb, inside(day.alpha), needed);
  }

  const trusted = edges
    ? inside(night.alpha)
    : Uint8Array.from(night.alpha, a => (a > 0.9 ? 1 : 0));
  fillInward(night.rgb, trusted, needed);

  return { day, night };
}

async function processFlat(flat) {
  const rect = guides.flats[flat.raw].rect;
  const pair = await keyPair(flat.raw);
  const { faded, box, pxPerUnit } = fadedAlpha(pair.day.alpha, flat, rect);
  const trim = {
    left: box.x0,
    top: box.y0,
    width: box.x1 - box.x0 + 1,
    height: box.y1 - box.y0 + 1,
  };
  const phone = phoneCut(trim, rect, pxPerUnit);
  const art = {};

  for (const theme of ['day', 'night']) {
    const haze = sceneTokenRgb('scene-haze', theme === 'night');
    const rgba = compose(pair[theme].rgb, faded, flat, rect, pxPerUnit, haze);
    const png = await sharp(rgba, { raw: { width: CANVAS.W, height: CANVAS.H, channels: 4 } })
      .extract(trim)
      .png()
      .toBuffer();
    await fs.writeFile(path.join(CHECK_DIR, `${flat.id}-${theme}.png`), png);
    const phonePng = await sharp(dissolveCut(rgba, phone), {
      raw: { width: CANVAS.W, height: CANVAS.H, channels: 4 },
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

  const entry = {
    kind: flat.kind,
    box: [
      +(rect[0] + trim.left / pxPerUnit).toFixed(2),
      +(rect[1] + trim.top / pxPerUnit).toFixed(2),
      +(trim.width / pxPerUnit).toFixed(2),
      +(trim.height / pxPerUnit).toFixed(2),
    ],
    /* the phone's near version covers less: only its x and width differ */
    boxPhone: [
      +(rect[0] + phone.left / pxPerUnit).toFixed(2),
      +(rect[1] + trim.top / pxPerUnit).toFixed(2),
      +(phone.width / pxPerUnit).toFixed(2),
      +(trim.height / pxPerUnit).toFixed(2),
    ],
    px: [trim.width, trim.height],
    art,
  };

  if (flat.kind === 'camp') {
    Object.assign(entry, { camp: flat.camp, side: flat.side });
  }

  if (flat.flagDx !== undefined) {
    entry.flagDx = flat.flagDx;
  }

  console.log(`${flat.id.padEnd(10)} ${trim.width}×${trim.height}  box ${entry.box.join(', ')}`);

  return entry;
}

/** The flag sheet: the pole on the left half, the pennant on the right, each trimmed on its own. */
async function processFlag() {
  const pair = await keyPair('flag-parts', { edges: false });
  const { W, H } = CANVAS;
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
    const rgba = compose(pair[theme].rgb, pair.day.alpha, { fades: [] }, [0, 0, W], 1, null);
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

await fs.rm(OUT_DIR, { recursive: true, force: true });
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(CHECK_DIR, { recursive: true });

const flats = {};

for (const flat of FLATS) {
  flats[flat.id] = await processFlat(flat);
}

const manifest = {
  note: 'Generated by scripts/process-flats.mjs. Boxes are [x, y, width, height] in design units, from the focus of expansion at scale 1.',
  order: FLATS.map(flat => flat.id),
  flats,
  flag: await processFlag(),
};
await fs.writeFile(MANIFEST, await format(JSON.stringify(manifest), { parser: 'json' }));

/* what a visit costs, per theme and device: every flat's near and far versions plus the flag */
const sizeOf = name => written.find(file => file.name === name)?.bytes ?? 0;

for (const theme of ['day', 'night']) {
  const flag = manifest.flag.art[theme];
  const flagBytes = sizeOf(flag.pole) + sizeOf(flag.cloth);
  let desktop = flagBytes;
  let phone = flagBytes;

  for (const entry of Object.values(flats)) {
    const art = entry.art[theme];
    desktop += sizeOf(art.near) + sizeOf(art.far);
    phone += sizeOf(art.nearPhone) + sizeOf(art.farPhone);
  }

  const row = (label, bytes, budget) =>
    `${label} ${(bytes / 1000).toFixed(0).padStart(5)} KB of ${budget / 1000} KB${bytes > budget ? '  OVER' : ''}`;
  console.log(
    `${theme.padEnd(6)} ${row('desktop', desktop, BUDGET.DESKTOP)}   ${row('phone', phone, BUDGET.PHONE)}`
  );
}
