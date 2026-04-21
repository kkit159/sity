import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import classNames from 'classnames';
import { DownOutlined } from '@ant-design/icons';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useTranslation } from '../QueueChaos.i18next';

// ИКОНКИ (FRONT)
import chatIcon from '@/shared/assets/chat.png';
import manIcon from '@/shared/assets/man.png';
import phoneIcon from '@/shared/assets/phone.png';
import statIcon from '@/shared/assets/stat.png';

// ФОНЫ QUEUE (Обычные)
import chatBackQ from '@/shared/assets/chat_back.png';
import manBackQ from '@/shared/assets/man_back.png';
import phoneBackQ from '@/shared/assets/phone_back.png';
import statBackQ from '@/shared/assets/stat_back.png';

// ФОНЫ PAGER (Light/Dark)
import chatPagerL from '@/shared/assets/chat_pager_light.png';
import chatPagerD from '@/shared/assets/chat_pager_dark.png';
import profilePagerL from '@/shared/assets/profile_pager_light.png';
import profilePagerD from '@/shared/assets/profile_pager_dark.png';
import phonePagerL from '@/shared/assets/phone_pager_light.png';
import phonePagerD from '@/shared/assets/phone_pager_dark.png';
import statPagerL from '@/shared/assets/stat_pager_light.png';
import statPagerD from '@/shared/assets/stat_pager_dark.png';

import styles from './QueueChaos.module.scss';

interface Step {
  id: string;
  title: string;
  content: string;
}

interface QueueChaosProps {
  variant?: 'queue' | 'pager';
}

const AccordionRow = ({ step, isOpen, onToggle }: { step: Step; isOpen: boolean; onToggle: () => void; }) => (
  <div className={styles.accordionItem}>
    <div className={styles.itemHeader} onClick={onToggle}>
      <div className={styles.number}>{step.id}</div>
      <div className={styles.stepTitle}>{step.title}</div>
      <DownOutlined className={classNames(styles.icon, { [styles.open]: isOpen })} />
    </div>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={styles.itemContent}
        >
          <div className={styles.inner}>{step.content}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const cardAssets = [
  { iconFront: chatIcon, backQ: chatBackQ, backPL: chatPagerL, backPD: chatPagerD },
  { iconFront: manIcon, backQ: manBackQ, backPL: profilePagerL, backPD: profilePagerD },
  { iconFront: phoneIcon, backQ: phoneBackQ, backPL: phonePagerL, backPD: phonePagerD },
  { iconFront: statIcon, backQ: statBackQ, backPL: statPagerL, backPD: statPagerD },
];

export const QueueChaos: React.FC<QueueChaosProps> = ({ variant = 'queue' }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [openStepId, setOpenStepId] = useState<string | null>('01');
  const handleToggle = (id: string) => setOpenStepId(openStepId === id ? null : id);
  const cardsData = useMemo(() => [0, 1, 2, 3].map((index) => ({
    title: t(`${variant}.cards.${index}.title`),
    desc: t(`${variant}.cards.${index}.desc`),
    iconFront: cardAssets[index].iconFront,
    back: variant === 'queue' ? cardAssets[index].backQ : (isDark ? cardAssets[index].backPD : cardAssets[index].backPL),
  })), [t, variant, isDark]);

  const stepsData = useMemo(() => [0, 1, 2, 3].map((index) => ({
    id: t(`steps.${index}.id`),
    title: t(`steps.${index}.title`),
    content: t(`steps.${index}.content`),
  })), [t]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] } }
  };

  return (
    <section className={classNames(styles.chaosSection, { [styles.darkTheme]: isDark })}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>{t(`${variant}.title` as any)}</h2>
          <p className={styles.subtitle}>{t(`${variant}.subtitle` as any)}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cardsData.map((card, index) => (
            <motion.div
              key={index}
              className={styles.card}
              variants={cardVariants}
              style={{ backgroundImage: `url(${card.back})` }}
            >
              <div className={styles.cardBgOverlay} />
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <img src={card.iconFront} alt="" className={styles.iconFront} />
              <p className={styles.cardDesc}>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.accordionSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className={styles.faqMainTitle}>{t('howItWorksTitle')}</h2>
          <div className={styles.accordionList}>
            {stepsData.map((step) => (
              <AccordionRow
                key={step.id}
                step={step}
                isOpen={openStepId === step.id}
                onToggle={() => handleToggle(step.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};