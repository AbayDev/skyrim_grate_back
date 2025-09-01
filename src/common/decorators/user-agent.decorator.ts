import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const getRequestUserAgent = (req: Request) => {
  return req.headers['user-agent'];
};

export const UserAgent = createParamDecorator((_: undefined, context) => {
  const ctx = context.switchToHttp();
  const request = ctx.getRequest<Request>();
  return getRequestUserAgent(request);
});
