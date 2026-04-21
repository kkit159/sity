### i18next

Обертка вокруг библиотек i18next и react-i18next, которая позволяет удобно хранить переводы в изолированных компонентах.

Для работы необходимо установить библиотеки i18next и react-i18next: npm install i18next react-i18next

Инициализируем i18next ([подробнее смотри тут](https://react.i18next.com/getting-started#basic-sample)) в файле `src/services/i18next.ts`:

```ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

void i18next.use(initReactI18next).init({
  resources: {},
  lng: 'ru',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export {
  createTranslation,
  getLanguage,
  setLanguage,
  type TLanguage,
  type TPluralKeys,
  type TUseTranslationResult,
} from 'shared/i18next';
```

Создаем структуру для переводов компонента

```
| Component
| Component.tsx
| Component.i18next
| | ru.ts
| | en.ts
| | index.ts
| index.ts
```

В файлах `Component.i18next/ru.ts` и `Component.i18next/en.ts` экспортируем объекты с переводами, пример:

```ts
export const ru = {
  greeting: 'Приветствие',
};
export const en = {
  greeting: 'Greeting',
};
```

В файле `Component.i18next/index.ts` экспортируем функции для работы с переводами:

```ts
import { createTranslation } from 'services/i18next';
import { ru } from './ru.ts';
import { en } from './en.ts';

export const { useTranslation, t } = createTranslation<typeof ru>({ ru, en });
```

Хук `useTranslation` используется в контексте react-компонента ([документацию на него смотри тут](https://react.i18next.com/latest/usetranslation-hook)).

Метод `t` используется там, где нельзя использовать react-хуки (например в сторах)
