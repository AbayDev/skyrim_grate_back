import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../infrastructure/repasitories/project.repository';
import { BaseListParams } from 'src/common/list/types/base-list-params.type';
import { CreateProjectDto } from '../../dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async getUserProjects(userId: number, params: BaseListParams) {
    return this.repository.findByUserId(userId, params);
  }

  async create(userId: number, project: CreateProjectDto) {
    return this.repository.create(userId, project);
  }
}
