import { JOBS, TRAILHEAD } from '@/content/jobs';
import manifest from './flats.json';

/** The scene's two looks: the same flats painted by day and by night, with identical silhouettes. */
export type Theme = 'day' | 'night';

/** [x, y, width, height] in design units, from the focus of expansion, at the flat's own scale 1. */
export type Box = readonly [x: number, y: number, width: number, height: number];

/** A flat's files in one theme. Ridges also have a far version: smaller, softer, hazed. */
export type FlatArt = { near: string; nearPhone: string; far?: string; farPhone?: string };

export type Flat = {
  id: string;
  /** `back` is the far ranges with the cloud sea, `peak` the summit, `camp` a ridge with its camp painted in. */
  kind: 'back' | 'peak' | 'camp';
  box: Box;
  /** A phone's near version covers only the middle of the painting: the same y and height, a narrower x. */
  boxPhone: Box;
  /** Camp index (0 is the trailhead) and the side its camp stands on (+1 right, 0 centred). */
  camp?: number;
  side?: number;
  /** Where this camp's flag stands from its trail point, in units. */
  flagDx?: number;
  art: Record<Theme, FlatArt>;
};

export type Flag = {
  /** Pixel sizes of the pole picture, and where on it the pennant's hem hangs (just under the cap). */
  pole: { w: number; h: number; ax: number; ay: number };
  /** Pixel sizes of the pennant picture, and its hem's top corner. */
  cloth: { w: number; h: number; hx: number; hy: number };
  art: Record<Theme, { pole: string; cloth: string }>;
};

const box = (values: number[]): Box => [values[0], values[1], values[2], values[3]];

/**
 * The flats, back to front, from `scene/flats.json` (written by `pnpm flats`). JSON arrays come in as
 * `number[]`, so the boxes are re-read as fixed tuples here rather than cast.
 */
export const FLATS: Flat[] = manifest.order.map(id => {
  const entry = manifest.flats[id as keyof typeof manifest.flats];

  return {
    ...entry,
    id,
    kind: entry.kind as Flat['kind'],
    box: box(entry.box),
    boxPhone: box(entry.boxPhone),
  };
});

export const FLAG: Flag = manifest.flag;

/** Camps are keyed by their start year, so adding or removing a job never shifts another camp's art. */
const CAMP_YEARS = [TRAILHEAD.year, ...JOBS.map(job => job.start)];

/** The flat a camp stands on (0 is the trailhead), or undefined when that camp has no painting yet. */
export function campFlat(camp: number): Flat | undefined {
  return FLATS.find(flat => flat.id === `camp-${CAMP_YEARS[camp]}`);
}

/** Where a processed file is served from: content-hashed names, so they can be cached for good. */
export const artUrl = (file: string) => `/scene/${file}`;
