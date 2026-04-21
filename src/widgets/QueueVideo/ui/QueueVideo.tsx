import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../QueueVideo.i18next';
import styles from './QueueVideo.module.scss';

export const QueueVideo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Заголовок */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </motion.div>

        {/* Видео контейнер */}
        <motion.div
          className={styles.videoWrapper}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
        >
          <div className={styles.videoPlaceholder}>
            {/* Иконка Play с Glassmorphism эффектом */}
            <div className={styles.playButton}>
              <div className={styles.playIconWrapper}>
                <svg width="24" height="26" viewBox="0 0 24 26" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.625 11.114C25.125 11.952 25.125 14.048 23.625 14.886L3.375 26.205C1.875 27.043 0 25.995 0 24.319L0 1.681C0 0.005 1.875 -1.043 3.375 -0.205L23.625 11.114Z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Кнопка действия */}
        <motion.div
          className={styles.actionWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button className={styles.actionButton}>{t('btn')}</button>
        </motion.div>

      </div>
    </section>
  );
};