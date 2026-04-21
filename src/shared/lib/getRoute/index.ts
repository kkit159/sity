/* eslint-disable unicorn/prevent-abbreviations */
export type TRouteParam<T extends string> = `/${T}/` extends `${infer S1}/:${infer P}/${infer S2}`
  ? P | TRouteParam<S1> | TRouteParam<S2>
  : never;

export const getRoute = <T extends string>(route: T, config?: Record<TRouteParam<T>, string | number>) => {
  return Object.entries((config as Record<string, unknown>) ?? {}).reduce<string>((result, [key, value]) => {
    return result.replace(`:${key}`, String(value));
  }, route);
};
