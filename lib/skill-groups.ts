export type SkillGroup = {
  name: string;
  /** Depth, self-rated 0–10. */
  score: number;
  items: string[];
};

export const MAX_SKILL_SCORE = 10;

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'Core Frontend',
    score: 9,
    items: [
      'TypeScript',
      'React',
      'Redux',
      'React Router',
      'Next.js',
      'TanStack Query',
      'Web Vitals',
      'Performance Optimization',
      'Accessibility',
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
      'MUI',
      'Storybook',
      'BEM',
      'Atomic Design',
      'Responsive Design',
    ],
  },
  {
    name: 'Data & APIs',
    score: 7,
    items: ['REST APIs', 'GraphQL', 'Apollo Client', 'WebSockets', 'JWT', 'Node.js', 'Prisma'],
  },
  {
    name: 'Tools & Workflow',
    score: 8,
    items: [
      'ESLint/Prettier',
      'Git',
      'Vite',
      'Turborepo',
      'Figma',
      'Vitest',
      'Webpack',
      'Docker',
      'Sentry',
      'Asana',
    ],
  },
  {
    name: 'AI Tooling',
    score: 8,
    items: ['Claude Code', 'Cursor', 'ChatGPT', 'v0', 'MCP'],
  },
  {
    name: 'Leadership & Process',
    score: 8,
    items: [
      'System Design',
      'Stakeholder Management',
      'Component Architecture',
      'Cross-team Delivery',
      'Mentoring',
    ],
  },
];
