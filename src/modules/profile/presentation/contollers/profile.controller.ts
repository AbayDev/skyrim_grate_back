import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { User } from 'src/common/decorators/user.decorator';
import { GetProfileQuery } from '../../application/query/get-progile/get-profile.query';

@Controller('profile')
export class ProfileController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getProfile(@User() user: RequestUser) {
    const result = await this.queryBus.execute(
      new GetProfileQuery(user.userId),
    );

    return result;
  }
}
