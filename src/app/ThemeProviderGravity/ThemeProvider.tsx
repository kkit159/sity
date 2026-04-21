// eslint-disable-next-line import/order
import { ThemeProvider as GravityThemeProvider } from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import './styles.css';

import { type FC, type PropsWithChildren } from 'react';

import { getThemePropsForProvider, useTheme } from 'shared/lib/theme';

export const ThemeProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { theme, contrast } = useTheme();

  return <GravityThemeProvider {...getThemePropsForProvider(theme, contrast)}>{children}</GravityThemeProvider>;
};
