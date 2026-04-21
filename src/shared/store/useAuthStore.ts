import { create } from 'zustand';

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
  // ПРАВКА: Добавили третий опциональный аргумент userData
  setAuth: (accessToken: string, refreshToken?: string, userData?: any) => void;
  logout: () => void;
}

// Безопасная инициализация
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
      } else {
        // Если 401 или другая ошибка — чистим токены
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error('Ошибка при загрузке профиля пользователя:', error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  setAuth: (accessToken: string, refreshToken?: string, userData?: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    // Синхронно ставим true и сразу записываем юзера, если он пришел
    set({
      isAuthenticated: true,
      user: userData || get().user // Если передали юзера - сохраняем
    });

    // Если юзера не передали, дергаем бэкенд
    if (!userData) {
      get().checkAuth();
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    set({ isAuthenticated: false, user: null });
  }
}));