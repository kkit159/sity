// Side-effect: настраивает сгенерированный hey-api client (baseUrl, интерцепторы).
// Обязательно импортировать один раз из точки входа приложения (см. index.tsx).
import { client } from './generated/client.gen';
import { getLanguage } from '../lib/i18n';

const PRODUCTION_API_BASE = 'https://queue-system-api.onrender.com';

/** В dev — пустая строка: запросы на /api/* идут через proxy Vite (без CORS). В prod — прямой URL API. */
const apiBaseUrl = import.meta.env.DEV ? '' : PRODUCTION_API_BASE;

client.setConfig({
  baseUrl: apiBaseUrl,
});

function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('access')
  );
}

function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('refreshToken') ||
    localStorage.getItem('refresh_token') ||
    localStorage.getItem('refresh')
  );
}

function persistTokens(access: string, refresh?: string) {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('access_token', access);
  if (refresh) {
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('refresh_token', refresh);
  }
}

function clearTokens() {
  const keys = ['accessToken', 'access_token', 'access', 'refreshToken', 'refresh_token', 'refresh'];
  keys.forEach((k) => localStorage.removeItem(k));
}

function getRequestPathname(url: string): string {
  try {
    return new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').pathname;
  } catch {
    return '';
  }
}

/** Не подставлять Bearer: регистрация, OTP, логин, refresh (тело запроса), сброс пароля. */
const PATHS_WITHOUT_AUTH = new Set([
  '/api/register/',
  '/api/auth/verify/',
  '/api/auth/send_code/',
  '/api/auth/login/',
  '/api/auth/refresh/',
]);

function shouldSkipAuthHeader(requestUrl: string): boolean {
  const p = getRequestPathname(requestUrl);
  if (PATHS_WITHOUT_AUTH.has(p)) return true;
  if (p.startsWith('/api/auth/password-reset')) return true;
  return false;
}

client.interceptors.request.use((request: Request) => {
  request.headers.set('Accept-Language', getLanguage());

  if (shouldSkipAuthHeader(request.url)) {
    return request;
  }

  const token = getStoredAccessToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
});

client.interceptors.response.use(async (response: Response, request: Request) => {
  if (response.status !== 401) {
    return response;
  }

  if (shouldSkipAuthHeader(request.url)) {
    return response;
  }

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return response;
  }

  try {
    const refreshUrl =
      apiBaseUrl === '' ? '/api/auth/refresh/' : `${apiBaseUrl.replace(/\/$/, '')}/api/auth/refresh/`;

    const refreshResponse = await fetch(refreshUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = (await refreshResponse.json()) as {
        access?: string;
        access_token?: string;
      };
      const access = refreshData.access || refreshData.access_token;
      if (access) {
        persistTokens(access);
        request.headers.set('Authorization', `Bearer ${access}`);
        return fetch(request);
      }
    }

    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  } catch {
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  return response;
});

export { client };
