import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://queue-system-api.onrender.com/api/schema/?format=yaml',
  output: 'src/shared/api/generated',
  plugins: [
    '@hey-api/client-fetch' // Подключаем клиент через новую систему плагинов
  ],
});