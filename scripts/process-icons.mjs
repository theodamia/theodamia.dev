/**
 * The site's icons: the owner's initials, TD, hand-painted in burnt-orange trail paint on a granite boulder, the way
 * Alpine trails are marked (prompts and tries in art/icon/ICON-README.md). By day in light browsers and on home
 * screens, by moonlight in dark browsers.
 *
 *   pnpm icons
 *
 * Reads art/icon/raw/blaze.png and blaze-night.png (local, like every raw painting). Writes:
 *
 *   app/favicon.ico              16, 32 and 48 px, by day (what a browser asks /favicon.ico for)
 *   public/icon-light-32x32.png  the tab icon in a light browser
 *   public/icon-dark-32x32.png   the tab icon in a dark browser, by moonlight
 *   public/apple-icon.png        180 px, square: iOS rounds the corners itself
 */
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { bounds, loadPainting } from './paintings.mjs';

const RAW = 'art/icon/raw';
const PAINTINGS = { day: `${RAW}/blaze.png`, night: `${RAW}/blaze-night.png` };
const CANVAS = { W: 1024, H: 1024 };
/**
 * How much of the icon's width the letters fill. A tab shows 16 px, so as much as the rounded corners allow: the
 * painting leaves more stone around them than a tab can spare.
 */
const LETTERS = 0.84;
/** Trail paint: red this far above both green and blue. Granite, by day or by moonlight, never is. */
const PAINT = 60;
/** A tab icon's corners, as a share of its side. The home-screen icon stays square. */
const CORNER = 0.22;

/** A painting at its canvas size, as PNG bytes (an image tool may return another size; it is stretched to fit). */
const atCanvas = file => sharp(file).resize(CANVAS.W, CANVAS.H, { fit: 'fill' }).png().toBuffer();

/**
 * The square around the letters, centred on them. Measured on the day painting only: the night is an edit of it
 * with the same letters, so both are cut alike and the icon does not shift when the browser's theme changes.
 */
async function frameOf(file) {
  const rgb = await loadPainting(file, CANVAS);
  const paint = i => rgb[i * 3] - Math.max(rgb[i * 3 + 1], rgb[i * 3 + 2]) > PAINT;
  const letters = bounds(CANVAS.W, CANVAS.H, paint);
  const side = Math.min(CANVAS.W, Math.round(letters.width / LETTERS));
  const start = (from, length) =>
    Math.min(CANVAS.W - side, Math.max(0, Math.round(from + length / 2 - side / 2)));

  return {
    left: start(letters.left, letters.width),
    top: start(letters.top, letters.height),
    width: side,
    height: side,
  };
}

/** One theme's icon at `size`: the framed painting, resampled once, its corners rounded unless `square`. */
async function icon(painting, frame, size, { square = false } = {}) {
  const picture = await sharp(painting)
    .extract(frame)
    .resize(size, size, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
  if (square) return sharp(picture).png({ compressionLevel: 9 }).toBuffer();

  const corners = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * CORNER}" fill="#fff"/></svg>`
  );

  return sharp(picture)
    .composite([{ input: corners, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

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

const frame = await frameOf(PAINTINGS.day);
const day = await atCanvas(PAINTINGS.day);
const night = await atCanvas(PAINTINGS.night);
const favicon = await Promise.all(
  [16, 32, 48].map(async size => ({ size, png: await icon(day, frame, size) }))
);

await fs.writeFile('app/favicon.ico', ico(favicon));
await fs.writeFile('public/icon-light-32x32.png', await icon(day, frame, 32));
await fs.writeFile('public/icon-dark-32x32.png', await icon(night, frame, 32));
await fs.writeFile('public/apple-icon.png', await icon(day, frame, 180, { square: true }));
console.log(
  `icons: framed ${frame.width} px around the letters; app/favicon.ico (16, 32, 48), public/icon-{light,dark}-32x32.png, public/apple-icon.png`
);
