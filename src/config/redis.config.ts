import { registerAs } from '@nestjs/config';
import { EnvValidator } from './utils/env-validator';

export const RedisConfig = registerAs('redis', () => {
  return {
    url: EnvValidator.getEnvString('REDIS_URL'),
    maxRequests: EnvValidator.getEnvNumberDefault('REDIS_MAX_REQUESTS', 100),
    limitWindowSize: EnvValidator.getEnvNumberDefault(
      'REDIS_LIMIT_WINDOW_SIZE',
      60,
    ),
    authLimitWindowSize: EnvValidator.getEnvNumberDefault(
      'REDIS_AUTH_LIMIT_WINDOW_SIZE',
      60,
    ),
  };
});
