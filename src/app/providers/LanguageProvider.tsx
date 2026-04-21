import React, { createContext, useContext, useEffect } from 'react';
import i18next from 'i18next';

import { appLanguageStorage, type AppLangType } from 'shared/lib/appLanguageStorage';

export type LangType = AppLangType;

interface LanguageContextType {
  lang: LangType;
  setLang: (lang: LangType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = appLanguageStorage.useWatch();

  useEffect(() => {
    const code = lang === 'EN' ? 'en' : 'ru';
    void i18next.changeLanguage(code);
  }, [lang]);

  const setLang = (val: LangType) => {
    appLanguageStorage.save({ lang: val });
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
