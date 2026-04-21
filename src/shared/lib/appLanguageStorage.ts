import { APP_NAME } from 'shared/const/env';

import { LocalStorageService } from './LocalStorageService';

export type AppLangType = 'RU' | 'EN';

type AppLanguageState = {
  lang: AppLangType;
};

export const appLanguageStorage = new LocalStorageService<AppLanguageState>({
  version: 1,
  appName: APP_NAME,
  id: 'appLanguage',
  initialState: { lang: 'RU' },
});

if (typeof window !== 'undefined') {
  const legacy = localStorage.getItem('app-lang') ?? localStorage.getItem('app_lang');
  if (legacy === 'EN' || legacy === 'RU') {
    appLanguageStorage.save({ lang: legacy });
    localStorage.removeItem('app-lang');
    localStorage.removeItem('app_lang');
  }
}
