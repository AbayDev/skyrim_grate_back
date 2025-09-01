import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BaseEntity } from 'src/shared/domain/base.entity';
import { isObject } from 'src/shared/utils/is-object';

interface IToTransformEntity {
  [key: string]: ToTransformEntity;
}

type TransformEntitiesPrimitives = null | undefined | number | string;
type ToTransformEntity =
  | TransformEntitiesPrimitives
  | ToTransformEntity[]
  | IToTransformEntity;

const transformEntities = (data: ToTransformEntity): ToTransformEntity => {
  if (isObject(data)) {
    if (data instanceof BaseEntity) {
      return data.toPrimitives() as ToTransformEntity;
    }

    for (const key in data) {
      const value = transformEntities(data[key]);
      data[key] = value;
    }

    return data;
  } else if (Array.isArray(data)) {
    return data.map((item) => transformEntities(item));
  }

  return data;
};

export class TransformIntercepter implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return transformEntities(data);
      }),
    );
  }
}
