'use client';

import { type RefObject, useEffect, useRef } from 'react';
import type { ChartXkcd } from 'chart.xkcd';
import { TIMING } from '@/lib/constants';

export type UseXkcdChartOptions = {
  svgRef: RefObject<SVGSVGElement | null>;
  /** Instantiates the chart. Runs again on a debounced resize. */
  draw: (chart: ChartXkcd, svg: SVGSVGElement) => void;
  /** Tidy-up pass, one frame after `draw`, once the library has committed its DOM. */
  afterDraw?: (svg: SVGSVGElement) => void;
  /** Return false when the draw produced nothing usable — the chart is then redrawn. */
  verify?: (svg: SVGSVGElement) => boolean;
  /** Fig. 1 does not mount on phones, so its chart must not draw either. */
  enabled?: boolean;
};

/**
 * Draws a chart.xkcd chart into a ref'd `<svg>`, keeps it in step with window resizes,
 * and retries when the library renders an empty chart (which it does if the svg is
 * measured before layout has settled).
 */
export function useXkcdChart({
  svgRef,
  draw,
  afterDraw,
  verify,
  enabled = true,
}: UseXkcdChartOptions) {
  const callbacks = useRef({ draw, afterDraw, verify });
  callbacks.current = { draw, afterDraw, verify };

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let attempts = 0;
    let retryTimer: number | undefined;
    let resizeTimer: number | undefined;
    let frame: number | undefined;

    const retry = () => {
      if (attempts >= TIMING.CHART_MAX_RETRIES) return;
      attempts += 1;
      retryTimer = window.setTimeout(() => void render(), TIMING.CHART_RETRY_MS);
    };

    const render = async () => {
      const svg = svgRef.current;
      if (cancelled || !svg) return;

      // chart.xkcd sizes itself from the parent's client width, so wait for layout.
      if (!svg.getBoundingClientRect().width) {
        retry();
        return;
      }

      const { default: chart } = await import('chart.xkcd');
      if (cancelled || !svgRef.current) return;

      // `innerHTML = ''` clears the drawn content but not attributes on the svg itself —
      // a viewBox fitted to the previous size would otherwise carry over and corrupt the
      // next draw's measurements (recenterArcs, fitToBox, fitViewBoxToContent all read
      // getBoundingClientRect, which a stale viewBox skews).
      svg.innerHTML = '';
      svg.removeAttribute('viewBox');
      svg.removeAttribute('preserveAspectRatio');
      callbacks.current.draw(chart, svg);

      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        callbacks.current.afterDraw?.(svg);
        if (callbacks.current.verify?.(svg) === false) retry();
      });
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        attempts = 0;
        void render();
      }, TIMING.RESIZE_DEBOUNCE_MS);
    };

    void render();
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
      window.clearTimeout(resizeTimer);
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [enabled, svgRef]);
}
