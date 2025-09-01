import { registerAs } from '@nestjs/config';
import { EnvValidator } from './utils/env-validator';

export const DatabaseConfig = registerAs('database', () => ({
  host: EnvValidator.getEnvString('DB_HOST'),
  port: EnvValidator.getEnvNumber('DB_PORT'),
  username: EnvValidator.getEnvString('DB_USERNAME'),
  password: EnvValidator.getEnvString('DB_PASSWORD'),
  name: EnvValidator.getEnvString('DB_NAME'),
}));
