import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat';
import base from "../eslint.base.mjs";

export default defineConfig([
  ...base, // shared rules

  ...expoConfig, // expo / react-native rules

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Expo / RN specific overrides
      'react/react-in-jsx-scope': 'off', // not needed in RN
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },

  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.expo/**'
    ]
  }
]);