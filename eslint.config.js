import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
});

export default [
  js.configs.recommended,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('eslint:recommended'),
  {
    ignores: [
      'frontend/.next/',
      'frontend/out/',
      'backend/dist/',
      'node_modules/',
      '**/*.d.ts',
      'frontend/next.config.js',
      'frontend/tailwind.config.js',
      'frontend/postcss.config.mjs',
    ],
  },
  {
    files: ['frontend/**/*.{js,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./frontend/tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2022,
      },
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
    },
  },
  {
    files: ['backend/**/*.{js,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./backend/tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2022,
      },
      ecmaVersion: 2022,
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
    },
  },
]; 