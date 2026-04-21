import React from 'react';
import classNames from 'classnames';
import { UpOutlined } from '@ant-design/icons';
import { useTheme } from '@/app/providers/ThemeProvider';
// Подключаем переводы
import { useTranslation } from './Footer.i18next';
import styles from './Footer.module.scss';
import logoClor from '@/shared/assets/logo_clor.png';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer} data-theme={theme}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <img src={logoClor} alt="LOGO" className={styles.logo} onClick={scrollToTop} />
          <nav className={styles.nav}>
            <a href="#main" onClick={(e) => handleScroll(e, 'hero')}>{t('nav.main')}</a>
            <a href="#queue" onClick={(e) => handleScroll(e, 'process')}>{t('nav.queue')}</a>
            <a href="#pager" onClick={(e) => handleScroll(e, 'process')}>{t('nav.pager')}</a>
            <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')}>{t('nav.price')}</a>
          </nav>
          <button type="button" className={styles.scrollTopBtn} onClick={scrollToTop} aria-label="Up">
            <UpOutlined />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottomGrid}>
          <div className={styles.column}>
            <a href="/policy">{t('links.policy')}</a>
            <a href="/agreement">{t('links.agreement')}</a>
            <a href="/consent">{t('links.consent')}</a>
            <a href="/cookie">{t('links.cookie')}</a>
          </div>

          <div className={styles.column}>
            <span>INN 856262652661626</span>
            <span>OGRN 856262652661626</span>
            <span>{t('address')}</span>
          </div>

          <div className={classNames(styles.column, styles.copyright)}>
            <span>{t('copyright')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};