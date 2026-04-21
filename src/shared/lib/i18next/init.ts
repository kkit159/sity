import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// ПРАВКА: Убрали лишнюю проверку, на которую ругался TypeScript.
// Оставили только безопасное извлечение дефолтного объекта (для Vite).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const i18nInstance = (i18next as any).default || i18next;

if (!i18nInstance.isInitialized) {
    i18nInstance.use(initReactI18next).init({
        lng: 'ru',
        fallbackLng: 'en',
        resources: {},
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });
}

export default i18nInstance;