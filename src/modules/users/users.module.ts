import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastruture/database/user.entity';
import { UserRepository } from './infrastruture/repository/user.repository';
import { UserService } from './application/service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UsersModule {}
