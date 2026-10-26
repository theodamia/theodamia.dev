/**
 * The painted backgrounds of the share cards, the picture a pasted link shows in LinkedIn or Slack.
 *
 *   pnpm og
 *
 * A card is 1200 × 630: the site's sky with one of its paintings standing in it, the words drawn over it at build
 * by the card's route (app/opengraph-image.tsx, app/ai/opengraph-image.tsx), from content/ so they cannot drift.
 * Satori, which draws the cards, reads no WebP and no CSS variables, so the background is composed here from the
 * processed paintings and the sky tokens, and saved as a JPEG next to the cards' fonts (lib/og/), committed, so a
 * build never needs this script or the network. Rerun it after repainting the range or the giant.
 *
 *   lib/og/card-site.jpg  the dawn sky and /about's next range at sunrise along the bottom: every page's card
 *   lib/og/card-ai.jpg    the day sky and the giant looking at its half-drafted range, on the right: /ai's card
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import about from '../scene/about.json' with { type: 'json' };
import ai from '../scene/ai.json' with { type: 'json' };
import { sceneTokenRgb } from './scene-token-rgb.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CARD = { W: 1200, H: 630 };
/** The range, as wide as this share of the card, its sea of clouds sinking past the bottom edge. */
const RANGE = { WIDTH: 1.25, CLOUD_LINE_AT: 0.98 };
/**
 * The giant's scene: its height as a share of the card's, on the bottom edge, and how much of its width runs past
 * the right edge (empty meadow there), which keeps its wireframe clear of the words.
 */
const GIANT = { HEIGHT: 0.64, PAST_RIGHT: 0.1 };
const JPEG = { quality: 86, mozjpeg: true };

const hex = ([r, g, b]) => `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;

/** The page's sky in one light, top to bottom, as the page paints it (the middle stop at 58%). */
function sky(tokens) {
  const [top, mid, low] = tokens.map(token => hex(sceneTokenRgb(token)));

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.W}" height="${CARD.H}"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="0.58" stop-color="${mid}"/><stop offset="1" stop-color="${low}"/></linearGradient></defs><rect width="${CARD.W}" height="${CARD.H}" fill="url(#sky)"/></svg>`
  );
}

/** A painting scaled to `width`, placed at `left`, `top` on the card; whatever falls outside is cut away. */
async function placed(file, width, left, top) {
  const picture = await sharp(file).resize({ width }).png().toBuffer();
  const { height } = await sharp(picture).metadata();
  const cut = {
    left: Math.max(0, -left),
    top: Math.max(0, -top),
    width: Math.min(width, CARD.W - left) - Math.max(0, -left),
    height: Math.min(height, CARD.H - top) - Math.max(0, -top),
  };

  return {
    input: await sharp(picture).extract(cut).png().toBuffer(),
    left: Math.max(0, left),
    top: Math.max(0, top),
  };
}

/* every page: the dawn, and the next range along the bottom, its clouds running off the edge */
const rangeWidth = Math.round(CARD.W * RANGE.WIDTH);
const rangeHeight = Math.round(rangeWidth / (about.canvas[0] / about.canvas[1]));
const range = await placed(
  path.join(ROOT, 'public/about', about.range.sunrise),
  rangeWidth,
  Math.round((CARD.W - rangeWidth) / 2),
  Math.round(CARD.H * RANGE.CLOUD_LINE_AT - about.cloudLine * rangeHeight)
);
await sharp(sky(['dawn-top', 'dawn-mid', 'dawn-low']))
  .composite([range])
  .jpeg(JPEG)
  .toFile(path.join(ROOT, 'lib/og/card-site.jpg'));

/* /ai: the day, and the giant against the right and bottom edges */
const giantHeight = Math.round(CARD.H * GIANT.HEIGHT);
const giantWidth = Math.round(giantHeight * (ai.header.size[0] / ai.header.size[1]));
const giant = await placed(
  path.join(ROOT, 'public/ai', ai.header.day),
  giantWidth,
  Math.round(CARD.W - giantWidth * (1 - GIANT.PAST_RIGHT)),
  CARD.H - giantHeight
);
await sharp(sky(['day-top', 'day-mid', 'day-low']))
  .composite([giant])
  .jpeg(JPEG)
  .toFile(path.join(ROOT, 'lib/og/card-ai.jpg'));

console.log('og: lib/og/card-site.jpg, lib/og/card-ai.jpg');
