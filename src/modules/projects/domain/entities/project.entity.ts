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
  dateStart?: Date;
  /**
   * Дата предупреждения начало
   */
  dateWStart?: Date;
  /**
   * Дата окончания
   */
  dateEnd?: Date;
  /**
   * Реальное дата окончания
   */
  dateEndReal?: Date;
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
