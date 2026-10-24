/**
 * Keying a painting off its magenta, shared by the processing (process-flats.mjs) and the assembly of painted
 * edits (compose-flats.mjs): an edit has to be keyed exactly as its painting is before the two can be joined,
 * because blending raw magenta along a join paints a pink fringe into the skyline.
 */

/** How magenta a pixel is: min(red, blue) - green, from where it starts to count to (a share of) the key's own. */
const KEY_FROM = 40;
const KEY_SHARE = 0.85;
/** Residual pink on opaque edge pixels: where min(red, blue) still stands this far above green. */
const SPILL_FROM = 20;
const SPILL_RANGE = 60;
const SPILL_PULL = 0.3;

/** Hermite smoothstep on 0..1. */
export const smooth = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  return t * t * (3 - 2 * t);
};

export const clampByte = v => Math.max(0, Math.min(255, Math.round(v)));
const median = values => values.toSorted((a, b) => a - b)[values.length >> 1];

/**
 * The key's own alpha and the colours with the key's share taken out, for raw RGB `data` on a `canvas` of
 * { W, H }. The key colour is the median of the most magenta pixels: generators paint a slightly different
 * magenta every time.
 */
export function key(data, canvas) {
  const pixels = canvas.W * canvas.H;
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
