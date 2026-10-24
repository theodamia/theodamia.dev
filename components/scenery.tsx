'use client';

import { createContext, useContext, type RefObject } from 'react';

/**
 * Taking in the view at the summit: the closing card set aside into the cairn by today's camp, and taken out of
 * it again. The climb owns it (components/climb.tsx), because both ends live there: the card in the page, and the
 * cairn the stage keeps on the camp.
 */
export type Scenery = {
  /** The card is set aside, kept in the cairn. */
  viewing: boolean;
  /** Set the card aside (true) or take it out again (false), carried by a view transition. */
  fold: (next: boolean) => void;
  /** The card, so the transition can carry it into the cairn. */
  cardRef: RefObject<HTMLElement | null>;
  /** Set when the card comes back by the reader's hand, so focus returns to where they left it. */
  returningRef: RefObject<boolean>;
};

export const SceneryContext = createContext<Scenery | null>(null);

/** The summit's scenery state, for the closing card. Only inside the climb. */
export function useScenery(): Scenery {
  const scenery = useContext(SceneryContext);

  if (!scenery) {
    throw new Error('useScenery is only available inside <Climb>');
  }

  return scenery;
}
