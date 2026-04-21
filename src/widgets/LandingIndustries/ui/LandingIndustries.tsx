import React from 'react';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
// Подключаем переводы
import { useTranslation } from '../LandingIndustries.i18next';
import { useTheme } from '@/app/providers/ThemeProvider';
import styles from './LandingIndustries.module.scss';

import { ToolOutlined } from '@ant-design/icons';

import medicalIcon from '@/shared/assets/icons/industries/medical.png';
import coffeeIcon from '@/shared/assets/icons/industries/coffee.png';
import serviceIcon from '@/shared/assets/icons/industries/service.png';
import govIcon from '@/shared/assets/icons/industries/government.png';
import foodIcon from '@/shared/assets/icons/industries/food.png';
import washIcon from '@/shared/assets/icons/industries/car-wash.png';
import cleaningIcon from '@/shared/assets/icons/industries/cleaning.png';
import tailorIcon from '@/shared/assets/icons/industries/tailor.png';

const { Paragraph } = Typography;

export const LandingIndustries: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme(); 

  const items = t('items', { returnObjects: true }) as Array<{ id: string; title: string; desc: string }>;

  const getIcon = (id: string) => {
    switch (id) {
      case 'medical': return <img src={medicalIcon} alt="Medical" />;
      case 'coffee': return <img src={coffeeIcon} alt="Coffee" />;
      case 'service': return <img src={serviceIcon} alt="Service" />;
      case 'gov': return <img src={govIcon} alt="Gov" />;
      case 'food': return <img src={foodIcon} alt="Food" />;
      case 'wash': return <img src={washIcon} alt="Wash" />;
      case 'cleaning': return <img src={cleaningIcon} alt="Cleaning" />;
      case 'tailor': return <img src={tailorIcon} alt="Tailor" />;
      default: return <ToolOutlined />;
    }
  };

  return (
    <section className={styles.section} data-theme={theme}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.title}>{t('title')}</h2>
            <Paragraph className={styles.subtitle}>
              {t('subtitle')}
            </Paragraph>
          </motion.div>
        </div>

        <div className={styles.scrollContainer}>
          <div className={styles.grid}>
            {items.map((item, index) => (
              <motion.div 
                key={item.id} 
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.05, duration: 0.4 }}
              >
                <div className={styles.iconWrapper}>
                  {getIcon(item.id)}
                </div>
                <h3 className={styles.cardTitle}>
                  {item.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}<br/>
                    </React.Fragment>
                  ))}
                </h3>
                <div className={styles.cardDesc}>
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};