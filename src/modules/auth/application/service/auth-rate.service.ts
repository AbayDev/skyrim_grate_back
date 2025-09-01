import { RedisConfig } from 'src/config/redis.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from 'src/common/redis/redis-client.const';
import { AuthConfig } from 'src/config/auth.config';
import { TooManyRequestsException } from 'src/common/redis/rate-limit.intercepter';

@Injectable()
export class AuthRateService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
    @Inject(RedisConfig)
    private readonly redisConfig: ConfigType<typeof RedisConfig>,
    @Inject(AuthConfig)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
  ) {}

  public async checkLimit(nickname: string) {
    const key = `auth-attempt:${nickname}`;

    const script = `
      local attempts = redis.call('INCR', KEYS[1])

      if (attempts == 1) then
        current = redis.call('EXPIRE', KEYS[1], ARGV[1])
      end

      return attempts
    `;

    const count = (await this.redisClient.eval(script, {
      keys: [key],
      arguments: [this.redisConfig.authLimitWindowSize.toString()],
    })) as number;

    if (count > this.authConfig.authAttempt) {
      throw new TooManyRequestsException('Слишком много попыток входа');
    }
  }
}
