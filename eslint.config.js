// eslint-disable-next-line import/extensions
import config from './.config/eslint/index.js';

export default [
  {
    ignores: [
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
      'vite.config*.js',
      'eslint.config.js',
      '.config/**/*',
    ],
  },
  ...config,
  {
    rules: {},
  },
];
