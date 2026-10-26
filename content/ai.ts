import type { LogItem } from '@/components/log-entry';

/** A practice or a limit: a short name, then one or two plain sentences. */
export type AiPoint = { name: string; text: string };

/**
 * /ai: how I set AI up for software teams, told as evidence, not opinion. The title is the stance /about's opinions
 * already hold ("AI writes the draft, not the decisions"); that line on /about links here.
 */
export const AI_PAGE = {
  eyebrow: 'Working with AI',
  title: 'AI writes the draft, not the decisions',
  lede: 'I set AI up for software teams: the rules it works by, the reviews it takes part in and the skills the team calls on, kept current as the tools change.',
} as const;

/** What I set up, wherever I go. Practices, not products: the tools change every few months, these do not. */
export const AI_PRACTICES: AiPoint[] = [
  {
    name: 'Early, not blind',
    text: 'No new tool reaches the team before I have read its docs and got to know it myself.',
  },
  {
    name: 'Rules the tools read',
    text: 'Standards written once, as Markdown templates for frontend in general and for React, so every engineer’s assistant works to the same conventions. Kept current as the team changes, with the conflicts between them settled.',
  },
  {
    name: 'Strict tools, readable output',
    text: 'Lint and types set strict, and what the AI writes held to what a person can read: comments that say why, JSDoc, plain names. Not the fewest tokens. A simple, boring codebase is the one that gets maintained.',
  },
  {
    name: 'Reviews it joins, not replaces',
    text: 'AI reads every pull request first; people review what it cannot judge.',
  },
  {
    name: 'Skills the team shares',
    text: 'Repeated work, written down once as skills anyone on the team can run.',
  },
  {
    name: 'Designs and docs as artifacts',
    text: 'Specs, designs and docs shared as pages the team can open and agree on before the code is written.',
  },
];

/** Where I did it, newest first, in /cv's log language: the date line, what it was, where, one sentence, the points. */
export const AI_PLACES: LogItem[] = [
  {
    id: 'ai-deepsea',
    when: 'Mar 2026 – present',
    title: 'AI enablement for the frontend guild',
    place: 'DeepSea.ai',
    url: 'https://www.deepsea.ai/',
    summary:
      'Rebuilding the frontend from its foundations, I wrote the Claude Code standards the guild works by.',
    points: [
      'Templated rules files for the guild and its frontend chapter: one general, one for React',
      'Skills the team runs for repeated work, and AI review on every pull request',
      'Designs and docs shared as artifacts, agreed before the code',
      'Kept the standards current and settled conflicts between them as we changed',
      'Now: automating the pipeline around artifacts, pull requests and releases',
    ],
  },
  {
    id: 'ai-geekbot',
    when: 'Mar 2022 – 2026 · as Frontend Lead',
    title: 'Early adopters, from the first ChatGPT to Claude Code',
    place: 'Geekbot',
    url: 'https://geekbot.com/',
    summary:
      'A team of three that took up each tool as it became worth it, and changed how it worked around them.',
    points: [
      'Automated code review on every pull request',
      'Docs drafted with AI, checked by the people who own them',
      'Early skills for the work we kept repeating',
      'From chat, to AI in the editor, to an agent working in the repo',
    ],
  },
  {
    id: 'ai-this-site',
    when: '2026',
    title: 'Designed, built and painted with AI',
    place: 'This site',
    summary: 'I set the direction and made every decision; the tools drafted.',
    points: [
      'The code written with Claude Code, under a rules file that grew with every decision',
      'Strict lint and types, and JSDoc that says why: code written for people to read',
      'Every design mocked as an artifact and agreed before any code was written',
      'Every painting made by an image model from a written brief, processed by scripts and checked at full size, by day and by night',
      'Every prompt and try kept beside the art, so any painting can be made again',
    ],
  },
];

/** What stays with people. The title's stance, made concrete. */
export const AI_LIMITS: AiPoint[] = [
  { name: 'What we build, and why', text: 'The tools are good at how.' },
  { name: 'The review', text: 'AI reads every change first; a person approves it.' },
  {
    name: 'How it feels to use',
    text: 'A tool can check a contrast ratio, not whether a page feels right.',
  },
  { name: 'The standards themselves', text: 'The tools follow the rules; the team writes them.' },
];

/** The closing card's question: the reader this page is for. */
export const AI_CONTACT_TITLE = 'Bringing AI into a software team?';
