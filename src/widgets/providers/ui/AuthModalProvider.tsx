import React, { createContext, useContext, useState, useCallback } from 'react';
// Импортируем только AuthModal, так как логика ConfirmEmailModal уже встроена внутри него
import { AuthModal } from '@/widgets/AuthModal';

interface AuthContextType {
  openAuth: () => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthModal = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

interface AuthModalProviderProps {
  children: React.ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = useCallback(() => setIsAuthOpen(true), []);
  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  // Этот коллбэк сработает, когда пользователь либо успешно залогинится, 
  // либо пройдет ВЕСЬ флоу регистрации (ввод данных -> ввод кода с почты -> успех).
  // Убрали неиспользуемый аргумент, чтобы TypeScript (tsc) пропускал билд.
  const handleSuccess = useCallback(() => {
    setIsAuthOpen(false);
    // Если в будущем понадобится обновить глобальный стор (Zustand/Redux) 
    // с данными юзера после входа, добавишь аргумент обратно (например, _data?: any)
  }, []);

  return (
    <AuthContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      
      {/* Модалка рендерится один раз на уровне провайдера. 
        Внутри себя она уже содержит ConfirmEmailModal и ConfirmPhoneModal.
      */}
      <AuthModal 
        open={isAuthOpen} 
        onClose={closeAuth} 
        onSuccess={handleSuccess} 
      />
    </AuthContext.Provider>
  );
};