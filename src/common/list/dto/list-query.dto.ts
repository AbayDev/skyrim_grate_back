import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ListSortOrder } from '../enums/list-sort-order.enum';
import { Transform, Type } from 'class-transformer';
import { BaseListFilterGroup } from '../types/base-filter.type';

export class ListQueryDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  /**
   * Количество записей
   */
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  /**
   * Страница списка
   */
  page?: number;

  @IsOptional()
  @IsString()
  /**
   * Сортировать по
   */
  sortBy?: string;

  @IsOptional()
  @IsEnum(ListSortOrder)
  /**
   * Направление сортировки
   */
  sortOrder?: ListSortOrder;

  @IsOptional()
  @IsString()
  /**
   * Общий поиск
   */
  search?: string;

  @Transform(({ value }) => {
    try {
      if (typeof value === 'string') {
        return JSON.parse(value) as BaseListFilterGroup;
      }
      return undefined;
    } catch {
      return undefined;
    }
  })
  @IsOptional()
  /**
   * Универсальная фильтрация списка
   */
  filter?: BaseListFilterGroup;
}
