import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from './get-profile.query';
import { UserEntity } from 'src/modules/users/infrastruture/database/user.entity';
import { UserService } from 'src/modules/users/application/service/user.service';
import { NotFoundException } from '@nestjs/common';
import { LogService } from 'src/modules/logs/application/service/log.service';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    private readonly usersService: UserService,
    private readonly logService: LogService,
  ) {}

  async execute(query: GetProfileQuery): Promise<{ user: UserEntity }> {
    const user = await this.usersService.findById(query.userId);

    if (!user) {
      const message = `пользователь с id ${query.userId} не найден`;
      await this.logService.error({
        context: 'Профиль',
        message,
        payload: {
          actor: {
            type: LogActor.User,
            id: query.userId,
          },
          entity: {
            type: LogEntity.User,
            id: query.userId,
          },
          reason: ErrorLogReason.UserNotFound,
        },
      });
      throw new NotFoundException(message);
    }

    return {
      user,
    };
  }
}
