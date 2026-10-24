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

  it('carries both kinds, since the page holds every season at once', () => {
    (['leaf', 'petal'] as WeatherKind[]).forEach(kind => {
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

  it('lets leaves and blossom tumble as they fall', () => {
    ofKind('leaf').forEach(leaf => expect(leaf.spin).toBeGreaterThan(0));
    ofKind('petal').forEach(petal => expect(petal.spin).toBeGreaterThan(0));
  });
});
