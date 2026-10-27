/**
 * One entry of a log, as /cv's field log and /ai's places print it (components/log-entry.tsx): a date line, what it
 * was, where, one sentence and its points. It lives with the content because content is written in it; the
 * component only draws it.
 */
export type LogItem = {
  /** The id its heading takes, so the entry is named by it. */
  id: string;
  /** The date line, as it reads: "Sep 2018 – Feb 2022 · 3 years 5 months". */
  when: string;
  title: string;
  place: string;
  /** The place's site; the place's name links there when it has one. */
  url?: string;
  summary: string;
  points: string[];
};
