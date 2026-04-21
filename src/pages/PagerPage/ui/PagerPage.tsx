import React from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';
import styles from './PagerPage.module.scss';

// === ПЕРЕИСПОЛЬЗУЕМЫЕ ВИДЖЕТЫ ===
import { LandingTrialCTA } from '@/widgets/LandingTrialCTA';
import { LandingIndustries } from '@/widgets/LandingIndustries';
import { QueueVideo } from '@/widgets/QueueVideo';
import { LandingRoadmap } from '@/widgets/LandingRoadmap';
import { LandingPricing } from '@/widgets/LandingPricing';
import { LandingFAQ } from '@/widgets/LandingFAQ';
import { LandingContact } from '@/widgets/LandingContact';
import { PagerHero } from '@/widgets/PagerHero';
import { QueueChaos } from '@/widgets/QueueChaos';
import { QueueCTA } from '@/widgets/QueueCTA';

export const PagerPage: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className={styles.pageWrapper} data-theme={theme}>
            <div className={styles.content}>

                {/* 1. Херо секция Пейджера */}
                <PagerHero />

                {/* 2. Удобство в каждой детали (Преимущества) */}
                {/* ПЕРЕДАЕМ variant="pager", чтобы сменились тексты и фоны */}
                <QueueChaos variant="pager" />


                {/* 4. Призыв к триалу */}
                <LandingTrialCTA />

                {/* 5. Индустрии (где применяется) */}
                <LandingIndustries />

                {/* 6. Видео */}
                <QueueVideo />

                {/* 7. Роадмап (5 минут и онлайн) */}
                <div style={{ marginTop: '80px' }}>
                    <LandingRoadmap variant="pager" />
                </div>

                {/* 8. Тарифы */}
                <div id="pricing">
                    <LandingPricing variant="pager" />
                </div>

                {/* 8. Call to Action (Финальный призыв с модалкой) */}
                {/* Добавлен variant="pager" для корректной работы пропсов */}
                <QueueCTA variant="pager" />

                {/* 9. FAQ */}
                <div id="faq" style={{ marginTop: '80px' }}>
                    <LandingFAQ variant="pager" />
                </div>

                {/* 10. Контакты */}
                <div id="contact">
                    <LandingContact variant="pager" />
                </div>

            </div>
        </div>
    );
};