import { configs } from 'eslint-plugin-sonarjs';
import { config } from 'typescript-eslint';

export default config({
  files: ['**/*.{js,jsx,ts,tsx,mts,cts,mjs,cjs}'],
  extends: [configs.recommended],
  rules: {
    'sonarjs/todo-tag': 'warn',
    'sonarjs/cognitive-complexity': 'off',
    'sonarjs/no-commented-code': 'off',
  },
});
