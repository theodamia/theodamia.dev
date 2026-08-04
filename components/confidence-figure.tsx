'use client';

import { useRef } from 'react';
import { FigureCard, FigureCaption, FigureLabel } from '@/components/figure-card';
import { CHART_COLORS, CHART_FONT } from '@/lib/constants';
import { COFFEE, CONFIDENCE_LEVELS, CONFIDENCE_PHASES, MAX_COFFEE_CUPS } from '@/lib/figures';
import { useXkcdChart } from '@/lib/use-xkcd-chart';
import { fitViewBoxToContent, stripNestedLegend, unclip } from '@/lib/xkcd-dom';

const CHART_HEIGHT = 280;
const CUP_SLOTS = Array.from({ length: MAX_COFFEE_CUPS }, (_, index) => index + 1);

/** Fig. 4 — the honest one: confidence per project, plus the coffee that tracks it. */
export function ConfidenceFigure() {
  const svgRef = useRef<SVGSVGElement>(null);

  useXkcdChart({
    svgRef,
    draw: (chart, svg) => {
      new chart.Line(svg, {
        title: 'Confidence, per project',
        xLabel: '',
        yLabel: '',
        data: {
          labels: CONFIDENCE_PHASES,
          datasets: [{ label: 'confidence', data: CONFIDENCE_LEVELS }],
        },
        options: {
          yTickCount: 3,
          legendPosition: chart.config.positionType.upRight,
          dataColors: [CHART_COLORS[1]],
          fontFamily: CHART_FONT,
        },
      });
    },
    afterDraw: svg => {
      stripNestedLegend(svg);
      unclip(svg);
      fitViewBoxToContent(svg);
    },
  });

  return (
    <FigureCard className='flex flex-col'>
      <FigureLabel className='mb-1.5'>Fig. 4 — the honest one</FigureLabel>

      <div className='px-2.5'>
        <svg ref={svgRef} className='w-full' style={{ height: CHART_HEIGHT }} />
      </div>

      <div className='border-ink/22 mt-4 border-t border-dashed pt-3.5'>
        <p className='text-ink-ghost mb-2.5 font-mono text-[10px] tracking-[0.18em] uppercase'>
          Coffee, cups per day
        </p>
        <div className='grid grid-cols-4 gap-2'>
          {COFFEE.map(phase => (
            <div key={phase.phase} className='flex flex-col items-center gap-1.5'>
              <div className='flex gap-[3px]'>
                {CUP_SLOTS.map(slot => (
                  <span
                    key={slot}
                    className='border-ink/70 block h-[11px] w-2 rounded-[1px_1px_3px_3px] border-[1.5px]'
                    style={{
                      background: slot <= phase.cups ? 'var(--color-coffee)' : 'transparent',
                    }}
                  />
                ))}
              </div>
              <span className='font-hand text-ink-muted text-[15px]'>{phase.phase}</span>
            </div>
          ))}
        </div>
      </div>

      <FigureCaption className='mt-auto pt-[18px]'>
        Every project has this shape. Confidence bottoms out mid-build — coffee peaks in exactly the
        same place, which is probably not a coincidence.
      </FigureCaption>
    </FigureCard>
  );
}
