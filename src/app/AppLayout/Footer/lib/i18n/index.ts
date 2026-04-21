import { createTranslation } from 'shared/lib/i18n';

import { en } from './en';
import { ru } from './ru';

export const { useTranslation } = createTranslation<typeof ru>({
  ru,
  en,
});
