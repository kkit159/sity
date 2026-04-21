import {
  authLoginCreate,
  authVerifyCreate,
  registerCreate,
} from '@/shared/api/generated';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { createStore } from 'shared/lib/zustand';

export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
};

export type AuthLoginResult =
  | { kind: 'tokens'; accessToken: string; refreshToken?: string; raw: unknown }
  | { kind: 'two_factor'; message: string; raw: unknown };

export type AuthRegisterResult = {
  sessionId: string;
  email: string;
  phone: string;
};

function parseRegisterError(errData: unknown, fallback: string): string {
  const e = errData as Record<string, unknown> & { detail?: string; message?: string };
  if (e?.detail && typeof e.detail === 'string') return e.detail;
  if (e?.message && typeof e.message === 'string') return e.message;
  if (e && typeof e === 'object') {
    const firstKey = Object.keys(e)[0];
    const val = firstKey ? (e as Record<string, unknown>)[firstKey] : undefined;
    if (firstKey && Array.isArray(val) && typeof val[0] === 'string') {
      return `${firstKey}: ${val[0]}`;
    }
  }
  return fallback;
}

export function buildRegisterPayload(values: RegisterFormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    email: values.email,
    password: values.password,
    password_confirm: values.confirmPassword,
    first_name: values.firstName,
    last_name: values.lastName,
  };

  if (values.middleName) {
    payload.middle_name = values.middleName;
  }

  if (values.phone) {
    let formattedPhone = values.phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone.replace(/\D/g, '')}`;
    }
    payload.phone = formattedPhone;
  }

  return payload;
}

const initialState = {
  isSubmitting: false,
};

export const useAuthFormStore = createStore(
  initialState,
  (set) => ({
    login: async (
      email: string,
      password: string,
      errorFallback: string,
    ): Promise<AuthLoginResult> => {
      set((draft) => {
        draft.isSubmitting = true;
      });
      try {
        const { data, error, response } = await authLoginCreate({
          body: {
            email: email,
            password: password,
            // ❌ Убрали skip_2fa полностью. Именно он ломал бэкенд на PROD сервере (500 ошибка)
          } as never,
          security: [], 
        });

        // ЛОВИМ 500-Ю ОШИБКУ СЕРВЕРА ДЛЯ ЛОГОВ
        if (response && response.status >= 500) {
          let errorDetails = "Нет деталей";
          try { errorDetails = await response.clone().text(); } catch (e) {}
          console.error(`🔥 [БЭКЕНД УПАЛ] Ошибка ${response.status}. Ответ от Onrender/API:`, errorDetails);
          throw new Error(`Ошибка сервера (${response.status}). Загляни в консоль разработчика!`);
        }

        if (error) {
          const errData = error as { detail?: string; message?: string };
          throw new Error(errData?.detail || errData?.message || errorFallback);
        }

        if (response?.status === 202) {
          const mData = data as { message?: string; '2fa_required'?: boolean };
          return {
            kind: 'two_factor' as const,
            message: mData.message || 'Требуется двухфакторная аутентификация',
            raw: data,
          };
        }

        const successData = data as {
          access?: string;
          refresh?: string;
          access_token?: string;
          refresh_token?: string;
        };
        const accessToken = successData?.access || successData?.access_token;
        const refreshToken = successData?.refresh || successData?.refresh_token;

        if (accessToken) {
          return {
            kind: 'tokens' as const,
            accessToken,
            refreshToken,
            raw: data,
          };
        }

        throw new Error('Токен не найден в ответе сервера');
      } finally {
        set((draft) => {
          draft.isSubmitting = false;
        });
      }
    },

    register: async (
      values: RegisterFormValues,
      errorFallback: string,
    ): Promise<AuthRegisterResult> => {
      set((draft) => {
        draft.isSubmitting = true;
      });
      try {
        const payload = buildRegisterPayload(values);
        const { data, error, response } = await registerCreate({
          body: payload as never,
          security: [], 
        });

        if (response && response.status >= 500) {
          let errorDetails = "Нет деталей";
          try { errorDetails = await response.clone().text(); } catch (e) {}
          console.error(`🔥 [БЭКЕНД УПАЛ ПРИ РЕГЕ] Ошибка ${response.status}. Ответ:`, errorDetails);
          throw new Error(`Ошибка сервера (${response.status}). Загляни в консоль разработчика!`);
        }

        if (error) {
          throw new Error(parseRegisterError(error, errorFallback));
        }

        const sessionId =
          data && typeof data === 'object' && 'session_id' in data
            ? String((data as { session_id?: string }).session_id || '')
            : '';

        const phone = typeof payload.phone === 'string' ? payload.phone : '';

        return {
          sessionId,
          email: values.email,
          phone,
        };
      } finally {
        set((draft) => {
          draft.isSubmitting = false;
        });
      }
    },

    verifyCode: async (
      sessionId: string,
      code: string,
      errorFallback: string,
    ): Promise<void> => {
      set((draft) => {
        draft.isSubmitting = true;
      });
      try {
        const { data, error, response } = await authVerifyCreate({
          body: {
            session_id: sessionId,
            code,
          } as never,
          security: [], 
        });

        if (response && response.status >= 500) {
          let errorDetails = "Нет деталей";
          try { errorDetails = await response.clone().text(); } catch (e) {}
          console.error(`🔥 [БЭКЕНД УПАЛ ПРИ ВЕРИФИКАЦИИ] Ответ:`, errorDetails);
          throw new Error(`Ошибка сервера (${response.status}). Загляни в консоль разработчика!`);
        }

        if (error) {
          const errData = error as { detail?: string; message?: string };
          throw new Error(errData?.detail || errData?.message || errorFallback);
        }

        const raw = data as Record<string, unknown>;
        const successData = raw as {
          access?: string;
          refresh?: string;
          access_token?: string;
          refresh_token?: string;
        };
        const accessToken =
          successData?.access ||
          successData?.access_token ||
          (typeof raw?.token === 'string' ? raw.token : undefined);
        const refreshToken =
          successData?.refresh || successData?.refresh_token;

        if (!accessToken) {
          throw new Error(errorFallback);
        }

        useAuthStore.getState().setAuth(accessToken, refreshToken);
      } finally {
        set((draft) => {
          draft.isSubmitting = false;
        });
      }
    },
  }),
  'authForm',
);