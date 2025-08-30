import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthTokenResponse } from 'src/modules/auth/domain/types/auth-token-response';
import { ReauthenticateCommand } from './reauthenticate.command';
import { TokenService } from '../../service/token.service';
import { UserService } from 'src/modules/users/application/service/user.service';
import { NotFoundException } from '@nestjs/common';
import { LogService } from 'src/modules/logs/application/service/log.service';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';
import { UserSessionService } from '../../service/user-session.service';

@CommandHandler(ReauthenticateCommand)
export class ReauthenticateHandler
  implements ICommandHandler<ReauthenticateCommand>
{
  constructor(
    private tokenService: TokenService,
    private usersService: UserService,
    private logService: LogService,
    private userSessionService: UserSessionService,
  ) {}

  async execute(command: ReauthenticateCommand): Promise<AuthTokenResponse> {
    const payload = this.tokenService.verifyRefreshToken(command.refreshToken);

    const user = await this.usersService.findOneBy({
      id: payload.userId,
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    try {
      await this.userSessionService.endSession(user.id, command.refreshToken);
    } catch {
      //
    }

    let accessToken: string;
    let refreshToken: string;
    try {
      accessToken = this.tokenService.generateAccessToken(user.id);
      refreshToken = this.tokenService.generateRefreshToken(user.id);
    } catch (e) {
      await this.logService.error({
        context: 'Обновление токена',
        message: 'не удалось сгенерировать токены',
        payload: {
          actor: {
            type: LogActor.User,
            id: user.id,
          },
          entity: {
            type: LogEntity.User,
            id: user.id,
          },
          reason: ErrorLogReason.TokenGenerateFailed,
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

    return {
      accessToken,
      refreshToken,
    };
  }
}
