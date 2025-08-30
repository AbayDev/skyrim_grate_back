import { Module } from '@nestjs/common';
import { RegisterHandler } from './application/command/register/register.handler';
import { AuthController } from './presentation/controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { TokenService } from './application/service/token.service';
import { HashService } from './application/service/hash.service';
import {
  JWT_ACCESS_SERVICE_NAME,
  JWT_REFRESH_SERVICE_NAME,
} from './auth.constants';
import { UserSessionRepository } from './infrastructure/repository/user-session.repository';
import { UserSessionService } from './application/service/user-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionEntity } from './infrastructure/database/user-session.entity';
import { AuthConfig } from 'src/config/auth.config';
import { LogoutHandler } from './application/command/logout/logout.handler';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticateHandler } from './application/command/authenticate/authenticate.handler';
import { ReauthenticateHandler } from './application/command/reauthenticate/reauthenticate.handler';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UserSessionEntity])],
  controllers: [AuthController],
  providers: [
    {
      provide: JWT_ACCESS_SERVICE_NAME,
      inject: [AuthConfig.KEY],
      useFactory: (authConfig: ConfigType<typeof AuthConfig>) => {
        return new JwtService({
          secret: authConfig.jwtAccess.secret,
          signOptions: {
            expiresIn: authConfig.jwtAccess.expiresIn,
          },
        });
      },
    },
    {
      provide: JWT_REFRESH_SERVICE_NAME,
      inject: [AuthConfig.KEY],
      useFactory: (authConfig: ConfigType<typeof AuthConfig>) => {
        return new JwtService({
          secret: authConfig.jwtRefresh.secret,
          signOptions: {
            expiresIn: authConfig.jwtRefresh.expiresIn,
          },
        });
      },
    },
    UserSessionRepository,
    TokenService,
    HashService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UserSessionService,
    RegisterHandler,
    AuthenticateHandler,
    LogoutHandler,
    ReauthenticateHandler,
  ],
})
export class AuthModule {}
