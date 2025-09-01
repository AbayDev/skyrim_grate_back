import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { Request } from 'express';
import { getRequestIp } from '../decorators/ip.decorator';
import { LogService } from 'src/modules/logs/application/service/log.service';
import { LogActor, LogEntity } from 'src/modules/logs/domain/types/log-payload';
import { getRequestUserAgent } from '../decorators/user-agent.decorator';

export class TooManyRequestsException extends HttpException {
  constructor(message = 'Слишком много запросов') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(
    private readonly rateLimitService: RateLimitService,
    private readonly logService: LogService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const key = req.user ? String(req.user.userId) : String(getRequestIp(req));

    const { exceeded, isAllowed } = await this.rateLimitService.checkLimit(key);
    if (!isAllowed) {
      /**
       * логируем только после первого превышения
       * что бы не заполнить базу
       * в случае DDOS атаки
       */
      if (exceeded === 1) {
        const ip = getRequestIp(req);
        const userAgent = getRequestUserAgent(req);
        await this.logService.warning({
          context: 'Ограничение скорости',
          message: 'превышен лимит запросов',
          payload: {
            actor: {
              type: req.user ? LogActor.User : LogActor.UnauthorizedUser,
              id: req.user ? req.user.userId : undefined,
            },
            entity: {
              type: LogEntity.Request,
              id: key,
              details: {
                userId: req.user?.userId,
                ip,
                userAgent,
                requestInfo: {
                  // какой url спамят
                  url: req.url,
                  // что бы понимать какие методы больше спамят
                  method: req.method,
                },
              },
            },
          },
        });
      }

      throw new TooManyRequestsException(
        'Слишком много запросов, попробуйте позже.',
      );
    }

    return next.handle();
  }
}
