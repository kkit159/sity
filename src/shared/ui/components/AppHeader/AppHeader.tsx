import { GlobalOutlined, LoginOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Layout, Space } from 'antd';
import type { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { routes } from 'shared/const/routes';
import { type TLanguage, createTranslation, setLanguage } from 'shared/lib/i18n';
import { Theme, setTheme, useTheme } from 'shared/lib/theme';
import logo from 'static/logo.png';

import { en, ru } from './lib/i18n';
import s from './AppHeader.module.scss';

const { Header } = Layout;

const { useTranslation: useAppHeaderTranslation } = createTranslation<typeof ru>({
  ru,
  en,
});

export const AppHeader: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const { t } = useAppHeaderTranslation();
  const currentLanguage = i18n.language as TLanguage;

  const handleThemeToggle = () => {
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
  };

  const handleLanguageToggle = () => {
    const languages: TLanguage[] = ['ru', 'en'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;

    setLanguage(languages[nextIndex]);
  };

  const handleLogin = () => {
    // TODO: Implement login logic
  };

  return (
    <Header className={s.header}>
      <Link to={routes.home} className={s.logo}>
        <img src={logo} alt={'Logo'} className={s.logoImage} />
        <span className={s.appName}>{t('appName')}</span>
      </Link>

      <div className={s.center}>{children}</div>

      <div className={s.actions}>
        <Space>
          <Button
            type={'text'}
            icon={theme === Theme.Light ? <MoonOutlined /> : <SunOutlined />}
            onClick={handleThemeToggle}
            aria-label={'Toggle theme'}
          />
          <Button type={'text'} icon={<GlobalOutlined />} onClick={handleLanguageToggle} aria-label={'Toggle language'}>
            {currentLanguage.toUpperCase()}
          </Button>
          <Button type={'primary'} icon={<LoginOutlined />} onClick={handleLogin}>
            Войти
          </Button>
        </Space>
      </div>
    </Header>
  );
};
