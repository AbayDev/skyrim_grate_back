import { Command } from '@nestjs/cqrs';
import { Project } from 'src/modules/projects/domain/entity/project.entity';
import { PatchProjectDto } from 'src/modules/projects/dto/patch-project.dto';

export class PatchUserProjectCommand extends Command<Project> {
  constructor(
    public readonly userId: string,
    public readonly project: PatchProjectDto,
  ) {
    super();
  }
}
