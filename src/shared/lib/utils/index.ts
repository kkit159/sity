/* eslint-disable sonarjs/pseudo-random */

const NBSP = '\u00A0';
const WIDOW_RE = / (в|и|а|но|к|с|у|о|по|за|на|до|об|из|от|без|для|при|над|под|или|не|ни|же|как|бы|что|то|чем|где) /g;

export const noWidow = (text: string): string =>
  text.replace(WIDOW_RE, `${NBSP}$1${NBSP}`);
export type IGetTimeInMsParams = {
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export const getTimeInMs = ({ hours = 0, minutes = 0, seconds = 0 }: IGetTimeInMsParams) => {
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
};

export type TGetRandomNumberInRangeParams =
  | {
      isInteger: true;
      step?: number;
    }
  | {
      isInteger?: false;
    };

export const getRandomNumberInRange = (min: number, max: number, options: TGetRandomNumberInRangeParams = {}) => {
  const randomValue = Math.random() * (max - min) + min;

  if (!options.isInteger) {
    return randomValue;
  }

  const { step = 1 } = options;

  return Math.round(randomValue / step) * step;
};

export type TWithJitterOptions = {
  withNegative?: boolean;
};

export const withJitter = (value: number, jitter: number, options: TWithJitterOptions = {}) => {
  const { withNegative = false } = options;

  const min = withNegative ? -jitter : 0;

  return value * (1 + getRandomNumberInRange(min, jitter) / 100);
};
