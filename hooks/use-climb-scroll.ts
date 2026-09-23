import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  CUE_HIDE_AFTER_PX,
  STOP_LEFT_AT,
  STOP_REACHED_AT,
  STOP_SCROLL_NUDGE_PX,
  WIDE_QUERY,
} from '@/constants';
import { anchorsFor, stopPositions } from '@/lib/climb-stops';
import { JOBS, TRAILHEAD } from '@/lib/jobs';
import { CAMP_COUNT, cameraKnot, campAnchor, WORLD, type SceneHandle } from '@/lib/scene/world';
import { readView } from '@/lib/view';

type ClimbScrollRefs = {
  /** False in the timeline, where there is no scene to drive and nothing to measure. */
  enabled: boolean;
  scene: RefObject<SceneHandle | null>;
  /** Everything in normal flow over the stage; the climb re-measures when its height changes. */
  track: RefObject<HTMLElement | null>;
  /** What the dock scrolls to, and where the first stop's position is published for it. */
  anchor: RefObject<HTMLElement | null>;
  /** The climb's own list; its `[data-card]` children are the stops, the timeline's are not. */
  climbList: RefObject<HTMLElement | null>;
  rail: RefObject<HTMLElement | null>;
  needle: RefObject<HTMLElement | null>;
  /** The altimeter's walked bar: scaled from the bottom up to the needle. */
  walked: RefObject<HTMLElement | null>;
};

type ClimbScroll = {
  /** Index of the camp the climber has reached: 0 is the trailhead, job `i` is camp `i + 1`. */
  stop: number;
  /** The year being passed, interpolated between stops. */
  year: number;
  /** True once the page has moved far enough to retire the scroll cue. */
  moving: boolean;
  scrollToStop: (index: number) => void;
};

const LAST_STOP = CAMP_COUNT - 1;
/** The year at each camp: the trailhead's, then each job's start. */
const CAMP_YEARS = [TRAILHEAD.year, ...JOBS.map(job => job.start)];
/** Camp 0 is the trailhead, which has no card; the first job is camp 1. */
const FIRST_JOB_STOP = 1;

/**
 * Drives the climb from the page scroll. Everything that needs layout is read in `measure()` (on resize and
 * when the track changes height), never while scrolling: the scroll position at which each card meets its camp
 * and the matching camera positions. A frame then only interpolates between those and hands the scene one
 * `SceneFrame`. The three pieces of state are set every frame but almost always with the value they already
 * hold, so React bails out and nothing re-renders until the stop or the year actually changes.
 *
 * In the timeline it drives nothing: it attaches no listeners and puts back everything it wrote, because a stale
 * published position would send the dock to a place that view does not have.
 */
export function useClimbScroll({
  enabled,
  scene,
  track,
  anchor,
  climbList,
  rail,
  needle,
  walked,
}: ClimbScrollRefs): ClimbScroll {
  const [stop, setStop] = useState(0);
  const [year, setYear] = useState<number>(TRAILHEAD.year);
  const [moving, setMoving] = useState(false);
  /** Scroll position of each stop, and the camera's world Y there. */
  const stops = useRef<number[]>([]);
  const knots = useRef<number[]>([]);
  const railHeight = useRef(0);
  const reached = useRef(0);
  /** The landing jump from the other page's dock happens once, not on every switch back to the climb. */
  const landed = useRef(false);

  useEffect(() => {
    /*
     * The attribute, not the prop: `useSyncExternalStore` hands the server's answer to the first pass, so a
     * reader who chose the timeline would otherwise measure a hidden list here before React corrected itself.
     */
    if (!enabled || readView() !== 'climb') return;
    /* held for the cleanup: by then the refs may point at whatever the next view rendered */
    const anchorEl = anchor.current;
    const needleEl = needle.current;
    const walkedEl = walked.current;
    let raf = 0;

    const frame = () => {
      raf = 0;
      const S = stops.current;
      const K = knots.current;
      if (S.length !== CAMP_COUNT) return;
      const y = window.scrollY;
      let leg = 0;
      let f = 0;

      if (y >= S[LAST_STOP]) {
        leg = LAST_STOP - 1;
        f = 1;
      } else if (y > S[0]) {
        leg = S.findIndex((_, i) => y < S[i + 1]);
        f = (y - S[leg]) / (S[leg + 1] - S[leg]);
      }

      const yTop = K[leg] + (K[leg + 1] - K[leg]) * f;
      scene.current?.applyFrame({ yTop, leg, f });

      if (needle.current) {
        const dpr = window.devicePixelRatio || 1;
        const offset = Math.round((yTop / WORLD.TRAVEL) * railHeight.current * dpr) / dpr;
        needle.current.style.transform = `translate3d(0,${offset}px,0)`;
      }

      if (walked.current) {
        walked.current.style.transform = `scaleY(${(1 - yTop / WORLD.TRAVEL).toFixed(4)})`;
      }

      /* arriving needs most of the leg; leaving needs a real step back (see STOP_LEFT_AT) */
      const holding = reached.current === leg + 1 && f >= STOP_LEFT_AT;
      reached.current = f >= STOP_REACHED_AT || holding ? leg + 1 : leg;
      setStop(reached.current);
      setYear(Math.round(CAMP_YEARS[leg] + (CAMP_YEARS[leg + 1] - CAMP_YEARS[leg]) * f));
      setMoving(y > CUE_HIDE_AFTER_PX);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const measure = (paint: () => void = onScroll) => {
      const wide = window.matchMedia(WIDE_QUERY).matches;
      const anchors = anchorsFor(wide);
      knots.current = CAMP_YEARS.map((_, i) => cameraKnot(i, campAnchor(i, anchors)));
      const cards = Array.from(
        climbList.current?.querySelectorAll<HTMLElement>('[data-card]') ?? []
      );
      /* the trailhead is the top of the page; every other camp is reached when its card arrives */
      stops.current = stopPositions(cards, {
        wide,
        innerHeight: window.innerHeight,
        scrollY: window.scrollY,
      });
      railHeight.current = rail.current?.clientHeight ?? 0;
      scene.current?.resize();

      /* the dock reads this to send "Experience" to the first job rather than the top of the list */
      if (stops.current.length > FIRST_JOB_STOP) {
        anchor.current?.setAttribute(
          'data-scroll-y',
          String(stops.current[FIRST_JOB_STOP] + STOP_SCROLL_NUDGE_PX)
        );
      }

      paint();
    };

    /* the stage was last posed for wherever the reader was when it went away: put it right in this frame, not the next */
    measure(frame);

    /* arriving from the other page's dock: land on the first stop, not on the top of the list */
    if (
      !landed.current &&
      window.location.hash === '#climb' &&
      stops.current.length > FIRST_JOB_STOP
    ) {
      landed.current = true;
      window.scrollTo({
        top: stops.current[FIRST_JOB_STOP] + STOP_SCROLL_NUDGE_PX,
        behavior: 'instant',
      });
    }

    const remeasure = () => measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
    const observer = new ResizeObserver(remeasure);
    if (track.current) observer.observe(track.current);

    return () => {
      /* the pending frame first: it would write the transforms back over the ones cleared below */
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('load', remeasure);
      observer.disconnect();
      /* a published position the timeline does not have is worse than none: the dock prefers it over geometry */
      anchorEl?.removeAttribute('data-scroll-y');
      /* both resting poses are classes, so dropping what the frames wrote restores them */
      needleEl?.style.removeProperty('transform');
      walkedEl?.style.removeProperty('transform');
      stops.current = [];
      reached.current = 0;
    };
  }, [enabled, scene, track, anchor, climbList, rail, needle, walked]);

  const scrollToStop = useCallback((index: number) => {
    const top = stops.current[index];
    /* smooth or instant is decided by `scroll-behavior` in globals.css, which follows reduced motion */
    if (top !== undefined) window.scrollTo({ top: top + STOP_SCROLL_NUDGE_PX });
  }, []);

  return { stop, year, moving, scrollToStop };
}
