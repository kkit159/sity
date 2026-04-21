import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Пока проверяем токен, ничего не рендерим (или можно кинуть спиннер)
  if (isLoading) return null; 

  // Если не авторизован — выкидываем на главную
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Если авторизован — пускаем к дочерним роутам
  return <Outlet />;
};