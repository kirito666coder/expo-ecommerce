import base from "../eslint.base.mjs"; 

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default defineConfig([
  ...base, 

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'node_modules/**',
    'next-env.d.ts'
  ]),

  {
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },

  ...nextVitals,
  ...nextTs,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    plugins: {
      prettier: prettierPlugin,
      'react-hooks': reactHooks,
      '@typescript-eslint': tsPlugin
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      'prettier/prettier': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],

      '@typescript-eslint/no-explicit-any': 'warn',

      'react/jsx-boolean-value': ['error', 'never'],
      'react/self-closing-comp': 'error',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      '@next/next/no-img-element': 'off'
    }
  },

  prettierConfig
]);