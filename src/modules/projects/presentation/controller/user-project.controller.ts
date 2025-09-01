import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from 'src/common/decorators/user.decorator';
import { ListQueryDto } from 'src/common/list/dto/list-query.dto';
import { GetUserProjectsQuery } from '../../application/query/get-user-projects/get-user-projects.query';
import { CreateProjectDto } from '../../dto/create-project.dto';
import { CreateUserProjectCommand } from '../../application/command/create-user-project/create-user-project.command';
import { PatchUserProjectCommand } from '../../application/command/patch-user-project/patch-user-project.command';
import { PatchProjectDto } from '../../dto/patch-project.dto';

@Controller('user/projects')
export class UserProjectController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async projects(@User() user: RequestUser, @Query() params: ListQueryDto) {
    const projects = await this.queryBus.execute(
      new GetUserProjectsQuery(user.userId, params),
    );
    return projects;
  }

  @Post()
  async create(@User() user: RequestUser, @Body() params: CreateProjectDto) {
    const project = await this.commandBus.execute(
      new CreateUserProjectCommand(user.userId, params),
    );

    return project.toPrimitives();
  }

  @Patch()
  async patch(@User() user: RequestUser, @Body() project: PatchProjectDto) {
    return this.commandBus.execute(
      new PatchUserProjectCommand(user.userId, project),
    );
  }
}
