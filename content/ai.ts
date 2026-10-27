import { jobFrom } from '@/content/jobs';
import type { LogItem } from '@/content/log';

/** The jobs /ai tells again, by the year each started: their dates, names and links are read from content/jobs.ts. */
const DEEPSEA = jobFrom(2026);
const GEEKBOT_LEAD = jobFrom(2022);

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
    text: 'Standards written once, as a Markdown template for each concern: security, implementation, project structure, maintainability, the language, testing, scalability and performance. Every engineer’s assistant works to the same conventions, kept current as the team changes, the conflicts between them settled.',
  },
  {
    name: 'Safe by rule',
    text: 'The rules are strict on security: the tools read no secrets and commit nothing risky.',
  },
  {
    name: 'Strict tools, readable output',
    text: 'Lint and types set strict and what the AI writes held to what a person can read: comments that say why, JSDoc, plain names. Not the fewest tokens. A simple, boring codebase is the one that gets maintained.',
  },
  {
    name: 'Nothing done until it passes',
    text: 'Tests, lint and formatting must pass on every change, the AI’s included. QA agents check each release on their own.',
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
    when: DEEPSEA.period,
    title: 'AI enablement for the frontend guild',
    place: DEEPSEA.company,
    url: DEEPSEA.url,
    summary:
      'I wrote the Claude Code standards the guild’s three engineers work by. Releases got faster and migrations easier.',
    points: [
      'Templated rules files for the guild and its frontend chapter, one per concern: security, structure, testing, performance and more',
      'In a month: Turborepo set up and a legacy app moved into a new app shell on current React, Vite and Tailwind',
      'Tests, lint and formatting on every change; QA agents check each release on their own',
      'Skills the team runs for repeated work and AI review on every pull request',
      'Now: exploring agents in the pipeline, from pull request to release',
    ],
  },
  {
    id: 'ai-geekbot',
    when: `${GEEKBOT_LEAD.period} · as ${GEEKBOT_LEAD.role}`,
    title: 'Early adopters, from the first ChatGPT to Claude Code',
    place: GEEKBOT_LEAD.company,
    url: GEEKBOT_LEAD.url,
    summary:
      'A team of three that took up each tool as it became worth it and changed how it worked around them.',
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
      'Strict lint and types and JSDoc that says why: code written for people to read',
      'Every design mocked as an artifact and agreed before any code was written',
      'Every painting made by an image model from a written brief, processed by scripts and checked at full size, by day and by night',
      'Every prompt and try kept beside the art, so any painting can be made again',
    ],
  },
];

/** What stays with people. The title's stance, made concrete. */
export const AI_LIMITS: AiPoint[] = [
  { name: 'What we build and why', text: 'The tools are good at how.' },
  { name: 'The review', text: 'AI reads every change first; a person approves it.' },
  {
    name: 'How it feels to use',
    text: 'A tool can check a contrast ratio, not whether a page feels right.',
  },
  { name: 'The standards themselves', text: 'The tools follow the rules; the team writes them.' },
];

/** The closing card's question: the reader this page is for. */
export const AI_CONTACT_TITLE = 'Bringing AI into a software team?';
