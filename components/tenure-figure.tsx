'use client';

import { useRef } from 'react';
import { FigureCard, FigureLabel } from '@/components/figure-card';
import { SliceLegend } from '@/components/slice-legend';
import { SliceTooltip } from '@/components/slice-tooltip';
import { CHART_COLORS, CHART_FONT, PIE_INNER_RADIUS } from '@/lib/constants';
import { TENURE } from '@/lib/figures';
import { useSliceHover } from '@/lib/use-slice-hover';
import { useXkcdChart } from '@/lib/use-xkcd-chart';
import { fitToBox, recenterArcs, stripNestedLegend, unclip } from '@/lib/xkcd-dom';

/**
 * The drawing is scaled to fill this box, so it sets how large the donut renders. The title
 * is held at its authored size, so this only grows the donut.
 */
const CHART_HEIGHT = 240;

/** Fig. 2 — loyalty, quantified. */
export function TenureFigure() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { hover, bindArcs, clearHover } = useSliceHover(wrapperRef);

  useXkcdChart({
    svgRef,
    draw: (chart, svg) => {
      new chart.Pie(svg, {
        title: 'Years per employer',
        data: {
          labels: TENURE.map(slice => slice.label),
          datasets: [{ data: TENURE.map(slice => slice.value) }],
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
      fitToBox(svg);
      bindArcs(svg);
    },
  });

  return (
    <FigureCard className='flex flex-col'>
      <FigureLabel className='mb-1.5'>Fig. 2 — loyalty, quantified</FigureLabel>
      <div ref={wrapperRef} className='relative' onMouseLeave={clearHover}>
        <svg ref={svgRef} className='w-full' style={{ height: CHART_HEIGHT }} />
        {hover && (
          <SliceTooltip
            key={hover.index}
            slice={TENURE[hover.index]}
            color={CHART_COLORS[hover.index % CHART_COLORS.length]}
            x={hover.x}
            y={hover.y}
            containerWidth={hover.containerWidth}
            containerHeight={hover.containerHeight}
          />
        )}
      </div>
      <SliceLegend slices={TENURE} className='mt-8' />
    </FigureCard>
  );
}
