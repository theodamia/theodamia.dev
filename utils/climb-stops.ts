/**
 * Where a card's top sits on screen when its camp is reached (0 top, 1 bottom). The same for every card: beside
 * the camp on wide screens, below it on phones. The camera brings each camp to its own line (scene/camera.ts).
 */
const CARD_LINE = { WIDE: 0.32, PHONE: 0.49 } as const;

type Viewport = {
  /** Wide screens put the cards beside the camp, phones below it. */
  wide: boolean;
  innerHeight: number;
  scrollY: number;
};

/**
 * The scroll position of every stop: the trailhead at the top of the page, then the point at which each card's
 * top reaches its line. Kept out of the scroll hook so the one piece of arithmetic the whole climb rests on can be
 * tested on its own.
 */
export function stopPositions(
  cards: HTMLElement[],
  { wide, innerHeight, scrollY }: Viewport
): number[] {
  const line = wide ? CARD_LINE.WIDE : CARD_LINE.PHONE;
  let previous = 0;

  const cardStops = cards.map(card => {
    const top = card.getBoundingClientRect().top + scrollY;
    /* `previous + 1` keeps the stops strictly increasing, so the progress within a leg never divides by zero */
    previous = Math.max(previous + 1, top - line * innerHeight);

    return previous;
  });

  return [0, ...cardStops];
}

/**
 * The middle of the gap between the left and the right card lanes, in viewport pixels: where the camera keeps the
 * camps on wide screens, so a camp never stands under a card even when the altimeter's padding makes the lanes
 * lopsided. Null when the cards are not in two lanes.
 */
export function cardLaneGap(cards: HTMLElement[], innerWidth: number): number | null {
  const rects = cards.map(card => card.getBoundingClientRect());
  const middle = innerWidth / 2;
  const left = rects.filter(rect => rect.left + rect.width / 2 < middle);
  const right = rects.filter(rect => rect.left + rect.width / 2 >= middle);
  if (!left.length || !right.length) return null;

  const leftEdge = Math.max(...left.map(rect => rect.right));
  const rightEdge = Math.min(...right.map(rect => rect.left));

  return (leftEdge + rightEdge) / 2;
}
