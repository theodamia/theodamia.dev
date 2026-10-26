/**
 * The site's icons, made from the climb's own summit: the painted peak over its sea of clouds, on the sky the page
 * paints behind it. By day in light browsers and on home screens, by moonlight in dark browsers.
 *
 *   pnpm icons
 *
 * It reads the processed peak (scene/flats.json) and the sky tokens (app/globals.css), so a repainted peak or a
 * retuned sky is one command away from the tab. Writes:
 *
 *   app/favicon.ico              16, 32 and 48 px, by day (what a browser asks /favicon.ico for)
 *   public/icon-light-32x32.png  the tab icon in a light browser
 *   public/icon-dark-32x32.png   the tab icon in a dark browser, by moonlight
 *   public/apple-icon.png        180 px, square: iOS rounds the corners itself
 */
import fs from 'node:fs/promises';
import sharp from 'sharp';
import manifest from '../scene/flats.json' with { type: 'json' };
import { sceneTokenRgb } from './scene-token-rgb.mjs';

/** Every icon is drawn at this size first and scaled down, so the painting is resampled once, from its own pixels. */
const MASTER = 512;
/**
 * The window onto the peak: its side as a share of the painting's width, and where the summit's tip sits from the
 * top. Wide enough to keep the cloud sea along the bottom, which is what makes it a summit rather than a rock.
 */
const FRAME = { SIDE: 0.36, TIP: 0.17 };
/** A tab icon's corners, as a share of its side. The home-screen icon stays square. */
const CORNER = 0.22;
/** The sky behind the peak: the page's day sky, its middle stop where the page puts it. */
const SKY_STOPS = [0, 0.58, 1];
/** Alpha above which a pixel counts as the peak when looking for its tip. */
const SOLID = 128;

const hex = ([r, g, b]) => `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;

/** The topmost painted pixel of the peak: the summit's tip, as [x, y]. */
async function tipOf(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > SOLID) return [x, y];
    }
  }

  throw new Error(`${file} has no paint`);
}

/** The sky gradient the page paints, as an SVG the size of the master. */
function skySvg(night) {
  const stops = ['day-top', 'day-mid', 'day-low']
    .map(
      (token, i) =>
        `<stop offset="${SKY_STOPS[i]}" stop-color="${hex(sceneTokenRgb(token, night))}"/>`
    )
    .join('');

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MASTER}" height="${MASTER}"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient></defs><rect width="${MASTER}" height="${MASTER}" fill="url(#sky)"/></svg>`
  );
}

/** The summit in one theme, framed and laid on its sky: a square master, its corners rounded unless `square`. */
async function summit(theme, { square = false } = {}) {
  const file = `public/scene/${manifest.flats.peak.art[theme].near}`;
  const { width, height } = await sharp(file).metadata();
  const [tipX, tipY] = await tipOf(file);
  const side = Math.round(width * FRAME.SIDE);
  const left = Math.round(tipX - side / 2);
  const top = Math.round(tipY - FRAME.TIP * side);
  /* the frame starts above the painting's top edge: that part is sky, so the painting is padded with nothing */
  const above = Math.max(0, -top);
  const below = Math.max(0, top + side - height);
  const padded = await sharp(file)
    .extend({ top: above, bottom: below, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const peak = await sharp(padded)
    .extract({ left, top: top + above, width: side, height: side })
    .resize(MASTER, MASTER, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
  const tile = await sharp(skySvg(theme === 'night'))
    .composite([{ input: peak }])
    .png()
    .toBuffer();
  if (square) return tile;
  const corners = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MASTER}" height="${MASTER}"><rect width="${MASTER}" height="${MASTER}" rx="${MASTER * CORNER}" fill="#fff"/></svg>`
  );

  return sharp(tile)
    .composite([{ input: corners, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

const sized = (master, size) =>
  sharp(master).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();

/**
 * An .ico of PNG images, one per size. Every browser and Windows since Vista read PNGs inside an icon, and sharp
 * writes no .ico of its own, so the container is written here: a six-byte header, a sixteen-byte entry per image,
 * then the images.
 */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    /* a size of 256 is written as 0 */
    entry.writeUInt8(size % 256, 0);
    entry.writeUInt8(size % 256, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;

    return entry;
  });

  return Buffer.concat([header, ...entries, ...pngs.map(({ png }) => png)]);
}

const day = await summit('day');
const night = await summit('night');
const favicon = await Promise.all(
  [16, 32, 48].map(async size => ({ size, png: await sized(day, size) }))
);

await fs.writeFile('app/favicon.ico', ico(favicon));
await fs.writeFile('public/icon-light-32x32.png', await sized(day, 32));
await fs.writeFile('public/icon-dark-32x32.png', await sized(night, 32));
await fs.writeFile(
  'public/apple-icon.png',
  await sized(await summit('day', { square: true }), 180)
);
console.log(
  'icons: app/favicon.ico (16, 32, 48), public/icon-{light,dark}-32x32.png, public/apple-icon.png'
);
