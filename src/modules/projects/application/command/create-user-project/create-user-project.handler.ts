import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserProjectCommand } from './create-user-project.command';
import { ProjectService } from '../../service/project.service';

@CommandHandler(CreateUserProjectCommand)
export class CreateUserProjectHandler
  implements ICommandHandler<CreateUserProjectCommand>
{
  constructor(private readonly projectService: ProjectService) {}

  async execute(command: CreateUserProjectCommand) {
    return this.projectService.create(command.userId, command.project);
  }
}
