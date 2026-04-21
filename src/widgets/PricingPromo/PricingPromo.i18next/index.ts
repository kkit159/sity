import { createTranslation } from '@/shared/lib/i18next';
import { ru } from './ru';
import { en } from './en';

// Достаем Trans из твоего хелпера
export const { useTranslation, Trans, t } = createTranslation<typeof ru>({ ru, en });