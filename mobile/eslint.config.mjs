import { defineConfig } from 'eslint/config';
import expo from 'eslint-config-expo/flat.js';
import base from '../eslint.base.mjs';

const cleanBase = base.map((config) => {
  const newConfig = { ...config };

  // ❌ remove plugins (clean way)
  if (newConfig.plugins) {
    delete newConfig.plugins;
  }

  // ❌ remove TS parser
  if (newConfig.languageOptions?.parser) {
    delete newConfig.languageOptions.parser;
  }

  // ❌ remove TS rules
  if (newConfig.rules) {
    newConfig.rules = Object.fromEntries(
      Object.entries(newConfig.rules).filter(([key]) => !key.startsWith('@typescript-eslint/')),
    );
  }

  return newConfig;
});

export default defineConfig([
  ...cleanBase, // shared rules

  ...expo, // expo / react-native rules

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Expo / RN specific overrides
      'react/react-in-jsx-scope': 'off', // not needed in RN
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  {
    ignores: ['dist/**', 'node_modules/**', '.expo/**'],
  },
]);
