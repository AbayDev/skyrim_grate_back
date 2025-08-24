import { LogType } from './log-type';
import { LogPayload } from './log-payload';

export type LogProps = {
  id: number;
  /**
   * Главное сообщение лога
   */
  message: string;
  /**
   * Тип лога, например ошибка
   */
  type: LogType;
  /**
   * Полезная нагрузка
   */
  payload?: LogPayload;
  /**
   * Стек вызовов
   */
  stack?: string;
  /**
   * Дата создания лога
   */
  createdAt: Date;
};
