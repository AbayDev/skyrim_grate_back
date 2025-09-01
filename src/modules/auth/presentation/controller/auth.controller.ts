import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from '../../application/command/register/register.command';
import { RegisterDto } from '../../dto/register.dto';
import { Response } from 'express';
import { ConfigType } from '@nestjs/config';
import { AuthConfig } from 'src/config/auth.config';
import { LogoutCommand } from '../../application/command/logout/logout.command';
import { User } from 'src/common/decorators/user.decorator';
import { Public } from '../../decorators/public.decorator';
import { AuthenticateDto } from '../../dto/authenticate.dto';
import { AuthenticateCommand } from '../../application/command/authenticate/authenticate.command';
import { ReauthenticateCommand } from '../../application/command/reauthenticate/reauthenticate.command';
import { Ip } from 'src/common/decorators/ip.decorator';
import { UserAgent } from 'src/common/decorators/user-agent.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token';

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
    @Res() res: Response,
    @Body() data: AuthenticateDto,
    @Ip() ip: string | undefined,
    @UserAgent() userAgent: string | undefined,
  ) {
    const result = await this.commandBus.execute(
      new AuthenticateCommand(data.nickname, data.password, {
        ip,
        userAgent,
      }),
    );

    this.setRefrestTokenCookie(res, result.refreshToken);

    return res.status(200).json({
      token: result.accessToken,
    });
  }

  @Post('/reauthenticate')
  @Public()
  async reauthenticate(
    @Res() res: Response,
    @Ip() ip: string | undefined,
    @UserAgent() userAgent: string | undefined,
    @RefreshToken() refreshToken: string,
  ) {
    const result = await this.commandBus.execute(
      new ReauthenticateCommand(refreshToken, {
        ip,
        userAgent,
      }),
    );

    this.setRefrestTokenCookie(res, result.refreshToken);

    return res.status(200).json({
      token: result.accessToken,
    });
  }

  private setRefrestTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: this.authConfig.jwtRefresh.cookie.httpOnly,
      secure: this.authConfig.jwtRefresh.cookie.secure,
      sameSite: this.authConfig.jwtRefresh.cookie.sameSite,
      maxAge: this.authConfig.jwtRefresh.cookie.maxAge,
    });
  }

  @Post('/registration')
  @Public()
  async registration(
    @Res() res: Response,
    @Body() data: RegisterDto,
    @Ip() ip: string | undefined,
    @UserAgent() userAgent: string | undefined,
  ) {
    const result = await this.commandBus.execute(
      new RegisterCommand(data.nickname, data.password, {
        ip,
        userAgent,
      }),
    );

    this.setRefrestTokenCookie(res, result.refreshToken);

    return res.status(200).json({
      token: result.accessToken,
    });
  }

  @Post('/logout')
  async logout(
    @User() user: RequestUser,
    @Res() res: Response,
    @RefreshToken() refreshToken: string,
  ) {
    await this.commandBus.execute(new LogoutCommand(user.userId, refreshToken));
    res.clearCookie('refreshToken');

    return res.status(204).json({ success: true });
  }
}
