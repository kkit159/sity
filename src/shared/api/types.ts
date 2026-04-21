import { type TAnyObject } from 'shared/types';

export type IPaginationResponse<Data = TAnyObject> = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  result: Data[];
};
