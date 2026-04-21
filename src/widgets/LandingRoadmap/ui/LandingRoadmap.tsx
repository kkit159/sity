import React, { useRef, useEffect, useState } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from '../LandingRoadmap.i18next';
import styles from './LandingRoadmap.module.scss';

import clyaksaLight from '@/shared/assets/clyaksa.png';
import clyaksaQueue from '@/shared/assets/clyaksa_queue.png';
import clyaksaPager from '@/shared/assets/klyaksa_pager.png';

interface LandingRoadmapProps {
  variant?: 'main' | 'queue' | 'pager';
}

const timelineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 }
  }
};

const stepItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const circleVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

export const LandingRoadmap: React.FC<LandingRoadmapProps> = ({ variant = 'main' }) => {
  const { t } = useTranslation();

  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yDesktop = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const yMobile = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Жестко фиксируем светлую тему для кляксы
  const getClyaksaImage = () => {
    if (variant === 'queue') return clyaksaQueue;
    if (variant === 'pager') return clyaksaPager;
    return clyaksaLight;
  };

  const currentClyaksa = getClyaksaImage();

  const stepsData = [
    { id: t('steps.0.id'), title: t('steps.0.title'), desc: t('steps.0.desc') },
    { id: t('steps.1.id'), title: t('steps.1.title'), desc: t('steps.1.desc') },
    { id: t('steps.2.id'), title: t('steps.2.title'), desc: t('steps.2.desc') },
    { 
      id: t(variant === 'pager' ? 'steps.3_pager.id' : 'steps.3_queue.id'), 
      title: t(variant === 'pager' ? 'steps.3_pager.title' : 'steps.3_queue.title'), 
      desc: t(variant === 'pager' ? 'steps.3_pager.desc' : 'steps.3_queue.desc') 
    }
  ];

  return (
    <section ref={sectionRef} className={styles.section} data-variant={variant}>
      <div className={styles.container}>
        <div className={styles.roadmapContent}>
          <div className={styles.stepsColumn}>
            <motion.h2
              className={styles.mainTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t('title')}
            </motion.h2>

            <motion.div
              className={styles.timeline}
              variants={timelineContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {stepsData.map((step, index) => (
                <motion.div
                  key={index}
                  className={styles.stepItem}
                  variants={stepItemVariants}
                >
                  <motion.div
                    className={styles.numberCircle}
                    variants={circleVariants}
                  >
                    {step.id}
                  </motion.div>

                  <div className={styles.stepText}>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className={styles.footerNote}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              {t('footerNote')}
            </motion.p>
          </div>

          <motion.div
            className={styles.decorWrapper}
            style={{ y: isMobile ? yMobile : yDesktop }}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <div className={styles.decorInner}>
              <img
                key={variant}
                src={currentClyaksa}
                alt="Decor"
                className={styles.decorImage}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};