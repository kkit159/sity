/* eslint-disable import/no-named-as-default-member */
import i18next from 'i18next';

export * from './createTranslation';

export type TLanguage = 'ru' | 'en' | 'sr';

export const setLanguage = (lang: TLanguage) => {
  if (i18next.language !== lang) {
    void i18next.changeLanguage(lang);
  }
};

export const getLanguage = () => {
  return i18next.language as TLanguage;
};
