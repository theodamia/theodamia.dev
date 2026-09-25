/**
 * Turns the generated camp illustrations in art/camps/raw/ into what the site ships.
 *
 *   pnpm camps
 *
 * For every raw/camp-<start year>.(png|jpe?g|webp) (and the trailhead's `camp-start`, a camp's stand-alone
 * `-spinner`, the village's `village-<n>`, the `flag`, the near slopes' `tree-<n>`): crop the outer margin (where a generator's corner mark would sit), remove the flat
 * magenta background, trim to the subject so every camp stands on its own bottom edge, then write
 * public/camps/camp-<start year>.webp at twice the display size (the camp is an SVG <image>, which takes one
 * source, and WebP is supported everywhere the site runs). The sizes go into scene/camp-art.json so the
 * page can reserve the right box for each camp. A camp listed in LIGHTS also gets its lit part as separate
 * layers, and is itself saved with the fire out, so the page can light it on arrival.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/* a closed output pipe (`| head`) must not stop the run half way, before the manifest is written */
process.stdout.on('error', () => {});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'art/camps/raw');
const OUT_DIR = path.join(ROOT, 'public/camps');
const MANIFEST = path.join(ROOT, 'scene/camp-art.json');

/** Share of each edge thrown away before anything else: the subject is centred, a watermark is not. */
const EDGE_CROP = 0.06;
/** Pictures whose subject reaches further out than that (and have no corner mark to lose) get a thinner crop. */
const EDGE_CROPS = { 'camp-2022': 0.025 };
/** How magenta a pixel is: min(red, blue) - green. Nothing in our palette comes close to the key colour. */
const KEY_FROM = 36;
const KEY_TO = 150;
/** Pixels fainter than this do not count as subject when trimming. */
const TRIM_ALPHA = 24;
const PADDING = 0.02;
/** Twice the widest a camp is shown (about 190px on a tall desktop screen). */
const OUTPUT_WIDTH = 384;
/** Pictures shown much smaller than a camp are saved smaller too (still well over twice their display size). */
const OUTPUT_WIDTHS = {
  'camp-start': 160,
  'village-1': 240,
  'village-2': 200,
  flag: 140,
  'camp-2026-spinner': 100,
};
const BUDGET_BYTES = 40_000;
/** How far (in pixels) a stand-alone part's mask may grow outward to take in its outline. */
const OUTLINE_GROWTH = 26;

/**
 * Camps with something that lights up when the climber arrives. `seeds` are points inside the lit shape (the
 * orange of a flame, the amber glass of a lantern), in pixels of the raw image: one is enough unless dark lines
 * divide the shape into separate panes. That shape is lifted out into
 * layers of its own, and the camp itself is saved with the light out.
 *   fire    - two layers, the flame and its yellow core, so the page can make them flicker out of step
 *   lantern - one layer, the glass as drawn; the page fades it in and lets it breathe
 *   window  - like a lantern, but a house's window: it comes on at night and stays steady
 *   flag    - the cloth of the flag every camp raises, taken off its pole: `region` is a rectangle of the raw image
 *             holding only the cloth (everything in it that is not background is lifted), `pole` the x of the
 *             pole's centre, written to the manifest as `poleX` so the page can stand the pole where it belongs
 *   spinner - one layer, the blades; it is always shown, and the page spins it about its hub on arrival.
 *             `erase` lists rectangles of the raw image to clear from the saved picture
 * A camp can have several, each with its own `id` (used in the file names).
 */
const LIGHTS = {
  'camp-2018': [{ id: 'light', kind: 'fire', seeds: [[337, 705]] }],
  /* the bell tent's entrance, lit from inside: a tie line splits it into two panes */
  'camp-2022': [
    {
      id: 'light',
      kind: 'lantern',
      seeds: [
        [383, 600],
        [390, 717],
      ],
    },
  ],
  /* the cabin's window: one pane */
  'camp-2015': [{ id: 'light', kind: 'lantern', seeds: [[475, 585]] }],
  /* the bigger village house: the gable window and the one beside the door, four panes each (a wooden cross) */
  'village-1': [
    {
      id: 'gable',
      kind: 'window',
      seeds: [
        [385, 405],
        [420, 405],
        [385, 452],
        [420, 452],
      ],
    },
    {
      id: 'window',
      kind: 'window',
      seeds: [
        [478, 660],
        [522, 660],
        [478, 718],
        [522, 718],
      ],
    },
  ],
  /* the glass has a wire guard across it, so each pane needs its own seed */
  'camp-2016': [
    {
      id: 'light',
      kind: 'lantern',
      seeds: [
        [258, 418],
        [258, 478],
        [230, 450],
        [286, 450],
      ],
    },
  ],
  /* its smaller neighbour: one window, four panes */
  'village-2': [
    {
      id: 'window',
      kind: 'window',
      seeds: [
        [478, 660],
        [522, 660],
        [478, 716],
        [522, 716],
      ],
    },
  ],
  /*
   * The flag every camp raises (one picture for all). The cloth is everything right of the pole in this box, with
   * the ends of its two ties; the pole, its cap, the tie knots and the stones stay in the picture.
   */
  flag: [{ id: 'cloth', kind: 'flag', region: [441, 225, 800, 470], pole: 410 }],
  /* the dome's doorway is drawn dark, so the light inside is made here from the doorway's own shape */
  'camp-2026': [
    { id: 'light', kind: 'lantern', door: { seed: [410, 650], box: [312, 540, 506, 768] } },
  ],
  /*
   * The wind spinner is a picture of its own that stands beside the dome (see ART_EXTRAS in camp-layout.ts), so
   * nothing is ever behind its blades. One seed per blade; `hub` is what they turn about and stays in the picture.
   */
  'camp-2026-spinner': [
    {
      id: 'blades',
      kind: 'spinner',
      hub: [512, 405],
      hubRadius: 80,
      /* drawn alone on the background: the blades are lifted with their whole outline */
      standsAlone: true,
      /* the mast, which the lower blades' outlines run into */
      keep: [[474, 470, 552, 905]],
      seeds: [
        [365, 250],
        [665, 250],
        [365, 560],
        [665, 560],
      ],
      /* the ends of the ground line that stick out past the stones */
      erase: [
        [320, 880, 384, 915],
        [642, 880, 705, 915],
      ],
    },
  ],
};
/** How far the flame's outline reaches beyond its colour, as a share of the image width. */
const FLAME_OUTLINE = 0.012;

/* flame orange, warm yellow and lantern amber; cream and snow are far too blue to pass */
const isWarm = (r, g, b) => r > 140 && b < 170 && r - b > 60 && g < r;
const isCore = (r, g, b) => r > 205 && g > 150 && g - b > 40;

/** The flame's pixels: flood-fill warm colours from the seed (its dark outline walls it in), then grow to cover the outline. */
function flameMask(data, width, height, seeds) {
  const fill = new Uint8Array(width * height);
  const queue = seeds.map(([x, y]) => y * width + x);

  while (queue.length) {
    const i = queue.pop();
    if (fill[i] || !isWarm(data[i * 3], data[i * 3 + 1], data[i * 3 + 2])) continue;
    fill[i] = 1;
    const [x, y] = [i % width, (i / width) | 0];

    if (x > 0) {
      queue.push(i - 1);
    }

    if (x < width - 1) {
      queue.push(i + 1);
    }

    if (y > 0) {
      queue.push(i - width);
    }

    if (y < height - 1) {
      queue.push(i + width);
    }
  }

  const reach = Math.round(width * FLAME_OUTLINE);
  const mask = new Uint8Array(width * height);
  let [left, top, right, bottom] = [width, height, -1, -1];

  for (let i = 0; i < fill.length; i++) {
    if (!fill[i]) continue;
    const [cx, cy] = [i % width, (i / width) | 0];

    for (let dy = -reach; dy <= reach; dy++) {
      for (let dx = -reach; dx <= reach; dx++) {
        if (dx * dx + dy * dy > reach * reach) continue;
        const [x, y] = [cx + dx, cy + dy];
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        mask[y * width + x] = 1;
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }

  if (right < 0) throw new Error('the light seed is not inside a warm-coloured shape');

  return { fill, mask, box: { left, top, width: right - left + 1, height: bottom - top + 1 } };
}

/**
 * Everything in a rectangle that is not background, for a part drawn on its own there (a flag's cloth): the whole
 * shape with its outline and soft edge, and nothing else is in the way.
 */
function regionMask(data, width, height, [x0, y0, x1, y1]) {
  const mask = new Uint8Array(width * height);
  let [left, top, right, bottom] = [width, height, -1, -1];

  for (let y = Math.max(0, y0); y <= Math.min(height - 1, y1); y++) {
    for (let x = Math.max(0, x0); x <= Math.min(width - 1, x1); x++) {
      const i = y * width + x;
      const magenta = Math.min(data[i * 3], data[i * 3 + 2]) - data[i * 3 + 1];
      if (magenta > KEY_TO) continue;
      mask[i] = 1;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < 0) throw new Error('the region holds nothing but background');

  return {
    fill: mask,
    mask,
    box: { left, top, width: right - left + 1, height: bottom - top + 1 },
  };
}

/**
 * Take a lifted shape out of the picture: every pixel under the mask takes the colour of the nearest pixel that
 * is not, growing inward from the mask's edge. Over empty background that leaves background; over a tent it
 * continues the tent.
 */
function inpaint(data, width, height, mask) {
  const out = Buffer.from(data);
  const known = new Uint8Array(width * height);
  const queued = new Uint8Array(width * height);

  const neighbours = i => {
    const [x, y] = [i % width, (i / width) | 0];
    const list = [];

    if (x > 0) {
      list.push(i - 1);
    }

    if (x < width - 1) {
      list.push(i + 1);
    }

    if (y > 0) {
      list.push(i - width);
    }

    if (y < height - 1) {
      list.push(i + width);
    }

    return list;
  };

  for (let i = 0; i < mask.length; i++) known[i] = mask[i] ? 0 : 1;
  /* the first ring: masked pixels that touch a known one */
  let ring = [];

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] && neighbours(i).some(j => known[j])) {
      ring.push(i);
      queued[i] = 1;
    }
  }

  while (ring.length) {
    /* colour the whole ring from what is known, and only then count it as known: colours flow in evenly */
    for (const i of ring) {
      let [r, g, b, n] = [0, 0, 0, 0];

      for (const j of neighbours(i)) {
        if (!known[j]) continue;
        r += out[j * 3];
        g += out[j * 3 + 1];
        b += out[j * 3 + 2];
        n++;
      }

      out.set([r / n, g / n, b / n], i * 3);
    }

    const next = [];
    for (const i of ring) known[i] = 1;

    for (const i of ring) {
      for (const j of neighbours(i)) {
        if (known[j] || queued[j]) continue;
        queued[j] = 1;
        next.push(j);
      }
    }

    ring = next;
  }

  /* where the fill drew on the background it is a blend of magenta and its neighbours: make it plain background
     again, so it keys out completely instead of leaving a tinted haze */
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const magenta = Math.min(out[i * 3], out[i * 3 + 2]) - out[i * 3 + 1];

    if (magenta > BACKGROUND_TINT) {
      out.set([255, 0, 255], i * 3);
    }
  }

  return out;
}

/** Inpainted pixels more magenta than this are background, whatever they were blended with. */
const BACKGROUND_TINT = 10;

const isInk = (r, g, b) => r < 80 && g < 90 && b < 105;
/** The lit doorway's colour, and how far inside the doorway's dark shape the light stops (its outline stays dark). */
const DOOR_LIGHT = [242, 180, 65];
const DOOR_INSET = 9;

/** A doorway drawn dark, lit from inside: the dark shape around `seed` within `box`, shrunk by the outline's width. */
function doorLight(data, width, height, seed, [x0, y0, x1, y1]) {
  const region = new Uint8Array(width * height);
  const queue = [seed[1] * width + seed[0]];

  while (queue.length) {
    const i = queue.pop();
    const [x, y] = [i % width, (i / width) | 0];
    if (region[i] || x < x0 || x > x1 || y < y0 || y > y1) continue;
    if (!isInk(data[i * 3], data[i * 3 + 1], data[i * 3 + 2])) continue;
    region[i] = 1;
    queue.push(i - 1, i + 1, i - width, i + width);
  }

  const mask = new Uint8Array(width * height);
  let [left, top, right, bottom] = [width, height, -1, -1];

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!region[y * width + x]) continue;
      let inside = true;

      for (let dy = -DOOR_INSET; dy <= DOOR_INSET && inside; dy++) {
        for (let dx = -DOOR_INSET; dx <= DOOR_INSET && inside; dx++) {
          if (dx * dx + dy * dy > DOOR_INSET * DOOR_INSET) continue;
          const [nx, ny] = [x + dx, y + dy];
          inside =
            nx >= 0 && ny >= 0 && nx < width && ny < height && Boolean(region[ny * width + nx]);
        }
      }

      if (!inside) continue;
      mask[y * width + x] = 1;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < 0) throw new Error('the door seed is not inside a dark doorway');
  const box = { left, top, width: right - left + 1, height: bottom - top + 1 };
  const pixels = Buffer.alloc(box.width * box.height * 4);

  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) {
      if (mask[(y + top) * width + x + left]) {
        pixels.set([...DOOR_LIGHT, 255], (y * box.width + x) * 4);
      }
    }
  }

  return { box, pixels };
}

/** Unlit lantern glass: a dark slate that still reads as glass behind its frame. */
const DARK_GLASS = [42, 58, 72];
const GLASS_FEATHER = 2;

/** Turn a lantern off: its frame and wire guard stay, only the lit panes (and their soft edge) go dark. */
function darken(data, width, height, fill) {
  const out = Buffer.from(data);

  for (let i = 0; i < fill.length; i++) {
    if (!fill[i]) continue;
    const [cx, cy] = [i % width, (i / width) | 0];

    for (let dy = -GLASS_FEATHER; dy <= GLASS_FEATHER; dy++) {
      for (let dx = -GLASS_FEATHER; dx <= GLASS_FEATHER; dx++) {
        const [x, y] = [cx + dx, cy + dy];
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const j = y * width + x;

        /* only pixels that carry some of the light's colour; the dark frame right next to it is left alone */
        if (fill[j] || data[j * 3] > 110) {
          out.set(DARK_GLASS, j * 3);
        }
      }
    }
  }

  return out;
}

/** A lantern's light: the lit shape exactly as drawn, as one cut-out the size of its box. */
function lanternLayer(rgba, width, { mask, box }) {
  const glass = Buffer.alloc(box.width * box.height * 4);

  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) {
      const i = (y + box.top) * width + x + box.left;

      if (mask[i]) {
        glass.set(rgba.subarray(i * 4, i * 4 + 4), (y * box.width + x) * 4);
      }
    }
  }

  return glass;
}

/** The flame as two cut-outs the size of its box: the whole flame with its core painted over, and the core alone. */
function flameLayers(data, rgba, width, { fill, mask, box }) {
  let [r, g, b, n] = [0, 0, 0, 0];

  for (let i = 0; i < fill.length; i++) {
    if (!fill[i] || isCore(data[i * 3], data[i * 3 + 1], data[i * 3 + 2])) continue;
    r += data[i * 3];
    g += data[i * 3 + 1];
    b += data[i * 3 + 2];
    n++;
  }

  const body = [r / n, g / n, b / n];
  const flame = Buffer.alloc(box.width * box.height * 4);
  const core = Buffer.alloc(box.width * box.height * 4);

  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) {
      const i = (y + box.top) * width + x + box.left;
      const o = (y * box.width + x) * 4;
      if (!mask[i]) continue;
      const hot = fill[i] && isCore(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
      const px = hot
        ? [...body, 255]
        : [rgba[i * 4], rgba[i * 4 + 1], rgba[i * 4 + 2], rgba[i * 4 + 3]];
      flame.set(px, o);

      if (hot) {
        core.set([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 255], o);
      }
    }
  }

  return { flame, core };
}

/**
 * Turns the flat magenta behind the subject into transparency. A pixel's magenta share is measured from its
 * green channel (the background's own green is 0, the subject's is not), and along a soft edge that share is
 * divided back out of the colour, so an anti-aliased outline keeps its own hue instead of turning pink.
 */
function removeBackground(data, width, height) {
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    const magenta = Math.min(r, b) - g;
    const alpha = 1 - Math.min(1, Math.max(0, (magenta - KEY_FROM) / (KEY_TO - KEY_FROM)));
    /* on soft edges, take the background's share of the colour back out so no pink fringe is left */
    const unmix = (channel, key) =>
      alpha > 0.02 ? Math.min(255, Math.max(0, (channel - (1 - alpha) * key) / alpha)) : 0;
    out[i * 4] = unmix(r, 255);
    out[i * 4 + 1] = unmix(g, 0);
    out[i * 4 + 2] = unmix(b, 255);
    out[i * 4 + 3] = Math.round(alpha * 255);
  }

  return out;
}

/** The tight box round what is left, with a little air on three sides: never below, so it stands on its base. */
function subjectBox(rgba, width, height) {
  let [left, top, right, bottom] = [width, height, -1, -1];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (rgba[(y * width + x) * 4 + 3] <= TRIM_ALPHA) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < 0) return null;
  const pad = Math.round(Math.max(right - left, bottom - top) * PADDING);

  return {
    left: Math.max(0, left - pad),
    top: Math.max(0, top - pad),
    /* no padding below: the bottom edge of the file is the ground the camp stands on */
    width: Math.min(width - 1, right + pad) - Math.max(0, left - pad) + 1,
    height: bottom - Math.max(0, top - pad) + 1,
  };
}

/**
 * One raw image to what the site ships: crop the generator's margin, lift any light or moving part into a layer
 * of its own, take the background out, trim to the subject, and write the WebP files plus this camp's entry.
 */
async function processCamp(file) {
  const name = path.basename(file, path.extname(file));
  const source = sharp(path.join(RAW_DIR, file)).removeAlpha();
  const meta = await source.metadata();
  const edge = EDGE_CROPS[name] ?? EDGE_CROP;
  const crop = {
    left: Math.round(meta.width * edge),
    top: Math.round(meta.height * edge),
    width: Math.round(meta.width * (1 - 2 * edge)),
    height: Math.round(meta.height * (1 - 2 * edge)),
  };
  const { data, info } = await source.extract(crop).raw().toBuffer({ resolveWithObject: true });
  const local = ([x, y]) => [x - crop.left, y - crop.top];

  const liftedShape = light => {
    if (light.region) {
      const [x0, y0, x1, y1] = light.region;

      return regionMask(data, info.width, info.height, [...local([x0, y0]), ...local([x1, y1])]);
    }

    return light.seeds ? flameMask(data, info.width, info.height, light.seeds.map(local)) : null;
  };

  const lights = (LIGHTS[name] ?? []).map(light => ({
    ...light,
    /* shapes lifted out of the picture; a door light is made from the doorway's shape instead */
    lifted: liftedShape(light),
  }));

  for (const light of lights) {
    if (!light.hub || !light.lifted) continue;
    const [hx, hy] = local(light.hub);
    const inHub = (x, y) => (x - hx) ** 2 + (y - hy) ** 2 <= light.hubRadius ** 2;
    const kept = (light.keep ?? []).map(([x0, y0, x1, y1]) => [
      ...local([x0, y0]),
      ...local([x1, y1]),
    ]);
    const isKept = (x, y) =>
      kept.some(([x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1);

    if (light.standsAlone) {
      /* nothing is behind these blades, so take them with their WHOLE outline: grow the mask through everything
         that is not background, stopping at the hub and at what must stay (the mast) */
      const { mask } = light.lifted;
      let ring = [];

      for (let i = 0; i < mask.length; i++) {
        if (mask[i]) {
          ring.push(i);
        }
      }

      for (let step = 0; step < OUTLINE_GROWTH && ring.length; step++) {
        const next = [];

        for (const i of ring) {
          const [x, y] = [i % info.width, (i / info.width) | 0];

          for (const [nx, ny] of [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
          ]) {
            if (nx < 0 || ny < 0 || nx >= info.width || ny >= info.height) continue;
            const j = ny * info.width + nx;
            if (mask[j] || inHub(nx, ny) || isKept(nx, ny)) continue;
            const magenta = Math.min(data[j * 3], data[j * 3 + 2]) - data[j * 3 + 1];
            if (magenta > KEY_TO) continue;
            mask[j] = 1;
            next.push(j);
          }
        }

        ring = next;
      }

      /* the box follows the grown mask */
      let [left, top, right, bottom] = [info.width, info.height, -1, -1];

      for (let i = 0; i < mask.length; i++) {
        if (!mask[i]) continue;
        const [x, y] = [i % info.width, (i / info.width) | 0];
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }

      light.lifted.box = { left, top, width: right - left + 1, height: bottom - top + 1 };
    }

    /* a spinner's hub does not turn: keep it (and the ring of outline round it) in the picture, not in the rotor */
    for (let y = hy - light.hubRadius; y <= hy + light.hubRadius; y++) {
      if (y < 0 || y >= info.height) continue;

      for (let x = hx - light.hubRadius; x <= hx + light.hubRadius; x++) {
        if (x < 0 || x >= info.width) continue;

        if ((x - hx) ** 2 + (y - hy) ** 2 <= light.hubRadius ** 2) {
          light.lifted.mask[y * info.width + x] = 0;
        }
      }
    }
  }

  const lit = removeBackground(data, info.width, info.height);
  /* the camp is saved with its lights out and its moving parts removed; they go on the page as layers of their own */
  let unlit = data;

  for (const light of lights) {
    if (!light.lifted) continue;

    if (light.kind === 'lantern' || light.kind === 'window') {
      unlit = darken(unlit, info.width, info.height, light.lifted.fill);
    } else if (light.standsAlone || light.region) {
      /* only background was behind it */
      unlit = Buffer.from(unlit);

      for (let i = 0; i < light.lifted.mask.length; i++) {
        if (light.lifted.mask[i]) {
          unlit.set([255, 0, 255], i * 3);
        }
      }
    } else {
      unlit = inpaint(unlit, info.width, info.height, light.lifted.mask);
    }
  }

  for (const light of lights) {
    for (const [x0, y0, x1, y1] of light.erase ?? []) {
      /* rectangles of the raw image to clear from the saved picture (the lifted layers are not touched) */
      const [left, top] = local([x0, y0]);
      const [right, bottom] = local([x1, y1]);

      if (unlit === data) {
        unlit = Buffer.from(data);
      }

      for (let y = Math.max(0, top); y <= Math.min(info.height - 1, bottom); y++) {
        for (let x = Math.max(0, left); x <= Math.min(info.width - 1, right); x++) {
          unlit.set([255, 0, 255], (y * info.width + x) * 3);
        }
      }
    }
  }

  const rgba = lights.length ? removeBackground(unlit, info.width, info.height) : lit;
  const box = subjectBox(rgba, info.width, info.height);
  if (!box) throw new Error(`${file}: nothing left after removing the background. Is it magenta?`);

  const cutout = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract(box)
    .resize({ width: OUTPUT_WIDTHS[name] ?? OUTPUT_WIDTH, withoutEnlargement: true });
  const { info: size } = await cutout.clone().png().toBuffer({ resolveWithObject: true });
  const webp = await cutout.clone().webp({ quality: 84, alphaQuality: 92, effort: 6 }).toBuffer();
  await fs.writeFile(path.join(OUT_DIR, `${name}.webp`), webp);

  const kb = bytes => `${(bytes / 1024).toFixed(1)} KB`;
  const warn = webp.length > BUDGET_BYTES ? '  <- over budget' : '';
  console.log(`${name}: ${size.width}x${size.height}  webp ${kb(webp.length)}${warn}`);
  const entry = { width: size.width, height: size.height };

  const scale = size.width / box.width;
  const share = v => Number(v.toFixed(4));

  for (const light of lights) {
    const made = light.door
      ? doorLight(data, info.width, info.height, local(light.door.seed), [
          ...local(light.door.box.slice(0, 2)),
          ...local(light.door.box.slice(2)),
        ])
      : null;
    if (!made && !light.lifted)
      throw new Error(`${file}: light "${light.id}" needs seeds, a region or a door`);
    const area = made ? made.box : light.lifted.box;
    const flame = light.kind === 'fire' ? flameLayers(data, lit, info.width, light.lifted) : null;
    let layers = [[light.id, made ? made.pixels : null]];

    if (flame) {
      layers = [
        [light.id, flame.flame],
        [`${light.id}-core`, flame.core],
      ];
    } else if (!made) {
      layers = [[light.id, lanternLayer(lit, info.width, light.lifted)]];
    }

    for (const [suffix, pixels] of layers) {
      const layer = await sharp(pixels, {
        raw: { width: area.width, height: area.height, channels: 4 },
      })
        .resize({ width: Math.max(1, Math.round(area.width * scale)) })
        .webp({ quality: 88, alphaQuality: 95, effort: 6 })
        .toBuffer();
      await fs.writeFile(path.join(OUT_DIR, `${name}-${suffix}.webp`), layer);
      console.log(`  ${name}-${suffix}: ${kb(layer.length)}`);
    }

    /* where it sits in the camp picture, as shares of its width and height */
    const placed = {
      id: light.id,
      kind: light.kind,
      x: share((area.left - box.left) / box.width),
      y: share((area.top - box.top) / box.height),
      width: share(area.width / box.width),
      height: share(area.height / box.height),
    };

    if (light.hub) {
      /* what a spinner turns about, as shares of its own box */
      const [hx, hy] = local(light.hub);
      placed.originX = share((hx - area.left) / area.width);
      placed.originY = share((hy - area.top) / area.height);
    }

    (entry.lights ??= []).push(placed);

    if (light.pole !== undefined) {
      entry.poleX = share((local([light.pole, 0])[0] - box.left) / box.width);
    }
  }

  return [name, entry];
}

const files = (await fs.readdir(RAW_DIR))
  .filter(f =>
    /^(camp-(\d+|start)(-spinner)?|village-\d+|flag|tree-\d+)\.(png|jpe?g|webp)$/i.test(f)
  )
  .sort();

if (!files.length) {
  console.log('Nothing to process in art/camps/raw/ yet. See art/camps/README.md.');
  process.exit(0);
}

await fs.mkdir(OUT_DIR, { recursive: true });
const entries = [];
for (const file of files) entries.push(await processCamp(file));
await fs.writeFile(MANIFEST, `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`);
console.log(
  `Wrote ${entries.length} camp(s) to public/camps/ and ${path.relative(ROOT, MANIFEST)}`
);
