import React, { useRef, useEffect, useState, UIEvent } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useTranslation } from '../LandingReviews.i18next';
import styles from './LandingReviews.module.scss';

import annaImg from '@/shared/assets/reviews/anna.png';
import alexeyImg from '@/shared/assets/reviews/alexey.png';
import mariaImg from '@/shared/assets/reviews/maria.png';
import sergeyImg from '@/shared/assets/reviews/sergey.png';

// Выносим ассеты отдельно от текстов
const avatars = [annaImg, alexeyImg, mariaImg, sergeyImg, annaImg, alexeyImg, mariaImg, sergeyImg];

// Типизируем отзыв для подсказок IDE
type ReviewItem = {
  id: number;
  name: string;
  role: string;
  text: string;
};

export const LandingReviews: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDraggingStyle, setIsDraggingStyle] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Достаем массив объектов перевода
  const reviews = t('reviews', { returnObjects: true }) as ReviewItem[];

  // Рефы для логики мыши
  const isDragging = useRef(false);
  const isDragMove = useRef(false); // Для отличия клика от свайпа
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Обработчик нативного скролла (для вычисления центра)
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const center = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    const children = Array.from(container.children) as HTMLElement[];
    
    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(center - childCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (activeIndex !== closestIndex) {
      setActiveIndex(closestIndex);
    }
  };

  // Клик по неактивной карточке или точке пагинации
  const scrollToCard = (index: number) => {
    // Если это был свайп мышью, а не клик — отменяем действие
    if (isDragMove.current) return; 

    if (!carouselRef.current) return;
    const children = Array.from(carouselRef.current.children) as HTMLElement[];
    const child = children[index];
    
    if (child) {
      const scrollPosition = child.offsetLeft - carouselRef.current.clientWidth / 2 + child.clientWidth / 2;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // --- ЛОГИКА СВАЙПА МЫШЬЮ ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    isDragMove.current = false;
    setIsDraggingStyle(true); // Отключаем CSS-магнит
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !carouselRef.current) return;
    
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Скорость свайпа мышью
    
    // Если мышь сдвинулась больше чем на 10px — считаем это свайпом, а не кликом
    if (Math.abs(walk) > 10) {
      isDragMove.current = true;
      e.preventDefault(); // Предотвращаем выделение текста
    }
    
    if (isDragMove.current) {
      carouselRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    setIsDraggingStyle(false);
    // Reset after the current click event fires so drag-end doesn't trigger navigation,
    // but the next intentional click always works
    setTimeout(() => {
      isDragMove.current = false;
    }, 0);
  };

  // Выравниваем карусель по первой карточке при загрузке
  useEffect(() => {
    if (carouselRef.current) {
      scrollToCard(0);
    }
  }, []);

  return (
    <section className={styles.section} data-theme={theme}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{t('title')}</h2>
          <p>{t('desc')}</p>
        </div>
      </div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div 
          ref={carouselRef} 
          className={`${styles.carouselViewport} ${isDraggingStyle ? styles.dragging : ''}`}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className={`${styles.card} ${activeIndex === index ? styles.active : ''}`}
              onClick={() => scrollToCard(index)}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.name}>{review.name}</h3>
                <span className={styles.role}>{review.role}</span>
              </div>
              
              <div className={styles.cardBody}>
                {/* Берем картинку из статичного массива по индексу */}
                <img src={avatars[index]} alt={review.name} className={styles.avatar} />
                <p className={styles.quote}>{review.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${activeIndex === index ? styles.activeDot : ''}`}
              onClick={() => scrollToCard(index)}
              aria-label={`${t('goToReview')} ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};