/**
 * The angle to turn to, taking the short way round. Given where something is pointing and where it should point,
 * it answers with a running total rather than one of a fixed set of angles: from 270° to 0° it returns 360, so the
 * thing turns a quarter forward instead of three quarters back.
 *
 * `target` is the direction wanted, as any angle; the answer is always within half a turn of `from`.
 */
export function turnToward(from: number, target: number): number {
  return from + ((((target - from) % 360) + 540) % 360) - 180;
}
