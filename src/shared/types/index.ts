// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TAnyObject = Record<string, any>;
export type TNullable<T> = { [key in keyof T]: T[key] | null };

export type IPaginator = {
  page: number;
  pages: number;
  pageSize: number;
  total: number | null;
};
