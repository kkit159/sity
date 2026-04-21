/* eslint-disable @typescript-eslint/no-shadow */
import { type TAnyObject } from '../types';

/** Возвращает типизированный массив ключей объекта */
export const getObjectKeys = <T extends TAnyObject>(object: T) => {
  return Object.keys(object) as (keyof T)[];
};

type TKeyValueArray<T extends TAnyObject, K extends string | number | symbol> = K extends keyof T ? [K, T[K]] : never;

/** Возвращает типизированный массив записей [ключ, значение] для объекта */
export const getObjectEntries = <T extends TAnyObject>(object: T) => {
  return Object.entries(object) as TKeyValueArray<T, keyof T>[];
};

/** Создает новый объект, выбирая только указанные ключи из исходного объекта */
export const pick = <T extends TAnyObject, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K> => {
  return keys.reduce(
    (result, key) => {
      if (Object.hasOwn(object, key)) {
        result[key] = object[key];
      }

      return result;
    },
    {} as Pick<T, K>,
  );
};

/** Создает новый объект, исключая указанные ключи из исходного объекта */
export const omit = <T extends TAnyObject, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K> => {
  const keysSet = new Set(keys);

  return Object.fromEntries(
    getObjectEntries(object).filter(([key]) => {
      return !keysSet.has(key as K);
    }),
  );
};

/** Конвертирует объект в FormData */
export const toFormData = (object: TAnyObject) => {
  const formData = new FormData();

  Object.entries(object).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        value.forEach((value) => {
          formData.append(key, value === null ? '' : (value as string | Blob));
        });
      } else {
        formData.append(key, '');
      }
    } else {
      formData.append(key, value === null ? '' : (value as string | Blob));
    }
  });

  return formData;
};
