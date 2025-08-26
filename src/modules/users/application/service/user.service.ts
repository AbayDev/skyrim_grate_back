import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastruture/repository/user.repository';
import { LogService } from 'src/modules/logs/application/service/log.service';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logService: LogService,
  ) {}

  public findByNickname(nickname: string) {
    return this.userRepository.findByNickname(nickname);
  }

  public async createUser(nickname: string, password: string) {
    try {
      const user = await this.userRepository.create(nickname, password);

      await this.logService.info({
        context: 'Создание пользователя',
        message: `пользователь ${nickname} был создан`,
        payload: {
          actor: {
            type: LogActor.System,
            id: 'UserService',
          },
          entity: {
            type: LogEntity.User,
            id: user.id,
            details: {
              nickname,
            },
          },
        },
      });

      return user;
    } catch (e) {
      await this.logService.error({
        context: 'Создание пользователя',
        message: `не удалось создать пользователя ${nickname}`,
        payload: {
          actor: {
            type: LogActor.System,
            id: 'UserService',
          },
          entity: {
            type: LogEntity.User,
            details: {
              nickname,
            },
          },
          reason: ErrorLogReason.UserCreateFailed,
        },
        errorInstance: e,
      });
      throw e;
    }
  }
}
