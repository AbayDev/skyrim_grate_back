import { ProjectRepository } from './infrastructure/repository/project.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './presentation/controller/project.controller';
import { ProjectService } from './application/service/project.service';
import { ProjectEntity } from './infrastructure/database/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectController],
  providers: [ProjectRepository, ProjectService],
})
export class ProjectModule {}
