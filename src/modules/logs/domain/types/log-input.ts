import { LogCreate } from './log-create';
import { BaseLogPayload, ErrorLogPayload } from './log-payload';

export type LogInputBase = Omit<
  LogCreate,
  'type' | 'id' | 'createAt' | 'message' | 'stack'
> & {
  /**
   * Событие, например "Регистрация"
   */
  context: string;
  /**
   * Основное сообщение
   */
  message: string;
};

export interface LoggedError extends Error {
  /**
   * Если `true`, значит ошибка уже в логе
   */
  isLogged?: boolean;
}

export type LogInputError = Omit<LogInputBase, 'payload'> & {
  payload: ErrorLogPayload;
  /**
   * Должен быть интстансом класса Error.
   * @important
   * Если был отловлен с помощью try catch,
   * то это обязательное свойство
   */
  errorInstance?: unknown;
};

export type LogInputInfo = Omit<LogInputBase, 'payload'> & {
  payload: BaseLogPayload;
};

export type LogInputWarning = Omit<LogInputBase, 'payload'> & {
  payload: BaseLogPayload;
};
