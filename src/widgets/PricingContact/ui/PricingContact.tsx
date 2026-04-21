import React, { useState } from 'react';
import { useTranslation } from '../PricingContact.i18next';
import styles from './PricingContact.module.scss';

// Импорт твоих иконок
import numberIcon from '@/shared/assets/number.png';
import messageIcon from '@/shared/assets/message.png';
import locationIcon from '@/shared/assets/location.png';
import tgIcon from '@/shared/assets/tg.png';

export const PricingContact: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    agreed: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Логика отправки
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        
        {/* Левая часть: Заголовки (сверху) и иконки (снизу) */}
        <div className={styles.infoBlock}>
          
          <div className={styles.titleWrapper}>
            {/* Десктопный заголовок */}
            <h2 className={styles.titleDesktop}>
              {(t('titleDesktop') as string).split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{line}<br/></React.Fragment>
              ))}
            </h2>
            
            {/* Мобильный заголовок */}
            <h2 className={styles.titleMobile}>
              {(t('titleMobile') as string).split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{line}<br/></React.Fragment>
              ))}
            </h2>
          </div>

          {/* Иконки внизу */}
          <div className={styles.iconsRow}>
            <a href="#" className={styles.iconCircle}>
              <img src={numberIcon} alt="Phone" />
            </a>
            <a href="#" className={styles.iconCircle}>
              <img src={messageIcon} alt="Email" />
            </a>
            <a href="#" className={styles.iconCircle}>
              <img src={locationIcon} alt="Location" />
            </a>
            <a href="#" className={styles.iconCircle}>
              <img src={tgIcon} alt="Telegram" />
            </a>
          </div>
          
        </div>

        {/* Правая часть: Форма */}
        <div className={styles.formBlock}>
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{t('formTitle')}</h3>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <input 
                type="text" 
                placeholder={t('name')} 
                className={styles.inputField}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              
              <input 
                type="tel" 
                placeholder={t('phone')} 
                className={styles.inputField}
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              
              <textarea 
                placeholder={t('message')} 
                className={styles.textAreaField}
                rows={3}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
              
              <button type="submit" className={styles.submitBtn}>
                {t('button')}
              </button>

              <label className={styles.policyLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={formData.agreed}
                  onChange={e => setFormData({...formData, agreed: e.target.checked})}
                />
                <span className={styles.policyText}>{t('policy')}</span>
              </label>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};