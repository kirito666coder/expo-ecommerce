import { defineConfig } from 'eslint/config';
import expo from 'eslint-config-expo/flat.js';
import base from '../eslint.base.mjs';

const baseWithoutPlugins = base.map((config) => {
  if (!config.plugins) return config;
  const { _plugins, ...rest } = config;
  return rest;
});

export default defineConfig([
  ...baseWithoutPlugins, // shared rules

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
