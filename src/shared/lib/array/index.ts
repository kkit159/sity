/* eslint-disable unicorn/prevent-abbreviations */
/**
 * Вычисляет (циклически) следующий индекс в массиве.
 *
 * Пример использования:
 * const length = 5;
 * let currentIdx = 3;
 * let nextIdx = getNextIdx(currentIdx, length); // 4
 *
 * currentIdx = 4;
 * nextIdx = getNextIdx(currentIdx, length) // 0
 */
export const getNextIdx = (currentIndex: number, length: number) => {
  return (currentIndex + 1) % length;
};

/**
 * Вычисляет (циклически) предыдущий индекс в массиве.
 *
 * Пример использования:
 * const length = 5;
 * let currentIdx = 3;
 * let prevIdx = getPrevIdx(currentIdx, length); // 2
 *
 * currentIdx = 0;
 * prevIdx = getPrevIdx(currentIdx, length); // 4
 */
export const getPrevIdx = (currentIndex: number, length: number) => {
  return (currentIndex - 1 + length) % length;
};
