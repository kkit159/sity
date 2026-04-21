import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Header } from './Header';
import { Footer } from './Footer';

const { Content } = AntLayout;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header />
      {/* Убрали padding: '24px 0', поставили жесткий 0 */}
      <Content style={{ padding: 0, margin: 0 }}>
        {children}
      </Content>
      <Footer />
    </AntLayout>
  );
};