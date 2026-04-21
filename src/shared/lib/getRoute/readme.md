## getRoute

Метод для получения маршрута с типизированной подстановкой параметров.

Пример использования:

```ts
export const routes = {
  home: '/',
  terminalsList: '/terminals/',
  terminalCat: '/terminals/cat/:terminalId/',
  presetsList: '/presets/',
  presetsItem: '/presets/:presetId/',
} as const;

const route = getRoute(routes.terminalCat, { terimalId: 1 });
```
