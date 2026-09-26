import { describe, expect, it } from 'vitest';
import {
  moonlit,
  sceneLayers,
  scenePalette,
  seasonal,
  summitLabelMarkup,
  SUMMIT_LABEL,
  walkedPathMarkup,
} from '@/scene/scenery';
import { SEASONS } from '@/lib/season';
import { CAMP_ANCHORS } from '@/constants';
import { ART, VILLAGE } from '@/scene/camp-layout';
import { cameraKnot, campAnchor, CAMP_Y, LEGS, WORLD } from '@/scene/world';

describe('scenery', () => {
  it('is deterministic, so server and browser paint the same mountain', () => {
    expect(sceneLayers()).toEqual(sceneLayers());
  });

  it('paints seven layers back to front, each as tall as its depth travels', () => {
    const layers = sceneLayers();
    expect(layers.map(layer => layer.depth)).toEqual([0.05, 0.15, 0.35, 0.8, 1, 1, 1.35]);
    layers.forEach(layer => {
      expect(layer.height).toBeCloseTo(WORLD.VIEW + WORLD.TRAVEL * layer.depth);
      expect(layer.markup).not.toContain('NaN');
      expect(layer.markup).not.toContain('undefined');
    });
  });

  it('gives every layer its own gradient ids', () => {
    const ids = sceneLayers().flatMap(layer =>
      [...layer.markup.matchAll(/ id="([^"]+)"/g)].map(match => match[1])
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  /*
   * The label has to fade on its own once the climb is over, so it is drawn apart from the layers, the way the
   * camps are. If it ever creeps back into one, the fade would repaint a full-height layer for every frame of it.
   */
  it('leaves every word out of the layers: the summit label and the camps are drawn apart', () => {
    sceneLayers().forEach(layer => expect(layer.markup).not.toContain('<text'));
  });

  it('draws the summit label at the summit, escaping its text', () => {
    const markup = summitLabelMarkup('Summit & beyond');
    expect(markup.match(/<text /g)).toHaveLength(1);
    expect(markup).toContain('Summit &amp; beyond');
    expect(markup).toContain(`x="${SUMMIT_LABEL.x}"`);
  });

  it('keeps the foreground mist off every camp when the climber stands there', () => {
    const front = sceneLayers().find(layer => layer.key === 'front');
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
    const layers = sceneLayers();
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

  it('defines every colour in every season, so no season paints a hole', () => {
    const palette = scenePalette();
    const names = new Set([
      ...sceneLayers()
        .flatMap(layer => [...layer.markup.matchAll(/var\((--m-\d+)\)/g)])
        .map(([, name]) => name),
    ]);

    SEASONS.forEach(season => {
      const block = new RegExp(`\\[data-season='${season}'\\]\\{([^}]*)\\}`).exec(palette);
      expect(block, `no block for ${season}`).not.toBeNull();
      const defined = new Set([...(block?.[1] ?? '').matchAll(/(--m-\d+):/g)].map(([, n]) => n));
      [...names].forEach(name => expect(defined, `${season} is missing ${name}`).toContain(name));
    });
  });

  it('leaves summer exactly as the mountain was drawn', () => {
    const green: [number, number, number] = [0.6, 0.055, 152];
    expect(seasonal(green, 'summer')).toEqual(green);
  });

  it('turns the forest without moving the snowline', () => {
    const forest: [number, number, number] = [0.6, 0.055, 152];
    const snow: [number, number, number] = [0.95, 0.018, 240];

    /* autumn hauls the forest round to amber; the snow keeps its hue to within a few degrees */
    expect(seasonal(forest, 'autumn')[2]).toBeLessThan(110);
    expect(Math.abs(seasonal(snow, 'autumn')[2] - snow[2])).toBeLessThan(30);
    /* winter pales the forest most of the way to the snow it already is */
    expect(seasonal(forest, 'winter')[0]).toBeGreaterThan(forest[0] + 0.15);
    expect(seasonal(forest, 'winter')[1]).toBeLessThan(forest[1]);
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
    const trail = sceneLayers().find(layer => layer.key === 'trail');
    const huts = trail?.markup.match(/var\(--color-hut-wall\)/g)?.length ?? 0;
    expect(huts).toBe(VILLAGE.filter(house => !ART[house.key]).length);
  });

  it('draws the walked path as one solid stroke per leg', () => {
    const markup = walkedPathMarkup();
    expect(markup.match(/<path /g)).toHaveLength(LEGS.length);
    LEGS.forEach(leg => expect(markup).toContain(leg.d));
  });
});
