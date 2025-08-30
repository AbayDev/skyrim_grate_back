import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const RefreshToken = createParamDecorator((_: undefined, context) => {
  const ctx = context.switchToHttp();
  const request = ctx.getRequest<Request>();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const refreshToken = request.cookies['refreshToken'] as string;

  if (!refreshToken) {
    throw new UnauthorizedException('Не найден refreshToken');
  }

  return refreshToken;
});
