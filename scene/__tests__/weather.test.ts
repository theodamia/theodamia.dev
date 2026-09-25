import { describe, expect, it } from 'vitest';
import { weatherField, type WeatherKind } from '@/scene/weather';

const bits = weatherField();
const ofKind = (kind: WeatherKind) => bits.filter(bit => bit.kind === kind);

describe('weatherField', () => {
  it('draws the same weather twice, so the server and the browser agree', () => {
    expect(weatherField()).toEqual(bits);
  });

  it('gives every bit its own key', () => {
    expect(new Set(bits.map(bit => bit.key)).size).toBe(bits.length);
  });

  it('carries all three kinds, since the page holds every season at once', () => {
    (['snow', 'leaf', 'petal'] as WeatherKind[]).forEach(kind => {
      expect(ofKind(kind).length).toBeGreaterThan(0);
    });
  });

  it('keeps everything across the sky and falling forwards', () => {
    bits.forEach(bit => {
      expect(bit.x).toBeGreaterThanOrEqual(0);
      expect(bit.x).toBeLessThanOrEqual(100);
      expect(bit.fall).toBeGreaterThan(0);
      expect(bit.size).toBeGreaterThan(0);
      /* somewhere inside its own cycle, so the sky is full from the first frame rather than filling up */
      expect(bit.phase).toBeGreaterThanOrEqual(0);
      expect(bit.phase).toBeLessThanOrEqual(bit.fall);
    });
  });

  it('lets snow fall straight and the others tumble', () => {
    ofKind('snow').forEach(flake => expect(flake.spin).toBe(0));
    ofKind('leaf').forEach(leaf => expect(leaf.spin).toBeGreaterThan(0));
    /* a leaf is blown further sideways than a flake is */
    const widest = (kind: WeatherKind) => Math.max(...ofKind(kind).map(b => Math.abs(b.drift)));
    expect(widest('leaf')).toBeGreaterThan(widest('snow'));
  });
});
