import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProjectService } from '../../application/service/project.service';
import { ListQueryDto } from 'src/common/list/dto/list-query.dto';
import { CreateProjectDto } from '../../dto/create-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  public getUserProjects(@Query() params: ListQueryDto) {
    const userId = 2;
    return this.projectService.getUserProjects(userId, params);
  }

  @Post()
  public createProject(@Body() params: CreateProjectDto) {
    const userId = 2;
    return this.projectService.create(userId, params);
  }
}
