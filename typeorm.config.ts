// src/typeorm.config.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ProjectEntity } from './src/modules/projects/infrastructure/database/project.entity';
import { UserEntity } from './src/modules/users/infrastruture/database/user.entity';
import { UserSessionEntity } from './src/modules/auth/infrastructure/database/user-session.entity';
import { LogEntity } from 'src/modules/logs/infrastructure/database/log.entity';

config(); // подгружает .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [ProjectEntity, UserEntity, UserSessionEntity, LogEntity],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
});
