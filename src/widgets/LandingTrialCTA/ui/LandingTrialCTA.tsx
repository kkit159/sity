import React from 'react';
import { motion } from 'framer-motion';
// Подключаем переводы
import { useTranslation } from '../LandingTrialCTA.i18next';
import { useTheme } from '@/app/providers/ThemeProvider';
import styles from './LandingTrialCTA.module.scss';

// Картинка фона (люди)
import peopleBg from '@/shared/assets/people-group.png';

export const LandingTrialCTA: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section className={styles.section} data-theme={theme}>
      <div className={styles.container}>
        <motion.div 
          className={styles.ctaBlock}
          style={{ '--cta-bg': `url(${peopleBg})` } as React.CSSProperties}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className={styles.ctaContent}>
            <h2>{t('title')}</h2>
            <p>{t('desc')}</p>
          </div>
          <button className={styles.ctaButton}>{t('btn')}</button>
        </motion.div>
      </div>
    </section>
  );
};