import campArt from '@/scene/camp-art.json';
import { JOBS } from '@/content/jobs';
import { CAMP_Y, WORLD } from '@/scene/world';

/**
 * Something in a picture that comes alive (a fire, a lantern, a window, a wind spinner, a flag's cloth), and where it sits as shares
 * of the picture. A spinner also says what it turns about, as shares of its own box.
 */
export type CampLight = {
  id: string;
  kind: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originX?: number;
  originY?: number;
};
/** `poleX`: where a flag's pole stands in its picture, as a share of the picture's width. */
type CampArt = { width: number; height: number; lights?: CampLight[]; poleX?: number };
/**
 * Generated artwork, written by scripts/process-camps.mjs (see art/camps/README.md). Anything without an entry keeps
 * its hand-drawn stand-in, so artwork can arrive one piece at a time.
 */
export const ART: Record<string, CampArt | undefined> = campArt;

/** Camps and houses are placed in the layer that moves with the mountain, as shares of its size. */
const LAYER_HEIGHT = WORLD.VIEW + WORLD.TRAVEL;
/** A world X as a percentage of the layer's width, for an element positioned inside it. */
export const layerX = (value: number) => `${((value / WORLD.WIDTH) * 100).toFixed(4)}%`;
/** A world Y as a percentage of the layer's height. Percentages, so the layer scales without re-measuring. */
export const layerY = (value: number) => `${((value / LAYER_HEIGHT) * 100).toFixed(4)}%`;

/**
 * The village at the foot of the trail, left of where it starts, left to right: where each house stands (the centre
 * of its base), how wide its artwork is shown, and the simple hut `scenery.ts` draws there until that artwork
 * arrives. The bigger house has the orange roof, its smaller neighbour the green one.
 */
export const VILLAGE = [
  { key: 'village-1', x: 1030, width: 148, hut: { width: 96, roof: 'var(--color-accent)' } },
  { key: 'village-2', x: 1190, width: 116, hut: { width: 84, roof: 'var(--color-roof)' } },
] as const;
/** The village stands on the trailhead's level ground, a hair below where the trail starts. */
export const VILLAGE_GROUND_Y = CAMP_Y[0] + 2;

/*
 * Where a camp's artwork stands and how much level ground it needs. Shared by the component that draws the camp
 * and the scenery generator that shapes the mountain under it, so a wide camp always gets a wide enough ledge:
 * nothing may hang over the edge where the ridge starts to fall.
 */

/** The artwork's left edge, in world units right of the point where the trail arrives. */
export const ART_LEFT = 20;
/** Artwork is shown this wide unless the camp has its own size: small camps for short stays, the Lead camp widest. */
const DEFAULT_ART_WIDTH = 176;
const ART_WIDTHS: Record<string, number> = {
  /* the trailhead is a signpost, not a camp: about as tall as the village huts beside it */
  'camp-start': 64,
  'camp-2015': 138,
  'camp-2016': 148,
  'camp-2022': 192,
  'camp-2026': 150,
};
/**
 * Pictures of their own that stand beside a camp's main artwork (something with moving parts is cleaner to draw
 * alone than in front of a tent): `gap` right of the main artwork, shown `width` wide.
 */
const ART_EXTRAS: Record<string, { key: string; gap: number; width: number }[]> = {
  /* the spinner's picture is its mast and stones; its blades reach about 15 further out on each side */
  'camp-2026': [{ key: 'camp-2026-spinner', gap: 0, width: 27 }],
};

/** Level ground kept left of the arrival point (the flag stands there) and right of the artwork. */
const GROUND_LEFT = 54;
const GROUND_RIGHT = 38;

/** Key of a camp's generated artwork: the trailhead, then one per job by start year. */
export function campArtKey(camp: number): string {
  return camp === 0 ? 'camp-start' : `camp-${JOBS[camp - 1].start}`;
}

/** How wide a camp's picture is drawn, in world units: its own width where it has one, else the common one. */
export function artWidthFor(artKey: string): number {
  return ART_WIDTHS[artKey] ?? DEFAULT_ART_WIDTH;
}

/** Where each extra picture of a camp stands: its left edge (relative to the arrival point) and width. */
export function artExtrasFor(artKey: string): { key: string; left: number; width: number }[] {
  let left = ART_LEFT + artWidthFor(artKey);

  return (ART_EXTRAS[artKey] ?? []).map(extra => {
    const placed = { key: extra.key, left: left + extra.gap, width: extra.width };
    left = placed.left + extra.width;

    return placed;
  });
}

/** The level ground under a camp: its centre (relative to the arrival point) and half-width. */
export function campGround(camp: number): { center: number; flat: number } {
  const key = campArtKey(camp);
  const artRight = artExtrasFor(key).reduce(
    (edge, extra) => Math.max(edge, extra.left + extra.width),
    ART_LEFT + artWidthFor(key)
  );
  const right = artRight + GROUND_RIGHT;

  return { center: (right - GROUND_LEFT) / 2, flat: (right + GROUND_LEFT) / 2 };
}
