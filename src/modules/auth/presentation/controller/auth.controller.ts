import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from '../../application/command/register/register.command';
import { RegisterDto } from '../../dto/register.dto';
import { Request } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/authenticate')
  authenticate() {}

  @Post('/registration')
  registration(@Req() req: Request, @Body() data: RegisterDto) {
    const forwardedIps = req.headers['x-forwarded-for'];

    // Берём первый IP-адрес из списка (если он есть), иначе используем request.ip
    const ip = forwardedIps ? forwardedIps.toString().split(',')[0] : req.ip;
    const userAgent = req.headers['user-agent'];

    return this.commandBus.execute(
      new RegisterCommand(data.nickname, data.password, {
        ip,
        userAgent,
      }),
    );
  }

  @Post('/logout')
  logout() {}
}
