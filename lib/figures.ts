/** Static content for Figs. 2–7 and the stat row. */

export type Slice = {
  label: string;
  value: number;
  /** The quantity in words — reads after the label in the legend, and alone in the tooltip. */
  detail: string;
  /** One line on what the slice actually means, shown only in the tooltip. */
  note: string;
};

export type Opinion = {
  name: string;
  /** Position on the depends -> every time scale, 0–1. */
  position: number;
};

export type CoffeePhase = {
  phase: string;
  cups: number;
};

export type Language = {
  name: string;
  /** Command of the language, 0–1. */
  level: number;
  note: string;
};

export type Trivium = {
  label: string;
  note: string;
};

export type Stat = {
  value: string;
  label: string;
};

/** Fig. 2 — years per employer. */
export const TENURE: Slice[] = [
  {
    label: 'Geekbot',
    value: 7.9,
    detail: '7.9 yrs',
    note: 'Two roles, one codebase, most of a decade.',
  },
  {
    label: 'Ordereze',
    value: 1,
    detail: '1 yr',
    note: 'A year of React, PostCSS and cleanup passes.',
  },
  {
    label: 'Fedenet',
    value: 0.5,
    detail: '6 mos',
    note: 'The internship that turned localhost into production.',
  },
  {
    label: 'DeepSea.ai',
    value: 0.4,
    detail: 'just started',
    note: 'New team, taller mountain, same boots.',
  },
];

/** Fig. 3 — stances, ordered as drawn. */
export const OPINIONS: Opinion[] = [
  { name: 'Types before cleverness', position: 0.94 },
  { name: 'A design system beats one-off UI', position: 0.88 },
  { name: 'Small PRs, fast reviews', position: 0.9 },
  { name: 'Tests where they earn their keep', position: 0.62 },
  { name: 'WET before DRY — write it twice, then abstract', position: 0.74 },
];

/** Fig. 4 — confidence over the life of a project. */
export const CONFIDENCE_PHASES = ['Start', 'Build', 'Wk 4', 'Ship'];
export const CONFIDENCE_LEVELS = [9, 3, 5, 9.5];

export const COFFEE: CoffeePhase[] = [
  { phase: 'Start', cups: 2 },
  { phase: 'Build', cups: 4 },
  { phase: 'Wk 4', cups: 3 },
  { phase: 'Ship', cups: 2 },
];

export const MAX_COFFEE_CUPS = 4;

/** Fig. 5 — where the week goes. */
export const WEEK_SPLIT: Slice[] = [
  {
    label: 'Writing code',
    value: 35,
    detail: '35%',
    note: 'The part everyone pictures when they hear the job title.',
  },
  {
    label: 'Code review',
    value: 20,
    detail: '20%',
    note: 'The cheapest place to catch a bad idea.',
  },
  {
    label: 'Mentoring',
    value: 20,
    detail: '20%',
    note: 'Compounds better than anything else on this chart.',
  },
  {
    label: 'Deciding what to build',
    value: 15,
    detail: '15%',
    note: 'The hardest fifteen percent of every week.',
  },
  {
    label: 'Meetings',
    value: 10,
    detail: '10%',
    note: 'Lower than you would think. Guarded carefully.',
  },
];

/** Fig. 7 — the margin notes. */
export const LANGUAGES: Language[] = [
  { name: 'Greek', level: 1, note: 'native — the language at home' },
  { name: 'English', level: 0.9, note: 'fluent — work, docs and arguing in PRs' },
];

export const EDUCATION = {
  kicker: "Bachelor's degree",
  subject: 'Computer Science',
  institution: 'Technological Educational Institute of Central Macedonia',
  place: 'Serres, Greece',
  note: 'Where the localhost-only projects happened.',
  aside: 'Cited exactly once since graduating — in this box.',
} as const;

export const TRIVIA: Trivium[] = [
  { label: 'Based in Thessaloniki, Greece', note: 'remote since before it was mandatory' },
  { label: 'Available for a conversation', note: 'replies within a day, usually less' },
  { label: 'References upon request', note: 'the phrase every CV ends with' },
];

export const STATS: Stat[] = [
  { value: '10', label: 'years building software professionally' },
  { value: '5', label: 'roles, from intern to lead and back to building' },
  { value: '2026', label: 'new chapter, new challenge — DeepSea.ai' },
  { value: '∞', label: 'opinions about state management' },
];

export const CONTACT_LINKS = [
  { label: 'theodamia@gmail.com', href: 'mailto:theodamia@gmail.com', external: false },
  { label: 'github.com/theodamia', href: 'https://github.com/theodamia', external: true },
  {
    label: 'linkedin.com/in/theodore-damianidis',
    href: 'https://www.linkedin.com/in/theodore-damianidis-19369714a/',
    external: true,
  },
];
