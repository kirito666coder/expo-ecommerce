import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.next/**',
      '**/.next/**',
      'out/**',
      'build/**',
    ],
  },
  // Node.js globals for backend
  {
    files: ['backend/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'writable',
        global: 'readonly',
      },
    },
  },
  {
    files: ['admin/**/*.{js,ts,tsx,jsx}', 'mobile/**/*.{js,ts,tsx,jsx}'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        File: 'readonly',
        alert: 'readonly',
        FormData: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        MutationObserver: 'readonly',
        HTMLAnchorElement: 'readonly',
        MouseEvent: 'readonly',

        URL: 'readonly',
      },
    },
  },
{
  files: ['**/*.config.cjs', '**/*.cjs'],
  languageOptions: {
    sourceType: 'commonjs',
    globals: {
      module:     'readonly',
      require:    'readonly',
      exports:    'writable',
      __dirname:  'readonly',
      __filename: 'readonly',
      process:    'readonly',
      console:    'readonly',
    },
  },
},
];
