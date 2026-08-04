export type SkillGroup = {
  name: string;
  /** Depth, self-rated 0–10. */
  score: number;
  items: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'Core Frontend',
    score: 8,
    items: [
      'JavaScript',
      'TypeScript',
      'React',
      'Redux',
      'React Router',
      'Next.js',
      'TanStack Query',
    ],
  },
  {
    name: 'Styling & UI',
    score: 9,
    items: [
      'Tailwind CSS',
      'PostCSS',
      'Shadcn UI',
      'Mantine UI',
      'Material UI (MUI)',
      'Storybook',
      'BEM',
      'Atomic Design',
    ],
  },
  {
    name: 'Data & APIs',
    score: 7,
    items: ['REST APIs', 'GraphQL', 'Apollo Client', 'WebSockets', 'Node.js', 'Prisma'],
  },
  {
    name: 'Tools & Workflow',
    score: 8,
    items: ['Git', 'Vite', 'Webpack', 'Vitest', 'Docker', 'Sentry', 'Asana', 'Zeplin'],
  },
  {
    name: 'AI Tooling',
    score: 5,
    items: ['Cursor', 'Claude', 'ChatGPT', 'v0'],
  },
  {
    name: 'Leadership & Process',
    score: 7,
    items: [
      'Team Leadership',
      'Mentoring',
      'Code Reviews',
      'Architecture',
      'Project Management',
      'Scrum',
    ],
  },
];

export const MAX_SKILL_SCORE = 10;
