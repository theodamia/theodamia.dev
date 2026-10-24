import { JOBS, TRAILHEAD } from '@/content/jobs';
import manifest from './flats.json';

/** The scene's two looks: the same flats painted by day and by night, with identical silhouettes. */
export type Theme = 'day' | 'night';

/** [x, y, width, height] in design units, from the focus of expansion, at the flat's own scale 1. */
export type Box = readonly [x: number, y: number, width: number, height: number];

/** A span of x, in design units. */
export type Span = readonly [left: number, right: number];

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
  /** The top centre of the camp itself (tent, cabin or chalets), in units from its trail point: its name's place. */
  label?: readonly [x: number, y: number];
  /**
   * Today's camp only: its cairn, where the closing card is kept while it is set aside. `at` is where the stones
   * stand on the snow, in units from the trail point, and `height` how tall the picture is drawn, in units.
   */
  cairn?: { at: readonly [x: number, y: number]; height: number };
  /**
   * A seamless tile (the backdrop): the page lays copies a period apart. Its files hold the period plus `bleed`
   * pixels of its own start, so each copy overlaps the last on identical paint (pixels of the desktop file).
   */
  tile?: { period: number; bleed: number };
  /** Where a tile's painting dissolves at its foot (units): the page fills below it with the haze. */
  foot?: number;
  /** The span this flat paints solid, and its phone file's: what the camera tests check the screen against. */
  solid?: Span;
  solidPhone?: Span;
  art: Record<Theme, FlatArt>;
};

/** One of the sky's painted clouds: its painted size in pixels (its shape), and its picture per theme. */
export type Cloud = { w: number; h: number; art: Record<Theme, string> };

export type Flag = {
  /** Pixel sizes of the pole picture, and where on it the pennant's hem hangs (just under the cap). */
  pole: { w: number; h: number; ax: number; ay: number };
  /** Pixel sizes of the pennant picture, and its hem's top corner. */
  cloth: { w: number; h: number; hx: number; hy: number };
  art: Record<Theme, { pole: string; cloth: string }>;
};

const box = (values: number[]): Box => [values[0], values[1], values[2], values[3]];
const span = (values?: number[]): Span | undefined => values && [values[0], values[1]];
const point = (values: number[]) => [values[0], values[1]] as const;

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
    solid: span('solid' in entry ? entry.solid : undefined),
    solidPhone: span('solidPhone' in entry ? entry.solidPhone : undefined),
    label: span('label' in entry ? entry.label : undefined),
    cairn: 'cairn' in entry ? { at: point(entry.cairn.at), height: entry.cairn.height } : undefined,
  };
});

/** The backdrop: the one tile, which every other flat stands in front of. */
export const BACKDROP: Flat = FLATS.find(flat => flat.tile)!;

/** The middle of the painting a phone file keeps, in units either side of the focus line, and its dissolve. */
export const PHONE_ART = manifest.phone;

export const FLAG: Flag = manifest.flag;

/** The sky's clouds, left to right as they were painted. */
export const CLOUDS: Cloud[] = manifest.clouds;

/** The night's aurora: its painted layers (night only, glow on black, blended as light), back to front. */
export const AURORA: { w: number; h: number; art: string }[] = manifest.aurora;

/**
 * The cairn's picture: its size in pixels (its shape), where its stones stand on the snow as a share of its height
 * from the top (its patch of snow spreads in front, below that line), and its file per theme.
 */
export type Cairn = { w: number; h: number; ground: number; art: Record<Theme, string> };

/** The cairn by today's camp (components/scene/cairn.tsx). */
export const CAIRN: Cairn = manifest.cairn;

/** Camps are keyed by their start year, so adding or removing a job never shifts another camp's art. */
const CAMP_YEARS = [TRAILHEAD.year, ...JOBS.map(job => job.start)];

/** The flat a camp stands on (0 is the trailhead), or undefined when that camp has no painting yet. */
export function campFlat(camp: number): Flat | undefined {
  return FLATS.find(flat => flat.id === `camp-${CAMP_YEARS[camp]}`);
}

/** Where a processed file is served from: content-hashed names, so they can be cached for good. */
export const artUrl = (file: string) => `/scene/${file}`;
