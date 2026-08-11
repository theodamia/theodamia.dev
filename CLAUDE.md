# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Theodore Damianidis (theodamia.dev). Single-page Next.js app, "A career, hand-graphed": the CV rendered as hand-drawn napkin figures. A fixed header toggles between two views — **The climb** (`climb-view.tsx`, seven figures on graph paper plus a role drawer) and **The words** (`words-view.tsx`, the same CV as prose in a four-panel kiosk). Light mode only; there is no dark variant.

## Commands

- `npm run dev` - Start dev server (localhost:3000)
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run format` - Prettier format
- `npm run check` - Lint + format check combined
- `npm run test` - Vitest in watch mode
- `npm run test:run` - Run tests once
- `npx vitest run components/__tests__/site-header.test.tsx` - Run a single test file

## Architecture

- **Framework**: Next.js 16 App Router, React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with shadcn/ui (New York style, Radix UI primitives). All design tokens live in `@theme` in `app/globals.css` — colours, the four font families, shadows, easing. No `:root`/`.dark` pair; the design is light-only.
- **Type**: Instrument Serif (display), DM Sans (UI/body), JetBrains Mono (labels/meta), Patrick Hand (hand-drawn labels and captions), all via `next/font/google` in `app/layout.tsx`
- **Charts**: `chart.xkcd`, loaded client-side through `lib/use-xkcd-chart.ts`. The library forces its own aspect ratio and renders its legend as a nested `<svg>`, so every chart runs a tidy-up pass from `lib/xkcd-dom.ts`
- **Animations**: CSS transitions. `lib/use-reveal.ts` adds the reveal class on intersection; content already on screen is never hidden
- **Testing**: Vitest + React Testing Library + jsdom
- **Pre-commit**: Husky runs lint-staged (ESLint fix + Prettier on TS/TSX/JS/JSX, Prettier on JSON/MD/CSS)

### Directory Layout

- `app/` - Single route: `layout.tsx` (root layout + metadata), `page.tsx` (home), `globals.css`
- `components/` - Views (`portfolio.tsx`, `climb-view.tsx`, `words-view.tsx`) and one file per figure (`tenure-figure.tsx`, `opinions-figure.tsx`, …). `figure-card.tsx` holds the shared card shell, label and caption
- `components/ui/` - shadcn/ui primitives (button, badge, card). Add new ones via `npx shadcn@latest add <component>`
- `components/__tests__/` - Component tests colocated in `__tests__` directories
- `lib/utils.ts` - `cn()` helper (clsx + tailwind-merge)
- `lib/constants.ts` - Palette, climb geometry, timings, breakpoints
- `lib/milestones.ts`, `lib/skill-groups.ts`, `lib/panels.ts`, `lib/figures.ts` - All page content. Nothing is fetched; edit the CV here, not in JSX
- `lib/climb-geometry.ts` - Maps year/level to the measured plot box and builds the mountains behind Fig. 1
- `types/chart-xkcd.d.ts` - Hand-written types for `chart.xkcd`, which ships none
- `test/setup.ts` - Global test setup and mocks (Next.js router, browser APIs)

### Key Conventions

- Path alias: `@/*` maps to project root (e.g., `@/components/climb-view`, `@/lib/utils`)
- Components use named exports (`export function Component()`), pages use default exports
- Server Components by default; use `'use client'` only when necessary
- File names: kebab-case. Component names: PascalCase
- Prettier: single quotes, JSX single quotes, semicolons, 2-space indent, 100 char line width, trailing commas (es5)
- Use `cn()` for conditional/merged Tailwind classes
- Use `cva` (class-variance-authority) for component variants
- Avoid nested ternaries; extract to variables or early returns
- Extract magic numbers into named constants
- Add a token in `@theme` rather than hardcoding an `oklch()` value in JSX
- Fig. 1's overlays are positioned from the **measured** bounding box of the plotted line, never from assumed percentages — keep the measure/ResizeObserver/retry path intact if you touch `climb-chart.tsx`
- Below 640px Fig. 1 swaps to `climb-ladder.tsx`. The chart must not mount on phones, so the split is a JS media query (`lib/use-media-query.ts`), not `display: none`
