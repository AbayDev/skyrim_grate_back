import { BaseEntity } from 'src/shared/domain/base.entity';
import { DifficultyLevel } from 'src/shared/enums/difficulty-level.enum';

type ProjectProps = {
  id: number;
  /**
   * Название
   */
  name: string;
  /**
   * Описание проекта
   */
  description?: string;
  /**
   * Дата начало
   */
  dateStart?: string;
  /**
   * Дата предупреждения начало
   */
  dateWStart?: string;
  /**
   * Дата окончания
   */
  dateEnd?: string;
  /**
   * Реальное дата окончания
   */
  dateEndReal?: string;
  /**
   * Название иконки проекта
   */
  iconName: string;
  /**
   * Уровень сложности проекта
   */
  level: DifficultyLevel;
  /**
   * Идентификатор исполнителя проекта
   */
  userId: number;
};

export class Project extends BaseEntity<ProjectProps> {}
