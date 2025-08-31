import { Query } from '@nestjs/cqrs';
import { UserEntity } from 'src/modules/users/infrastruture/database/user.entity';

export class GetProfileQuery extends Query<{
  user: UserEntity;
}> {
  constructor(public readonly userId: string) {
    super();
  }
}
