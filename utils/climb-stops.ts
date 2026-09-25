import { CAMP_ANCHORS } from '@/constants';

/**
 * How far (in screen heights) a card's top is from its anchor when the climber reaches the camp. Negative on
 * wide screens because the card sits beside the tent, positive on phones where it sits below it.
 */
const CARD_LEAD = { WIDE: -0.12, PHONE: 0.07 } as const;
import { campAnchor } from '@/scene/world';

type Viewport = {
  /** Wide screens put the cards beside the trail, so a camp is reached at a different point. */
  wide: boolean;
  innerHeight: number;
  scrollY: number;
};

/** Where the camera rests at each camp: a phone holds the trail lower, since the massif fills more of it. */
export const anchorsFor = (wide: boolean) => (wide ? CAMP_ANCHORS.WIDE : CAMP_ANCHORS.PHONE);
/** How far ahead of its camp a card arrives, as a share of the leg. Negative means the card is already there. */
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
