import React from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';
import styles from './QueuePage.module.scss';

// === НОВЫЕ ВИДЖЕТЫ ===
import { QueueHero } from '@/widgets/QueueHero';
import { QueueChaos } from '@/widgets/QueueChaos';
import { QueueCTA } from '@/widgets/QueueCTA';
import { QueueVideo } from '@/widgets/QueueVideo';

// === Переиспользуемые виджеты ===
import { LandingTrialCTA } from '@/widgets/LandingTrialCTA';
import { LandingIndustries } from '@/widgets/LandingIndustries';
import { LandingRoadmap } from '@/widgets/LandingRoadmap';
import { LandingPricing } from '@/widgets/LandingPricing';
import { LandingFAQ } from '@/widgets/LandingFAQ';
import { LandingContact } from '@/widgets/LandingContact';


export const QueuePage: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className={styles.pageWrapper} data-theme={theme}>
            <div className={styles.content}>

                {/* 1. Херо секция */}
                <QueueHero />

                {/* 2. Блок с хаосом (проблема) */}
                <QueueChaos />

                {/* 3. Призыв к триалу */}
                <LandingTrialCTA />

                {/* 4. Индустрии (где применяется) */}
                <LandingIndustries />

                {/* 5. Видео */}
                <QueueVideo />

                {/* 6. Роадмап (Как это работает) */}
                <div style={{ marginTop: '80px' }}>
                    <LandingRoadmap variant="queue" />
                </div>

                {/* 7. Тарифы */}
                <div id="pricing">
                    <LandingPricing variant="queue" />
                </div>

                {/* 8. Call to Action (Финальный призыв с модалкой) */}
                <QueueCTA />

                {/* 9. FAQ */}
                <div id="faq" style={{ marginTop: '80px' }}>
                    <LandingFAQ variant="queue" />
                </div>

                {/* 10. Контакты */}
                <div id="contact">
                    <LandingContact variant="queue" />
                </div>

            </div>
        </div>
    );
};