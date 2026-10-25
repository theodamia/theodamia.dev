import { YearLand, YearSky } from '@/components/scene/year-backdrop';
import { cn } from '@/utils/cn';

type SeasonWindowProps = {
  /** The state of the year it looks onto (scene/seasons.ts): the season it shows. */
  k: number;
  /** The last window ends the page: taller, and soft only at its top, so the page ends in the meadow. */
  end?: boolean;
  className?: string;
};

/**
 * A window onto the year, for phones, where there is no room beside the log for the landscape. A full-width band
 * in the page's flow that clips a fixed, full-screen copy of one state: the picture stays put and the page slides
 * over it, so each window shows the wood at a different height as it passes. Three of them (after the header,
 * mid-log and at the foot) turn the year in three steps instead of seven. No stars and no weather: a band this
 * small would not show them, and each would be another copy in the page. Hidden on wide screens and on paper.
 */
export function SeasonWindow({ k, end, className }: SeasonWindowProps) {
  return (
    <div
      aria-hidden='true'
      data-end={end ? '' : undefined}
      className={cn('season-window wide:hidden print:hidden', className)}
    >
      <div className='season-window-view'>
        <div className='year-state' data-k={k}>
          <YearSky k={k} />
        </div>
        <div className='year-state' data-k={k}>
          <YearLand k={k} />
        </div>
      </div>
    </div>
  );
}
