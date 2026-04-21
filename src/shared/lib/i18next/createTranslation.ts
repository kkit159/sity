/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-shadow */
import i18next from './init'; // Берем наш инициализированный инстанс
import { type i18n } from 'i18next';
import { type ComponentProps, type ReactElement, createElement } from 'react';
import { Trans, useTranslation as useTranslationBase } from 'react-i18next';
import { type Replace } from 'type-fest';
import { v4 as uuid } from 'uuid';
import { type TAnyObject } from '../types';

type TPluralKey = '_zero' | '_one' | '_two' | '_few' | '_many' | '_other';
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;
type ReplacePluralKey<T> = T extends `${infer K}${TPluralKey}` ? K : T;

export type TPluralKeys<T> = T extends TAnyObject
    ? {
        [K in keyof T]: K extends string
            ? T[K] extends TAnyObject
                ? T[K] extends Record<string, string>
                    ? keyof T[K] extends string
                        ? `${K}.${ReplacePluralKey<Extract<keyof T[K], string>>}`
                        : never
                    : `${K}${DotPrefix<TPluralKeys<T[K]>>}`
                : `${ReplacePluralKey<K>}`
            : never;
    }[keyof T & string]
    : never;

type TPluralObject<T> = Record<
    { [K in keyof T]: K extends string ? Replace<K, TPluralKey, string> : never; }[keyof T],
    { [K in keyof T]: T[K] extends string ? string : TPluralObject<T[K]>; }[keyof T]
>;

export type TUseTranslationResult<T> = {
    t: (key: TPluralKeys<T> | string, options?: any) => any;
    i18n: i18n;
    ready: boolean;
};

export type ITransProps<T> = {
    i18nKey: TPluralKeys<T> | keyof T;
    options?: TAnyObject;
    components: ReactElement[] | Record<string, ReactElement>;
};

export const createTranslation = <T>(keyset: { ru: TPluralObject<T>; en: TPluralObject<T>; sr?: TPluralObject<T> }) => {
    const namespaceId = uuid();

    // Регистрируем переводы
    i18next.addResourceBundle('ru', namespaceId, keyset.ru, true, true);
    i18next.addResourceBundle('en', namespaceId, keyset.en, true, true);
    if (keyset.sr) i18next.addResourceBundle('sr', namespaceId, keyset.sr, true, true);

    const useTranslation = () => {
        return useTranslationBase(namespaceId, { i18n: i18next }) as TUseTranslationResult<T>;
    };
    
    const tStandAlone = (key: TPluralKeys<T> | string, options?: TAnyObject) => {
        return i18next.t(`${namespaceId}:${key as string}`, options);
    };

    // ПРАВКА: Вернули компонент, чтобы импорты из 'react' и 'react-i18next' не были лишними
    const Component = (props: ITransProps<T>) => {
        const { i18nKey, options, components } = props;
        const { t } = useTranslation();

        return createElement(Trans, {
            t,
            i18nKey,
            count: options?.count,
            tOptions: options,
            components,
        } as ComponentProps<typeof Trans>) as ReactElement;
    };

    return {
        t: tStandAlone,
        Trans: Component,
        useTranslation,
    };
};