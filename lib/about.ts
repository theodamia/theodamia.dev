export const ABOUT_PARAGRAPHS: string[] = [
  'Frontend engineer, ten years in, mostly at startups. I work across the stack: React and TypeScript up front, Node.js, GraphQL and databases behind. I take a feature from the schema to the screen.',
  "I work closely with Product, Design and UX, from the first sketch to release. At Geekbot I led the frontend team for four years: I built its design system, set the team's coding and review standards, made AI tools part of the daily workflow and mentored the engineers who joined.",
  'Now I am hands-on again as a Senior Frontend Engineer at DeepSea.ai. I ask what we are solving before how, and I write code that stays easy to change.',
];

export type Fact = { label: string; value: string };

export const FACTS: Fact[] = [
  { label: 'Currently', value: 'Senior Frontend Engineer at DeepSea.ai' },
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

export const OPINIONS: Opinion[] = [
  { name: 'Types before cleverness', holds: 0.94 },
  { name: 'A design system beats one-off UI', holds: 0.88 },
  { name: 'Small PRs, fast reviews', holds: 0.9 },
  { name: 'Tests where they earn their keep', holds: 0.62 },
  { name: 'Write it twice, then abstract', holds: 0.74 },
];

export type WeekSlice = {
  label: string;
  /** Share of a week in percent. The slices sum to 100. */
  share: number;
  note: string;
};

export const WEEK: WeekSlice[] = [
  {
    label: 'Writing code',
    share: 35,
    note: 'The part everyone pictures when they hear the job title.',
  },
  { label: 'Code review', share: 20, note: 'The cheapest place to catch a bad idea.' },
  { label: 'Mentoring', share: 20, note: 'Compounds better than anything else here.' },
  {
    label: 'Deciding what to build',
    share: 15,
    note: 'The hardest fifteen percent of every week.',
  },
  { label: 'Meetings', share: 10, note: 'Lower than you would think. Guarded carefully.' },
];
