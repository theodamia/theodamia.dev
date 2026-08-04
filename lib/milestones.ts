export type Milestone = {
  year: number;
  /** Seniority level on the climb, 1 (student) to 5.6 (today). */
  level: number;
  title: string;
  /** The short version, shown in the hover tooltip. */
  text: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  /** The long version, shown in the drawer. */
  full: string;
  tags: string[];
  url?: string;
  host?: string;
};

export type RoleBand = {
  level: number;
  label: string;
  note: string;
};

export const CLIMB_YEARS = [
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
];

/** Monotonically non-decreasing on purpose — the line never dips. */
export const CLIMB_LEVELS = [1, 2, 3, 3, 3.2, 3.6, 4, 4, 5, 5.1, 5.2, 5.4, 5.6];

export const MILESTONES: Milestone[] = [
  {
    year: 2014,
    level: 1,
    title: 'Student',
    text: 'Computer science and side projects that only ever ran on localhost. Learned to build; had no idea yet what shipping costs.',
    company: 'Before the first paycheck',
    role: 'Student',
    period: 'until 2015',
    duration: 'the study years',
    full: 'Studying computer science and building side projects that never left localhost. This is where the habits started: reading other people’s code, breaking things on purpose and learning that the interesting problems are rarely the ones in the assignment.',
    tags: ['JavaScript', 'PHP', 'curiosity'],
  },
  {
    year: 2015,
    level: 2,
    title: 'Intern — Fedenet',
    text: 'Six months of JavaScript, PHP and a proprietary CMS. First taste of real users and real deadlines.',
    company: 'Fedenet',
    role: 'Web Developer Internship',
    period: 'Jul 2015 — Dec 2015',
    duration: '6 mos',
    full: 'Built and customized websites using JavaScript, PHP and a proprietary CMS. Collaborated with senior engineers to implement dynamic features while optimizing website performance and responsiveness across different devices.',
    tags: ['JavaScript', 'PHP', 'CMS', 'Performance'],
  },
  {
    year: 2016,
    level: 3,
    title: 'Developer — Ordereze',
    text: 'React and PostCSS interfaces, hunting bugs with QA, constant cleanup.',
    company: 'Ordereze',
    role: 'Junior Frontend Engineer',
    period: 'Jan 2016 — Jan 2017',
    duration: '1 yr',
    full: 'Built and updated user interfaces using React and PostCSS, focusing on creating maintainable and performant code. Worked closely with QA teams to identify and resolve bugs, conducting regular code cleanup to improve overall project quality.',
    tags: ['React', 'PostCSS', 'QA', 'Refactoring'],
  },
  {
    year: 2020,
    level: 4,
    title: 'Senior — Geekbot',
    text: 'Owning features end to end: the internal UI library, Tailwind and Atomic Design.',
    company: 'Geekbot',
    role: 'Frontend Engineer',
    period: 'Sep 2018 — Feb 2022',
    duration: '3 yrs 5 mos',
    url: 'https://geekbot.com/',
    host: 'geekbot.com',
    full: 'Developed and optimized the company’s web application using modern frontend architecture and workflows. Collaborated closely with Product, Design and UX teams to deliver user-focused features while ensuring code quality through comprehensive debugging and code reviews.',
    tags: ['React', 'Redux', 'GraphQL', 'Code review'],
  },
  {
    year: 2022,
    level: 5,
    title: 'Frontend Lead — Geekbot',
    text: 'Technical direction, mentoring and team process.',
    company: 'Geekbot',
    role: 'Frontend Lead',
    period: 'Mar 2022 — 2026',
    duration: '3 yrs+',
    url: 'https://geekbot.com/',
    host: 'geekbot.com',
    full: 'Built and maintained the majority of the frontend over the years. Created the company’s internal UI library, introduced Tailwind and Atomic Design patterns and kept the codebase sustainable as the product evolved. Mentored engineers and helped shape both technical direction and the team processes that keep work moving forward.',
    tags: ['Leadership', 'UI library', 'Tailwind', 'Atomic Design', 'Mentoring'],
  },
  {
    year: 2026,
    level: 5.6,
    title: 'Senior — DeepSea.ai',
    text: 'A new team, a taller mountain, the same boots.',
    company: 'DeepSea.ai',
    role: 'Senior Frontend Engineer',
    period: '2026 — present',
    duration: 'just started',
    url: 'https://www.deepsea.ai/',
    host: 'deepsea.ai',
    full: 'Back to building, carrying everything the lead years taught me: an eye for architecture that survives its second year, the habit of asking what we are actually solving and a low tolerance for code nobody can change. Same boots, taller mountain.',
    tags: ['React', 'TypeScript', 'Architecture'],
  },
];

/** The dashed rules behind the climb. Lower two align right, upper two align left. */
export const ROLE_BANDS: RoleBand[] = [
  { level: 2, label: 'Intern', note: 'first paid code' },
  { level: 3, label: 'Developer', note: 'shipping features' },
  { level: 4, label: 'Senior', note: 'owning systems' },
  { level: 5, label: 'Lead', note: 'owning architecture' },
];

/** Header shown when the drawer is opened in all-steps mode. */
export const ALL_STEPS_HEADER = {
  period: '2015 — present',
  company: 'The whole climb',
  role: 'Every step, in order',
} as const;

const BAND_BY_LEVEL: { min: number; label: string }[] = [
  { min: 5.5, label: 'Senior' },
  { min: 5, label: 'Lead' },
  { min: 4, label: 'Senior' },
  { min: 3, label: 'Developer' },
  { min: 2, label: 'Intern' },
];

export function bandForLevel(level: number): string {
  return BAND_BY_LEVEL.find(band => level >= band.min)?.label ?? 'Student';
}
