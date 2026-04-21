import { Layout } from 'antd';
import type { FC } from 'react';
import { Outlet, useLocation } from 'react-router';

import { routes } from 'shared/const/routes';
import { DefaultHeader, HomeHeader } from 'widgets';

import s from './AppLayout.module.scss';

const { Footer, Content } = Layout;

export const AppLayout: FC = () => {
  const location = useLocation();

  return (
    <Layout className={s.root}>
      {location.pathname === routes.home ? <HomeHeader /> : <DefaultHeader />}
      <Content className={s.content}>
        <Outlet />
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};
