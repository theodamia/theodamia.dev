const STEPS = 24;

function bezier(p1: number, p2: number, s: number): number {
  const r = 1 - s;

  return 3 * r * r * s * p1 + 3 * r * s * s * p2 + s * s * s;
}

/**
 * The inverse of a CSS `cubic-bezier(x1, y1, x2, y2)` easing: the share of the duration after which an animation
 * using it has covered `progress`. Found by bisection on the curve's parameter, so it needs the output to only
 * ever rise (y1 and y2 between 0 and 1).
 */
export function timeAtProgress(
  [x1, y1, x2, y2]: readonly [number, number, number, number],
  progress: number
): number {
  const target = Math.min(1, Math.max(0, progress));
  let low = 0;
  let high = 1;

  for (let i = 0; i < STEPS; i++) {
    const mid = (low + high) / 2;

    if (bezier(y1, y2, mid) < target) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return bezier(x1, x2, (low + high) / 2);
}
