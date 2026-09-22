/**
 * TypeScript 6 wants a declaration for a side-effect import that is not code. The stylesheet is handed to the
 * bundler, not to the type system: `app/layout.tsx` imports it only so Tailwind's output reaches the page.
 */
declare module '*.css';
