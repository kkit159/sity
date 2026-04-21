import React from 'react';
import { Flex } from 'antd';
import logoImage from '@/shared/assets/logo.png'; 

interface LogoProps {
  color?: 'brand' | 'white';
}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <Flex align="center" style={{ cursor: 'pointer' }}>
      {/* Только картинка, без текста */}
      <img 
        src={logoImage} 
        alt="S3 Queue Logo" 
        style={{ 
          height: '40px', // Чуть увеличил, чтобы соответствовать высоте в хедере
          width: 'auto',
          display: 'block'
        }} 
      />
    </Flex>
  );
};