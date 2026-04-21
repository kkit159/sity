import React from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';
import styles from './PricingPage.module.scss';
import { PricingCards } from '@/widgets/PricingCards';
import { PricingComparison } from '@/widgets/PricingComparison';
import { PricingPromo } from '@/widgets/PricingPromo';
import { LandingReviews } from '@/widgets/LandingReviews';
// Импортируем новый блок контактов
import { PricingContact } from '@/widgets/PricingContact';

export const PricingPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={styles.pageWrapper} data-theme={theme}>
      <div className={styles.content}>
        {/* Карточки тарифов */}
        <PricingCards />
        
        {/* Таблица сравнения */}
        <PricingComparison />
        
        {/* Блок со скидкой 10% */}
        <PricingPromo />

        {/* Отзывы */}
        <LandingReviews />

        {/* Форма заявки/контактов */}
        <PricingContact />
      </div>
    </div>
  );
};