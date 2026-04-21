import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useTranslation } from '../LandingFAQ.i18next';
import { noWidow } from '@/shared/lib/utils';
import styles from './LandingFAQ.module.scss';

// Импорт картинок
import questionImg from '@/shared/assets/question2.png';
import queueFaqImg from '@/shared/assets/faq_queue.png';

interface LandingFAQProps {
  variant?: 'main' | 'queue' | 'pager';
}

export const LandingFAQ: React.FC<LandingFAQProps> = ({ variant = 'main' }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Первый открыт по умолчанию

  // Расширяем логику: для queue и pager показываем одну и ту же картинку
  const isSpecialVariant = variant === 'queue' || variant === 'pager';
  const currentImg = isSpecialVariant ? queueFaqImg : questionImg;

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Собираем массив вопросов из словаря
  const faqItems = [0, 1, 2, 3, 4, 5, 6].map(index => ({
    q: noWidow(t(`items.${index}.q` as any)),
    a: noWidow(t(`items.${index}.a` as any))
  }));

  return (
    <section className={styles.section} data-variant={variant}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <h2>{t('title')}</h2>
          <p>{noWidow(t('desc'))}</p>
        </div>

        <div className={styles.contentWrapper}>
          
          {/* LEFT: Accordion */}
          <div className={styles.leftColumn}>
            <div className={styles.accordionList}>
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className={classNames(styles.accordionItem, { 
                    [styles.open]: activeIndex === index 
                  })}
                >
                  <div 
                    className={styles.itemHeader} 
                    onClick={() => toggleIndex(index)}
                  >
                    <h3>{item.q}</h3>
                    <DownOutlined className={styles.icon} />
                  </div>

                  <AnimatePresence initial={false}>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={styles.itemContent}
                      >
                        <div className={styles.inner}>
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className={styles.rightColumn}>
            <motion.img 
              src={currentImg} 
              alt="FAQ Illustration" 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

        </div>

      </div>
    </section>
  );
};