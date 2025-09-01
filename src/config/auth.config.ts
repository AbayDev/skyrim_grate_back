import { EnvValidator } from './utils/env-validator';
import { registerAs } from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => {
  return {
    authAttempt: EnvValidator.getEnvNumberDefault('AUTH_ATTEMPT_COUNT', 3),
    jwtAccess: {
      secret: EnvValidator.getEnvString('JWT_ACCESS_SECRET'),
      expiresIn: EnvValidator.getEnvString('JWT_ACCESS_EXPIRES_IN'),
    },
    jwtRefresh: {
      secret: EnvValidator.getEnvString('JWT_REFRESH_SECRET'),
      expiresIn: EnvValidator.getEnvString('JWT_REFRESH_EXPIRES_IN'),
      cookie: {
        sameSite: EnvValidator.getEnvEnumDefault(
          'JWT_REFRESH_COOKIE_SAME_SITE',
          ['strict', 'lax', 'none'],
          'strict',
        ),
        maxAge: EnvValidator.getEnvNumberDefault(
          'JWT_REFRESH_COOKIE_MAX_AGE',
          1000 * 60 * 60 * 24 * 7,
        ),
        secure: EnvValidator.getEnvBooleanDefault(
          'JWT_REFRESH_COOKIE_SECURE',
          true,
        ),
        httpOnly: EnvValidator.getEnvBooleanDefault(
          'JWT_REFRESH_COOKIE_HTTP_ONLY',
          true,
        ),
      },
    },
  };
});
