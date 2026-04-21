import { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getLanguage } from 'shared/lib/i18n';

export const onBeforeRequest = (config: InternalAxiosRequestConfig<unknown>) => {
  config.headers['Accept-Language'] = getLanguage();

  return config;
};

export const onResponseRejected = (rejected: AxiosError) => {
  return Promise.reject(rejected);
};
