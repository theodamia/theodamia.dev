/** The About section, in the order it reads: where I come from, the lead years, and what I am doing now. */
export const ABOUT_PARAGRAPHS: string[] = [
  'Frontend engineer, ten years in, mostly at startups. I work across the stack: React and TypeScript up front, Node.js, GraphQL and databases behind. I take a feature from the schema to the screen.',
  "I work closely with Product, Design and UX, from the first sketch to release. At Geekbot I led the frontend team for four years: I built its design system, set the team's coding and review standards, made AI tools part of the daily workflow and mentored the engineers who joined.",
  'Now I am hands-on again at DeepSea.ai, where I set the frontend architecture: a Turborepo monorepo, the move off Create React App, a design system and the standards around them, with releases going out all the while. I ask what we are solving before how, and I write code that stays easy to change.',
];

/** One line of the fact list beside the About text. */
export type Fact = { label: string; value: string };

/** Ordered by what a reader wants first: the job now, then where, then how long, then the rest. */
export const FACTS: Fact[] = [
  { label: 'Currently', value: 'Senior Frontend Software Engineer at DeepSea.ai' },
  { label: 'Based in', value: 'Thessaloniki, Greece. Remote since before it was mandatory.' },
  { label: 'Experience', value: '10 years, 5 roles, 4 teams' },
  { label: 'Languages', value: 'Greek (native), English (fluent)' },
  { label: 'Education', value: 'BSc Computer Science, TEI of Central Macedonia' },
];

export type Opinion = {
  name: string;
  /** How often it holds, 0 ("it depends") to 1 ("every time"). */
  holds: number;
};

/** Ordered by how often each holds, strongest first: the bars read as one falling line down the section. */
export const OPINIONS: Opinion[] = [
  { name: 'Boring code beats clever code', holds: 0.92 },
  { name: 'What we are solving, before how', holds: 0.9 },
  { name: 'A design system beats one-off UI', holds: 0.88 },
  { name: 'AI writes the draft, not the decisions', holds: 0.85 },
  { name: 'Write it twice, then abstract', holds: 0.74 },
  { name: 'Tests where they earn their keep', holds: 0.62 },
];

export type WeekSlice = {
  label: string;
  /** Share of a week in percent. The slices sum to 100. */
  share: number;
  note: string;
};

/** Largest share first, so the legend follows the bar above it. The shares must add up to 100. */
export const WEEK: WeekSlice[] = [
  {
    label: 'Writing code',
    share: 45,
    note: 'Architecture included: it is settled in the editor, not in slides.',
  },
  { label: 'Code review', share: 20, note: 'The cheapest place to catch a bad idea.' },
  {
    label: 'Deciding what to build',
    share: 15,
    note: 'The hardest fifteen percent of every week.',
  },
  { label: 'Mentoring', share: 10, note: 'Compounds better than anything else here.' },
  { label: 'Meetings', share: 10, note: 'Lower than you would think. Guarded carefully.' },
];
