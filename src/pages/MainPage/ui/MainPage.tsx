import React from 'react';
import styles from './MainPage.module.scss'; 

// Импорты виджетов
import { Hero } from '@/widgets/LandingHero';
import { LandingAbout } from '@/widgets/LandingAbout';
import { LandingBenefits } from '@/widgets/LandingBenefits';
import { LandingIndustries } from '@/widgets/LandingIndustries';
import { LandingPricing } from '@/widgets/LandingPricing';
import { LandingProcess } from '@/widgets/LandingProcess';
import { LandingTrialCTA } from '@/widgets/LandingTrialCTA';
import { LandingRoadmap } from '@/widgets/LandingRoadmap';
import { LandingReviews } from '@/widgets/LandingReviews';
import { LandingFAQ } from '@/widgets/LandingFAQ';
import { LandingContact } from '@/widgets/LandingContact';

import vectorBg from '@/shared/assets/vector.png';

export const MainPage: React.FC = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        
        <div id="hero"><Hero /></div>
        
        {/* --- КЛАСТЕР С КЛЯКСОЙ --- */}
        <div className={styles.clusterWrapper}>
          {!isDark && (
            <div className={styles.vectorGrid}>
              <img 
                src={vectorBg} 
                alt="background vector" 
                className={styles.vectorImage}
              />
            </div>
          )}
          
          <div className={styles.clusterContent}>
            <div id="about"><LandingAbout /></div>
            <LandingBenefits />
            <LandingIndustries /> 
          </div>
        </div>
        
        <div id="pricing"><LandingPricing /></div>
        <div id="process"><LandingProcess /></div>
        
        <LandingTrialCTA />
        
        <LandingRoadmap />
        <LandingReviews />
        <div id="faq"><LandingFAQ /></div>
        <div id="contact"><LandingContact /></div>
        
      </div>
    </div>
  );
};