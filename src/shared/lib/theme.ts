import { APP_NAME } from 'shared/const/env';

import { LocalStorageService } from './LocalStorageService';

const themeLightConfig = {
  token: {
    colorBgBase: '#f9fafb',
    colorTextBase: '#1a2a3f',
    colorPrimary: '#1a2a3f',
    colorInfo: '#1a2a3f',
  },
  components: {
    Layout: {
      headerColor: 'rgb(26,42,63)',
      headerBg: 'rgb(249,250,251)',
      bodyBg: 'rgb(249,250,251)',
      footerBg: 'rgb(249,250,251)',
    },
  },
};

const themeDarkConfig = {
  token: {
    // Seed Token
    colorPrimary: '#ffffff',
    borderRadius: 10,

    // Alias Token
    colorBgContainer: '#f6ffed',
  },
};

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export const getThemeConfig = (theme: Theme) => {
  return theme === Theme.Light ? themeLightConfig : themeDarkConfig;
};

type TThemeState = {
  theme: Theme;
};

const themeStore = new LocalStorageService<TThemeState>({
  version: 1,
  appName: APP_NAME,
  id: 'themeStore',
  initialState: { theme: Theme.Light },
});

export const useTheme = () => {
  const { theme } = themeStore.useWatch();

  return { theme };
};

export const setTheme = (theme: Theme) => {
  themeStore.save((state) => {
    state.theme = theme;
  });
};
