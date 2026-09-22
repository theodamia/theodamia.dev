import { describe, expect, it } from 'vitest';
import { moonlit, sceneLayers, walkedPathMarkup } from '@/lib/scene/scenery';
import { CAMP_ANCHORS } from '@/constants';
import { ART, VILLAGE } from '@/lib/scene/camp-layout';
import { cameraKnot, campAnchor, CAMP_Y, LEGS, WORLD } from '@/lib/scene/world';

describe('scenery', () => {
  it('is deterministic, so server and browser paint the same mountain', () => {
    expect(sceneLayers('Summit')).toEqual(sceneLayers('Summit'));
  });

  it('paints seven layers back to front, each as tall as its depth travels', () => {
    const layers = sceneLayers('Summit');
    expect(layers.map(layer => layer.depth)).toEqual([0.05, 0.15, 0.35, 0.8, 1, 1, 1.35]);
    layers.forEach(layer => {
      expect(layer.height).toBeCloseTo(WORLD.VIEW + WORLD.TRAVEL * layer.depth);
      expect(layer.markup).not.toContain('NaN');
      expect(layer.markup).not.toContain('undefined');
    });
  });

  it('gives every layer its own gradient ids', () => {
    const ids = sceneLayers('Summit').flatMap(layer =>
      [...layer.markup.matchAll(/ id="([^"]+)"/g)].map(match => match[1])
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('labels the summit on the trail layer, escaping text, and leaves the camps to their own elements', () => {
    const trail = sceneLayers('Summit & beyond').find(layer => layer.key === 'trail');
    expect(trail?.markup).toContain('Summit &amp; beyond');
    expect(trail?.markup.match(/<text /g)).toHaveLength(1);
  });

  it('keeps the foreground mist off every camp when the climber stands there', () => {
    const front = sceneLayers('Summit').find(layer => layer.key === 'front');
    const wisps = [
      ...(front?.markup.matchAll(/<ellipse cx="[\d.]+" cy="([\d.]+)" rx="[\d.]+" ry="(\d+)"/g) ??
        []),
    ];
    expect(wisps).toHaveLength(CAMP_Y.length - 1);
    CAMP_Y.forEach((_, i) => {
      const anchor = campAnchor(i, CAMP_ANCHORS.WIDE);
      const top = cameraKnot(i, anchor);
      wisps.forEach(([, cy, ry]) => {
        /* where the wisp and the camp are on screen (in viewport heights) at this stop */
        const wispOnScreen = (Number(cy) - top * (front?.depth ?? 1)) / WORLD.VIEW;
        const clearance = Math.abs(wispOnScreen - anchor) - Number(ry) / WORLD.VIEW;
        expect(clearance).toBeGreaterThan(0.25);
      });
    });
  });

  it('pairs every generated colour with its moonlit twin, keeping the day as the fallback', () => {
    const PAIR =
      /(fill|stop-color)="(oklch\([^)]*\))" style="\1:light-dark\(\2,oklch\(([\d.]+) [^)]*\)\)"/g;
    sceneLayers('Summit').forEach(layer => {
      const pairs = [...layer.markup.matchAll(PAIR)];
      const oklchCount = layer.markup.match(/oklch\(/g)?.length ?? 0;
      /* every oklch() in the markup is one of a pair: the fallback, the day and the night */
      expect(oklchCount).toBe(pairs.length * 3);
      expect(layer.markup).not.toMatch(/rgb\(/);
      pairs.forEach(([, , day, nightL]) => {
        const dayL = Number(day.match(/oklch\(([\d.]+)/)?.[1]);
        expect(Number(nightL)).toBeLessThan(dayL);
      });
    });
  });

  it('keeps snow the brightest thing on the mountain by moonlight', () => {
    const [snow] = moonlit([0.95, 0.018, 240]);
    const [forest] = moonlit([0.6, 0.055, 152]);
    expect(snow).toBeGreaterThan(forest);
    expect(snow).toBeLessThan(0.6);
  });

  it('draws a hut only where a village house has no artwork yet', () => {
    const trail = sceneLayers('Summit').find(layer => layer.key === 'trail');
    const huts = trail?.markup.match(/var\(--color-hut-wall\)/g)?.length ?? 0;
    expect(huts).toBe(VILLAGE.filter(house => !ART[house.key]).length);
  });

  it('draws the walked path as one solid stroke per leg', () => {
    const markup = walkedPathMarkup();
    expect(markup.match(/<path /g)).toHaveLength(LEGS.length);
    LEGS.forEach(leg => expect(markup).toContain(leg.d));
  });
});
