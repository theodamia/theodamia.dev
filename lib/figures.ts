/** Static content for Figs. 2–7 and the stat row. */

export type Slice = {
  label: string;
  value: number;
  /** How the slice reads in the hand-written legend. */
  legend: string;
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
  { label: 'Geekbot', value: 7.9, legend: 'Geekbot — 7.9 yrs' },
  { label: 'Ordereze', value: 1, legend: 'Ordereze — 1 yr' },
  { label: 'Fedenet', value: 0.5, legend: 'Fedenet — 6 mos' },
  { label: 'DeepSea.ai', value: 0.4, legend: 'DeepSea.ai — just started' },
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
  { label: 'Writing code', value: 35, legend: 'Writing code — 35%' },
  { label: 'Code review', value: 20, legend: 'Code review — 20%' },
  { label: 'Mentoring', value: 20, legend: 'Mentoring — 20%' },
  { label: 'Deciding what to build', value: 15, legend: 'Deciding what to build — 15%' },
  { label: 'Meetings', value: 10, legend: 'Meetings — 10%' },
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
  { label: 'References on request', note: 'the phrase every CV ends with' },
];

export const STATS: Stat[] = [
  { value: '10', label: 'years building software professionally' },
  { value: '5', label: 'roles, from intern to lead and back to building' },
  { value: '2026', label: 'new chapter, new company — DeepSea.ai' },
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
