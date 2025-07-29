import { ProjectEntity } from './../database/project.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../domain/entities/project.entity';
import { ProjectMapper } from '../mappers/project.mapper';
import { BaseListService } from 'src/common/list/services/base-list.service';
import { BaseListParams } from 'src/common/list/types/base-list-params.type';
import { BaseListReturn } from 'src/common/list/types/base-list-return.type';
import { CreateProjectDto } from '../../dto/create-project.dto';

@Injectable()
export class ProjectRepository extends BaseListService<ProjectEntity> {
  constructor(
    @InjectRepository(ProjectEntity)
    private ormRepo: Repository<ProjectEntity>,
  ) {
    super(ormRepo, ['name', 'description'], 'project');
  }

  private mapper = new ProjectMapper();

  public async findByUserId(
    userId: number,
    params: BaseListParams,
  ): Promise<BaseListReturn<Project>> {
    const { items, total } = await this.findListByUser(userId, params);

    return {
      items: this.mapper.toDomainAll(items),
      total,
    };
  }

  public async create(userId: number, project: CreateProjectDto) {
    const projectEntity = new ProjectEntity();
    projectEntity.iconName = project.iconName;
    projectEntity.name = project.name;
    projectEntity.description = project.description;
    projectEntity.dateStart = project.dateStart;
    projectEntity.dateWStart = project.dateWStart;
    projectEntity.dateEnd = project.dateEnd;
    projectEntity.level = project.level;
    projectEntity.userId = userId;
    return this.ormRepo.save(projectEntity);
  }

  public async save(project: Project) {
    const projectEntity = this.mapper.toEntityDatabase(project);
    await this.ormRepo.save(projectEntity);
  }
}
