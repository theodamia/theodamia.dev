import { describe, expect, it } from 'vitest';
import { moonlit, sceneLayers, scenePalette, walkedPathMarkup } from '@/scene/scenery';
import { CAMP_ANCHORS } from '@/constants';
import { ART, VILLAGE } from '@/scene/camp-layout';
import { cameraKnot, campAnchor, CAMP_Y, LEGS, WORLD } from '@/scene/world';

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

  it('names every generated colour, and defines every name it uses', () => {
    const layers = sceneLayers('Summit');
    const palette = scenePalette();
    const defined = new Set([...palette.matchAll(/(--m-\d+):/g)].map(([, name]) => name));
    const used = new Set(
      layers
        .flatMap(layer => [...layer.markup.matchAll(/(?:fill|stop-color):var\((--m-\d+)\)/g)])
        .map(([, name]) => name)
    );

    expect(used.size).toBeGreaterThan(0);
    /* a drawing that asked for a colour nobody defined would paint black, and only in some seasons */
    [...used].forEach(name => expect(defined).toContain(name));

    layers.forEach(layer => {
      /* the colour itself is written once, as the daylight fallback; the rest is the variable's name */
      const PAINT = /(fill|stop-color)="(oklch\([^)]*\))" style="\1:var\(--m-\d+\)"/g;
      const painted = [...layer.markup.matchAll(PAINT)].length;
      const oklchCount = layer.markup.match(/oklch\(/g)?.length ?? 0;
      expect(oklchCount).toBe(painted);
      expect(layer.markup).not.toMatch(/rgb\(/);
    });
  });

  it('pairs every colour in the palette with its moonlit twin, which is darker', () => {
    const PAIR = /--m-\d+:light-dark\(oklch\(([\d.]+)[^)]*\),oklch\(([\d.]+)[^)]*\)\)/g;
    const pairs = [...scenePalette().matchAll(PAIR)];

    expect(pairs.length).toBeGreaterThan(0);
    pairs.forEach(([, dayL, nightL]) => expect(Number(nightL)).toBeLessThan(Number(dayL)));
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
