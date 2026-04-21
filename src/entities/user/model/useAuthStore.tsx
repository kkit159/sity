import { create } from 'zustand';

import { authLogoutCreate } from '@/shared/api/generated';

export interface UserProfile {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  role?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setAuth: (accessToken: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
}

// Безопасная проверка для SSR
const getInitialAuth = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('accessToken');
  }
  return false;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: getInitialAuth(),
  isLoading: false,

  checkAuth: async () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    set({ isLoading: true });
    
    try {
      const response = await fetch('/api/user/me/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        set({ user: data, isAuthenticated: true });
      } else if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error('Ошибка при загрузке профиля пользователя:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setAuth: (accessToken: string, refreshToken?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    set({ isAuthenticated: true });
    // Сразу запрашиваем данные пользователя
    get().checkAuth();
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      const refresh =
        localStorage.getItem('refreshToken') ||
        localStorage.getItem('refresh_token') ||
        localStorage.getItem('refresh');

      if (refresh) {
        try {
          await authLogoutCreate({
            body: { refresh },
          });
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }

      const keysToRemove = [
        'accessToken',
        'refreshToken',
        'access_token',
        'refresh_token',
        'access',
        'refresh',
        'token',
        'user-storage',
      ];
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }

    set({ isAuthenticated: false, user: null });
  },
}));