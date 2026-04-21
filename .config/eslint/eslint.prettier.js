import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { config } from 'typescript-eslint';

export default config({
  files: ['**/*.{js,jsx,ts,tsx,mts,cts,mjs,cjs, scss, css}'],
  extends: [prettierConfig],
  plugins: { prettier: prettierPlugin },
  rules: { 'prettier/prettier': 'error' },
});
