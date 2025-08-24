import { Injectable } from '@nestjs/common';
import { UserSessionCreate } from '../../domain/types/user-session-create';
import { HashService } from './hash.service';
import { UserSessionRepository } from '../../infrastructure/repository/user-session.repository';
import { LogService } from 'src/modules/logs/application/service/log.service';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';

@Injectable()
export class UserSessionService {
  constructor(
    private readonly hashService: HashService,
    private readonly userSessionRepository: UserSessionRepository,
    private readonly logService: LogService,
  ) {}

  public async startSession(
    session: Omit<UserSessionCreate, 'refreshTokenHash'> & {
      refreshToken: string;
    },
  ) {
    let refreshTokenHash: string;
    try {
      refreshTokenHash = await this.hashService.hashToken(session.refreshToken);
    } catch (e) {
      await this.logService.error({
        context: 'Сессия',
        message: 'не удалось захешировать токен обновления',
        payload: {
          actor: {
            type: LogActor.User,
            id: String(session.userId),
          },
          entity: {
            type: LogEntity.UserSession,
            details: {
              userId: session.userId,
            },
          },
          reason: ErrorLogReason.TokenHashFailed,
        },
        errorInstance: e,
      });
      throw e;
    }

    try {
      return await this.userSessionRepository.create({
        ...session,
        refreshTokenHash: refreshTokenHash,
      });
    } catch (e) {
      await this.logService.error({
        context: 'Сессия',
        message: 'не удалось создать сессию пользователя',
        payload: {
          actor: {
            type: LogActor.User,
            id: String(session.userId),
          },
          entity: {
            type: LogEntity.UserSession,
            details: {
              userId: session.userId,
            },
          },
          reason: ErrorLogReason.UserSessionCreateFailed,
        },
        errorInstance: e,
      });
      throw e;
    }
  }

  public async endSession(refreshTokenHash: string) {
    try {
      await this.userSessionRepository.deleteByRefreshToken(refreshTokenHash);
      await this.logService.info({
        context: 'Сессия',
        message: 'сессия пользователя закончена',
        payload: {
          actor: {
            type: LogActor.System,
            id: 'UserSessionService',
          },
          entity: {
            type: LogEntity.UserSession,
          },
        },
      });
    } catch (e) {
      await this.logService.error({
        context: 'Сессия',
        message: 'не удалось удалить сессию',
        payload: {
          actor: {
            type: LogActor.System,
            id: 'UserSessionService',
          },
          entity: {
            type: LogEntity.UserSession,
          },
          reason: ErrorLogReason.UserSessionDeleteFailed,
        },
        errorInstance: e,
      });
      throw e;
    }
  }
}
