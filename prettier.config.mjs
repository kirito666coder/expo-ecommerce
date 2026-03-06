/** @type {import("prettier").Config} */
export default {
  // Code style
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',

  // JSX / React
  jsxSingleQuote: false,
  bracketSameLine: false,

  // Markdown / prose
  proseWrap: 'preserve',

  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],
};
