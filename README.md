# theodamia.dev

Personal portfolio website for Theodore Damianidis - Senior Software Engineer. "The Ascent": ten years of software engineering drawn as one long, scroll-driven climb up a painted mountain, the same years read plainly as a field log on `/cv`, and a page about what's ahead on `/about`.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with `class-variance-authority`
- **Scene**: painted flats (WebP) moved by a small camera in plain TypeScript and CSS transforms — no WebGL, no canvas, no animation library
- **Icons**: [Lucide](https://lucide.dev/) for the dock (plus one hand-drawn ice axe) and for skills without a logo, [Simple Icons](https://simpleicons.org/) for brand logos in Skills and the links
- **Type**: Bricolage Grotesque and Instrument Sans via `next/font`
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Code Quality**: ESLint (Next + React Hooks + full jsx-a11y + type-aware TypeScript rules) and Prettier

## ✨ Features

- 🏔️ The CV as a climb: the camera walks into a painted mountain, one camp and one card per job, a summit that is never reached
- 📓 `/cv`: every role on one page, newest first, with the year turning in the valley behind it; it prints as a CV
- 🌅 `/about`: about, how I work, skills and contact, ending on the next range at sunrise
- 🌙 Day and night: every painting has a moonlit twin, and the night spreads from the switch as a soft circle
- 🧭 An altimeter with clickable year marks and a floating icon dock that works across all three pages
- ⚡ Scroll frames that only write transforms, so the climb stays smooth
- 📱 Responsive down to 320px, with touch-specific dock behaviour
- ♿ Semantic HTML, keyboard-reachable everything, reduced-motion support
- 🎯 Type-safe with TypeScript
- 🧹 Clean code with ESLint and Prettier

## 📁 Project Structure

```
theodamia.dev/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout: fonts, metadata, the dock
│   ├── page.tsx           # "/" — hero and the climb
│   ├── cv/page.tsx        # "/cv" — the field log of every role
│   ├── about/page.tsx     # "/about" — about, how I work, skills, contact
│   └── globals.css        # Design tokens (@theme) and the scene's CSS
├── components/             # React components
│   ├── scene/             # The climb's stage, the sky, /cv's year and /about's dawn
│   ├── icons/             # Inline SVG icons
│   ├── ui/                # Small primitives (button, text)
│   ├── climb.tsx          # Client shell of the main page
│   ├── job-card.tsx       # One stop on the climb
│   ├── altimeter.tsx      # Year rail, needle and the "Now" card
│   └── dock.tsx           # The only navigation
├── hooks/                 # use-climb-scroll (scroll controller), use-theme, use-in-view, use-reduced-motion
├── content/               # Every word on the site
│   ├── jobs.ts            # Career timeline (source of truth)
│   ├── skill-groups.ts    # Skills by category
│   ├── about.ts           # About copy, facts, opinions, week split
│   └── site.ts            # Name, title, links
├── scene/                 # The climb as numbers: the camera, the paintings' manifests, the sky
├── scripts/               # The art pipelines: raw paintings in, WebP and manifests out
├── art/                   # Prompts and records of every painting (the raw files stay local)
├── lib/                   # Where our code meets someone else's
├── utils/                 # Our own helpers, one per file
├── constants/             # Values shared across modules
└── public/                # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/theodamia/theodamia.dev.git
cd theodamia.dev
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm check` - Types, ESLint, Prettier and the tests
- `pnpm flats`, `pnpm seasons`, `pnpm about` - Rebuild the paintings of `/`, `/cv` and `/about` from `art/`
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage report

## 🎨 Styling

This project uses Tailwind CSS with the following configuration:

- **Design System**: "Alpine" — cool slate interface, hairline borders, one orange accent; green lives only in the scene
- **Tokens**: every colour, radius, shadow and easing is declared in `@theme` in `app/globals.css`
- **Day and night**: a toggle at the end of the dock. The night spreads from it as a soft circle (a view transition), the sun turns into the moon and the stars come out as it passes. First visits follow the system setting
- **The scene**: green belongs to the paintings, never to the interface

## 🔧 Code Quality

- **ESLint**: Configured with Next.js and Prettier integration
- **Prettier**: Code formatting with Tailwind plugin
- **TypeScript**: Strict mode enabled
- **Path Aliases**: `@/*` for cleaner imports

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for testing.

### Testing Framework

- **Vitest**: Fast unit test framework with Vite integration
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for tests

### Test Structure

Tests are located in:

- `__tests__/` directories next to components
- `.test.ts` or `.test.tsx` files
- `test/setup.ts` for global test configuration and mocks

### Writing Tests

Tests follow React Testing Library best practices:

- Test user behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`, `getByText`)
- Use `userEvent` for user interactions
- Mock external dependencies (Next.js router, browser APIs)

### Running Tests

```bash
pnpm test          # Run tests in watch mode
pnpm test:run      # Run tests once
pnpm test:ui       # Run tests with UI
pnpm test:coverage # Generate coverage report
```

### Test Coverage

Focus on meaningful coverage:

- Critical user flows
- Complex logic and edge cases
- Component interactions
- Utility functions

See `test/README.md` for detailed testing guidelines.

## 📦 Key Dependencies

### Core

- `next` - React framework
- `react` & `react-dom` - UI library
- `tailwindcss` - Utility-first CSS
- `class-variance-authority` - Component variants
- `clsx` & `tailwind-merge` - Class name utilities

### Testing

- `vitest` - Unit test framework
- `@testing-library/react` - React component testing
- `@testing-library/jest-dom` - DOM matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for tests

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/theodamia/theodamia.dev)

Or check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Theodore Damianidis**

- Website: [theodamia.dev](https://theodamia.dev)
- GitHub: [@theodamia](https://github.com/theodamia)

---
