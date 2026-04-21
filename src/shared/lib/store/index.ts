import { pick } from 'lodash-es';
import { useShallow } from 'zustand/react/shallow';

export const useShallowPicker = <T extends Record<string, unknown>, K extends keyof T>(...keys: K[]) => {
  return useShallow((state: T) => {
    return pick<T, K>(state, keys);
  });
};
