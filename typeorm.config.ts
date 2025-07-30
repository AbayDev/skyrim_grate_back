// src/typeorm.config.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ProjectEntity } from './src/modules/projects/infrastructure/database/project.entity';

config(); // подгружает .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [ProjectEntity],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
});
