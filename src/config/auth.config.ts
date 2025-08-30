import { envValidator } from './utils/EnvValidator';
import { registerAs } from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => {
  return {
    jwtAccess: {
      secret: envValidator.getEnvString('JWT_ACCESS_SECRET'),
      expiresIn: envValidator.getEnvString('JWT_ACCESS_EXPIRES_IN'),
    },
    jwtRefresh: {
      secret: envValidator.getEnvString('JWT_REFRESH_SECRET'),
      expiresIn: envValidator.getEnvString('JWT_REFRESH_EXPIRES_IN'),
      cookie: {
        sameSite: envValidator.getEnvEnumDefault(
          'JWT_REFRESH_COOKIE_SAME_SITE',
          ['strict', 'lax', 'none'],
          'strict',
        ),
        maxAge: envValidator.getEnvNumberDefault(
          'JWT_REFRESH_COOKIE_MAX_AGE',
          1000 * 60 * 60 * 24 * 7,
        ),
        secure: envValidator.getEnvBooleanDefault(
          'JWT_REFRESH_COOKIE_SECURE',
          true,
        ),
        httpOnly: envValidator.getEnvBooleanDefault(
          'JWT_REFRESH_COOKIE_HTTP_ONLY',
          true,
        ),
      },
    },
  };
});
