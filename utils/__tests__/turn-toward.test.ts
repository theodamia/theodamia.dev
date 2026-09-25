import { describe, expect, it } from 'vitest';
import { turnToward } from '@/utils/turn-toward';

/** Where the answer points, once the turns are taken off. */
const facing = (angle: number) => ((angle % 360) + 360) % 360;

describe('turnToward', () => {
  it('points where it was asked to', () => {
    [0, 90, 180, 270].forEach(target => {
      [0, 90, 180, 270, -450, 720].forEach(from => {
        expect(facing(turnToward(from, target))).toBe(target);
      });
    });
  });

  it('never turns more than half a circle', () => {
    [0, 90, 180, 270].forEach(target => {
      [0, 90, 180, 270, 630, -270].forEach(from => {
        expect(Math.abs(turnToward(from, target) - from)).toBeLessThanOrEqual(180);
      });
    });
  });

  it('takes the short way round the end of the circle', () => {
    /* autumn back to winter is a quarter forward, not three quarters back */
    expect(turnToward(270, 0)).toBe(360);
    /* and winter back to autumn is a quarter the other way */
    expect(turnToward(0, 270)).toBe(-90);
  });

  it('stays put when it is already pointing there', () => {
    expect(turnToward(180, 180)).toBe(180);
    expect(turnToward(540, 180)).toBe(540);
  });
});
