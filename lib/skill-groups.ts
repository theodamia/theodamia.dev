export type SkillGroup = {
  name: string;
  items: string[];
};

/** Skills: a category name, then its skills. No ratings, no per-job filter. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'Core frontend',
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
    name: 'Styling and UI',
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
    name: 'Data and APIs',
    items: ['REST APIs', 'GraphQL', 'Apollo Client', 'WebSockets', 'JWT', 'Node.js', 'Prisma'],
  },
  {
    name: 'Tools and workflow',
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
    name: 'AI tooling',
    items: ['Claude Code', 'Cursor', 'ChatGPT', 'v0', 'MCP'],
  },
  {
    name: 'Leadership and process',
    items: [
      'System Design',
      'Stakeholder Management',
      'Component Architecture',
      'Cross-team Delivery',
      'Mentoring',
    ],
  },
];
