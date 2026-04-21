import { createTranslation } from 'shared/lib/i18n';

import { en } from './i18n/en';
import { ru } from './i18n/ru';

export const { useTranslation } = createTranslation<typeof ru>({
  ru,
  en,
});
