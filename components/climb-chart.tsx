'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CHART_COLORS,
  CHART_FONT,
  CLIMB,
  TOOLTIP_ABOVE_LEVEL,
  TOOLTIP_FLIP_RATIO,
} from '@/constants';
import { useXkcdChart } from '@/hooks/use-xkcd-chart';
import {
  buildHills,
  landmarkBorder,
  landmarkCaptionOffset,
  landmarkFill,
  landmarkSize,
  plotX,
  plotY,
  samePlot,
  type PlotBox,
} from '@/lib/climb-geometry';
import { CLIMB_LEVELS, CLIMB_YEARS, MILESTONES, ROLE_BANDS } from '@/lib/milestones';
import { stripNestedLegend, syncHeightToAttribute, trimTicksLeftOf, unclip } from '@/lib/xkcd-dom';
import { cn } from '@/utils/cn';

type ClimbChartProps = {
  onSelect: (index: number) => void;
};

/**
 * Fig. 1 — the ascending career line with mountains, role bands and clickable landmarks.
 *
 * chart.xkcd forces its own aspect ratio, so every overlay coordinate is derived from the
 * *measured* bounding box of the drawn line rather than assumed percentages. A
 * ResizeObserver re-measures; the chart hook redraws on a debounced resize.
 */
export function ClimbChart({ onSelect }: ClimbChartProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [plot, setPlot] = useState<PlotBox | null>(null);
  const [hover, setHover] = useState(-1);

  const measurePlot = useCallback(() => {
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    const line = svg.querySelector<SVGPathElement>(`path[stroke="${CLIMB.LINE_COLOR}"]`);
    if (!line) return;

    const lineRect = line.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    if (!lineRect.width || !lineRect.height) return;

    trimTicksLeftOf(svg, lineRect.left);

    const next: PlotBox = {
      x: Math.round(lineRect.left - wrapperRect.left),
      y: Math.round(lineRect.top - wrapperRect.top),
      w: Math.round(lineRect.width),
      h: Math.round(lineRect.height),
    };
    setPlot(current => (current && samePlot(current, next) ? current : next));
  }, []);

  useXkcdChart({
    svgRef,
    draw: (chart, svg) => {
      svg.style.height = `${CLIMB.CHART_HEIGHT}px`;
      new chart.Line(svg, {
        title: 'The climb, with landmarks',
        xLabel: 'year',
        yLabel: '',
        data: { labels: CLIMB_YEARS, datasets: [{ label: 'level', data: CLIMB_LEVELS }] },
        options: {
          yTickCount: 5,
          legendPosition: chart.config.positionType.upLeft,
          dataColors: [...CHART_COLORS],
          fontFamily: CHART_FONT,
        },
      });
    },
    afterDraw: svg => {
      stripNestedLegend(svg);
      unclip(svg);
      syncHeightToAttribute(svg);
      measurePlot();
    },
    verify: svg => Boolean(svg.querySelector(`path[stroke="${CLIMB.LINE_COLOR}"]`)),
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const observer = new ResizeObserver(() => measurePlot());
    observer.observe(svg);
    return () => observer.disconnect();
  }, [measurePlot]);

  const hills = useMemo(() => (plot ? buildHills(plot) : []), [plot]);

  const landmarks = useMemo(() => {
    if (!plot) return [];
    return MILESTONES.map((milestone, index) => {
      const active = hover === index;
      const minor = index === 0;
      const below = index === MILESTONES.length - 1;
      const size = landmarkSize(active, minor);
      return {
        milestone,
        index,
        active,
        minor,
        below,
        size,
        x: plotX(plot, milestone.year),
        y: plotY(plot, milestone.level),
      };
    });
  }, [plot, hover]);

  const tip = hover > -1 && plot ? MILESTONES[hover] : null;

  return (
    <div ref={wrapperRef} className='relative'>
      <div aria-hidden='true' className='pointer-events-none absolute inset-0 z-0'>
        {hills.map(hill => (
          <div key={hill.id} style={hill.style} />
        ))}
      </div>

      <svg
        ref={svgRef}
        className='relative z-[1] mt-[46px] w-full'
        style={{ height: CLIMB.CHART_HEIGHT }}
      />

      <div className='pointer-events-none absolute inset-0 z-[2]'>
        {plot &&
          ROLE_BANDS.map(band => {
            const alignRight = band.level <= 3;
            return (
              <div
                key={band.level}
                className='border-ink/16 absolute h-0 border-t border-dashed'
                style={{ left: plot.x, top: plotY(plot, band.level), width: plot.w }}
              >
                <div
                  className={cn(
                    'absolute top-[-6px] flex -translate-y-full flex-col gap-px',
                    alignRight ? 'right-1.5 items-end' : 'left-2 items-start'
                  )}
                >
                  <span className='font-hand text-ink-strong text-[17px] leading-none'>
                    {band.label}
                  </span>
                  <span className='text-ink-ghost font-mono text-[9.5px] leading-[1.2] tracking-[0.1em] uppercase'>
                    {band.note}
                  </span>
                </div>
              </div>
            );
          })}

        {landmarks.map(landmark => (
          <button
            key={landmark.milestone.year}
            type='button'
            data-keep-drawer='true'
            aria-label={`${landmark.milestone.title}, ${landmark.milestone.period}`}
            onMouseEnter={() => setHover(landmark.index)}
            onMouseLeave={() => setHover(-1)}
            onFocus={() => setHover(landmark.index)}
            onBlur={() => setHover(-1)}
            onClick={() => onSelect(landmark.index)}
            className='pointer-events-auto absolute cursor-help rounded-full transition-[width,height,margin] duration-150'
            style={{
              left: landmark.x,
              top: landmark.y,
              width: landmark.size,
              height: landmark.size,
              marginLeft: -landmark.size / 2,
              marginTop: -landmark.size / 2,
              border: landmarkBorder(landmark.active, landmark.minor),
              background: landmarkFill(landmark.active, landmark.minor),
            }}
          />
        ))}

        {landmarks.map(landmark => (
          <div
            key={`caption-${landmark.milestone.year}`}
            className={cn(
              'font-hand pointer-events-none absolute -translate-x-1/2 whitespace-nowrap',
              landmark.minor ? 'text-ink-ghost text-[13px]' : 'text-ink-muted text-[15px]'
            )}
            style={{
              left: landmark.x,
              top: landmark.y,
              marginTop: landmarkCaptionOffset(landmark.minor, landmark.below),
            }}
          >
            {landmark.minor ? 'Student' : landmark.milestone.company}
          </div>
        ))}

        {tip && plot && <LandmarkTooltip plot={plot} milestone={tip} />}
      </div>
    </div>
  );
}

type LandmarkTooltipProps = {
  plot: PlotBox;
  milestone: (typeof MILESTONES)[number];
};

function LandmarkTooltip({ plot, milestone }: LandmarkTooltipProps) {
  const ratio = (milestone.year - CLIMB.FIRST_YEAR) / CLIMB.YEAR_SPAN;
  const flip = ratio > TOOLTIP_FLIP_RATIO;
  const low = milestone.level <= TOOLTIP_ABOVE_LEVEL;

  const transform = [flip ? 'translateX(-100%)' : 'translateX(0)', low ? 'translateY(-100%)' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className='border-ink bg-tooltip shadow-tooltip absolute z-[5] w-[250px] rounded-[4px] border-2 px-4 py-3.5'
      style={{
        left: plotX(plot, milestone.year),
        top: plotY(plot, milestone.level),
        marginTop: low ? -16 : 18,
        transform,
      }}
    >
      <p className='font-hand text-ink text-[21px] leading-[1.1]'>{milestone.title}</p>
      <p className='text-ink-faint mt-1 font-mono text-[10.5px] tracking-[0.14em] uppercase'>
        {milestone.period}
      </p>
      <p className='text-ink-muted mt-1.5 text-[13.5px] leading-[1.55]'>{milestone.text}</p>
      <p className='text-accent mt-2 font-mono text-[10px] tracking-[0.16em] uppercase'>
        Click for the full story
      </p>
    </div>
  );
}
