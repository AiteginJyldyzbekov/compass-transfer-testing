import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'src/generated/*',
      'node_modules/**',
      '.yarn/**',
      '.pnp/**',
      '.next/**',
      'apps/*/.next/**',
      'apps/compass-admin/.next/**',
      'apps/compass-driver/.next/**',
      'apps/compass-terminal/.next/**',
      'dist/**',
      'build/**',
      'out/**',
      '**/*.min.js',
      '**/*.bundle.js',
      'coverage/**',
      '.cache/**',
      '.eslintcache',
      'docs/api-documentation/**',
      'docs/**/*.json',
      'docker/**',
      '*.log',
      '.env*',
      // Дополнительные паттерны из .eslintignore
      '.vercel/**',
      '.turbo/**',
      'next-env.d.ts',
      'next.config.js',
      'next.config.ts',
      'next.config.mjs',
      'tailwind.config.js',
      'tailwind.config.ts',
      'postcss.config.js',
      'postcss.config.ts',
      '**/*.json',
      '**/*.lock',
      '**/*.md',
      '**/*.yml',
      '**/*.yaml',
    ],
  },
  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],

      // Unused imports optimization
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Import rules with FSD architecture support
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never', // Убираем обязательные пустые строки
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@app/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@shared/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@entities/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@features/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@widgets/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@pages/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-unresolved': 'off',
      'import/no-duplicates': ['error', { considerQueryString: true }],
      'import/no-self-import': 'error',
      'import/no-cycle': 'error',
      'import/prefer-default-export': 'off',
      'import/named': 'off',

      // Bundle size optimization rules
      'import/no-namespace': 'warn', // Предотвращает import * as

      // Code quality rules (non-formatting)
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',

      // React specific rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-unescaped-entities': 'error',
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-pascal-case': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Next.js specific rules
      '@next/next/no-img-element': 'error',
      '@next/next/no-page-custom-font': 'error',
      '@next/next/no-html-link-for-pages': [
        'error',
        [
          'apps/compass-admin/src/app',
          'apps/compass-terminal/src/app',
          'apps/compass-driver/src/app',
        ],
      ],

      // Organization rules (minimal, non-conflicting with Prettier)
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: '*', next: 'class' },
        { blankLine: 'always', prev: 'class', next: '*' },
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'any', prev: 'export', next: 'export' },
      ],

      // Best practices
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-param-reassign': ['error', { props: false }],
      'no-return-assign': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': 'error',
      radix: 'error',
      yoda: 'error',

      // Variables
      'no-catch-shadow': 'off',
      'no-delete-var': 'error',
      'no-label-var': 'error',
      'no-restricted-globals': 'error',
      'no-shadow': 'off',
      'no-shadow-restricted-names': 'error',
      'no-undef': 'off',
      'no-undef-init': 'error',
      'no-undefined': 'off',
      'no-use-before-define': 'off',
    },
  },
  prettierConfig, // Must be last to disable conflicting rules
];

export default eslintConfig;
