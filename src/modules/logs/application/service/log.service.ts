import { Injectable } from '@nestjs/common';
import { LogRepository } from '../../infrastructure/repository/log.reposity';
import { LogType } from '../../domain/types/log-type';
import {
  LoggedError,
  LogInputBase,
  LogInputError,
  LogInputInfo,
  LogInputWarning,
} from '../../domain/types/log-input';

type WriteLogAdditionalParams = {
  stack?: string;
};

type WriteLogArgs = {
  type: LogType;
  input: LogInputBase;
  params?: WriteLogAdditionalParams;
};

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  /**
   * Форматирование сообщения лога
   * @param context событие, например "Регистрация"
   * @param message основное сообщение
   *
   * @example
   * ```
   *   const message = this.logService.formatMessage("Регистрация", "Пользователь не смог зарегистроваться, так как никнейс test уже занят")
   * this.logService.error({
   *  message,
   *  payload: JSON.stringify({ nickname: 'test }),
   * })
   * ```
   */
  private formatMessage(context: string, message: string) {
    return `${context}: ${message}`;
  }

  /**
   * Добавить запись лога
   * @param data - данные для записи
   */
  private writeLog(data: WriteLogArgs) {
    const formattedMessage = this.formatMessage(
      data.input.context,
      data.input.message,
    );

    return this.logRepository.create({
      message: formattedMessage,
      payload: data.input.payload,
      stack: data.params?.stack,
      type: data.type,
    });
  }

  /**
   * Получить текущий стек вызывов
   */
  private getCurrentErrorStack() {
    const stack = new Error().stack;
    if (!stack) {
      return '';
    }

    // убираем 2 первые строки, что бы не включать вызов `getCurrentErrorStack`
    return stack.split('\n').slice(2).join('/n');
  }

  /**
   * Добавить запись логка как информацию
   */
  public info(data: LogInputInfo) {
    return this.writeLog({
      input: data,
      type: LogType.INFO,
    });
  }

  /**
   * Добавить запись лога как ошибку
   */
  public error(data: LogInputError) {
    // говорим что ошибка уже в логе
    if (data.errorInstance && data.errorInstance instanceof Error) {
      const typeErrorInstance = data.errorInstance as LoggedError;
      typeErrorInstance.isLogged = true;
      // сообщение ошибки, что бы понимать где точно ошибка
      data.payload.systemErrorMessage = typeErrorInstance.message;
    }

    return this.writeLog({
      input: data,
      type: LogType.ERROR,
      params: {
        // В ошибке требуется стек, что бы легче найти в коде
        stack: this.getCurrentErrorStack(),
      },
    });
  }

  /**
   * Добавить запись лога как предупреждение
   */
  public warning(data: LogInputWarning) {
    return this.writeLog({
      input: data,
      type: LogType.WARNING,
    });
  }
}
