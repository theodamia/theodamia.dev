import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import stylistic from '@stylistic/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * `eslint-config-next` already brings the plugins and registers them, so the blocks below add rules to them
 * rather than the plugins' own flat configs, which would try to register the same plugin twice.
 */

/* The type-aware rules, flattened: typescript-eslint's own config would re-register @typescript-eslint. */
const typeChecked = Object.assign(
  {},
  ...tseslint.configs.recommendedTypeChecked.map(config => config.rules ?? {})
);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  /*
   * Accessibility. Next turns on six jsx-a11y rules as warnings; the recommended set is the rest of them, as
   * errors: an anchor that goes nowhere, a click handler with no keyboard way in, a label tied to no field.
   */
  { rules: jsxA11y.flatConfigs.recommended.rules },

  /*
   * Type-aware linting: these rules read the types, which is how they catch a promise nobody awaits or a value
   * that is `any` in disguise. Only TypeScript files: the config files are not in the program.
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: typeChecked,
  },

  /* Matchers hand back `any` and unbound methods by design, so those rules only get in the way in tests. */
  {
    files: ['**/__tests__/**', 'test/**'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  /*
   * Breathing room. Prettier decides everything except where the blank lines go, so this is the one piece of
   * layout left to say out loud: a return stands apart from the work above it, and so does a branch or a loop.
   */
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
      ],
    },
  },

  // Disable ESLint rules that conflict with Prettier
  prettierConfig,
  // Add Prettier plugin and rules
  {
    plugins: {
      prettier,
    },
    rules: {
      /* one source for formatting: the rule reads .prettierrc itself, so eslint --fix and prettier agree */
      'prettier/prettier': 'error',
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      /* Next switches this off; every external link here sets rel itself, and the rule keeps it that way */
      'react/jsx-no-target-blank': 'error',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'coverage/**']),
]);

export default eslintConfig;
