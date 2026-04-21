import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

// Подключаем переводы
import { useTranslation, Trans } from '../LandingHero.i18next';
import { noWidow } from '@/shared/lib/utils';
import heroBg from '@/shared/assets/hero-bg.jpg';

const { Title, Text } = Typography;

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    setIsMobile(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleResize);
      return () => mediaQuery.removeEventListener('change', handleResize);
    } else {
      mediaQuery.addListener(handleResize);
      return () => mediaQuery.removeListener(handleResize);
    }
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      width: '100%',
      // ИСПРАВЛЕНИЕ: На мобилке отступов сверху/снизу нет (0), на десктопе 117px сверху.
      // Чтобы по бокам на мобилке не было белых рамок, padding сбрасываем в 0, 
      // а на десктопе оставляем 24px по бокам для красоты.
      padding: isMobile ? '0' : '117px 24px 0 24px',
      display: 'flex',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          maxWidth: isMobile ? '100%' : '1720px',
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: isMobile ? 0 : '100px',
          minHeight: isMobile ? '100dvh' : '805px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          color: '#F9FAFB',
          willChange: 'opacity, transform',
          transform: 'translateZ(0)',
        }}
      >
        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          margin: '0 auto',
          // ИСПРАВЛЕНИЕ: На мобилке делаем отступ сверху побольше, чтобы текст не залезал под прозрачную шапку
          padding: isMobile ? '100px 24px 40px' : '60px 80px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          boxSizing: 'border-box'
        }}>

          <div style={{
            maxWidth: '860px', 
            alignSelf: 'flex-start'
          }}>
            <Title
              level={1}
              style={{
                color: '#F9FAFB',
                fontSize: isMobile ? '32px' : '52px',
                textTransform: 'uppercase',
                margin: isMobile ? '0 0 200px 0' : '0 0 413px 0',
                lineHeight: '1.1',
                fontWeight: 800,
                fontFamily: 'var(--font-main)',
                letterSpacing: '-0.01em'
              }}
            >
              <Trans i18nKey="title" components={{ br: <br /> }} />
            </Title>
          </div>

          <div style={{ flexGrow: 1 }} />

          <Flex
            vertical
            gap={24} 
            style={{
              width: '100%',
              maxWidth: '580px', 
              alignSelf: isMobile ? 'flex-start' : 'flex-end',
              marginTop: 'auto'
            }}
          >
            <Text style={{
              color: 'rgba(249,250,251,0.95)',
              fontSize: isMobile ? '14px' : '15px',
              lineHeight: '1.35',
              fontFamily: 'var(--font-text)',
              fontWeight: 400
            }}>
              {noWidow(t('desc'))}
            </Text>

            <Flex
              vertical={isMobile}
              gap={isMobile ? 12 : 24}
              align={isMobile ? "stretch" : "center"}
            >
              <Button
                type="default" 
                size="large"
                onClick={() => scrollTo('contact')}
                style={{
                  height: isMobile ? '50px' : '54px',
                  borderRadius: '80px',
                  fontSize: isMobile ? '15px' : '16px',
                  backgroundColor: '#F9FAFB',
                  color: '#11273B',
                  border: 'none',
                  boxShadow: 'none',
                  fontWeight: 700,
                  fontFamily: 'var(--font-main)',
                  padding: '0 32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {t('btn_start')}
              </Button>

              <Button
                type="text"
                icon={<PlayCircleOutlined style={{ fontSize: isMobile ? '24px' : '28px' }} />}
                onClick={() => scrollTo('process')}
                style={{
                  color: '#F9FAFB',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: 700,
                  height: isMobile ? '50px' : '54px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  fontFamily: 'var(--font-main)',
                  padding: isMobile ? '0' : '0 16px',
                  border: 'none',
                  boxShadow: 'none',
                }}
              >
                {t('btn_how')}
              </Button>
            </Flex>
          </Flex>
        </div>
      </motion.div>
    </div>
  );
};