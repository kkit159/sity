/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sonarjs/function-return-type */
/* eslint-disable @typescript-eslint/no-shadow */
import queryString from 'query-string';
import { useEffect, useState } from 'react';

import { type TAnyObject } from '../types';

const listeners = new Set<CallableFunction>();

/** Возвращает значения текущих search-параметров из url  */
const get = <T extends TAnyObject>() => {
  return queryString.parse(globalThis.location.search, {
    decode: true,
    parseNumbers: true,
    parseBooleans: true,
  }) as Partial<T>;
};

/** Заменяет значения search-параметров текущего url без перезагрузки страницы  */
const set = (data: TAnyObject) => {
  const search = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });
  const url = new URL(globalThis.location.toString());

  url.search = search;

  globalThis.history.replaceState(globalThis.history.state, '', url);
  listeners.forEach((notify) => {
    return notify();
  });
};

export const useSearchParamsWatch = <T extends TAnyObject>() => {
  const [state, setState] = useState<Partial<T>>(() => {
    return get();
  });

  useEffect(() => {
    const onChange = () => {
      setState(get());
    };

    listeners.add(onChange);

    return () => {
      listeners.delete(onChange);
    };
  }, []);

  return state;
};

/**
 * Сервис для управления search-параметрами
 *  get - Возвращает значения текущих search-параметров из url
 *  set - Заменяет значения search-параметров текущего url без перезагрузки страницы
 *  data - Объект с текущими параметрами, присваивание значений в этот объект обновляет url без перезагрузки страницы
 *
 *  @example
 *  const params = searchParams.get<TSearchParams>(); // получить текущие параметры
 *
 *  searchParams.set({ data: 123 }); // заменить текущие параметры
 *
 *  searchParams.data // объект с текущими параметрами
 *  searchParams.data.myParam = 777 // задать значение полю myParam
 *
 */
export const searchParams = new Proxy(
  {
    get,
    set,
    data: {} as TAnyObject,
    useWatch: useSearchParamsWatch,
  },
  {
    get: (target, key) => {
      if (key === 'data') {
        return new Proxy(target.get(), {
          set: (target: Partial<TAnyObject>, key: string | symbol, value: any) => {
            set({ ...target, [key]: value });

            return true;
          },
        });
      }

      return target[key as keyof typeof target];
    },
  },
);

/** Метод для типизации объекта searchParams */
export const getTypedSearchParams = <T extends TAnyObject>() => {
  return searchParams as {
    get: () => Partial<T>;
    set: (data: Partial<T>) => void;
    data: Partial<T>;
    useWatch: () => Partial<T>;
  };
};
