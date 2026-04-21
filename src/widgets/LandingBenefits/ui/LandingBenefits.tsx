import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from '../LandingBenefits.i18next';
import styles from './LandingBenefits.module.scss';
import bgImage from '@/shared/assets/rectangle-182.png';

export const LandingBenefits: React.FC = () => {
  const { t } = useTranslation();

  const cards = t('cards', { returnObjects: true }) as Array<{ title: string; desc: string }>;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className={styles.container}>
      <motion.div 
        className={styles.cardWrapper}
        style={{ backgroundImage: `url(${bgImage})` }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <header className={styles.header}>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('subtitle')}
          </motion.p>
        </header>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cards.map((item, index) => (
            <motion.article 
              key={index} 
              className={styles.glassCard}
              variants={cardVariants}
            >
              <h3 className={styles.cardTitle}>
                {item.title.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}<br/>
                  </React.Fragment>
                ))}
              </h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};