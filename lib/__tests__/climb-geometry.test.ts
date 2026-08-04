import { describe, expect, it } from 'vitest';
import { buildHills, plotX, plotY, samePlot, type PlotBox } from '@/lib/climb-geometry';
import { CLIMB } from '@/lib/constants';
import { CLIMB_LEVELS, CLIMB_YEARS, MILESTONES } from '@/lib/milestones';

const PLOT: PlotBox = { x: 100, y: 50, w: 1200, h: 400 };

describe('plot mapping', () => {
  it('anchors the first year to the left edge and the last to the right', () => {
    expect(plotX(PLOT, CLIMB.FIRST_YEAR)).toBe(PLOT.x);
    expect(plotX(PLOT, CLIMB.FIRST_YEAR + CLIMB.YEAR_SPAN)).toBe(PLOT.x + PLOT.w);
  });

  it('puts the top level at the top of the plot', () => {
    expect(plotY(PLOT, CLIMB.TOP_LEVEL)).toBe(PLOT.y);
    expect(plotY(PLOT, CLIMB.TOP_LEVEL - CLIMB.LEVEL_SPAN)).toBe(PLOT.y + PLOT.h);
  });

  it('treats an unchanged box as the same box', () => {
    expect(samePlot(PLOT, { ...PLOT })).toBe(true);
    expect(samePlot(PLOT, { ...PLOT, w: PLOT.w + 1 })).toBe(false);
  });
});

describe('buildHills', () => {
  const hills = buildHills(PLOT);
  const byId = (id: string) => hills.find(hill => hill.id === id);

  it('lands the middle apex on the Frontend Lead landmark', () => {
    const lead = MILESTONES.find(milestone => milestone.title === 'Frontend Lead — Geekbot');
    const mid = byId('mid-hill');
    const left = Number(mid?.style.left);
    const width = Number(mid?.style.width);

    expect(left + width / 2).toBeCloseTo(plotX(PLOT, lead!.year), 5);
    expect(Number(mid?.style.top)).toBeCloseTo(plotY(PLOT, lead!.level), 5);
  });

  it('raises the summit above the plot so the last dot sits on its slope', () => {
    const summit = byId('summit');
    expect(Number(summit?.style.top)).toBe(PLOT.y - CLIMB.SUMMIT_RISE);
  });

  it('flies the pennant to the left of the pole so it stays inside the card', () => {
    const pole = byId('flagpole');
    const pennant = byId('pennant');
    expect(Number(pennant?.style.left)).toBeLessThan(Number(pole?.style.left));
  });
});

describe('climb data', () => {
  it('has one level per year', () => {
    expect(CLIMB_LEVELS).toHaveLength(CLIMB_YEARS.length);
    expect(CLIMB_YEARS).toHaveLength(CLIMB.YEAR_SPAN + 1);
  });

  it('never dips', () => {
    CLIMB_LEVELS.forEach((level, index) => {
      if (index === 0) return;
      expect(level).toBeGreaterThanOrEqual(CLIMB_LEVELS[index - 1]);
    });
  });

  it('keeps every milestone inside the plotted range', () => {
    MILESTONES.forEach(milestone => {
      expect(milestone.year).toBeGreaterThanOrEqual(CLIMB.FIRST_YEAR);
      expect(milestone.year).toBeLessThanOrEqual(CLIMB.FIRST_YEAR + CLIMB.YEAR_SPAN);
      expect(milestone.level).toBeLessThanOrEqual(CLIMB.TOP_LEVEL);
    });
  });
});
