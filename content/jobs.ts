export type Job = {
  /** Year the stop starts; also its mark on the altimeter. Unique. */
  start: number;
  /** The camp's name: over its camp in the scene, and on its altimeter mark. */
  place: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  /** Tenure in years. It sizes the leg that leaves this camp: the longer you stayed, the longer the walk. */
  years: number;
  /** One or two sentences at the top of the card: what the job was, in plain words. */
  summary: string;
  /** "What I did", in the card's lower panel: two or three short points. */
  highlights: string[];
  /** The company's site. The company name on the card links here. */
  url?: string;
};

/** Where the trail begins. A place, not a job: it has no card, only a signpost in the village. */
export const TRAILHEAD = { label: 'Start', year: 2014 } as const;

/**
 * The climb, oldest first: every stop is a job. The trail itself starts lower, at TRAILHEAD (the student years
 * live under Education on /about). The last entry is the present and feeds the altimeter's "Now" card.
 */
export const JOBS: Job[] = [
  {
    start: 2015,
    place: 'Fedenet',
    company: 'Fedenet',
    role: 'Web Developer Intern',
    period: 'Jul – Dec 2015',
    duration: '6 months',
    years: 0.5,
    summary:
      'Client sites on a proprietary CMS, in JavaScript and PHP, next to senior engineers. Among them Mount Olympus Summits, still up ten years on.',
    highlights: [
      'Built and customized client sites on the company’s own CMS',
      'Tuned performance and made every one work across devices',
    ],
  },
  {
    start: 2016,
    place: 'Ordereze',
    company: 'Ordereze',
    role: 'Junior Frontend Engineer',
    period: 'Jan 2016 – Jan 2017',
    duration: '1 year',
    years: 1,
    summary:
      'My first year of React: new interfaces, design updates and the bugs that came with both.',
    highlights: [
      'Built the design updates as they landed, in React and PostCSS',
      'Fixed what QA found and left the code cleaner than I got it',
    ],
  },
  {
    start: 2018,
    place: 'Geekbot',
    company: 'Geekbot',
    role: 'Frontend Software Engineer',
    period: 'Sep 2018 – Feb 2022',
    duration: '3 years 5 months',
    years: 3.4,
    url: 'https://geekbot.com/',
    summary:
      'Four years on Geekbot’s web app in React and GraphQL, as the whole of its frontend team, shipping a release every few days.',
    highlights: [
      'Built the standup builder, the insights graphs, billing and A/B testing',
      'Kept the GraphQL gateway and went into PHP to finish a feature off',
      'Replaced no standard at all with a UI library and Storybook specs',
    ],
  },
  {
    start: 2022,
    place: 'Geekbot · Lead',
    company: 'Geekbot',
    role: 'Frontend Lead',
    period: 'Mar 2022 – 2026',
    duration: '3 years+',
    years: 4,
    url: 'https://geekbot.com/',
    summary:
      'Leading a frontend team of three on the codebase I had mostly written, used by teams at GitHub, Shopify and GitLab.',
    highlights: [
      'Built the Polls sub-product: the builder, the views and its billing',
      'Ran the board in Asana, reviewed the code, mentored the engineers',
      'Design handovers, written specs and Claude Code rules: less was guessed',
    ],
  },
  {
    start: 2026,
    place: 'DeepSea.ai',
    company: 'DeepSea.ai',
    role: 'Senior Frontend Software Engineer',
    period: 'Mar 2026 – present',
    duration: '7 months',
    years: 0.6,
    url: 'https://www.deepsea.ai/',
    summary:
      'Rebuilding the frontend from its foundations: I set up the Turborepo monorepo and moved its apps onto React 19, Vite and Tailwind.',
    highlights: [
      'Built the shared UI, lint, types and docs packages the other apps use',
      'Designed the typed API layer every app reads the backend through',
      'Set up Claude Code with rules and review steps the team ships with',
    ],
  },
];
