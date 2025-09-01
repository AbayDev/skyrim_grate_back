import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from '../../infrastructure/repository/project.repository';
import { BaseListParams } from 'src/common/list/types/base-list-params.type';
import { CreateProjectDto } from '../../dto/create-project.dto';
import { LogService } from 'src/modules/logs/application/service/log.service';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';
import { UserService } from 'src/modules/users/application/service/user.service';
import { PatchProjectDto } from '../../dto/patch-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly repository: ProjectRepository,
    private readonly logService: LogService,
    private readonly usersService: UserService,
  ) {}

  async getUserProjects(userId: string, params: BaseListParams) {
    return this.repository.findByUserId(userId, params);
  }

  async create(userId: string, project: CreateProjectDto) {
    try {
      const user = await this.usersService.findById(userId);

      if (!user) {
        const message = `не удалось создать проект ${project.name}, так как пользователь с идентификатором ${userId} не найден`;
        const e = new NotFoundException(message);
        await this.logService.error({
          context: 'Создание проекта',
          message,
          payload: {
            actor: {
              type: LogActor.System,
              id: 'ProjectService',
            },
            entity: {
              type: LogEntity.Project,
              details: {
                name: project.name,
              },
            },
            reason: ErrorLogReason.UserNotFound,
          },
          errorInstance: e,
        });
        throw e;
      }

      const newProject = await this.repository.create(userId, project);
      const newProjectProps = newProject.toPrimitives();

      await this.logService.info({
        context: 'Создание проекта',
        message: `пользователь ${userId} успешно создал проект ${newProjectProps.name}`,
        payload: {
          actor: {
            type: LogActor.User,
            id: userId,
          },
          entity: {
            type: LogEntity.Project,
            id: newProjectProps.id.toString(),
            details: {
              name: newProjectProps.name,
            },
          },
        },
      });

      return newProject;
    } catch (e) {
      await this.logService.error({
        context: 'Создание проекта',
        message: `не удалось создать проект с названием ${project.name}`,
        payload: {
          actor: {
            type: LogActor.User,
            id: userId,
          },
          entity: {
            type: LogEntity.Project,
            details: {
              name: project.name,
            },
          },
          reason: ErrorLogReason.ProjectCreateFailed,
        },
        errorInstance: e,
      });
      throw e;
    }
  }

  async patch(project: PatchProjectDto) {
    const projectDb = await this.repository.findById(project.id);

    if (!projectDb) {
      const message = `не удалось изменить проет, проект с идентификатором ${project.id} не найден`;
      const e = new NotFoundException(message);
      await this.logService.error({
        context: 'Изменение проекта',
        message,
        payload: {
          actor: {
            type: LogActor.System,
            id: 'ProjectService',
          },
          entity: {
            type: LogEntity.Project,
            id: project.id.toString(),
          },
          reason: ErrorLogReason.ProjectNotFound,
        },
        errorInstance: e,
      });
      throw e;
    }

    try {
      await this.repository.update(project);
      await this.logService.info({
        context: 'Изменение проекта',
        message: `проект с идентификатором ${project.id} успешно изменен`,
        payload: {
          actor: {
            type: LogActor.System,
            id: 'ProjectService',
          },
          entity: {
            type: LogEntity.Project,
            id: project.id.toString(),
          },
        },
      });
    } catch (e) {
      await this.logService.error({
        context: 'Изменение проекта',
        message: `не удалось изменить проект с идентификатором ${project.id}`,
        payload: {
          actor: {
            type: LogActor.System,
            id: 'ProjectService',
          },
          entity: {
            type: LogEntity.Project,
            id: project.id.toString(),
          },
          reason: ErrorLogReason.ProjectUpdateFailed,
        },
        errorInstance: e,
      });
      throw e;
    }
  }
}
