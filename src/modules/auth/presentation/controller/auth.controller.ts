import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from '../../application/command/register/register.command';
import { RegisterDto } from '../../dto/register.dto';
import { Request, Response } from 'express';
import { ConfigType } from '@nestjs/config';
import { AuthConfig } from 'src/config/auth.config';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
  ) {}

  @Post('/authenticate')
  authenticate() {}

  @Post('/registration')
  async registration(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: RegisterDto,
  ) {
    const forwardedIps = req.headers['x-forwarded-for'];

    // Берём первый IP-адрес из списка (если он есть), иначе используем request.ip
    const ip = forwardedIps ? forwardedIps.toString().split(',')[0] : req.ip;
    const userAgent = req.headers['user-agent'];

    const result = await this.commandBus.execute(
      new RegisterCommand(data.nickname, data.password, {
        ip,
        userAgent,
      }),
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: this.authConfig.jwtRefresh.cookie.httpOnly,
      secure: this.authConfig.jwtRefresh.cookie.secure,
      sameSite: this.authConfig.jwtRefresh.cookie.sameSite,
      maxAge: this.authConfig.jwtRefresh.cookie.maxAge,
    });

    return res.status(200).json(result);
  }

  @Post('/logout')
  logout() {}
}
