/**
 * Кто инициатор действия
 */
export enum LogActor {
  User = 'user',
  System = 'system',
}

/**
 * Логируемая сущность
 */
export enum LogEntity {
  User = 'user',
  UserSession = 'user-session',
  Token = 'token',
}

/**
 * Причина ошибки в виде уникального кода.
 * Нужно для диагностики и статистики ошибок.
 */
export enum ErrorLogReason {
  UnhandlerError = 'UnhandlerError',
  NicknameAlreadyExist = 'NicknameAlreadyExist',
  NicknameNotFound = 'NicknameNotFound',
  PasswordHashFailed = 'PasswordHashFailed',
  TokenHashFailed = 'TokenHashFailed',
  TokenGenerateFailed = 'TokenGenerateFailed',
  TokenVerifyFailed = 'TokenVerifyFailed',

  UserCreateFailed = 'UserCreateFailed',
  UserSessionCreateFailed = 'UserSessionCreateFailed',
  UserSessionDeleteFailed = 'UserSessionDeleteFailed',
}

export interface BaseLogPayload {
  /**
   * Инициатор действия
   */
  actor: {
    type: LogActor;
    /**
     * Если пользователь, то его идентификатор
     */
    id?: string;
  };
  /**
   * Логируемая сущность
   */
  entity: {
    type: LogEntity;
    /**
     * Идентификатор сущности
     */
    id?: string;
    /**
     * Полезные данные
     */
    details?: Record<string, unknown>;
  };
}

export interface ErrorLogPayload extends BaseLogPayload {
  /**
   * Причина ошибки в виде кода.
   * Нужно для диагностики и статистики ошибок.
   */
  reason: ErrorLogReason;
  /**
   * Сообщение системной ошибки
   */
  systemErrorMessage?: string;
}

export type LogPayload = ErrorLogPayload | BaseLogPayload;
