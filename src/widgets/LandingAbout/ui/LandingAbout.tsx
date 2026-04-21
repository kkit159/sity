import React from 'react';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { useTranslation } from '../LandingAbout.i18next';
import { noWidow } from '@/shared/lib/utils';
import styles from './LandingAbout.module.scss';
import infoImage from '@/shared/assets/info-i.png'; 

const { Paragraph } = Typography;

export const LandingAbout: React.FC = () => {
  const { t } = useTranslation();
  
  const stats = t('stats', { returnObjects: true }) as Array<{ value: string; label: string }>;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Левая колонка (Текст) */}
          <motion.div
            className={styles.leftColumn}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className={styles.label}>{t('label')}</h2>
            
            <Paragraph className={styles.textBlock}>
              {noWidow(t('p1'))}
            </Paragraph>
            
            <Paragraph className={styles.textBlock}>
              {noWidow(t('p2'))}
            </Paragraph>
          </motion.div>

          {/* Правая колонка (Иконка) */}
          <motion.div 
            className={styles.imageWrapper}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img src={infoImage} alt="Info" />
          </motion.div>
        </div>

        {/* Статистика */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className={styles.statItem}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>
                {stat.label.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}<br/>
                  </React.Fragment>
                ))}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};