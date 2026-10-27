/** Build-time compositors resolve the same OKLCH tokens the browser reads. */
import fs from 'node:fs/promises';

const css = await fs.readFile('app/globals.css', 'utf8');

/** Librsvg does not render OKLCH or CSS variables; convert tokens only for saved review images. */
export function sceneTokenRgb(name, night = false) {
  const matches = [...css.matchAll(new RegExp(`--color-${name}: oklch\\(([^)]+)\\)`, 'g'))];
  const [l, c, hue] = matches[night ? 1 : 0][1].split(' ').map(Number);
  const angle = (hue * Math.PI) / 180;
  const a = c * Math.cos(angle);
  const b = c * Math.sin(angle);
  const ll = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const ss = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss,
    -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss,
    -0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss,
  ].map(v =>
    Math.round(
      255 * Math.min(1, Math.max(0, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055))
    )
  );
}

/** A colour token written as hex (`--color-accent: #cf4318`), as RGB: the interface's tokens are hex, not OKLCH. */
export function hexTokenRgb(name) {
  const value = css.match(new RegExp(`--color-${name}: #([0-9a-fA-F]{6});`))?.[1];
  if (!value) throw new Error(`No hex token --color-${name} in app/globals.css`);

  return [0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16));
}
