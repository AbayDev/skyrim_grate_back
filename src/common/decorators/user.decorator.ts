import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator((_: undefined, ctx) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  return request.user as RequestUser;
});
