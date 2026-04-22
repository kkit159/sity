/* eslint-disable */
// @ts-nocheck
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import ruRU from 'antd/locale/ru_RU';

import { LanguageProvider } from '@/app/providers/LanguageProvider';
import { useThemeStore } from '@/app/providers/ThemeProvider';
import { MainLayout } from '@/widgets/Layout';

import '@/app/styles/index.scss';
import '@/shared/lib/i18next/init';
import '@/shared/api/client';

import { MainPage } from '@/pages/MainPage/ui/MainPage';
import { QueuePage } from '@/pages/QueuePage/ui/QueuePage';
import { PagerPage } from '@/pages/PagerPage/ui/PagerPage';
import { PricingPage } from '@/pages/PricingPage/ui/PricingPage';

import { ProtectedRoute } from '@/app/AppRouter/ui/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage/ui/DashboardPage';
import { BusinessPointsPage } from '@/pages/BusinessPointsPage/ui/BusinessPointsPage';

const App = () => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#44607A',
          fontFamily: "'Martel', serif",
          borderRadius: 12,
          colorText: isDark ? '#F9FAFB' : '#11273B',
          colorTextSecondary: isDark ? '#9CA3AF' : '#6B7280',
          colorBgBase: isDark ? '#202326' : '#F9FAFB',
          colorBgLayout: isDark ? '#202326' : '#F9FAFB',
          colorBgContainer: isDark ? '#2C3843' : '#FFFFFF',
          colorBorder: isDark ? '#4B5563' : '#E5E7EB',
        },
        components: {
          Button: {
            controlHeight: 48,
            fontWeight: 600,
            borderRadius: 10,
            fontFamily: "'Roboto Mono', monospace",
            boxShadow: 'none',
            primaryShadow: 'none',
          },
          Typography: { fontFamily: "'Roboto Mono', monospace" },
          Tabs: { fontFamily: "'Roboto Mono', monospace", titleFontSize: 18 },
          Input: { fontFamily: "'Martel', serif" },
        },
      }}
    >
      <MainLayout>
        <Routes>
          {/* Публичные роуты (Лендинги) */}
          <Route path="/" element={<MainPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/pager" element={<PagerPage />} />
          <Route path="/price" element={<PricingPage />} />

          {/* Публичный доступ к странице бизнес-точек */}
          <Route path="/business-points" element={<BusinessPointsPage />} />

          {/* ПРИВАТНЫЕ РОУТЫ (Личный кабинет) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);