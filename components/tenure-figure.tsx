'use client';

import { useRef } from 'react';
import { FigureCard, FigureLabel } from '@/components/figure-card';
import { SliceLegend } from '@/components/slice-legend';
import { CHART_COLORS, CHART_FONT, PIE_INNER_RADIUS } from '@/lib/constants';
import { TENURE } from '@/lib/figures';
import { useXkcdChart } from '@/lib/use-xkcd-chart';
import { fitHeightToContent, recenterArcs, stripNestedLegend, unclip } from '@/lib/xkcd-dom';

const CHART_HEIGHT = 280;

/** Fig. 2 — loyalty, quantified. */
export function TenureFigure() {
  const svgRef = useRef<SVGSVGElement>(null);

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
      fitHeightToContent(svg);
    },
  });

  return (
    <FigureCard className='flex flex-col'>
      <FigureLabel className='mb-1.5'>Fig. 2 — loyalty, quantified</FigureLabel>
      <svg ref={svgRef} className='w-full' style={{ height: CHART_HEIGHT }} />
      <SliceLegend slices={TENURE} className='mt-3' />
    </FigureCard>
  );
}
