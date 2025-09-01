import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { TokenService } from '../../service/token.service';
import { UserService } from 'src/modules/users/application/service/user.service';
import { ConflictException } from '@nestjs/common';
import { AuthTokenResponse } from 'src/modules/auth/domain/types/auth-token-response';
import { LogService } from 'src/modules/logs/application/service/log.service';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';
import { UserSessionService } from '../../service/user-session.service';
import { HashService } from '../../service/hash.service';
import { PasswordStrengthService } from '../../service/password-strength.service';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
    private readonly logService: LogService,
    private readonly passwordStrengthService: PasswordStrengthService,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthTokenResponse> {
    const isNicknameBusy = await this.userService.findByNickname(
      command.nickname,
    );

    if (isNicknameBusy) {
      const errorMessage = `пользователь с никнеймом ${command.nickname} уже существует`;
      await this.logService.error({
        message: errorMessage,
        context: 'Регистрация',
        payload: {
          reason: ErrorLogReason.NicknameAlreadyExist,
          actor: {
            type: LogActor.System,
          },
          entity: {
            type: LogEntity.User,
            details: {
              nickname: command.nickname,
            },
          },
        },
      });
      throw new ConflictException(errorMessage);
    }

    try {
      await this.passwordStrengthService.validate(
        command.password.normalize('NFC'),
      );
    } catch (e) {
      await this.logService.error({
        context: 'Регистрация',
        message: 'введенный пароль в базе скомпрометированых данных',
        payload: {
          actor: {
            type: LogActor.System,
            id: 'PasswordStrengthService',
          },
          entity: {
            type: LogEntity.User,
            details: {
              nickname: command.nickname,
            },
          },
          reason: ErrorLogReason.PasswordStrengthFailed,
        },
        errorInstance: e,
      });
      throw e;
    }

    let passwordHash: string;
    try {
      passwordHash = await HashService.hashPassword(
        command.password.normalize('NFC'),
      );
    } catch (e) {
      await this.logService.error({
        context: 'Регистрация',
        message: 'не удалось захешировать пароль',
        payload: {
          actor: {
            type: LogActor.System,
            id: 'HashService',
          },
          entity: {
            type: LogEntity.User,
            details: {
              nickname: command.nickname,
            },
          },
          reason: ErrorLogReason.PasswordHashFailed,
        },
      });
      throw e;
    }

    const user = await this.userService.createUser(
      command.nickname,
      passwordHash,
    );

    let accessToken: string;
    let refreshToken: string;
    try {
      accessToken = this.tokenService.generateAccessToken(user.id);
      refreshToken = this.tokenService.generateRefreshToken(user.id);
    } catch (e) {
      await this.logService.error({
        context: 'Регистрация',
        message: 'не удалось сгенировать токен доступа',
        payload: {
          reason: ErrorLogReason.TokenGenerateFailed,
          actor: {
            type: LogActor.System,
            id: 'TokenService',
          },
          entity: {
            type: LogEntity.User,
            details: {
              nickname: command.nickname,
            },
          },
        },
        errorInstance: e,
      });
      throw e;
    }

    await this.userSessionService.startSession({
      refreshToken,
      userId: user.id,
      ip: command.meta.ip,
      userAgent: command.meta.userAgent,
    });

    await this.logService.info({
      context: 'Регистрация',
      message: `пользователь ${command.nickname} зарегистроровался`,
      payload: {
        actor: {
          type: LogActor.User,
          id: user.id,
        },
        entity: {
          type: LogEntity.User,
          id: user.id,
        },
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
