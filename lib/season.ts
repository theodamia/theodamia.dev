import { remember, reveal } from '@/lib/theme';

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

/** In the order they come round, so a list of them reads like a year. */
export const SEASONS: Season[] = ['winter', 'spring', 'summer', 'autumn'];

/** Where an explicit season is kept. Until there is one, the mountain follows the calendar. */
export const SEASON_STORAGE_KEY = 'season';

/**
 * Which season a month falls in, northern-hemisphere first: December to February is winter, and so on round.
 * Exported for its own sake because the pre-paint script below carries a copy of this table inline, and a test
 * holds the two together.
 */
export const SEASON_BY_MONTH: Season[] = [
  'winter', // January
  'winter',
  'spring',
  'spring',
  'spring',
  'summer',
  'summer',
  'summer',
  'autumn',
  'autumn',
  'autumn',
  'winter', // December
];

export function seasonOfMonth(month: number, southern: boolean): Season {
  return SEASON_BY_MONTH[(month + (southern ? 6 : 0)) % 12];
}

/**
 * Which hemisphere the clock thinks it is in: summer time falls in January in the south and July in the north, so
 * whichever of the two has the smaller offset from UTC is that half of the world's summer. Somewhere that keeps
 * no summer time gives the same answer twice and is taken for the north, which is where most of the visitors are.
 */
export function southernHemisphere(date: Date): boolean {
  const year = date.getFullYear();

  return new Date(year, 0, 1).getTimezoneOffset() < new Date(year, 6, 1).getTimezoneOffset();
}

/** The season it actually is, where the reader is. */
export function seasonNow(date: Date = new Date()): Season {
  return seasonOfMonth(date.getMonth(), southernHemisphere(date));
}

export function readSeason(): Season {
  const value = document.documentElement.dataset.season;

  return SEASONS.includes(value as Season) ? (value as Season) : 'summer';
}

/** The season someone chose here before, or null while the mountain is still following the calendar. */
export function storedSeason(): Season | null {
  try {
    const value = localStorage.getItem(SEASON_STORAGE_KEY);

    return SEASONS.includes(value as Season) ? (value as Season) : null;
  } catch {
    return null;
  }
}

/**
 * Runs in <head> before the first paint, beside the theme's own script, so the mountain is never briefly the
 * wrong season. The month table and the hemisphere test are repeated here rather than imported, because this
 * string has to stand alone in the document; a test asserts the copy still agrees with the module.
 */
export const SEASON_SCRIPT = `(function(){var d=document.documentElement;var T=${JSON.stringify(SEASON_BY_MONTH)};try{var s=localStorage.getItem('${SEASON_STORAGE_KEY}');if(T.indexOf(s)<0){var n=new Date(),y=n.getFullYear();var south=new Date(y,0,1).getTimezoneOffset()<new Date(y,6,1).getTimezoneOffset();s=T[(n.getMonth()+(south?6:0))%12]}d.dataset.season=s}catch(e){d.dataset.season='summer'}})()`;

/**
 * Changes the season from a wedge of the dial, and remembers the choice — which also stops the mountain
 * following the calendar from then on. It sweeps out from the wedge exactly as the night does, because it is
 * the same reveal.
 */
export function switchSeason(from: HTMLElement, season: Season) {
  remember(SEASON_STORAGE_KEY, season);
  reveal(from, () => {
    document.documentElement.dataset.season = season;
  });
}
