import { Loader as Component, type LoaderProps } from '@gravity-ui/uikit';
import { clsx } from 'clsx';
import { type FC } from 'react';

import s from './Loader.module.scss';

export type ISpinProps = {
  withParanja?: boolean;
} & LoaderProps;

export const Loader: FC<ISpinProps> = (props) => {
  const { withParanja, className, ...restProps } = props;

  return (
    <>
      {withParanja ? <div className={s.paranja} /> : null}
      <Component {...restProps} className={clsx(className, s.spin)} />
    </>
  );
};
