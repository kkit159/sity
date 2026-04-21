import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { APP_NAME } from 'shared/const/env';

import { LocalStorageService } from './LocalStorageService';
import { type TLanguage } from './i18next';

// eslint-disable-next-line import/no-named-as-default-member
void i18next.use(initReactI18next).init({
  resources: {},
  lng: 'ru',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
export const languageStore = new LocalStorageService<{ language: TLanguage }>({
  version: 1,
  appName: APP_NAME,
  id: 'languageStore',
  initialState: { language: 'ru' },
});

export {
  createTranslation,
  getLanguage,
  setLanguage,
  type TPluralKeys,
  type TUseTranslationResult,
  type TLanguage,
} from './i18next';

export { default as i18next } from 'i18next';
