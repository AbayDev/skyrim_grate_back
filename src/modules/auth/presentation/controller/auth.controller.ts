import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from '../../application/command/register/register.command';
import { RegisterDto } from '../../dto/register.dto';
import { Request, Response } from 'express';
import { ConfigType } from '@nestjs/config';
import { AuthConfig } from 'src/config/auth.config';
import { LogoutCommand } from '../../application/command/logout/logout.command';
import { User } from 'src/common/decorators/user.decorator';
import { Public } from '../../decorators/public.decorator';
import { AuthenticateDto } from '../../dto/authenticate.dto';
import { AuthenticateCommand } from '../../application/command/authenticate/authenticate.command';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
  ) {}

  @Post('/authenticate')
  @Public()
  async authenticate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: AuthenticateDto,
  ) {
    const forwardedIps = req.headers['x-forwarded-for'];

    // Берём первый IP-адрес из списка (если он есть), иначе используем request.ip
    const ip = forwardedIps ? forwardedIps.toString().split(',')[0] : req.ip;
    const userAgent = req.headers['user-agent'];

    const result = await this.commandBus.execute(
      new AuthenticateCommand(data.nickname, data.password, {
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

    return res.status(200).json({
      token: result.accessToken,
    });
  }

  @Post('/registration')
  @Public()
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

    return res.status(200).json({
      token: result.accessToken,
    });
  }

  @Post('/logout')
  async logout(
    @User() user: RequestUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const refreshToken = req.cookies['refreshToken'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Не найден refreshToken');
    }

    await this.commandBus.execute(new LogoutCommand(user.userId, refreshToken));
    res.clearCookie('refreshToken');

    return res.status(204).json({ success: true });
  }
}
