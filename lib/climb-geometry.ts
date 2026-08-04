import type { CSSProperties } from 'react';
import { CLIMB, LANDMARK_DOT } from '@/lib/constants';

/** The plotted line's bounding box, measured relative to the Fig. 1 wrapper. */
export type PlotBox = { x: number; y: number; w: number; h: number };

/** Where the middle mountain's apex must land: the Frontend Lead landmark. */
const LEAD = { year: 2022, level: 5 };

const BACK_HILL = { top: 0.58, width: 0.34, height: 0.42 };
const MID_HILL = { width: 0.46, snowWidth: 0.14, snowHeight: 0.1 };
const SUMMIT = { width: 0.34, overhang: 16, snowWidth: 0.09, snowHeight: 0.11, snowOverhang: 8 };
const FLAG = { poleWidth: 2, poleHeight: 24, pennantWidth: 22, pennantHeight: 14 };

const PEAK_CLIP = 'polygon(0 100%,50% 0,100% 100%)';
const MID_SNOW_CLIP = 'polygon(50% 0,100% 100%,74% 74%,50% 96%,26% 74%,0 100%)';
const PENNANT_CLIP = 'polygon(100% 0,0 50%,100% 100%)';

export function plotX(plot: PlotBox, year: number): number {
  return plot.x + ((year - CLIMB.FIRST_YEAR) / CLIMB.YEAR_SPAN) * plot.w;
}

export function plotY(plot: PlotBox, level: number): number {
  return plot.y + ((CLIMB.TOP_LEVEL - level) / CLIMB.LEVEL_SPAN) * plot.h;
}

export function samePlot(a: PlotBox, b: PlotBox): boolean {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}

export type Hill = { id: string; style: CSSProperties };

/**
 * Mountains behind the climb, derived from the measured plot box so the middle apex
 * sits on the Lead landmark and the summit flag clears the last data point.
 */
export function buildHills(plot: PlotBox): Hill[] {
  const box = (left: number, top: number, width: number, height: number): CSSProperties => ({
    position: 'absolute',
    pointerEvents: 'none',
    left: plot.x + left,
    top: plot.y + top,
    width,
    height,
  });

  const leadX = ((LEAD.year - CLIMB.FIRST_YEAR) / CLIMB.YEAR_SPAN) * plot.w;
  const leadY = ((CLIMB.TOP_LEVEL - LEAD.level) / CLIMB.LEVEL_SPAN) * plot.h;
  const summitX = plot.w;
  const rise = CLIMB.SUMMIT_RISE;

  const midWidth = plot.w * MID_HILL.width;
  const summitWidth = plot.w * SUMMIT.width;
  const summitApex = ((summitWidth / (summitWidth + SUMMIT.overhang)) * 100).toFixed(1);
  const snowWidth = plot.w * SUMMIT.snowWidth;
  const snowApex = ((snowWidth / (snowWidth + SUMMIT.snowOverhang)) * 100).toFixed(1);

  return [
    {
      id: 'back-hill',
      style: {
        ...box(0, plot.h * BACK_HILL.top, plot.w * BACK_HILL.width, plot.h * BACK_HILL.height),
        clipPath: PEAK_CLIP,
        background: 'var(--color-hill-back)',
      },
    },
    {
      id: 'mid-hill',
      style: {
        ...box(leadX - midWidth / 2, leadY, midWidth, plot.h - leadY),
        clipPath: PEAK_CLIP,
        background: 'var(--color-hill-mid)',
      },
    },
    {
      id: 'mid-snow',
      style: {
        ...box(
          leadX - (plot.w * MID_HILL.snowWidth) / 2,
          leadY,
          plot.w * MID_HILL.snowWidth,
          plot.h * MID_HILL.snowHeight
        ),
        clipPath: MID_SNOW_CLIP,
        background: 'color-mix(in oklab, var(--color-snow) 92%, transparent)',
      },
    },
    {
      id: 'summit',
      style: {
        ...box(summitX - summitWidth, -rise, summitWidth + SUMMIT.overhang, plot.h + rise),
        clipPath: `polygon(0 100%,${summitApex}% 0,100% 100%)`,
        background: 'var(--color-hill-summit)',
      },
    },
    {
      id: 'summit-snow',
      style: {
        ...box(
          summitX - snowWidth,
          -rise,
          snowWidth + SUMMIT.snowOverhang,
          plot.h * SUMMIT.snowHeight
        ),
        clipPath: `polygon(${snowApex}% 0,100% 52%,74% 78%,52% 96%,28% 74%,0 100%)`,
        background: 'var(--color-snow)',
      },
    },
    {
      id: 'flagpole',
      style: {
        ...box(
          summitX - FLAG.poleWidth / 2,
          -rise - FLAG.poleHeight,
          FLAG.poleWidth,
          FLAG.poleHeight
        ),
        background: 'var(--color-ink-strong)',
      },
    },
    {
      id: 'pennant',
      style: {
        ...box(
          summitX - FLAG.pennantWidth - 1,
          -rise - FLAG.poleHeight,
          FLAG.pennantWidth,
          FLAG.pennantHeight
        ),
        clipPath: PENNANT_CLIP,
        background: 'var(--color-accent)',
      },
    },
  ];
}

export function landmarkSize(active: boolean, minor: boolean): number {
  if (active) return LANDMARK_DOT.HOVER;
  if (minor) return LANDMARK_DOT.MINOR;
  return LANDMARK_DOT.DEFAULT;
}

export function landmarkFill(active: boolean, minor: boolean): string {
  if (active) return 'var(--color-chart-2)';
  if (minor) return 'var(--color-dot-hollow)';
  return 'var(--color-chart-1)';
}

export function landmarkBorder(active: boolean, minor: boolean): string {
  if (minor && !active) return '2px solid color-mix(in oklab, var(--color-ink) 45%, transparent)';
  return '2.5px solid var(--color-ink)';
}

/** Caption offset above the dot — or below it, for the summit. */
export function landmarkCaptionOffset(minor: boolean, below: boolean): number {
  if (below) return 16;
  if (minor) return -28;
  return -34;
}
