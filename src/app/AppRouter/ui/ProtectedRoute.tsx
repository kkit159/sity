import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { IS_DEV } from '@/shared/const/env';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Локальная разработка: без логина можно заходить в ЛК (в prod-сборке отключено).
  if (IS_DEV) {
    return <Outlet />;
  }

  // Пока проверяем токен, ничего не рендерим (или можно кинуть спиннер)
  if (isLoading) return null;

  // Если не авторизован — выкидываем на главную
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Если авторизован — пускаем к дочерним роутам
  return <Outlet />;
};