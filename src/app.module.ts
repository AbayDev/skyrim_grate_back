import { Module } from '@nestjs/common';
import { ProjectModule } from './modules/projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './modules/projects/infrastructure/database/project.entity';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './modules/auth/auth.module';
import { LogsModule } from './modules/logs/logs.module';
import { UserEntity } from './modules/users/infrastruture/database/user.entity';
import { UserSessionEntity } from './modules/auth/infrastructure/database/user-session.entity';
import { LogEntity } from './modules/logs/infrastructure/database/log.entity';
import { UsersModule } from './modules/users/users.module';
import { DatabaseConfig } from './config/database.config';
import { AuthConfig } from './config/auth.config';
import { ProfileModule } from './modules/profile/profile.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformIntercepter } from './common/intercepters/transform-interceptor';
import { RedisConfig } from './config/redis.config';
import { RateLimitInterceptor } from './common/redis/rate-limit.intercepter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig, AuthConfig, RedisConfig],
    }),
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseConfig.KEY],
      useFactory: (databaseConfig: ConfigType<typeof DatabaseConfig>) => ({
        type: 'postgres',
        host: databaseConfig.host,
        port: databaseConfig.port,
        username: databaseConfig.username,
        password: databaseConfig.password,
        database: databaseConfig.name,
        entities: [ProjectEntity, UserEntity, UserSessionEntity, LogEntity],
        synchronize: true,
      }),
    }),
    LogsModule,
    ProjectModule,
    UsersModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformIntercepter,
    },
  ],
})
export class AppModule {}
