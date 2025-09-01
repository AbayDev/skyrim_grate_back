import { Command } from '@nestjs/cqrs';
import { Project } from 'src/modules/projects/domain/entity/project.entity';
import { CreateProjectDto } from 'src/modules/projects/dto/create-project.dto';

export class CreateUserProjectCommand extends Command<Project> {
  constructor(
    public readonly userId: string,
    public readonly project: CreateProjectDto,
  ) {
    super();
  }
}
