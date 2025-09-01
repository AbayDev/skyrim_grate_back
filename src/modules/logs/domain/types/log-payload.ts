/**
 * Кто инициатор действия
 */
export enum LogActor {
  User = 'user',
  System = 'system',
  UnauthorizedUser = 'unauthorizedUser',
}

/**
 * Логируемая сущность
 */
export enum LogEntity {
  User = 'user',
  UserSession = 'user-session',
  Token = 'token',
  Project = 'project',
  Request = 'request',
  Redis = 'redis',
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
  PasswordStrengthFailed = 'PasswordStrengthFailed',
  TokenHashFailed = 'TokenHashFailed',
  TokenGenerateFailed = 'TokenGenerateFailed',
  TokenVerifyFailed = 'TokenVerifyFailed',

  UserNotFound = 'UserNotFound',

  UserCreateFailed = 'UserCreateFailed',
  UserSessionCreateFailed = 'UserSessionCreateFailed',
  UserSessionDeleteFailed = 'UserSessionDeleteFailed',

  ProjectCreateFailed = 'ProjectCreateFailed',
  ProjectNotFound = 'ProjectNotFound',
  ProjectUpdateFailed = 'ProjectUpdateFailed',

  RedisScriptFailed = 'RedisScriptFailed',
  RedisConnectFailed = 'RedisConnectFailed',
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
