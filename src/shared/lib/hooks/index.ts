/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md */
export const useEvent = <T extends (...args: any[]) => any>(handler: T): T => {
  const handlerRef = useRef<T>(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback(
    ((...args) => {
      const function_ = handlerRef.current;

      return function_.apply(this, args);
    }) as T,
    [],
  );
};

/**
 * Возвращает передаваемое значение с эффектом "debounce"
 * Может быть полезен, если вы хотите выполнить сложную операцию на основе состояния, например, отправить поисковый запрос
 *
 */
export const useDebounceValue = <T>(value: T, delay?: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay ?? 300);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useMount = (callback: () => void) => {
  const event = useEvent(callback);

  useEffect(() => {
    event();
  }, []);
};

export const useUnmount = (callback: () => void) => {
  const event = useEvent(callback);

  useEffect(() => {
    return () => {
      event();
    };
  }, []);
};
