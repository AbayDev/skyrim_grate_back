import { DifficultyLevel } from '../../../../shared/enums/difficulty-level.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description?: string;

  @Column({ type: 'timestamp', name: 'date_start', nullable: true })
  dateStart?: string;

  @Column({ type: 'timestamp', name: 'date_w_start', nullable: true })
  dateWStart?: string;

  @Column({ type: 'timestamp', name: 'date_end', nullable: true })
  dateEnd?: string;

  @Column({ type: 'timestamp', name: 'date_end_real', nullable: true })
  dateEndReal?: string;

  @Column({ type: 'enum', enum: DifficultyLevel })
  level: DifficultyLevel;

  @Column({ type: 'varchar', name: 'icon_name', length: 50 })
  iconName: string;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;
}
