import { Module } from '@nestjs/common';
import { ProjectModule } from './modules/projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './modules/projects/infrastructure/database/project.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './modules/auth/auth.module';
import { LogsModule } from './modules/logs/logs.module';
import { UserEntity } from './modules/users/infrastruture/database/user.entity';
import { UserSessionEntity } from './modules/auth/infrastructure/database/user-session.entity';
import { LogEntity } from './modules/logs/infrastructure/database/log.entity';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [ProjectEntity, UserEntity, UserSessionEntity, LogEntity],
        synchronize: true,
      }),
    }),
    LogsModule,
    ProjectModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
