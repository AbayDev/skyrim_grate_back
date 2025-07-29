/**
 * Условие фильтра
 */
export interface BaseListFilterCondition {
  /**
   * Поле по которому фильтровать
   */
  field: string;
  /**
   * Тип фильтрации
   */
  operator: 'eq' | 'like' | 'in' | 'gt' | 'lt' | 'gte' | 'lte';
  /**
   * Значение фильтра
   */
  value: any;
}

export interface BaseListFilterGroup {
  /**
   * Тип группировки фильтра
   */
  operator: 'AND' | 'OR';
  /**
   * Условия
   */
  conditions: (BaseListFilterCondition | BaseListFilterGroup)[];
}
