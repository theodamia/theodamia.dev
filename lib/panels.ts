export type PanelKey = 'about' | 'experience' | 'skills' | 'contact';

export type Panel = {
  kicker: string;
  title: string;
  body: string[];
  chips: string[];
};

export const PANEL_KEYS: PanelKey[] = ['about', 'experience', 'skills', 'contact'];

export const PANELS: Record<PanelKey, Panel> = {
  about: {
    kicker: 'Panel 01',
    title: 'About',
    body: [
      'Lead Frontend Engineer with 7+ years building and evolving production web applications — the kind used every day, that cannot be rewritten on a whim.',
      'The trickiest part was never the how. It is the ambiguity: figuring out what to build and making decisions that still hold up as the product grows.',
      'Mentoring is at the heart of what I do — reviewing designs and code, encouraging thoughtful architecture and keeping a culture where questions are welcome.',
    ],
    chips: ['React', 'TypeScript', 'GraphQL', 'Tailwind', 'Thessaloniki, Greece'],
  },
  experience: {
    kicker: 'Panel 02',
    title: 'Experience',
    body: [
      'DeepSea.ai — Senior Frontend Engineer, 2026 to present. Back to building with the lead years in the toolbox.',
      'Geekbot — Frontend Lead, Mar 2022 to 2026. Most of the frontend, the internal UI library, Tailwind and Atomic Design, plus technical direction and team process.',
      'Geekbot — Frontend Engineer, Sep 2018 to Feb 2022. Modern frontend architecture, close work with Product, Design and UX and quality held through review.',
      'Ordereze — Junior Frontend Engineer, 2016. React and PostCSS interfaces, QA partnership, steady cleanup.',
      'Fedenet — Web Developer intern, 2015. JavaScript, PHP and a proprietary CMS.',
    ],
    chips: ['10 years', '4 companies', '1 very long tenure'],
  },
  skills: {
    kicker: 'Panel 03',
    title: 'Skills',
    body: [
      'Core frontend: JavaScript, TypeScript, React, Redux, React Router, Next.js, TanStack Query.',
      'Styling and UI: Tailwind CSS, PostCSS, Shadcn UI, Mantine UI, Material UI, Storybook, BEM, Atomic Design.',
      'Data and APIs: REST, GraphQL, Apollo Client, WebSockets, Node.js, Prisma. Tooling: Git, Vite, Webpack, Vitest, Docker, Sentry.',
      'Leadership: team leadership, mentoring, code reviews, architecture, project management, Scrum.',
    ],
    chips: ['Cursor', 'Claude', 'ChatGPT', 'v0'],
  },
  contact: {
    kicker: 'Panel 04',
    title: 'Contact',
    body: [
      'Always open to a conversation — new opportunities, interesting challenges, or simply exchanging ideas.',
      'theodamia@gmail.com · github.com/theodamia · linkedin.com/in/theodore-damianidis',
    ],
    chips: ['Open to roles', 'Replies within a day'],
  },
};
