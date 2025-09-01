import { ProjectRepository } from './infrastructure/repository/project.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './presentation/controller/project.controller';
import { ProjectService } from './application/service/project.service';
import { ProjectEntity } from './infrastructure/database/project.entity';
import { UsersModule } from '../users/users.module';
import { CreateUserProjectHandler } from './application/command/create-user-project/create-user-project.handler';
import { GetUserProjectsHandler } from './application/query/get-user-projects/get-user-projects.handler';
import { UserProjectController } from './presentation/controller/user-project.controller';
import { PatchUserProjectHandler } from './application/command/patch-user-project/patch-user-project.handler';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), UsersModule],
  controllers: [ProjectController, UserProjectController],
  providers: [
    ProjectRepository,
    ProjectService,
    GetUserProjectsHandler,
    CreateUserProjectHandler,
    PatchUserProjectHandler,
  ],
})
export class ProjectModule {}
