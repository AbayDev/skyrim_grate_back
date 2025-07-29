/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BaseListParams } from '../types/base-list-params.type';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseListFilterGroup } from '../types/base-filter.type';
import { BaseListReturn } from '../types/base-list-return.type';
import { withUserFilter } from '../utils/with-user-filter';

/**
 * Сервис управление списками
 */
export class BaseListService<T extends Record<string, any>> {
  /**
   *
   * @param repository - репозитории сущности
   * @param searchableFields - массив своств для поиска
   * @param qbAlias - название для qb
   */
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly searchableFields: (keyof T)[],
    protected readonly qbAlias: string,
  ) {}

  /**
   * Получить список
   * @param params - параметры фильтрации и сортировки списка
   */
  public async findList(params: BaseListParams): Promise<BaseListReturn<T>> {
    const qb = this.repository.createQueryBuilder(this.qbAlias);
    BaseListService.applyQuery(qb, this.qbAlias, params);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
    };
  }

  public async findListByUser(
    userId: number,
    params: BaseListParams,
  ): Promise<BaseListReturn<T>> {
    params.filter = withUserFilter(params.filter, userId);

    return this.findList(params);
  }

  /**
   * Применить фиьтры и сортировки для query builder
   * @param qb - query builder
   * @param alias - название для query bulder
   * @param params - параметры фильтрации и сортировки
   */
  private static applyQuery<T extends Record<string, any>>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    { page, limit, sortBy, sortOrder, search, filter }: BaseListParams,
    searchFields?: string[],
  ) {
    if (page && limit) {
      const skip = (page - 1) * limit;

      // Пагинация
      qb.skip(skip).take(limit);
    }

    if (sortBy && sortOrder) {
      // Сортировка
      qb.orderBy(`${alias}.${sortBy}`, sortOrder);
    }

    // Общий поиск
    if (search && searchFields && searchFields.length > 0) {
      qb.andWhere(
        new Brackets((qbWhere) => {
          for (const field of searchFields) {
            qbWhere.orWhere(`${alias}.${field} ILIKE :search`, {
              search: `%${search}%`,
            });
          }
        }),
      );
    }

    // Фильтры
    if (filter) {
      BaseListService.applyFilters(qb, alias, filter);
    }

    return qb;
  }

  private static applyFilters<T extends Record<string, any>>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    group: BaseListFilterGroup,
    parentOperator: 'AND' | 'OR' = 'AND',
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const bracketFn = (
      parentOperator === 'AND' ? qb.andWhere.bind(qb) : qb.orWhere.bind(qb)
    ) as CallableFunction;

    if (typeof bracketFn === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      bracketFn(
        new Brackets((subQb) => {
          for (const condition of group.conditions) {
            if ('field' in condition) {
              const key = `${alias}.${condition.field}`;
              const paramKey = `${condition.field}_${Math.random().toString(36).slice(2, 8)}`;

              switch (condition.operator) {
                case 'eq':
                  subQb.andWhere(`${key} = :${paramKey}`, {
                    [paramKey]: condition.value,
                  });
                  break;
                case 'like':
                  subQb.andWhere(`${key} ILIKE :${paramKey}`, {
                    [paramKey]: `%${condition.value}%`,
                  });
                  break;
                case 'in':
                  subQb.andWhere(`${key} IN (:...${paramKey})`, {
                    [paramKey]: condition.value,
                  });
                  break;
                case 'gt':
                  subQb.andWhere(`${key} > :${paramKey}`, {
                    [paramKey]: condition.value,
                  });
                  break;
                case 'lt':
                  subQb.andWhere(`${key} < :${paramKey}`, {
                    [paramKey]: condition.value,
                  });
                  break;
                case 'gte':
                  subQb.andWhere(`${key} >= :${paramKey}`, {
                    [paramKey]: condition.value,
                  });
                  break;
                case 'lte':
                  subQb.andWhere(`${key} <= :${paramKey}`, {
                    [paramKey]: condition.value,
                  });
                  break;
              }
            } else {
              this.applyFilters(
                subQb as SelectQueryBuilder<Record<string, any>>,
                alias,
                condition,
                condition.operator,
              );
            }
          }
        }),
      );
    }
  }
}
