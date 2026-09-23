import { CAMP_ANCHORS, CARD_LEAD } from '@/constants';
import { campAnchor } from '@/lib/scene/world';

type Viewport = {
  /** Wide screens put the cards beside the trail, so a camp is reached at a different point. */
  wide: boolean;
  innerHeight: number;
  scrollY: number;
};

/** Where the camera rests at each camp, and how far ahead of it a card arrives. */
export const anchorsFor = (wide: boolean) => (wide ? CAMP_ANCHORS.WIDE : CAMP_ANCHORS.PHONE);
export const leadFor = (wide: boolean) => (wide ? CARD_LEAD.WIDE : CARD_LEAD.PHONE);

/**
 * The scroll position of every stop: the trailhead at the top of the page, then the point at which each card
 * meets its camp. Kept out of the scroll hook so the view switch can work out the same positions without it,
 * and so the one piece of arithmetic the whole climb rests on can be tested on its own.
 */
export function stopPositions(
  cards: HTMLElement[],
  { wide, innerHeight, scrollY }: Viewport
): number[] {
  const anchors = anchorsFor(wide);
  const lead = leadFor(wide);
  let previous = 0;

  const cardStops = cards.map((card, i) => {
    const top = card.getBoundingClientRect().top + scrollY;
    /* `previous + 1` keeps the stops strictly increasing, so the progress within a leg never divides by zero */
    previous = Math.max(previous + 1, top - (campAnchor(i + 1, anchors) + lead) * innerHeight);

    return previous;
  });

  return [0, ...cardStops];
}
