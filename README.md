# theodamia.dev

Personal portfolio website for Theodore Damianidis - Senior Frontend Software Engineer. "The Ascent": ten years of frontend work drawn as one long, scroll-driven climb up a mountain, with a second, quiet page for about, skills and contact.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with `class-variance-authority`
- **Scene**: hand-written SVG + CSS, generated deterministically — no WebGL, no chart or animation library
- **Icons**: [Lucide](https://lucide.dev/) for the dock (plus one hand-drawn ice axe) and for skills without a logo, [Simple Icons](https://simpleicons.org/) for brand logos in Skills and the links
- **Type**: Bricolage Grotesque and Instrument Sans via `next/font`
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Code Quality**: ESLint (Next + React Hooks + full jsx-a11y + type-aware TypeScript rules) and Prettier

## ✨ Features

- 🏔️ The CV as a climb: a sticky parallax mountain, one camp and one card per job, a summit that is never reached
- 🧭 An altimeter with clickable year marks and a floating icon dock that works across both pages
- 📖 A quiet `/about` page: about, how I work, skills and contact
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
│   ├── about/page.tsx     # "/about" — about, how I work, skills, contact
│   └── globals.css        # Design tokens (@theme) and scene layer CSS
├── components/             # React components
│   ├── scene/             # The SVG stage, the still summit strip, shared layers
│   ├── icons/             # Inline SVG icons
│   ├── ui/                # Small primitives (button, pill, text)
│   ├── climb.tsx          # Client shell of the main page
│   ├── job-card.tsx       # One stop on the climb
│   ├── altimeter.tsx      # Year rail, needle and the "Now" card
│   └── dock.tsx           # The only navigation
├── hooks/                 # use-climb-scroll (scroll controller), use-reduced-motion
├── content/               # Every word on the site
│   ├── jobs.ts            # Career timeline (source of truth)
│   ├── skill-groups.ts    # Skills by category
│   ├── about.ts           # About copy, facts, opinions, week split
│   └── site.ts            # Name, title, links
├── scene/                 # The mountain as numbers (world.ts, scenery.ts)
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
- `pnpm check` - Run both ESLint and Prettier checks
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage report

## 🎨 Styling

This project uses Tailwind CSS with the following configuration:

- **Design System**: "Alpine" — cool slate interface, hairline borders, one orange accent; green lives only in the scene
- **Tokens**: every colour, radius, shadow and easing is declared in `@theme` in `app/globals.css`
- **Day and night**: a toggle at the end of the dock. The night spreads from it as a soft circle (a view transition), the sun turns into the moon and the stars come out as it passes. First visits follow the system setting

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
