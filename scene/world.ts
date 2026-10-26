import { JOBS, TRAILHEAD } from '@/content/jobs';

/*
 * The climb as numbers: its stops and how long each leg between them is, the altimeter's rail, the side each card
 * stands on, and the contract between the scroll controller and the stage (`SceneHandle`). Everything outside
 * components/scene/ knows the climb through this file and that contract, so the stage can change without touching
 * cards, dock or altimeter. Pure maths only: it runs on the server, in the browser and in jsdom.
 */

/**
 * Legs are sized by tenure, compressed: weight = BASE + GAIN * sqrt(years / REFERENCE_YEARS), clamped. Strictly
 * proportional legs would make a six-month job a sliver no card fits in. The same weight sets how far the camera
 * travels on a leg and how long the leg takes to scroll, so the camera keeps one speed all the way up.
 */
export const LEG_WEIGHT = {
  BASE: 0.45,
  GAIN: 0.6,
  REFERENCE_YEARS: 4,
  MIN: 0.62,
  MAX: 1.08,
  /** The walk from the trailhead to the first job. */
  INTRO: 0.55,
} as const;

/** What a renderer needs to draw one moment of the climb. */
export type SceneFrame = {
  /** Index of the leg being walked: 0 leaves the trailhead, the last one arrives at the present camp. */
  leg: number;
  /** Progress along that leg, 0 to 1. */
  f: number;
};

/** Layout the stage cannot read for itself: measured by the scroll hook, with the cards. */
export type SceneLayout = {
  /** Wide screens: the middle of the gap between the two card lanes, in viewport pixels. Null on phones. */
  laneGap: number | null;
};

export type SceneHandle = {
  /** Draw one frame. Must only write transforms and opacity: no layout reads, no re-renders. */
  applyFrame: (frame: SceneFrame) => void;
  /** Re-read the stage size. Called on resize, never while scrolling. */
  resize: (layout: SceneLayout) => void;
};

/** Camps are waypoints: the trailhead, then one per job. */
export const CAMP_COUNT = JOBS.length + 1;

/** The year each camp stands for: the trailhead's, then each job's start. A camp's painting is named by it. */
export const CAMP_YEARS = [TRAILHEAD.year, ...JOBS.map(job => job.start)];

/** How long a leg is for a tenure in years. See LEG_WEIGHT. */
export function legWeight(years: number): number {
  const weight =
    LEG_WEIGHT.BASE + LEG_WEIGHT.GAIN * Math.sqrt(Math.max(0, years) / LEG_WEIGHT.REFERENCE_YEARS);

  return Math.min(LEG_WEIGHT.MAX, Math.max(LEG_WEIGHT.MIN, weight));
}

/**
 * Weight of the leg leaving each camp: the intro walk from the trailhead, then each job's tenure. The last job
 * has no leg: the pitch above it is never walked.
 */
export const LEG_WEIGHTS: number[] = [
  LEG_WEIGHT.INTRO,
  ...JOBS.slice(0, -1).map(job => legWeight(job.years)),
];

const TOTAL_WEIGHT = LEG_WEIGHTS.reduce((sum, weight) => sum + weight, 0);

/** Room left above the present camp on the altimeter's rail, for the summit it is heading to. */
const SUMMIT_ROOM = 1.08;

/**
 * How far down the altimeter's rail a point of the climb sits: 0 at the summit mark, 1 at the trailhead. The rail
 * is a map of the same road the camera walks, so it is measured by leg weight, linear within a leg: the needle
 * passes each mark exactly when its card arrives.
 */
export function railShare(leg: number, f: number): number {
  const walked = LEG_WEIGHTS.slice(0, leg).reduce((sum, weight) => sum + weight, 0);

  return 1 - (walked + (LEG_WEIGHTS[leg] ?? 0) * f) / (TOTAL_WEIGHT * SUMMIT_ROOM);
}

/** +1: the card at that stop stands on the left, -1 on the right; they alternate up the mountain. */
export const SIDES: number[] = Array.from({ length: CAMP_COUNT }, (_, i) => (i % 2 === 0 ? 1 : -1));
