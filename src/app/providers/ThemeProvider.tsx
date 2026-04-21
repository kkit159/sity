import React from 'react';

import { appThemeStorage } from 'shared/lib/appThemeStorage';
import { createStore } from 'shared/lib/zustand';

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return appThemeStorage.data.theme;
};

export const useThemeStore = createStore(
  { theme: getInitialTheme() },
  (set) => ({
    toggleTheme: () => {
      set((draft) => {
        const next = draft.theme === 'light' ? 'dark' : 'light';
        draft.theme = next;
        appThemeStorage.save({ theme: next });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', next);
        }
      });
    },
  }),
  'themeUiStore',
);

export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  return { theme, toggleTheme };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
