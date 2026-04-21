import { createTranslation } from '@/shared/lib/i18next';
import { ru } from './ru';
import { en } from './en';

export const { useTranslation, t } = createTranslation<typeof ru>({ ru, en });