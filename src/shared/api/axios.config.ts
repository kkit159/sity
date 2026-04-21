import axios from 'axios';

import { getLanguage } from 'shared/lib/i18n';

import { onBeforeRequest, onResponseRejected } from './interceptors';

export const $api = axios.create();

$api.defaults.headers.common['Accept-Language'] = getLanguage();
$api.defaults.withCredentials = true;
$api.defaults.headers.common.Accept = '*/*';
$api.defaults.baseURL = '/back';

$api.interceptors.request.use(onBeforeRequest);

$api.interceptors.response.use((response) => {
  return response;
}, onResponseRejected);
