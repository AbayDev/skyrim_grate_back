import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LogType } from '../../domain/types/log-type';
import { isObject } from 'src/shared/utils/isObject';
import { LogPayload } from '../../domain/types/log-payload';

const PAYLOAD_MAX_LENGTH = 10000;

const truncuateJSONValue = (value: LogPayload | string) => {
  if (typeof value === 'string' && value.length > PAYLOAD_MAX_LENGTH) {
    return value.slice(0, 10000);
  } else if (isObject(value)) {
    const stringified = JSON.stringify(value);

    if (stringified.length > PAYLOAD_MAX_LENGTH) {
      return stringified.slice(0, 10000);
    }
  }

  return value;
};

@Entity('logs')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: LogType })
  type: LogType;

  /**
   * 1000 символов достаточно для основного сообщения
   */
  @Column({ type: 'varchar', length: 1000 })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  payload?: LogPayload | string;

  /**
   * Ограничение 4000 символов хватит для стека,
   * если нужно больше, то можно и 6000-8000 символов
   */
  @Column({ type: 'varchar', length: 4000, nullable: true })
  stack?: string;

  @CreateDateColumn()
  createAt: Date;

  @BeforeInsert()
  beforeInsert() {
    if (this.payload) {
      this.payload = truncuateJSONValue(this.payload);
    }
  }
}
