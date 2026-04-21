import type { FC } from 'react';

import { routes } from 'shared/const/routes';

import s from './HomeHeader.module.scss';
import { AppHeader } from 'shared/ui/components/AppHeader';

// Содержимое хедера на базе AppHeader
export const HomeHeader: FC = () => {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const element = document.getElementById(anchor);
    if (element) {
      const headerOffset = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AppHeader>
      <nav className={s.homeHeader}>
        <a href={`${routes.home}#home`} onClick={(e) => handleAnchorClick(e, 'home')} className={s.link}>
          Главная
        </a>
        <a
          href={`${routes.home}#how-it-works`}
          onClick={(e) => handleAnchorClick(e, 'how-it-works')}
          className={s.link}
        >
          Как это работает
        </a>
        <a href={`${routes.home}#queue-types`} onClick={(e) => handleAnchorClick(e, 'queue-types')} className={s.link}>
          Типы очередей
        </a>
        <a href={`${routes.home}#contacts`} onClick={(e) => handleAnchorClick(e, 'contacts')} className={s.link}>
          Контакты
        </a>
      </nav>
    </AppHeader>
  );
};
