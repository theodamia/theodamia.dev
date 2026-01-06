# theodamia.dev

Personal portfolio website for Theodore Damianidis - Frontend Engineer showcasing experience, skills and projects.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Anime.js](https://animejs.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Code Quality**: ESLint + Prettier

## ✨ Features

- 🎨 Modern, responsive design with dark mode support
- ⚡ Optimized performance with Next.js App Router
- 🎭 Smooth scroll-triggered animations
- 📱 Fully responsive mobile-first design
- ♿ Accessible components and semantic HTML
- 🎯 Type-safe with TypeScript
- 🧹 Clean code with ESLint and Prettier

## 📁 Project Structure

```
theodamia.dev/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── about.tsx          # About section
│   ├── contact.tsx        # Contact section
│   ├── experience.tsx     # Experience timeline
│   ├── hero.tsx           # Hero section
│   ├── navigation.tsx     # Navigation bar
│   └── skills.tsx         # Skills showcase
├── lib/                   # Utility functions
└── public/                # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/theodamia/theodamia.dev.git
cd theodamia.dev
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run check` - Run both ESLint and Prettier checks
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## 🎨 Styling

This project uses Tailwind CSS with the following configuration:

- **Design System**: shadcn/ui (New York style)
- **Base Color**: Neutral
- **CSS Variables**: Enabled for theming
- **Dark Mode**: Supported via CSS variables

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
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
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
- `animejs` - Animation library
- `lucide-react` - Icon library
- `@radix-ui/*` - Accessible UI primitives
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
