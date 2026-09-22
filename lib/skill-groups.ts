import {
  Accessibility,
  Atom,
  Blocks,
  Gauge,
  GitPullRequest,
  GraduationCap,
  Handshake,
  Layers,
  SwatchBook,
  Users,
  type LucideIcon,
} from 'lucide-react';
import {
  siApollographql,
  siBem,
  siClaude,
  siCursor,
  siDocker,
  siFigma,
  siGraphql,
  siModelcontextprotocol,
  siNextdotjs,
  siNodedotjs,
  siPrisma,
  siReact,
  siRedux,
  siSentry,
  siSocketdotio,
  siStorybook,
  siTailwindcss,
  siTanstack,
  siTurborepo,
  siTypescript,
  siV0,
  siVite,
  siVitest,
  type SimpleIcon,
} from 'simple-icons';

/** A brand carries its logo (Simple Icons); a practice, which has none, a Lucide symbol. */
export type Skill = { name: string } & ({ brand: SimpleIcon } | { icon: LucideIcon });

export type SkillGroup = {
  name: string;
  items: Skill[];
};

/**
 * Skills: a category name, then its skills, strongest first. No ratings, no per-job filter. Curated, not complete:
 * every pill is one worth ten minutes in an interview, so the basics every frontend engineer has are left out.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'Frontend',
    items: [
      { name: 'TypeScript', brand: siTypescript },
      { name: 'React', brand: siReact },
      { name: 'Next.js', brand: siNextdotjs },
      { name: 'Redux', brand: siRedux },
      { name: 'TanStack Query', brand: siTanstack },
    ],
  },
  {
    name: 'Design systems',
    items: [
      { name: 'Design Systems', icon: SwatchBook },
      { name: 'Tailwind CSS', brand: siTailwindcss },
      { name: 'Atomic Design', icon: Atom },
      { name: 'BEM', brand: siBem },
      { name: 'Storybook', brand: siStorybook },
      // Shadcn UI, MUI and Mantine UI in one pill
      { name: 'Various UI Libs', icon: Blocks },
      { name: 'Figma', brand: siFigma },
    ],
  },
  {
    name: 'Across the stack',
    items: [
      { name: 'GraphQL', brand: siGraphql },
      { name: 'Apollo Client', brand: siApollographql },
      { name: 'Node.js', brand: siNodedotjs },
      { name: 'Prisma', brand: siPrisma },
      { name: 'Socket.io', brand: siSocketdotio },
    ],
  },
  {
    name: 'Quality and tooling',
    items: [
      { name: 'Accessibility', icon: Accessibility },
      { name: 'Performance', icon: Gauge },
      { name: 'Vitest', brand: siVitest },
      { name: 'Sentry', brand: siSentry },
      { name: 'Vite', brand: siVite },
      { name: 'Turborepo', brand: siTurborepo },
      { name: 'Docker', brand: siDocker },
    ],
  },
  {
    name: 'AI in the workflow',
    items: [
      { name: 'Claude Code', brand: siClaude },
      { name: 'Cursor', brand: siCursor },
      { name: 'v0', brand: siV0 },
      { name: 'MCP', brand: siModelcontextprotocol },
    ],
  },
  {
    name: 'Leadership',
    items: [
      { name: 'Frontend Architecture', icon: Layers },
      { name: 'Code Review', icon: GitPullRequest },
      { name: 'Mentoring', icon: GraduationCap },
      { name: 'Cross-team Delivery', icon: Users },
      { name: 'Stakeholder Management', icon: Handshake },
    ],
  },
];
