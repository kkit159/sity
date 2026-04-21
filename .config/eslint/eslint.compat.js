import compatPlugin from 'eslint-plugin-compat';
import { config } from 'typescript-eslint';

export default config({
  files: ['**/*.{js,jsx,ts,tsx,mts,cts,mjs,cjs}'],
  extends: [compatPlugin.configs['flat/recommended']],
});

