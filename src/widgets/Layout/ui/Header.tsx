import React, { useState, useEffect } from 'react';
import { Layout, Button, Flex, Switch, Drawer, Dropdown, ConfigProvider, Spin, Modal } from 'antd';
import {
  UserOutlined, MoonOutlined, SunOutlined, MenuOutlined,
  GlobalOutlined, LoadingOutlined, LogoutOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import i18next from 'i18next';

import { useTheme } from '@/app/providers/ThemeProvider';
import { useLang } from '@/app/providers/LanguageProvider';
import logoImg from '@/shared/assets/logo.png';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

// ИМПОРТИРУЕМ СЛОВАРИ НАПРЯМУЮ (вырезали сломанный useTranslation)
import { ru } from './Header.i18next/ru';
import { en } from './Header.i18next/en';

import headerLightBg from '@/shared/assets/header_light.png';
import headerDarkBg from '@/shared/assets/header_dark.png';
import { AuthModal } from '@/widgets/AuthModal/ui/AuthModal';

import settingIcon from '@/shared/assets/setting.png';
import notificationIcon from '@/shared/assets/notification.png';

// ИМПОРТ МОДУЛЬНЫХ СТИЛЕЙ
import styles from './Header.module.scss';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { toggleTheme, theme } = useTheme();
  const { lang, setLang } = useLang();
  const navigate = useNavigate();

  // === ЖЕЛЕЗОБЕТОННЫЙ ПАРСЕР ПЕРЕВОДОВ ===
  // Умеет читать вложенные ключи типа 'nav.main' или 'logout.title'
  const dict = lang === 'EN' ? en : ru;
  const t = (path: string) => {
    return path.split('.').reduce((obj: any, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), dict) || path;
  };

  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const isLight = theme === 'light';

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const handleLangChange = (newLang: 'RU' | 'EN', i18nCode: string) => {
    setLang(newLang);
    void i18next.changeLanguage(i18nCode);
  };

  const renderProfileName = () => {
    if (isLoading && !user) return <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: '#FFF' }} spin />} />;
    if (!user) return t('profile');
    if (!user.first_name && !user.last_name) return user.email?.split('@')[0] || t('profile');
    const last = user.last_name ? user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1) : '';
    const firstI = user.first_name ? `${user.first_name.charAt(0).toUpperCase()}.` : '';
    const midI = user.middle_name ? `${user.middle_name.charAt(0).toUpperCase()}.` : '';
    return `${last} ${firstI}${midI}`.trim();
  };

  const handleLogout = () => {
    Modal.confirm({
      title: t('logout.title'),
      icon: <ExclamationCircleOutlined />,
      content: t('logout.content'),
      okText: t('logout.ok'),
      cancelText: t('logout.cancel'),
      okType: 'danger',
      centered: true,
      onOk: async () => {
        await logout();
        window.location.href = '/';
      },
    });
  };

  const navLinks = [
    { label: t('nav.main'), path: '/' },
    { label: t('nav.businessPoints'), path: '/business-points' },
    { label: t('nav.queue'), path: '/queue' },
    { label: t('nav.pager'), path: '/pager' },
    { label: t('nav.price'), path: '/price' },
  ];

  return (
    <ConfigProvider theme={{
      components: {
        Dropdown: { paddingBlock: 8 },
        Menu: {
          colorBgContainer: 'var(--header-menu-bg)',
          colorText: 'var(--header-menu-text)',
          itemHoverColor: 'var(--header-menu-hover)',
          borderRadiusLG: 16
        }
      }
    }}>
      <AntHeader 
        className={styles.header}
        style={{ backgroundImage: `url(${isLight ? headerLightBg : headerDarkBg})` }}
      >
        <div className={styles.container}>
          <Flex align="center" gap={48}>

            <div onClick={() => navigate('/')} className={styles.logo}>
              <img src={logoImg} alt="LOGO" />
            </div>

            <div className="desktop-only">
              <Flex gap={24}>
                {navLinks.map(link => (
                  <Button 
                    key={link.path} 
                    type="text" 
                    className={styles.navLink} 
                    onClick={() => navigate(link.path)}
                  >
                    {link.label}
                  </Button>
                ))}
              </Flex>
            </div>
          </Flex>

          <Flex gap={24} align="center">
            <div className="desktop-only">
              <Flex gap={24} align="center">

                <Flex gap={16} align="center">
                  {/* Переключатель темы */}
                  <div 
                    className={`glass-pill ${styles.themeToggle} ${isLight ? styles.isLight : styles.isDark}`} 
                    onClick={toggleTheme}
                  >
                    <div className={isLight ? styles.themeIconLeft : styles.themeIconRight}>
                      {isLight ? <SunOutlined /> : <MoonOutlined />}
                    </div>
                    <div className={styles.themeKnob} />
                  </div>

                  {/* Переключатель языка */}
                  <Dropdown menu={{ items: [{ key: 'RU', label: 'Русский', onClick: () => handleLangChange('RU', 'ru') }, { key: 'EN', label: 'English', onClick: () => handleLangChange('EN', 'en') }] }} trigger={['click']}>
                    <div className={`glass-pill ${styles.langToggle}`}>
                      <GlobalOutlined /> <span>{lang}</span>
                    </div>
                  </Dropdown>
                </Flex>

                {isAuthenticated ? (
                  <Flex gap={16} align="center">
                    <div
                      className={`glass-pill ${styles.profileBtn}`}
                      onClick={() => navigate('/dashboard')}
                    >
                      <UserOutlined style={{ marginRight: 8 }} /> {renderProfileName()}
                    </div>

                    <img src={notificationIcon} alt="notifications" className={styles.actionIcon} />
                    <img src={settingIcon} alt="settings" className={styles.actionIcon} />
                    
                    <LogoutOutlined 
                      onClick={handleLogout} 
                      className={styles.logoutIcon}
                      title={t('logout.btn')}
                    />
                  </Flex>
                ) : (
                  <Button onClick={() => setIsAuthOpen(true)} className={`glass-pill ${styles.loginBtn}`}>
                    <UserOutlined /> {t('login_pc')}
                  </Button>
                )}
              </Flex>
            </div>
            
            <Button 
              className="mobile-only" 
              type="text" 
              icon={<MenuOutlined className={styles.mobileMenuBtn} />} 
              onClick={() => setMobileMenuOpen(true)} 
            />
          </Flex>
        </div>

        <Drawer
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          title={<img src={logoImg} style={{ height: 32 }} alt="LOGO" />}
          size="large"
          style={{ background: 'var(--bg-page)' }}
          styles={{ header: { borderBottom: '1px solid var(--border-color)' } }}
        >
          <Flex vertical gap={32}>
            {navLinks.map(link => (
              <a 
                key={link.path} 
                href="#" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate(link.path); }} 
                className={styles.drawerLink}
              >
                {link.label}
              </a>
            ))}
            <Flex vertical gap={20}>
              <Flex justify="space-between" align="center">
                <span style={{ color: 'var(--text-main)' }}>{t('lang_label')}</span>
                <Button onClick={() => handleLangChange(lang === 'RU' ? 'EN' : 'RU', lang === 'RU' ? 'en' : 'ru')}>{lang}</Button>
              </Flex>
              <Flex justify="space-between" align="center">
                <span style={{ color: 'var(--text-main)' }}>{t('dark')}</span>
                <Switch checked={theme === 'dark'} onChange={toggleTheme} />
              </Flex>
            </Flex>
            
            {isAuthenticated ? (
              <Button danger block size="large" className={styles.drawerAuthBtn} onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
                {t('logout.btn')}
              </Button>
            ) : (
              <Button type="primary" block size="large" className={`${styles.drawerAuthBtn} ${styles.drawerPrimaryBtn}`} onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}>
                {t('auth_mobile')}
              </Button>
            )}
          </Flex>
        </Drawer>
      </AntHeader>
      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </ConfigProvider>
  );
}