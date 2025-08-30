import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    let stack = '';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message =
        typeof res === 'string'
          ? res
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (res as any).message || JSON.stringify(res);
    } else if (exception instanceof Error) {
      message = `${exception.message}`;
      stack = exception.stack || '';
    } else {
      message = 'Internal server error';
    }

    console.log('message', message);
    console.log('exception', exception);

    response.status(status).json({
      message,
      stack,
    });
  }
}
