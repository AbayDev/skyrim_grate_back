import { Module } from '@nestjs/common';
import { ProjectModule } from './modules/projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './modules/projects/infrastructure/database/project.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
        entities: [ProjectEntity],
        synchronize: true,
      }),
    }),
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
