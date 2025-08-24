import { Module } from '@nestjs/common';
import { RegisterHandler } from './application/command/register/register.handler';
import { AuthController } from './presentation/controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './application/service/token.service';
import { HashService } from './application/service/hash.service';
import {
  JWT_ACCESS_SERVICE_NAME,
  JWT_REFRESH_SERVICE_NAME,
} from './auth.constants';
import { UserSessionRepository } from './infrastructure/repository/user-session.repository';
import { UserSessionService } from './application/service/user-session.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: JWT_ACCESS_SERVICE_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN'),
          },
        });
      },
    },
    {
      provide: JWT_REFRESH_SERVICE_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get('JWT_REFRESH_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_REFRESH_EXPIRES_IN'),
          },
        });
      },
    },
    UserSessionRepository,
    TokenService,
    HashService,
    UserSessionService,
    RegisterHandler,
  ],
})
export class AuthModule {}
