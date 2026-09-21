/**
 * Deterministic noise shared by both renderers. Integer hashing only (no Math.random, no trigonometry), so the
 * server, the browser and the tests all get the same mountain.
 */

/** Hash an integer to [0, 1). */
export function rnd(n: number): number {
  let x = Math.imul(n | 0, 374761393) + 668265263;
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  x = x ^ (x >>> 16);
  return (x >>> 0) / 4294967296;
}

/** Smooth 1D value noise in [0, 1). */
export function noise(seed: number, x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const a = rnd(seed * 1009 + i);
  const b = rnd(seed * 1009 + i + 1);
  return a + (b - a) * (f * f * (3 - 2 * f));
}

/** Three octaves of 1D noise around zero: the silhouette of a ridge. */
export function rough(seed: number, x: number, amp: number): number {
  return (
    (noise(seed, x / 260) - 0.5) * 2 * amp +
    (noise(seed + 7, x / 70) - 0.5) * amp * 0.5 +
    (noise(seed + 13, x / 24) - 0.5) * amp * 0.14
  );
}
