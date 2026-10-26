/**
 * Deterministic noise, shared by the generated parts of the scene (the stars, the snow, /cv's weather). Integer
 * hashing only (no Math.random, no trigonometry), so the server, the browser and the tests all draw the same sky.
 */

/** Hash an integer to [0, 1). */
export function rnd(n: number): number {
  let x = Math.imul(n | 0, 374761393) + 668265263;
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  x = x ^ (x >>> 16);

  return (x >>> 0) / 4294967296;
}
