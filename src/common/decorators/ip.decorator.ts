import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

const getRequestIp = (req: Request) => {
  const forwardedIps = req.headers['x-forwarded-for'];

  // Берём первый IP-адрес из списка (если он есть), иначе используем request.ip
  return forwardedIps ? forwardedIps.toString().split(',')[0] : req.ip;
};

export const Ip = createParamDecorator((_: undefined, context) => {
  const ctx = context.switchToHttp();
  const request = ctx.getRequest<Request>();
  return getRequestIp(request);
});
