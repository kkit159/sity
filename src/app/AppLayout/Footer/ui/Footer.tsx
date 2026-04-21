import { Footer as FooterGravity } from '@gravity-ui/navigation';
import { type FC } from 'react';

import { APP_DEPLOY_FROM_BRANCH, APP_VERSION } from 'shared/const/env';

import { useTranslation } from '../lib';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <FooterGravity
      withDivider
      view={'normal'}
      copyright={`© ${CURRENT_YEAR} Photon. ${t('version', { version: APP_DEPLOY_FROM_BRANCH || APP_VERSION })}`}
    />
  );
};
