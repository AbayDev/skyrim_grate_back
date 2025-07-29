// src/common/list/utils/with-user-filter.ts
import { BaseListFilterGroup } from '../types/base-filter.type';

export function withUserFilter(
  filter: BaseListFilterGroup | undefined,
  userId: number,
): BaseListFilterGroup {
  const userFilter: BaseListFilterGroup = {
    operator: 'AND',
    conditions: [
      {
        operator: 'eq',
        field: 'userId',
        value: userId,
      },
    ],
  };

  if (filter) {
    userFilter.conditions.push(filter);
  }

  return userFilter;
}
