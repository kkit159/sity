/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isEmpty } from 'lodash-es';
import get from 'lodash-es/get';
import set from 'lodash-es/set';
import { useRef } from 'react';
import { type FieldNamesMarkedBoolean, type FieldValues, type Resolver } from 'react-hook-form';
import { type PartialDeep, type Paths } from 'type-fest';

import { useEvent } from '../hooks';
import { type TAnyObject } from '../types';

/**
 * Возвращает объект содержащий только измененные поля формы
 *  @example
 *  const form = useForm();
 *  const onSubmit = form.handleSubmit((data) => {
 *    const changedValues = getDirtyValues(data, form.formState.dirtyFields);
 *
 *    api.patchData(changedValues);
 *  });
 *
 */
export const getDirtyValues = <T extends FieldValues>(
  data: T,
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<T>>>,
): PartialDeep<T> => {
  const result = {};
  const keyPaths: string[] = [];

  const findKeyPaths = (object: Partial<Readonly<FieldNamesMarkedBoolean<T>>>, keyPath = '') => {
    Object.entries(object).forEach(([key, value]) => {
      const path = [keyPath, key].filter(Boolean).join('.');

      if (value === true) {
        keyPaths.push(path);
      } else if (typeof value === 'object' && value !== null) {
        findKeyPaths(value as Partial<Readonly<FieldNamesMarkedBoolean<T>>>, path);
      }
    });
  };

  findKeyPaths(dirtyFields);

  keyPaths.forEach((key) => {
    set(result, key, get(data, key));
  });

  return result as PartialDeep<T>;
};

type TSetError<T extends TAnyObject> = (key: Paths<T>, message: string) => void;
type TResolve<T extends TAnyObject> = (values: PartialDeep<T>, setError: TSetError<T>) => void;
type TMapValues<T, F> = (values: T) => F;

type IResolverWithGetData<T extends TAnyObject, F = T> = {
  getData: () => F;
} & Resolver<T>;

export const useResolver = <T extends TAnyObject, F = T>(
  resolve: TResolve<T>,
  map?: TMapValues<T, F>,
): IResolverWithGetData<T, F> => {
  const dataRef = useRef<F | null>(null);
  const getData = useEvent(() => {
    return dataRef.current as F;
  });
  // @ts-ignore
  const resolver = useEvent<Resolver<T>>((values) => {
    const errors: Record<string, { message: string }> = {};
    const setError: TSetError<T> = (key, message) => {
      set(errors, key, { message });
    };

    resolve(values as PartialDeep<T>, setError);

    if (isEmpty(errors)) {
      dataRef.current = (map?.(values) ?? values) as F;
    }

    return {
      values,
      errors,
    };
  });

  return Object.assign(resolver, { getData });
};

type IAddRequiredFieldsValidationArgs<T extends TAnyObject> = {
  fields: Paths<T>[];
  values: PartialDeep<T>;
  setError: TSetError<T>;
  errorMessage: string;
};

/**
 * Метод для добавления валидации с типом required на поля формы.
 * Используется в контексте хука useResolver
 */
export const addRequiredFieldsValidation = <T extends TAnyObject>(args: IAddRequiredFieldsValidationArgs<T>) => {
  const { fields, values, setError, errorMessage } = args;

  fields.forEach((key) => {
    const value = get(values, key);
    let isExist = value !== undefined && value !== null;

    if (typeof value === 'string') {
      isExist = Boolean(value.trim());
    }

    if (!isExist) {
      setError(key, errorMessage);
    }
  });
};
