import { Bars, Xmark } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';
import { type FC, useCallback, useState } from 'react';
import { Link } from 'react-router';

import { routes } from 'shared/const/routes';
import imageLogo from 'static/logo.png';

import { useTranslation } from '../lib';

import s from './Header.module.scss';

const handleAuthorizeClick = () => {
  // TODO: Implement authorization
};

export const Header: FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onClick = useCallback(() => {
    handleAuthorizeClick();
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((previous) => {
      return !previous;
    });
  }, []);

  const handleNavLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link to={routes.home} className={s.logo}>
          <img src={imageLogo} width={40} />
          <span className={s.logoText}>{t('queueOnline')}</span>
        </Link>

        <nav className={s.nav}>
          <a href={'#how-it-works'} className={s.navLink}>
            {t('howItWorks')}
          </a>
          <a href={'#advantages'} className={s.navLink}>
            {t('advantages')}
          </a>
        </nav>

        <Button view={'action'} size={'l'} onClick={onClick} className={s.authorizeButton}>
          {t('authorize')}
        </Button>

        <button type={'button'} className={s.burgerButton} onClick={handleMenuToggle} aria-label={'Menu'}>
          <Icon data={isMenuOpen ? Xmark : Bars} size={24} />
        </button>
      </div>

      {isMenuOpen ? (
        <div className={s.mobileMenu}>
          <nav className={s.mobileNav}>
            <a href={'#how-it-works'} className={s.mobileNavLink} onClick={handleNavLinkClick}>
              {t('howItWorks')}
            </a>
            <a href={'#advantages'} className={s.mobileNavLink} onClick={handleNavLinkClick}>
              {t('advantages')}
            </a>
            <Button view={'action'} size={'l'} onClick={onClick} className={s.mobileAuthorizeButton}>
              {t('authorize')}
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
};
