import type { FC } from 'react';

import s from './DefaultHeader.module.scss';
import { AppHeader } from 'shared/ui';

// Содержимое хедера на базе AppHeader
export const DefaultHeader: FC = () => {
  return (
    <AppHeader>
      <div className={s.defaultHeader}>fsdf</div>
    </AppHeader>
  );
};
