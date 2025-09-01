import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetUserProjectsQuery } from './get-user-projects.query';
import { ProjectService } from '../../service/project.service';

@CommandHandler(GetUserProjectsQuery)
export class GetUserProjectsHandler
  implements ICommandHandler<GetUserProjectsQuery>
{
  constructor(private readonly projectService: ProjectService) {}

  async execute(command: GetUserProjectsQuery) {
    return this.projectService.getUserProjects(command.userId, command.params);
  }
}
