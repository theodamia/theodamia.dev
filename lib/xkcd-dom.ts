/**
 * Post-processing for chart.xkcd output. The library renders its legend as a nested
 * `<svg>`, forces its own aspect ratio and leaves pie arcs off-centre, so every chart
 * needs a tidy-up pass before the hand-drawn look sits correctly in a card.
 */

const NUMERIC_LABEL = /^\s*\d+(\.\d+)?\s*$/;

function safeBBox(svg: SVGSVGElement): DOMRect | null {
  try {
    return svg.getBBox();
  } catch {
    return null;
  }
}

/** Lets strokes and labels spill past the viewport edge instead of being clipped. */
export function unclip(svg: SVGSVGElement) {
  svg.style.overflow = 'visible';
  svg.style.background = 'transparent';
}

/** Removes the library's own legend, which is an `<svg>` nested inside a `<g>`. */
export function stripNestedLegend(svg: SVGSVGElement) {
  svg.querySelectorAll('svg').forEach(inner => {
    const parent = inner.parentElement;
    if (parent && parent.tagName === 'g' && parent.children.length === 1) {
      parent.remove();
      return;
    }
    inner.remove();
  });
}

/** Pie arcs are drawn off-centre; nudge the arc group back to the middle of the svg. */
export function recenterArcs(svg: SVGSVGElement) {
  const arcs = svg.querySelector('g');
  if (!arcs) return;

  const arcRect = arcs.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();
  if (!arcRect.width || !svgRect.width) return;

  const offset = svgRect.width / 2 - (arcRect.left - svgRect.left + arcRect.width / 2);
  const existing = arcs.getAttribute('transform') ?? '';
  arcs.setAttribute('transform', `${existing} translate(${offset.toFixed(1)},0)`);
}

/** Collapses the svg's CSS height onto the height its content actually occupies. */
export function fitHeightToContent(svg: SVGSVGElement, padding = 6) {
  const box = safeBBox(svg);
  if (!box?.height) return;
  svg.style.height = `${Math.ceil(box.height + padding)}px`;
}

/** Refits the viewBox around the drawn content so a short chart fills its card. */
export function fitViewBoxToContent(svg: SVGSVGElement, padding = 8) {
  const box = safeBBox(svg);
  if (!box?.width || !box.height) return;
  const viewBox = [
    box.x - padding,
    box.y - padding,
    box.width + padding * 2,
    box.height + padding * 2,
  ].join(' ');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
}

/** chart.xkcd forces its own height attribute; mirror it so overlays line up. */
export function syncHeightToAttribute(svg: SVGSVGElement) {
  const height = Number(svg.getAttribute('height'));
  if (height > 0) svg.style.height = `${Math.ceil(height)}px`;
}

/** Drops y-axis tick labels that end up outside the plot box. */
export function trimTicksLeftOf(svg: SVGSVGElement, boundary: number) {
  svg.querySelectorAll('text').forEach(label => {
    if (!NUMERIC_LABEL.test(label.textContent ?? '')) return;
    if (label.getBoundingClientRect().right < boundary - 2) label.remove();
  });
}
