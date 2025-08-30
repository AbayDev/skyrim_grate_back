import { registerAs } from '@nestjs/config';
import { envValidator } from './utils/env-validator';

export const DatabaseConfig = registerAs('database', () => ({
  host: envValidator.getEnvString('DB_HOST'),
  port: envValidator.getEnvNumber('DB_PORT'),
  username: envValidator.getEnvString('DB_USERNAME'),
  password: envValidator.getEnvString('DB_PASSWORD'),
  name: envValidator.getEnvString('DB_NAME'),
}));
