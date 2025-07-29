import { BaseEntityMapper } from 'src/shared/mappers/base.mapper';
import { Project } from '../../domain/entities/project.entity';
import { ProjectEntity } from '../database/project.entity';

export class ProjectMapper extends BaseEntityMapper<Project, ProjectEntity> {
  public toDomain(entityModel: ProjectEntity): Project {
    return new Project({
      id: entityModel.id,
      iconName: entityModel.iconName,
      level: entityModel.level,
      name: entityModel.name,
      description: entityModel.description,
      dateStart: entityModel.dateStart,
      dateWStart: entityModel.dateWStart,
      dateEnd: entityModel.dateEnd,
      dateEndReal: entityModel.dateEndReal,
      userId: entityModel.userId,
    });
  }

  public toEntityDatabase(domainModel: Project): ProjectEntity {
    const props = domainModel.toPrimitives();

    const entity = new ProjectEntity();

    entity.id = props.id;
    entity.iconName = props.iconName;
    entity.level = props.level;
    entity.name = props.name;
    entity.description = props.description;
    entity.dateStart = props.dateStart;
    entity.dateWStart = props.dateWStart;
    entity.dateEnd = props.dateEnd;
    entity.dateEndReal = props.dateEndReal;
    entity.userId = props.userId;

    return entity;
  }
}
