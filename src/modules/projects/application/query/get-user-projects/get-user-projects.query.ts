import { Query } from '@nestjs/cqrs';
import { BaseListParams } from 'src/common/list/types/base-list-params.type';
import { BaseListReturn } from 'src/common/list/types/base-list-return.type';
import { Project } from 'src/modules/projects/domain/entity/project.entity';

export class GetUserProjectsQuery extends Query<BaseListReturn<Project>> {
  constructor(
    public readonly userId: string,
    public readonly params: BaseListParams,
  ) {
    super();
  }
}
