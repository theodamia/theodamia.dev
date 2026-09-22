export type Job = {
  /** Year the stop starts; also its mark on the altimeter. Unique. */
  start: number;
  /** Seniority, 2 (intern) upwards. It picks the fallback tent; camps are placed by tenure (`years`). */
  level: number;
  /** Label painted next to the tent in the scene. */
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
    level: 2,
    place: 'Fedenet',
    company: 'Fedenet',
    role: 'Web Developer Intern',
    period: 'Jul – Dec 2015',
    duration: '6 months',
    years: 0.5,
    summary:
      'Client websites on a proprietary CMS, built in JavaScript and PHP next to senior engineers. The first taste of real users and real deadlines.',
    highlights: [
      'Built and customized client websites on a proprietary CMS',
      'Added dynamic features in JavaScript and PHP with senior engineers',
      'Tuned performance and made every site work across devices',
    ],
  },
  {
    start: 2016,
    level: 3,
    place: 'Ordereze',
    company: 'Ordereze',
    role: 'Junior Frontend Engineer',
    period: 'Jan 2016 – Jan 2017',
    duration: '1 year',
    years: 1,
    summary:
      'My first year of React: building and reworking interfaces with PostCSS, fixing what QA found and leaving the code cleaner than I found it.',
    highlights: [
      'Built and updated React interfaces styled with PostCSS',
      'Worked with QA to find and fix bugs before they shipped',
      'Made regular cleanup part of the job, not a side project',
    ],
  },
  {
    start: 2018,
    level: 4,
    place: 'Geekbot',
    company: 'Geekbot',
    role: 'Frontend Software Engineer',
    period: 'Sep 2018 – Feb 2022',
    duration: '3 years 5 months',
    years: 3.4,
    url: 'https://geekbot.com/',
    summary:
      'Building Geekbot’s web app in React, Redux and GraphQL, and shipping features together with Product, Design and UX.',
    highlights: [
      'Developed and optimized the web app’s frontend architecture',
      'Shipped user-facing features with Product, Design and UX',
      'Held the bar through debugging and thorough code review',
    ],
  },
  {
    start: 2022,
    level: 5,
    place: 'Geekbot · Lead',
    company: 'Geekbot',
    role: 'Frontend Lead',
    period: 'Mar 2022 – 2026',
    duration: '3 years+',
    years: 4,
    url: 'https://geekbot.com/',
    summary:
      'Leading the frontend I had built most of: an internal UI library, Tailwind and Atomic Design, and engineers who grew along with it.',
    highlights: [
      'Created the internal UI library; introduced Tailwind and Atomic Design',
      'Kept a growing codebase easy to change as the product evolved',
      'Mentored engineers and shaped technical direction and team process',
    ],
  },
  {
    start: 2026,
    level: 5.6,
    place: 'DeepSea.ai',
    company: 'DeepSea.ai',
    role: 'Senior Frontend Software Engineer',
    period: 'Mar 2026 – present',
    duration: '7 months',
    years: 0.6,
    url: 'https://www.deepsea.ai/',
    summary:
      'Rebuilding the frontend from its foundations, shipping all the way: the architecture, the stack, the design system and the standards.',
    highlights: [
      'CRA to React 19, Vite, Tailwind and Vitest, in a Turborepo',
      'Architected the design system: Storybook, icon library, Material',
      'Set the standards: lint, formatting and AI in the daily work',
    ],
  },
];
