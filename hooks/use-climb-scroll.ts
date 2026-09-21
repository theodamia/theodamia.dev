import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  CAMP_ANCHORS,
  CARD_LEAD,
  CUE_HIDE_AFTER_PX,
  STOP_LEFT_AT,
  STOP_REACHED_AT,
  STOP_SCROLL_NUDGE_PX,
  WIDE_QUERY,
} from '@/constants';
import { JOBS, TRAILHEAD } from '@/lib/jobs';
import { CAMP_COUNT, cameraKnot, campAnchor, WORLD, type SceneHandle } from '@/lib/scene/world';

type ClimbScrollRefs = {
  scene: RefObject<SceneHandle | null>;
  /** The column of cards. Its `[data-card]` children are the stops. */
  track: RefObject<HTMLElement | null>;
  /** The list of stops; the first stop's scroll position is published on it for the dock. */
  climb: RefObject<HTMLElement | null>;
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
 * `SceneFrame`. React state changes only when a new stop or year is reached.
 */
export function useClimbScroll({
  scene,
  track,
  climb,
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

  useEffect(() => {
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

    const measure = () => {
      const wide = window.matchMedia(WIDE_QUERY).matches;
      const anchors = wide ? CAMP_ANCHORS.WIDE : CAMP_ANCHORS.PHONE;
      const lead = wide ? CARD_LEAD.WIDE : CARD_LEAD.PHONE;
      const anchorFor = (i: number) => campAnchor(i, anchors);
      knots.current = CAMP_YEARS.map((_, i) => cameraKnot(i, anchorFor(i)));
      const cards = Array.from(track.current?.querySelectorAll<HTMLElement>('[data-card]') ?? []);
      /* the trailhead is the top of the page; every other camp is reached when its card arrives */
      let previous = 0;
      const cardStops = cards.map((card, i) => {
        const top = card.getBoundingClientRect().top + window.scrollY;
        previous = Math.max(previous + 1, top - (anchorFor(i + 1) + lead) * window.innerHeight);
        return previous;
      });
      stops.current = [0, ...cardStops];
      railHeight.current = rail.current?.clientHeight ?? 0;
      scene.current?.resize();
      /* the dock reads this to send "Experience" to the first job rather than the top of the list */
      if (stops.current.length > FIRST_JOB_STOP) {
        climb.current?.setAttribute(
          'data-scroll-y',
          String(stops.current[FIRST_JOB_STOP] + STOP_SCROLL_NUDGE_PX)
        );
      }
      onScroll();
    };

    measure();
    /* arriving from the other page's dock: land on the first stop, not on the top of the list */
    if (window.location.hash === '#climb' && stops.current.length > FIRST_JOB_STOP) {
      window.scrollTo({
        top: stops.current[FIRST_JOB_STOP] + STOP_SCROLL_NUDGE_PX,
        behavior: 'instant',
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      observer.disconnect();
    };
  }, [scene, track, climb, rail, needle, walked]);

  const scrollToStop = useCallback((index: number) => {
    const top = stops.current[index];
    /* smooth or instant is decided by `scroll-behavior` in globals.css, which follows reduced motion */
    if (top !== undefined) window.scrollTo({ top: top + STOP_SCROLL_NUDGE_PX });
  }, []);

  return { stop, year, moving, scrollToStop };
}
