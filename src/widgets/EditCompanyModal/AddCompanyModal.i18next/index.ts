import { useLang } from '@/app/providers/LanguageProvider';
import { ru } from './ru';
import { en } from './en';

export const useTranslation = () => {
    const { lang } = useLang();
    const t = (key: keyof typeof ru, variables?: Record<string, string>) => {
        const translations = lang === 'EN' ? en : ru;
        let text = translations[key] || key;
        
        if (variables) {
            Object.keys(variables).forEach((v) => {
                text = text.replace(`{{${v}}}`, variables[v]);
            });
        }
        return text;
    };
    return { t, lang };
};