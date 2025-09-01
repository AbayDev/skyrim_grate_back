import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchUserProjectCommand } from './patch-user-project.command';
import { ProjectService } from '../../service/project.service';

@CommandHandler(PatchUserProjectCommand)
export class PatchUserProjectHandler
  implements ICommandHandler<PatchUserProjectCommand>
{
  constructor(private readonly projectService: ProjectService) {}

  execute(command: PatchUserProjectCommand): Promise<void> {
    return this.projectService.patch(command.project);
  }
}
