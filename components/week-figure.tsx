'use client';

import { useRef } from 'react';
import { FigureCard, FigureLabel } from '@/components/figure-card';
import { SliceLegend } from '@/components/slice-legend';
import { SliceTooltip } from '@/components/slice-tooltip';
import { CHART_COLORS, CHART_FONT, PIE_INNER_RADIUS } from '@/lib/constants';
import { WEEK_SPLIT } from '@/lib/figures';
import { useSliceHover } from '@/lib/use-slice-hover';
import { useXkcdChart } from '@/lib/use-xkcd-chart';
import { fitHeightToContent, recenterArcs, stripNestedLegend, unclip } from '@/lib/xkcd-dom';

const CHART_HEIGHT = 330;

/** Fig. 5 — where the week goes. */
export function WeekFigure() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { hover, bindArcs, clearHover } = useSliceHover(wrapperRef);

  useXkcdChart({
    svgRef,
    draw: (chart, svg) => {
      new chart.Pie(svg, {
        title: 'How a week actually splits',
        data: {
          labels: WEEK_SPLIT.map(slice => slice.label),
          datasets: [{ data: WEEK_SPLIT.map(slice => slice.value) }],
        },
        options: {
          innerRadius: PIE_INNER_RADIUS,
          legendPosition: chart.config.positionType.upRight,
          dataColors: [...CHART_COLORS],
          fontFamily: CHART_FONT,
        },
      });
    },
    afterDraw: svg => {
      stripNestedLegend(svg);
      recenterArcs(svg);
      unclip(svg);
      fitHeightToContent(svg);
      bindArcs(svg);
    },
  });

  return (
    <FigureCard className='col-span-full flex flex-wrap items-center gap-[26px]'>
      <div className='min-w-0 flex-[1_1_480px]'>
        <FigureLabel className='mb-1.5'>Fig. 5 — where the week goes</FigureLabel>
        <div ref={wrapperRef} className='relative' onMouseLeave={clearHover}>
          <svg ref={svgRef} className='w-full' style={{ height: CHART_HEIGHT }} />
          {hover && (
            <SliceTooltip
              key={hover.index}
              slice={WEEK_SPLIT[hover.index]}
              color={CHART_COLORS[hover.index % CHART_COLORS.length]}
              x={hover.x}
              y={hover.y}
              containerWidth={hover.containerWidth}
              containerHeight={hover.containerHeight}
            />
          )}
        </div>
      </div>
      <div className='flex flex-[1_1_250px] flex-col gap-[18px]'>
        <SliceLegend slices={WEEK_SPLIT} className='gap-[9px]' />
        <p className='font-hand text-ink-muted text-[19px] leading-[1.5]'>
          Roughly a third of the week is hands-on-keyboard. The rest is the job that makes the code
          worth writing.
        </p>
      </div>
    </FigureCard>
  );
}
