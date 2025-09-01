import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticateCommand } from './authenticate.command';
import { AuthTokenResponse } from 'src/modules/auth/domain/types/auth-token-response';
import { UserSessionService } from '../../service/user-session.service';
import { TokenService } from '../../service/token.service';
import { HashService } from '../../service/hash.service';
import { UserService } from 'src/modules/users/application/service/user.service';
import { LogService } from 'src/modules/logs/application/service/log.service';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRateService } from '../../service/auth-rate.service';

@CommandHandler(AuthenticateCommand)
export class AuthenticateHandler
  implements ICommandHandler<AuthenticateCommand>
{
  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly tokenService: TokenService,
    private readonly usersService: UserService,
    private readonly logService: LogService,
    private readonly authRateService: AuthRateService,
  ) {}

  async execute(command: AuthenticateCommand): Promise<AuthTokenResponse> {
    const user = await this.usersService.findByNickname(command.nickname, {
      select: ['id', 'passwordHash'],
    });

    if (!user) {
      await this.logService.error({
        context: 'Авторизация',
        message: `пользователь с никнеймом ${command.nickname} не найден`,
        payload: {
          actor: {
            type: LogActor.System,
            id: 'UsersService',
          },
          entity: {
            type: LogEntity.User,
            details: {
              nickname: command.nickname,
            },
          },
          reason: ErrorLogReason.NicknameNotFound,
        },
      });
      throw new NotFoundException('Не верный никнейм или пароль');
    }

    await this.authRateService.checkLimit(command.nickname);

    const isPasswordEquals = await HashService.compare(
      command.password.normalize('NFC'),
      user.passwordHash,
    );

    if (!isPasswordEquals) {
      throw new UnauthorizedException('Не верный никнейм или пароль');
    }

    let accessToken: string;
    let refreshToken: string;

    try {
      accessToken = this.tokenService.generateAccessToken(user.id);
      refreshToken = this.tokenService.generateRefreshToken(user.id);
    } catch (e) {
      await this.logService.error({
        context: 'Авторизация',
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
      context: 'Авторизация',
      message: `пользователь ${command.nickname} авторизовался`,
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
