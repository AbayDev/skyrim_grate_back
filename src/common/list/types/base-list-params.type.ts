import { ListSortOrder } from '../enums/list-sort-order.enum';
import { BaseListFilterGroup } from './base-filter.type';

export type BaseListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: ListSortOrder;
  search?: string;
  filter?: BaseListFilterGroup;
};
