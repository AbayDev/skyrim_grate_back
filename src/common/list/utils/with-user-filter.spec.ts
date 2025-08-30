import { BaseListFilterGroup } from '../types/base-filter.type';
import { withUserFilter } from './with-user-filter';

describe('withUserFilter', () => {
  const userId = 42;

  it('должен возвращать фильтр только с userId, если filter не передан', () => {
    const result = withUserFilter(undefined, userId);

    expect(result).toEqual<BaseListFilterGroup>({
      operator: 'AND',
      conditions: [
        {
          operator: 'eq',
          field: 'userId',
          value: userId,
        },
      ],
    });
  });

  it('должен добавлять фильтр userId и объединять с переданным фильтром через AND', () => {
    const customFilter: BaseListFilterGroup = {
      operator: 'OR',
      conditions: [
        {
          operator: 'eq',
          field: 'status',
          value: 'active',
        },
      ],
    };

    const result = withUserFilter(customFilter, userId);

    expect(result).toEqual<BaseListFilterGroup>({
      operator: 'AND',
      conditions: [
        {
          operator: 'eq',
          field: 'userId',
          value: userId,
        },
        customFilter,
      ],
    });
  });
});
