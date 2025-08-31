import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { GetProfileHandler } from './application/query/get-progile/get-profile.handler';
import { ProfileController } from './presentation/contollers/profile.controller';

@Module({
  imports: [UsersModule],
  providers: [GetProfileHandler],
  controllers: [ProfileController],
})
export class ProfileModule {}
